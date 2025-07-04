from fastapi import APIRouter
from ..queries import text_view_queries
from ..colormaps import calculate_color_maps_text_view, calculate_color_maps_middle_view
from .endpoint_utils import execute_query
from typing import Any
from ..utils import get_page_for_segment
from shared.utils import get_filename_from_segmentnr
from .models.text_view_models import (
    TextParallelsInput,
    TextViewLeftOutput,
    TextViewMiddleInput,
    TextViewMiddleOutput,
)
from ..cache_config import cached_endpoint, CACHE_TIMES
import time

router = APIRouter()


@router.post("/middle/", response_model=TextViewMiddleOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_parallels_for_middle(input: TextViewMiddleInput) -> Any:
    """
    :return: List of parallels for text view (middle)
    """
    start_time = time.time()
    print("[LOG] Start processing /middle/ endpoint")
    
    db_fetch_start = time.time()
    query_result = execute_query(
        text_view_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        bind_vars={"parallel_ids": input.parallel_ids},
    )
    db_fetch_end = time.time()
    print(f"[LOG] Database fetch took {db_fetch_end - db_fetch_start:.4f} seconds")
    
    # Handle case where no data is returned
    if not query_result.result:
        total_time = time.time() - start_time
        print(f"[LOG] /middle/ endpoint took {total_time:.4f} seconds (no data returned)")
        return []
    
    color_map_start = time.time()
    result = calculate_color_maps_middle_view(query_result.result[0])
    color_map_end = time.time()
    print(f"[LOG] Color mapping took {color_map_end - color_map_start:.4f} seconds")
    
    total_time = time.time() - start_time
    print(f"[LOG] /middle/ endpoint total time: {total_time:.4f} seconds (about to return)")
    return result


@router.post("/text-parallels/", response_model=TextViewLeftOutput)
@cached_endpoint(expire=CACHE_TIMES["LONG"])
async def get_file_text_segments_and_parallels(input: TextParallelsInput) -> Any:
    """
    Endpoint for text view. Returns preformatted text segments and ids of the corresponding parallels.
    """
    start_time = time.time()
    print("[LOG] Start processing /text-parallels/ endpoint")
    
    filename = input.filename
    parallel_ids_type = "parallel_ids"
    page = input.page
    active_match = None
    # active_segment is used to scroll to and highlight the segment in the text view
    if input.active_segment != "none":
        print(f"[LOG] input.active_segment: {input.active_segment}")
        seg_start = time.time()
        page = get_page_for_segment(input.active_segment)
        seg_mid = time.time()
        print(f"[LOG] get_page_for_segment took {seg_mid - seg_start:.4f} seconds")
        filename = get_filename_from_segmentnr(input.active_segment)
        seg_end = time.time()
        print(f"[LOG] get_filename_from_segmentnr took {seg_end - seg_mid:.4f} seconds")
    # active_match_id bypasses page, filename and active_segement in order to highlight the active match in the text view
    if input.active_match_id:
        query_result = execute_query(
            text_view_queries.QUERY_GET_MATCH_BY_ID,
            bind_vars={"active_match_id": input.active_match_id},
        )
        if not query_result.result:
            end_time = time.time()
            print(f"[LOG] /text-parallels/ endpoint took {end_time - start_time:.4f} seconds (no match found)")
            return {"page": page, "total_pages": 0, "items": []}
        active_match = query_result.result[0]
        page = get_page_for_segment(active_match["par_segnr"][0])
        filename = get_filename_from_segmentnr(active_match["par_segnr"][0])
    number_of_total_pages = execute_query(
        text_view_queries.QUERY_GET_NUMBER_OF_PAGES,
        bind_vars={
            "filename": filename,
        },
    ).result
    # Handle case where file is not found or has no segment_pages
    if not number_of_total_pages:
        end_time = time.time()
        print(f"[LOG] /text-parallels/ endpoint took {end_time - start_time:.4f} seconds (no pages found)")
        return {"page": page, "total_pages": 0, "items": []}
    number_of_total_pages = number_of_total_pages[0]
    if page >= number_of_total_pages:
        end_time = time.time()
        print(f"[LOG] /text-parallels/ endpoint took {end_time - start_time:.4f} seconds (page >= total_pages)")
        return {"page": page, "total_pages": number_of_total_pages, "items": []}
    current_bind_vars = {
        "filename": filename,
        "page": page,
        "score": input.filters.score,
        "parlength": input.filters.par_length,
        "multi_lingual": input.filters.languages,
        "filter_include_files": input.filters.include_files,
        "filter_include_categories": input.filters.include_categories,
        "filter_include_collections": input.filters.include_collections,
        "filter_exclude_files": input.filters.exclude_files,
        "filter_exclude_categories": input.filters.exclude_categories,
        "filter_exclude_collections": input.filters.exclude_collections,
    }
    db_fetch_start = time.time()
    text_segments_query_result = execute_query(
        text_view_queries.QUERY_TEXT_AND_PARALLELS,
        bind_vars=current_bind_vars,
    )
    db_fetch_end = time.time()
    print(f"[LOG] Database fetch took {db_fetch_end - db_fetch_start:.4f} seconds")
    # Handle case where no data is returned
    if not text_segments_query_result.result:
        end_time = time.time()
        print(f"[LOG] /text-parallels/ endpoint took {end_time - start_time:.4f} seconds (no data returned)")
        return {"page": page, "total_pages": number_of_total_pages, "items": []}
    color_map_start = time.time()
    data_with_colormaps = calculate_color_maps_text_view(
        text_segments_query_result.result[0],
        active_match=active_match,
    )
    color_map_end = time.time()
    print(f"[LOG] Color mapping took {color_map_end - color_map_start:.4f} seconds")
    end_time = time.time()
    print(f"[LOG] /text-parallels/ endpoint total time: {end_time - start_time:.4f} seconds (about to return)")
    return {
        "page": page,
        "total_pages": number_of_total_pages,
        "items": data_with_colormaps,
    }
