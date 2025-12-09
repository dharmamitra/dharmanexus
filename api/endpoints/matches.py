from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel
from typing import List, Any
from ..queries import matches_queries
from .endpoint_utils import execute_query
from ..cache_config import cached_endpoint, CACHE_TIMES
from .models.general_models import FullNames
from shared.geoip_utils import get_geoip_data
import logging
import json
from datetime import datetime
import os

router = APIRouter()

logger = logging.getLogger(__name__)


class MatchesInput(BaseModel):
    segment_nrs: List[str]


class Match(BaseModel):
    id: str
    root_segnr: List[str]
    par_segnr: List[str]
    root_offset_beg: int
    root_offset_end: int
    par_offset_beg: int
    par_offset_end: int
    score: float
    par_length: int
    root_text: str
    par_text: str
    par_full_names: FullNames
    root_full_names: FullNames


class MatchesOutput(BaseModel):
    matches: List[Match]


def crop_text(text_list: List[str], offset_beg: int, offset_end: int) -> str:
    """
    Crops text based on start and end offsets.
    """
    full_text = "".join(text_list)
    return full_text[offset_beg:offset_end]


async def log_matches_request(request: Request, input: MatchesInput):
    try:
        os.makedirs("/logs", exist_ok=True)
        ip_address = request.client.host
        geoip_data = get_geoip_data(ip_address)

        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "ip_address": ip_address,
            "geoip": geoip_data,
            "request": input.model_dump(),
        }

        with open("/logs/matches_requests.ndjson", "a") as f:
            json.dump(log_data, f)
            f.write("\n")

    except Exception as e:
        logger.error(f"Error logging matches request: {e}", exc_info=True)


@router.post("/matches/", response_model=MatchesOutput, dependencies=[Depends(log_matches_request)])
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_matches(input: MatchesInput) -> Any:
    """
    :return: List of matches for a list of segment numbers
    """
    query_result = await execute_query(
        matches_queries.QUERY_MATCHES,
        bind_vars={"segment_nrs": input.segment_nrs},
    )
    # Handle case where no data is returned
    if not query_result.result:
        return {"matches": []}

    # Debug: Print the structure of query_result
    print(f"Query result type: {type(query_result.result)}")
    print(f"Query result: {query_result.result}")

    matches = [] # The query result is already a list of dictionaries, so iterate directly
    data_to_iterate = query_result.result
    
    # Track seen IDs to avoid duplicates
    seen_ids = set()

    for match_data in data_to_iterate:
        # Debug: Print the type and content of match_data
        print(f"Match data type: {type(match_data)}")
        print(f"Match data: {match_data}")

        # Check if match_data is a dictionary
        if not isinstance(match_data, dict):
            print(f"Skipping non-dict match_data: {match_data}")
            continue

        # Check for duplicates using match ID
        match_id = match_data.get("id")
        if match_id in seen_ids:
            print(f"Skipping duplicate match: {match_id}")
            continue
        seen_ids.add(match_id)

        # Handle root_text - could be string or list
        root_text_input = match_data["root_text"]
        if isinstance(root_text_input, str):
            root_text_cropped = root_text_input[match_data["root_offset_beg"]:match_data["root_offset_end"]]
        else:
            root_text_cropped = crop_text(
                root_text_input,
                match_data["root_offset_beg"],
                match_data["root_offset_end"],
            )
        
        # Handle par_text - could be string or list
        par_text_input = match_data["par_text"]
        if isinstance(par_text_input, str):
            par_text_cropped = par_text_input[match_data["par_offset_beg"]:match_data["par_offset_end"]]
        else:
            par_text_cropped = crop_text(
                par_text_input,
                match_data["par_offset_beg"],
                match_data["par_offset_end"],
            )
        match = Match(
            id=match_data["id"],
            root_segnr=match_data["root_segnr"],
            par_segnr=match_data["par_segnr"],
            root_offset_beg=match_data["root_offset_beg"],
            root_offset_end=match_data["root_offset_end"],
            par_offset_beg=match_data["par_offset_beg"],
            par_offset_end=match_data["par_offset_end"],
            score=match_data["score"],
            par_length=match_data["par_length"],
            root_text=root_text_cropped,
            par_text=par_text_cropped,
            par_full_names=match_data["par_full_names"],
            root_full_names=match_data["root_full_names"],
        )
        matches.append(match)

    # Convert Match objects to dictionaries for JSON serialization
    matches_dict = [match.model_dump() for match in matches]
    return {"matches": matches_dict} 