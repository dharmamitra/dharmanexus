import io
import os
import gzip

from joblib import Parallel as ParallelJobRunner, delayed

import urlfetch
import htmllistparse
from tqdm import trange
from invoke import task
from pyArango.connection import *

from models import Segment, Parallel

DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]
DEFAULT_SOURCE_URL = os.environ["SOURCE_FILES_URL"]

DEFAULT_LANGS = ("chn", "skt", "tib")
COLLECTION_NAMES = (
    "parallels",
    "segments",
    "files",
    "menu-collections",
    "menu-categories",
)


def get_db_connection():
    return Connection(
        username=os.environ["ARANGO_USER"],
        password=os.environ["ARANGO_PASS"],
        arangoURL=f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}",
    )


@task
def create_db(c):
    try:
        conn = get_db_connection()
        conn.createDatabase(name=DB_NAME)
        print(f"created {DB_NAME} database")
    except CreationError as e:
        print("Error creating the database: ", e)


@task()
def create_collections(c, collections=COLLECTION_NAMES):
    db = get_db_connection()[DB_NAME]
    try:
        for name in collections:
            db.createCollection(name=name)
    except CreationError as e:
        print("Error creating collection: ", e)
    print(f"created {collections} collections")


@task
def clean_collections(c):
    db = get_db_connection()[DB_NAME]
    for lang in DEFAULT_LANGS:
        db[lang].empty()
    print("all collections cleaned.")


def load_parallels_to_db(connection: Connection, json_parallels: [Parallel]) -> None:
    collection = connection["parallels"]
    for parallel in json_parallels:
        doc = collection.createDocument()
        doc.set(parallel)
        try:
            doc.save()
        except CreationError as e:
            print(f"Could not save parallel {parallel}. Error: ", e)


def load_segment_to_db(json_segment: Segment) -> None:
    db = get_db_connection()[DB_NAME]
    segment_lang = json_segment["lang"]
    collection = db[segment_lang]
    doc = collection.createDocument()
    doc._key = json_segment["segmentnr"]
    doc["segmentnr"] = json_segment["segmentnr"]
    doc["segment"] = json_segment["segment"]
    doc["lang"] = json_segment["lang"]

    try:
        doc.save()
        load_parallels_to_db(db, json_segment["parallels"])
    except CreationError as e:
        print(f"Could not save segment {doc._key}. Error: ", e)


def load_gzipfile_into_db(dir_url, file_name):
    file_url = f"{dir_url}{file_name}"
    if not file_url.endswith("gz"):
        return
    result = urlfetch.fetch(file_url)
    file_stream = io.BytesIO(result.content)
    with gzip.open(file_stream) as f:
        parsed = json.loads(f.read())
        for segment in parsed:
            load_segment_to_db(segment)
        f.close()


def load_dir_file(dir_url, dir_files, threads):
    try:
        if threads == 1:
            [
                load_gzipfile_into_db(dir_url, dir_files[i].name)
                for i in trange(len(dir_files))
            ]
        else:
            ParallelJobRunner(n_jobs=threads)(
                delayed(lambda i: load_gzipfile_into_db(dir_url, dir_files[i].name))(i)
                for i in trange(len(dir_files))
            )
    except ConnectionError as e:
        print("Connection Error: ", e)


# Temporary limit to speed up file loading:
def should_download_file(language, file_name):
    if language == "chn" and file_name.startswith("T01_T0082"):
        return True
    elif language == "tib" and file_name.startswith("T01TD1170E"):
        return True
    else:
        return False


@task(clean_collections)
def load_source_files(c, url=DEFAULT_SOURCE_URL, threads=1):
    print(f"Loading source files from {url} using {threads} threads.")
    cwd, listing = htmllistparse.fetch_listing(url, timeout=30)
    for directory in listing:
        print(f"loading {directory.name} files:")
        dir_url = f"{url}{directory.name}"
        _, dir_files = htmllistparse.fetch_listing(dir_url, timeout=30)

        # Todo remove testing filter
        filtered_files = [
            file
            for file in dir_files
            if should_download_file(directory.name[:3], file.name)
        ]

        load_dir_file(dir_url, filtered_files, threads)
        print("Data loading completed.")
