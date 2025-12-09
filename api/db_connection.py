"""
Utility methods for interacting with the database
"""

import os
import logging
import threading

from pyArango.collection import Collection
from pyArango.connection import Connection, Database

logger = logging.getLogger(__name__)

DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]

# Thread-local storage for database connections
# This ensures each thread has its own connection (important for thread pool)
_thread_local = threading.local()


def get_db() -> Database:
    """
    Returns database instance with connection reuse.
    Creates a connection per thread to avoid connection overhead.
    """
    # Check if this thread already has a connection
    if not hasattr(_thread_local, 'connection') or _thread_local.connection is None:
        try:
            logger.debug("Creating new ArangoDB connection for thread")
            _thread_local.connection = Connection(
                username=os.environ["ARANGO_USER_API"],
                password=os.environ["ARANGO_ROOT_PASSWORD_API"],
                arangoURL=f"http://{os.environ['ARANGO_HOST_API']}:{os.environ['ARANGO_PORT_API']}",
            )
        except Exception as e:
            logger.error(f"Failed to create ArangoDB connection: {e}", exc_info=True)
            raise
    
    try:
        # Get the database from the connection
        return _thread_local.connection[DB_NAME]
    except Exception as e:
        logger.error(f"Failed to access database {DB_NAME}: {e}", exc_info=True)
        # Reset connection on error
        _thread_local.connection = None
        raise


def get_collection(collection_name) -> Collection:
    """
    Returns single collection from the database
    """
    return get_db()[collection_name]
