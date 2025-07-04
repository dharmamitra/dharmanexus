from arango import CollectionDeleteError

from dataloader_constants import (
    COLLECTION_NAMES,
)

from utils import get_database


def clean_all_collections_db():
    """
    Clear all the database collections completely.
    """
    db = get_database()
    current_name = ""
    try:
        for name in COLLECTION_NAMES:
            current_name = name
            print("deleting collection", name)
            db.delete_collection(name)
    except CollectionDeleteError as e:
        print("Error deleting collection %s: " % current_name, e)

    print("all collections cleaned.")
