from fastapi import APIRouter
from ..colormaps import calculate_color_maps_table_view
from ..utils import (
    create_cleaned_limit_collection, 
    get_sort_key, 
    collect_segment_results,     
    get_folio_regex, 
    get_language_from_filename
)
from .endpoint_utils import execute_query
from ..queries import main_queries, menu_queries
from ..table_download import run_table_download, run_numbers_download
from .models.shared import GeneralInput, MultiLangInput
from .numbers_view import create_numbers_view_data

router = APIRouter()


@router.post("/table")
async def get_table_view(input: GeneralInput
):
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.
    """
    limitcollection_positive = create_cleaned_limit_collection(input.limits.collection_positive + input.limits.file_positive)
    limitcollection_negative = create_cleaned_limit_collection(input.limits.collection_negative + input.limits.file_negative)

    query_result = execute_query(main_queries.QUERY_TABLE_VIEW,                            
            bind_vars={
                "filename": input.file_name,
                "score": input.score,
                "parlength": input.par_length,
                "sortkey": get_sort_key(input.sort_method),
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
                "page": input.page,
                "folio": input.folio,
            }
        )
    return calculate_color_maps_table_view(query_result.result)


@router.post("/download")
async def get_table_download(input: GeneralInput):
    """
    Endpoint for the download table. Accepts filters.
    :return: List of segments and parallels for the downloaded table view.
    """
    language = get_language_from_filename(input.file_name)
    limitcollection_positive = create_cleaned_limit_collection(input.limits.collection_positive + input.limits.file_positive)
    limitcollection_negative = create_cleaned_limit_collection(input.limits.collection_negative + input.limits.file_negative)

    query_result = execute_query(main_queries.QUERY_TABLE_DOWNLOAD,                           
            bind_vars={
                "filename": input.file_name,
                "score": input.score,
                "parlength": input.par_length,
                "sortkey": get_sort_key(input.sort_method),
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
                "folio": input.folio,
            }
        )
    

    if input.download_data == "table":
        return run_table_download(
            query_result,
            [
                input.file_name,
                input.score,
                input.par_length,
                input.sort_method,
                input.limits,
                input.folio,
                language,
            ],
        )

    segment_collection_results = collect_segment_results(
        create_numbers_view_data(
            query_result.result, get_folio_regex(language, input.file_name, input.folio)
        )
    )

    collections_result = execute_query(
        menu_queries.QUERY_COLLECTION_NAMES,
        bind_vars={
            "collections": segment_collection_results[1],
            "language": language,
        },
    ).result[0]

    return run_numbers_download(
        collections_result,
        segment_collection_results[0],
        [
            input.file_name,
            input.score,
            input.par_length,
            input.sort_method,
            input.limits,
            input.folio,
            language,
        ],
    )


@router.post("/multilang")
async def get_multilang(input: MultiLangInput):
    """
    Endpoint for the multilingual table view. Accepts Parallel languages
    :return: List of segments and parallels for the table view.
    """
    query_result = execute_query(
        main_queries.QUERY_MULTILINGUAL,
        bind_vars={
            "filename": input.file_name,
            "multi_lingual": input.multi_lingual,
            "page": input.page,
            "score": input.score,
            "folio": input.folio,
        },
    )
    return query_result.result
