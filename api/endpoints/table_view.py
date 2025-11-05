from fastapi import APIRouter, Request, Depends
from typing import Any
from ..colormaps import calculate_color_maps_table_view
from ..utils import get_sort_key
from .endpoint_utils import execute_query
from ..queries import table_view_queries
from .models.general_models import GeneralInput
from .models.table_view_models import *
from ..cache_config import cached_endpoint, CACHE_TIMES
from shared.geoip_utils import get_geoip_data
import logging
import json
from datetime import datetime
import os

router = APIRouter()
logger = logging.getLogger(__name__)


async def log_table_view_request(request: Request, input: GeneralInput):
    try:
        os.makedirs("/logs", exist_ok=True)
        ip_address = request.client.host
        geoip_data = get_geoip_data(ip_address)

        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "ip_address": ip_address,
            "geoip": geoip_data,
            "request": input.dict(),
        }

        with open("/logs/table_view_requests.ndjson", "a") as f:
            json.dump(log_data, f)
            f.write("\n")

    except Exception as e:
        logger.error(f"Error logging table view request: {e}", exc_info=True)


@router.post("/table/", response_model=TableViewOutput, dependencies=[Depends(log_table_view_request)])
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_table_view(input: GeneralInput) -> Any:
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.

    sort_method options:

        "position": "By Position in Inquiry Text"

            (matches sorted by segment number position in the root text (default))

        "quotedtext": "By Position in Hit Text(s)"

            (matches sorted by segment number position in the target/quoted text)

        "length": "By Length of match in Inquiry Text (beginning with the longest)"

            (matches sorted by match-length in the root text

        "length2": "By Length of match in Hit Text (beginning with the longest)"

            (matches sorted by match-length in the target/quoted text)
    """
    print("FILENAME", input.filename)
    print("SORTKEY", get_sort_key(input.sort_method))
    query_result = execute_query(
        
        table_view_queries.QUERY_TABLE_VIEW,
        bind_vars={
            "filename": input.filename,
            "score": input.filters.score,
            "parlength": input.filters.par_length,
            "sortkey": get_sort_key(input.sort_method),
            "filter_include_files": input.filters.include_files,
            "filter_exclude_files": input.filters.exclude_files,
            "filter_include_categories": input.filters.include_categories,
            "filter_exclude_categories": input.filters.exclude_categories,
            "filter_include_collections": input.filters.include_collections,
            "filter_exclude_collections": input.filters.exclude_collections,
            "page": input.page,
            "folio": input.folio,
        },
    )

    for item in query_result.result:
        for name_type in ["par_full_names", "root_full_names"]:
            # Use .get() to avoid errors if the name_type key is missing
            name_data = item.get(name_type)
            if not isinstance(name_data, dict):
                print(f"Warning: '{name_type}' is not a dictionary for item: {item.get('root_segnr', 'N/A')}")
                continue

            for name_key in ["display_name", "text_name"]:
                name_value = name_data.get(name_key)
                if not isinstance(name_value, str) or not name_value:
                    print(
                        f"Warning: Problematic field '{name_type}.{name_key}' with value '{name_value}' for item: {item.get('root_segnr', 'N/A')} with par_filename: {item.get('par_filename', 'N/A')}"
                    )

    #print("QUERY RESULT", query_result.result)
    return calculate_color_maps_table_view(query_result.result)
