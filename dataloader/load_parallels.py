import json
import os
import gzip
import sys
from tqdm import tqdm as tqdm
from arango import DocumentInsertError, IndexCreateError
from arango.database import StandardDatabase
import multiprocessing
from utils import should_download_file, get_database
from time import sleep

from dataloader_models import Match, validate_dict_list
from dataloader_constants import (
    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    COLLECTION_FILES,
)

from shared.utils import (
    get_cat_from_segmentnr,
    get_filename_from_segmentnr,
    normalize_filename_for_key,
)


def load_parallels(parallels, db: StandardDatabase) -> None:
    """
    Given an array of parallel objects, load them all into the `parallels` collection

    :param json_parallels: Array of parallel objects to be loaded as-they-are.
    :param db: ArangoDB connection object
    """

    db_collection = db.collection(COLLECTION_PARALLELS)
    parallels_to_be_inserted = []

    for parallel in parallels:
        
        if not should_download_file(parallel["root_segnr"][0]):
            continue
        
        category_root = get_cat_from_segmentnr(parallel["root_segnr"][0])
        category_parallel = get_cat_from_segmentnr(parallel["par_segnr"][0])
        root_filename = get_filename_from_segmentnr(parallel["root_segnr"][0])
        par_filename = get_filename_from_segmentnr(parallel["par_segnr"][0])
        parallel["parallel_id"] = parallel["id"]
        parallel["_key"] = normalize_filename_for_key(parallel["id"])
        parallel["root_category"] = category_root
        parallel["par_category"] = category_parallel
        if root_filename in files_lookup:
            parallel["root_collection"] = files_lookup[root_filename]
        if par_filename in files_lookup:
            parallel["par_collection"] = files_lookup[par_filename]
        parallel["par_filename"] = par_filename
        # here we delete some things that we don't need in the DB:
        del parallel["par_segtext"]
        del parallel["root_segtext"]
        del parallel["par_string"]
        del parallel["root_string"]
        parallel["root_filename"] = root_filename
        parallels_to_be_inserted.append(parallel)

    chunksize = 1000
    for i in range(0, len(parallels_to_be_inserted), chunksize):
        try:
            db_collection.insert_many(parallels_to_be_inserted[i : i + chunksize])
        except (DocumentInsertError, IndexCreateError) as e:
            print(f"Could not save parallel {parallel}. Error: ", e)
    print("Done loading parallels")


def process_file(path, _):
    print("Processing file: ", path)
    db = get_database()

    parallels = []
    with gzip.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:  # Skip empty lines
                parallels.append(json.loads(line))
    
    print(f"Validating {path}")
    if validate_dict_list(path, Match, parallels):
        print(f"Loading {path}")
        load_parallels(parallels, db)
    else:
        print(f"Validation failed for {path}")


def load_parallels_for_language(folder, lang, db, number_of_threads):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    db_collection_files = db.collection(COLLECTION_FILES)
    db_collection = db.collection(COLLECTION_PARALLELS)
    # delete all parallels for this language
    db_collection.delete_many({"src_lang": lang})
    folder = os.path.join(folder, lang)
    files_db = db_collection_files.find({"lang": lang})
    global files_lookup
    files_lookup = {
        file["_key"]: file["collection"] for file in files_db if "collection" in file
    }

    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith(".ndjson.gz"), files))    
    files = list(filter(lambda f: should_download_file(f), files))
    pool = multiprocessing.Pool(number_of_threads)
    async_results = []
    for file in files:
        print(f"Looping over file {file}")
        result = pool.apply_async(process_file, args=(os.path.join(folder, file), None))
        async_results.append(result)

    for result in async_results:
        result.get()

    db_collection.add_hash_index(
        fields=[
            "parallel_id",
            "root_filename",
            "par_filename",
            "root_category",
            "par_category",
            "src_lang",
            "tgt_lang",
        ],
        unique=False,
    )
    # Add a single-field hash index for fast lookup by parallel_id
    db_collection.add_hash_index(fields=["parallel_id"], unique=False)
    # add index for root_segnr on all list items
    db_collection.add_hash_index(fields=["root_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["par_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["root_filename"], unique=False)
    db_collection.add_hash_index(fields=["root_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["par_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["root_filename"], unique=False)
    
    pool.close()
    pool.join()


def clean_parallels_for_language(lang, db):
    db_collection = db.collection(COLLECTION_PARALLELS)
    db_collection.delete_many({"src_lang": lang})
    print(f"Deleted all parallels for language {lang}")


def load_sorted_parallels_file(path, lang, db_collection):
    print("Loading sorted parallels for file: ", path)
    try:
        file = json.load(gzip.open(path, "rt", encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"JSON decode error in file {path}: {e}")
        return
    
    batch_size = 100
    batch = []

    if not isinstance(file, dict):
        print("file is not a dict: ", file)
        return
    if not should_download_file(file["filename"]):
        return
    filename = get_filename_from_segmentnr(file["filename"])
    file["_key"] = normalize_filename_for_key(filename)
    file["lang"] = lang
    batch.append(file)

    if len(batch) >= batch_size:
        try:
            db_collection.insert_many(batch, overwrite=True)
            batch = []
        except DocumentInsertError as e:
            print(f"Batch insert failed: {e}")
            raise

    # Insert remaining documents
    if batch:
        db_collection.insert_many(batch, overwrite=True)


def load_sorted_parallels_for_language(folder, lang, db):
    """
    Given a folder with parallel json files, load them all into the `parallels` collection

    :param folder: Folder with parallel json files
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    # create a dictionary with filename as key and collection as value for all files of current language
    print("Loading sorted parallels for language: ", lang)
    db_collection = db.collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
    # delete all parallels for this language
    db_collection.delete_many({"lang": lang})

    folder = os.path.join(folder, lang, "stats")

    files = os.listdir(folder)
    files = list(filter(lambda f: f.endswith("_stats.json.gz"), files))
    files = list(filter(lambda f: not "global" in f, files))
    files = list(filter(should_download_file, files))

    for file in tqdm(files):
        load_sorted_parallels_file(os.path.join(folder, file), lang, db_collection)
    db_collection.add_hash_index(fields=["filename", "lang"])

    print("Done sorted parallels for language: ", lang)


def load_multilingual_parallels(folder, db, number_of_threads):
    """
    Given a folder with multilingual parallel json files, load them all into the `parallels` collection
    
    :param folder: Folder with multilingual parallel json files (e.g., /matches/multilingual)
    :param db: ArangoDB connection object
    :param number_of_threads: Number of threads to use for parallel loading
    """
    db_collection_files = db.collection(COLLECTION_FILES)
    db_collection = db.collection(COLLECTION_PARALLELS)
    
    # Get all files lookup for all languages
    files_db = db_collection_files.find({})
    global files_lookup
    files_lookup = {
        file["_key"]: file["collection"] for file in files_db if "collection" in file
    }

    # Look for multilingual folder
    multilingual_folder = os.path.join(folder, "multilingual")
    if not os.path.exists(multilingual_folder):
        print(f"Multilingual folder not found: {multilingual_folder}")
        return

    files = os.listdir(multilingual_folder)
    files = list(filter(lambda f: f.endswith(".ndjson.gz"), files))    
    files = list(filter(lambda f: should_download_file(f), files))
    
    if not files:
        print(f"No valid multilingual files found in {multilingual_folder}")
        return
    
    print(f"Found {len(files)} multilingual files to process")
    
    pool = multiprocessing.Pool(number_of_threads)
    async_results = []
    for file in files:
        print(f"Processing multilingual file: {file}")
        result = pool.apply_async(process_file, args=(os.path.join(multilingual_folder, file), None))
        async_results.append(result)

    for result in async_results:
        result.get()

    # Add indexes for multilingual data
    db_collection.add_hash_index(
        fields=[
            "parallel_id",
            "root_filename",
            "par_filename",
            "root_category",
            "par_category",
            "src_lang",
            "tgt_lang",
        ],
        unique=False,
    )
    # Add a single-field hash index for fast lookup by parallel_id
    db_collection.add_hash_index(fields=["parallel_id"], unique=False)
    # add index for root_segnr on all list items
    db_collection.add_hash_index(fields=["root_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["par_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["root_filename"], unique=False)
    
    pool.close()
    pool.join()
    
    print("Multilingual parallels loading completed.")


def clean_multilingual_parallels(db):
    """
    Clean all multilingual parallels from the database.
    This removes parallels that have different source and target languages.
    
    :param db: ArangoDB connection object
    """
    db_collection = db.collection(COLLECTION_PARALLELS)
    
    # Remove parallels where src_lang != tgt_lang (these are multilingual)
    # We need to use a query to find documents where src_lang != tgt_lang
    query = """
    FOR p IN parallels
        FILTER p.src_lang != p.tgt_lang
        REMOVE p IN parallels
    """
    result = db.aql.execute(query)
    deleted_count = 0
    for _ in result:
        deleted_count += 1
    
    print(f"Deleted {deleted_count} multilingual parallels")


def clean_all_parallels_collections(db):
    """
    Remove and recreate all parallels-related collections completely.
    
    :param db: ArangoDB connection object
    """
    print("Removing all parallels collections...")
    
    # Remove parallels collection
    try:
        db.delete_collection(COLLECTION_PARALLELS)
        print(f"Deleted collection: {COLLECTION_PARALLELS}")
    except Exception as e:
        print(f"Error deleting {COLLECTION_PARALLELS}: {e}")
    
    # Remove parallels_sorted_file collection
    try:
        db.delete_collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
        print(f"Deleted collection: {COLLECTION_PARALLELS_SORTED_BY_FILE}")
    except Exception as e:
        print(f"Error deleting {COLLECTION_PARALLELS_SORTED_BY_FILE}: {e}")
    
    print("Recreating empty parallels collections...")
    
    # Recreate parallels collection
    try:
        db.create_collection(COLLECTION_PARALLELS)
        print(f"Recreated collection: {COLLECTION_PARALLELS}")
    except Exception as e:
        print(f"Error creating {COLLECTION_PARALLELS}: {e}")
    
    # Recreate parallels_sorted_file collection
    try:
        db.create_collection(COLLECTION_PARALLELS_SORTED_BY_FILE)
        print(f"Recreated collection: {COLLECTION_PARALLELS_SORTED_BY_FILE}")
    except Exception as e:
        print(f"Error creating {COLLECTION_PARALLELS_SORTED_BY_FILE}: {e}")
    
    print("All parallels collections have been removed and recreated as empty collections.")


if __name__ == "__main__":
    pass
