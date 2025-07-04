"""
This code loads the segments for the files into the database.
"""

from collections import defaultdict
import os
import sys
import natsort
import multiprocessing
from functools import partial
import time
import pandas as pd
from tqdm import tqdm as tqdm
import requests
from arango.exceptions import (
    CursorNextError, 
    CursorStateError, 
    ServerConnectionError,
    ArangoServerError,
    ArangoClientError
)

from dataloader_constants import (
    PAGE_SIZE,
    SEGMENT_URLS,
    COLLECTION_SEGMENTS,
    COLLECTION_SEGMENTS_PAGES,
    COLLECTION_FILES,
    LANG_PALI,
    LANG_SANSKRIT,
    LANG_TIBETAN,
    LANG_CHINESE,
    METADATA_URLS,
)

from utils import (
    check_if_collection_exists,
    get_database,
    should_download_file,
)

from shared.utils import (
    get_cat_from_segmentnr,
    get_language_from_filename,
    get_filename_from_segmentnr,
    normalize_filename_for_key,
)


def retry_database_operation(operation, max_retries=3, backoff_factor=2):
    """
    Retry a database operation with exponential backoff on connection errors.
    
    Args:
        operation: Function to execute
        max_retries: Maximum number of retry attempts
        backoff_factor: Multiplier for delay between retries
    
    Returns:
        Result of the operation
    """
    for attempt in range(max_retries + 1):
        try:
            return operation()
        except (
            requests.exceptions.ConnectionError, 
            ConnectionResetError, 
            CursorNextError, 
            CursorStateError, 
            ServerConnectionError,
            ArangoServerError,
            ArangoClientError
        ) as e:
            if attempt == max_retries:
                print(f"Database operation failed after {max_retries + 1} attempts: {e}")
                raise
            
            delay = backoff_factor ** attempt
            print(f"Database connection error (attempt {attempt + 1}/{max_retries + 1}): {e}")
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
            
            # Continue to next retry attempt
            continue


def process_text_group_worker(args):
    """Worker function for parallel processing of text groups"""
    loader_instance, text_key, files_in_text = args
    return loader_instance._process_and_insert_text_group(text_key, files_in_text)


class LoadSegmentsBase:

    def __init__(self) -> None:
        self.metadata = self._init_metadata()
        self.DATA_PATH = SEGMENT_URLS[self.LANG] + "segments/"

    def _init_metadata(self):
        df = pd.read_json(METADATA_URLS[self.LANG])
        df["filename"] = df["filename"].apply(get_filename_from_segmentnr)
        df = df.drop_duplicates(subset="filename")
        return df.set_index("filename").to_dict(orient="index")

    def load(self, number_of_threads: int = 1) -> None:
        # only create collection if it does not exist
        db = get_database()
        if not check_if_collection_exists(db, COLLECTION_SEGMENTS):
            db.create_collection(COLLECTION_SEGMENTS)
            db.collection(COLLECTION_SEGMENTS).add_hash_index(fields=["segmentnr"])

        if not check_if_collection_exists(db, COLLECTION_SEGMENTS_PAGES):
            db.create_collection(COLLECTION_SEGMENTS_PAGES)
            db.collection(COLLECTION_SEGMENTS_PAGES).add_hash_index(fields=["segmentnr"])
            
        if not check_if_collection_exists(db, COLLECTION_FILES):
            db.create_collection(COLLECTION_FILES)

        print(f"Loading Segments from: {self.DATA_PATH}")
        if not os.path.isdir(self.DATA_PATH):
            print(f"Could not find {self.DATA_PATH}")
            return

        # Clear existing data for this language
        print(f"Clearing existing segments for language: {self.LANG}")
        db.collection(COLLECTION_SEGMENTS).delete_many({"lang": self.LANG})

        # Group files by text (filename without $ suffix)
        text_groups = defaultdict(list)
        all_files = sorted([f for f in os.listdir(self.DATA_PATH) if f.endswith(".json")])
        print(f"Found {len(all_files)} files with .json extension")
        
        for file in all_files:
            if should_download_file(file):
                # Group by text using the same logic as get_filename_from_segmentnr
                text_key = get_filename_from_segmentnr(file)
                text_groups[text_key].append(file)

        print(f"Grouped {len(all_files)} files into {len(text_groups)} texts")

        # Process text groups - either in parallel or sequentially
        if number_of_threads > 1:
            print(f"Processing {len(text_groups)} text groups using {number_of_threads} threads")
            with multiprocessing.Pool(number_of_threads) as pool:
                # Create work items for parallel processing
                work_items = [(self, text_key, files_in_text) for text_key, files_in_text in text_groups.items()]
                
                # Process with progress bar
                results = []
                for result in tqdm(
                    pool.imap(process_text_group_worker, work_items), 
                    total=len(work_items),
                    desc="Processing texts"
                ):
                    results.append(result)
        else:
            print(f"Processing {len(text_groups)} text groups sequentially")
            results = []
            for text_key, files_in_text in tqdm(text_groups.items(), desc="Processing texts"):
                result = self._process_and_insert_text_group(text_key, files_in_text)
                results.append(result)

        # Count successful processing
        successful_texts = sum(1 for r in results if r)
        print(f"Successfully processed {successful_texts}/{len(text_groups)} texts")

        # Add optimized indexes after all processing for better performance
        print("Adding database indexes...")
        
        # Optimized composite index for segments collection - covers most common query patterns
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["lang", "filename", "segmentnr"],
            unique=False,
        )
        
        # Individual indexes for specific lookups
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["category"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["filename"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS).add_hash_index(            
            fields=["lang"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["segmentnr"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["segmentnr"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["collection"],
            unique=False,
        )
        db.collection(COLLECTION_SEGMENTS).add_hash_index(
            fields=["folio"],
            unique=False,
        )
        
        # Add hash index on segmentnr for segments_pages collection for fast lookups
        db.collection(COLLECTION_SEGMENTS_PAGES).add_hash_index(
            fields=["segmentnr"],
            unique=False,
        )
        
        print("DONE LOADING SEGMENT DATA")

    def _process_and_insert_text_group(self, text_key, files_in_text):
        """
        Process a single text group: load → sort → insert → clear memory.
        This method processes one text completely before moving to the next.
        Returns: True if successful, False otherwise
        """
        try:
            if text_key not in self.metadata:
                print(f"ERROR: text not in metadata: {text_key}")
                return False

            # Load and combine all segments for this text
            all_segments_for_text = []
            
            for file in files_in_text:
                try:
                    file_path = os.path.join(self.DATA_PATH, file)
                    file_df = pd.read_json(file_path)
                    
                    # Add required fields
                    file_df["_key"] = file_df["segmentnr"].apply(normalize_filename_for_key)  
                    file_df["lang"] = self.LANG
                    file_df["folio"] = file_df["folio"].astype(str)
                    file_df["filename"] = text_key
                    file_df["category"] = self.metadata[text_key]["category"]
                    file_df["collection"] = self.metadata[text_key]["collection"]
                    
                    all_segments_for_text.extend(file_df.to_dict("records"))
                    
                except Exception as e:
                    print(f"Error loading file {file}: {e}")
                    continue

            if not all_segments_for_text:
                return False

            # Sort all segments for this text using natural sort
            all_segments_for_text = natsort.natsorted(
                all_segments_for_text, key=lambda x: x["segmentnr"]
            )

            # Extract segment numbers and folios in sorted order
            sorted_segment_numbers = [seg["segmentnr"] for seg in all_segments_for_text]
            folios = [seg["folio"] for seg in all_segments_for_text]
            folios = list(dict.fromkeys(folios))  # Remove duplicates while preserving order

            # Create paginated segments
            segments_paginated = [
                sorted_segment_numbers[i : i + PAGE_SIZE] 
                for i in range(0, len(sorted_segment_numbers), PAGE_SIZE)
            ]
            segments_paginated = {count: page for count, page in enumerate(segments_paginated)}

            # Prepare segments pages for insertion
            segments_pages_to_insert = []
            for page, segs in segments_paginated.items():
                segments_pages_to_insert.extend(
                    [{"segmentnr": seg, "page": page} for seg in segs]
                )

            # Prepare file data
            lang = get_language_from_filename(text_key)
            file_data = {
                "_key": normalize_filename_for_key(text_key),
                "filename": text_key,
                "lang": lang,
                "folios": folios,
                "segment_keys": sorted_segment_numbers,
                "segment_pages": segments_paginated,
            }

            # Insert data immediately for this text group
            db = get_database()
            
            # Insert segments in chunks
            chunk_size = 5000
            if all_segments_for_text:
                for i in range(0, len(all_segments_for_text), chunk_size):
                    chunk = all_segments_for_text[i:i + chunk_size]
                    
                    retry_database_operation(lambda: db.collection(COLLECTION_SEGMENTS).insert_many(chunk))

            # Insert segment pages
            if segments_pages_to_insert:
                for i in range(0, len(segments_pages_to_insert), chunk_size):
                    chunk = segments_pages_to_insert[i:i + chunk_size]
                    retry_database_operation(lambda: db.collection(COLLECTION_SEGMENTS_PAGES).insert_many(chunk))

            # Insert/update file record
            try:
                existing_file = db.collection(COLLECTION_FILES).get(file_data["_key"])
                if existing_file:
                    existing_file.update(file_data)
                    retry_database_operation(lambda: db.collection(COLLECTION_FILES).update(existing_file))
                else:
                    retry_database_operation(lambda: db.collection(COLLECTION_FILES).insert(file_data))
            except Exception as e:
                print(f"Error inserting/updating file {text_key}: {e}")

            # Clear memory immediately after processing this text
            del all_segments_for_text
            del segments_pages_to_insert
            del file_data

            return True

        except Exception as e:
            print(f"Error processing text group {text_key}: {e}")
            return False

    def clean(self):
        db = get_database()
        print(f"Cleaning segments for language: {self.LANG}.")
        db.collection(COLLECTION_SEGMENTS).delete_many({"lang": self.LANG})


class LoadSegmentsSanskrit(LoadSegmentsBase):
    LANG = LANG_SANSKRIT


class LoadSegmentsPali(LoadSegmentsBase):
    LANG = LANG_PALI


class LoadSegmentsTibetan(LoadSegmentsBase):
    LANG = LANG_TIBETAN


class LoadSegmentsChinese(LoadSegmentsBase):
    LANG = LANG_CHINESE
