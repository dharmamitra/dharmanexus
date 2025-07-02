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


def ensure_utf8_strings(obj):
    """
    Recursively convert all string values in an object to ensure they are proper UTF-8.
    This handles cases where strings might contain Unicode escape sequences.
    """
    if isinstance(obj, dict):
        return {k: ensure_utf8_strings(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [ensure_utf8_strings(item) for item in obj]
    elif isinstance(obj, str):
        # Ensure the string is properly decoded and encoded as UTF-8
        # This will convert any Unicode escape sequences to proper UTF-8
        return obj.encode('utf-8').decode('utf-8')
    else:
        return obj


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
        parallel["_id"] = parallel["id"]
        parallel["_key"] = parallel["id"]
        parallel["root_category"] = category_root
        parallel["par_category"] = category_parallel
        if root_filename in files_lookup:
            parallel["root_collection"] = files_lookup[root_filename]
        if par_filename in files_lookup:
            parallel["par_collection"] = files_lookup[par_filename]
        parallel["par_filename"] = par_filename
        # here we delete some things that we don't need in the DB:
        del parallel["id"]
        del parallel["par_segtext"]
        del parallel["root_segtext"]
        del parallel["par_string"]
        del parallel["root_string"]
        parallel["root_filename"] = root_filename
        
        # Ensure all strings are properly UTF-8 encoded
        parallel = ensure_utf8_strings(parallel)
        
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
                try:
                    # json.loads should automatically handle Unicode escape sequences
                    parallel = json.loads(line)
                    # Double-check that strings are properly UTF-8
                    parallel = ensure_utf8_strings(parallel)
                    parallels.append(parallel)
                except json.JSONDecodeError as e:
                    print(f"JSON decode error in file {path}: {e}")
                    continue
    
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
            "root_filename",
            "par_filename",
            "root_category",
            "par_category",
            "src_lang",
            "tgt_lang",
        ],
        unique=False,
    )
    # add index for root_segnr on all list items
    db_collection.add_hash_index(fields=["root_segnr[*]"], unique=False)
    db_collection.add_hash_index(fields=["par_segnr[*]"], unique=False)

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
        # Ensure all strings are properly UTF-8 encoded
        file = ensure_utf8_strings(file)
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

    for file in tqdm(files):
        load_sorted_parallels_file(os.path.join(folder, file), lang, db_collection)
    db_collection.add_hash_index(fields=["filename", "lang"])

    print("Done sorted parallels for language: ", lang)


def test_utf8_conversion():
    """
    Test function to verify that UTF-8 conversion is working correctly.
    Run this to check if Unicode escape sequences are being properly converted.
    """
    test_data = {
        "id": "SA_T02_Abhay\u0101karagupta_Buddhakap\u0101latantra-Abhayapaddhati_Chog_2009:1896_SA_T02_n2934u:281",
        "root_segnr": ["SA_T02_Abhay\u0101karagupta_Buddhakap\u0101latantra-Abhayapaddhati_Chog_2009:1896"]
    }
    
    print("Original data:")
    print(f"  id: {test_data['id']}")
    print(f"  root_segnr: {test_data['root_segnr']}")
    
    converted = ensure_utf8_strings(test_data)
    
    print("\nConverted data:")
    print(f"  id: {converted['id']}")
    print(f"  root_segnr: {converted['root_segnr']}")
    
    # Check if the conversion worked
    original_str = test_data['id']
    converted_str = converted['id']
    
    print(f"\nOriginal string length: {len(original_str)}")
    print(f"Converted string length: {len(converted_str)}")
    print(f"Strings are equal: {original_str == converted_str}")
    
    # The converted string should contain the actual Unicode character, not the escape sequence
    if '\u0101' in converted_str:
        print("WARNING: Unicode escape sequence still present in converted string!")
    else:
        print("SUCCESS: Unicode escape sequences properly converted to UTF-8!")


if __name__ == "__main__":
    # Uncomment the line below to test UTF-8 conversion
    # test_utf8_conversion()
    pass
