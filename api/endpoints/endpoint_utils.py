import asyncio
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from fastapi import HTTPException
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from ..db_connection import get_db

logger = logging.getLogger(__name__)

# Create a thread pool executor for running blocking database operations
# This prevents blocking the async event loop
_executor = ThreadPoolExecutor(max_workers=10, thread_name_prefix="db_query")


def _execute_query_sync(query, bind_vars=None, batch_size=100000, raw_results=False):
    """
    Synchronous database query execution (runs in thread pool)
    """
    start_time = time.time()
    query_preview = query[:100] if len(query) > 100 else query
    
    try:
        logger.debug(f"Executing database query (preview: {query_preview}...)")
        db_query_result = get_db().AQLQuery(
            query=query,
            batchSize=batch_size,
            bindVars=bind_vars or {},
            rawResults=raw_results,
        )
        elapsed = time.time() - start_time
        logger.info(f"Database query completed in {elapsed:.2f}s (preview: {query_preview}...)")
        return db_query_result
    except DocumentNotFoundError as error:
        elapsed = time.time() - start_time
        logger.error(f"DocumentNotFoundError after {elapsed:.2f}s: {error}")
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        elapsed = time.time() - start_time
        logger.error(f"AQLQueryError after {elapsed:.2f}s: {error}")
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        elapsed = time.time() - start_time
        logger.error(f"KeyError after {elapsed:.2f}s: {error}")
        raise HTTPException(status_code=400) from error
    except Exception as error:
        elapsed = time.time() - start_time
        logger.error(f"Unexpected error in database query after {elapsed:.2f}s: {error}", exc_info=True)
        raise HTTPException(status_code=500, detail="Database query failed") from error


async def execute_query(query, bind_vars=None, batch_size=100000, raw_results=False, timeout=300):
    """
    Execute a database query asynchronously in a thread pool to prevent blocking the event loop.
    
    Args:
        query: AQL query string
        bind_vars: Query bind variables
        batch_size: Batch size for query results
        raw_results: Whether to return raw results
        timeout: Maximum time in seconds to wait for the query (default: 300)
    
    Returns:
        Database query result
        
    Raises:
        HTTPException: For various database errors
        asyncio.TimeoutError: If query exceeds timeout
    """
    async_start_time = time.time()
    query_preview = query[:100] if len(query) > 100 else query
    
    try:
        logger.debug(f"Submitting database query to thread pool (preview: {query_preview}...)")
        # Run the blocking database operation in a thread pool
        # This prevents blocking the async event loop
        loop = asyncio.get_event_loop()
        db_query_result = await asyncio.wait_for(
            loop.run_in_executor(
                _executor,
                _execute_query_sync,
                query,
                bind_vars,
                batch_size,
                raw_results,
            ),
            timeout=timeout,
        )
        async_elapsed = time.time() - async_start_time
        logger.debug(f"Database query returned from thread pool in {async_elapsed:.2f}s")
        return db_query_result
    except asyncio.TimeoutError:
        async_elapsed = time.time() - async_start_time
        logger.error(
            f"Database query timed out after {async_elapsed:.2f}s (timeout: {timeout}s). "
            f"Query preview: {query_preview}..."
        )
        raise HTTPException(
            status_code=504,
            detail=f"Database query timed out after {timeout} seconds"
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as error:
        async_elapsed = time.time() - async_start_time
        logger.error(
            f"Unexpected error executing query after {async_elapsed:.2f}s: {error}",
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to execute database query") from error
