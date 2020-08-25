"""
This file contains all FastAPI endpoints for Buddhanexus.

Todo:
- Split into smaller feature-based folders
  (https://fastapi.tiangolo.com/tutorial/bigger-applications/)
"""

import re
import os
from typing import Dict, List
from urllib.parse import unquote

from fastapi import FastAPI, HTTPException, Query
from pyArango.theExceptions import DocumentNotFoundError, AQLQueryError
from starlette.middleware.cors import CORSMiddleware

from .search import search_utils
from .models_api import ParallelsCollection
from .queries import menu_queries, main_queries, search_queries
from .utils import (
    get_language_from_filename,
    get_collection_files_regex,
    collect_segment_results,
)
from .db_connection import get_collection, get_db

API_PREFIX = "/api" if os.environ["PROD"] == "1" else ""

APP = FastAPI(title="Buddha Nexus Backend", version="0.2.1", openapi_prefix=API_PREFIX)

APP.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

COLLECTION_PATTERN = r"^(pli-tv-b[ui]-vb|XX|OT|NY|[A-Z]+[0-9]+|[a-z\-]+)"


@APP.get("/")
def root() -> object:
    """
    Root API endpoint
    :return: The response (json object)
    """
    return {"message": "Visit /docs to view the documentation"}


@APP.get("/segments/{lang}/count")
async def get_segment_count(lang: str):
    """
    Returns number of segments in language
    """
    try:
        collection = get_collection(lang)
        return {"count": collection.count()}
    except KeyError as error:
        return error


@APP.get("/segments/{lang}/{key}")
async def get_segment(lang: str, key: str) -> Dict[str, str]:
    """
    Returns segment object given its ID and language
    :param lang: Segment language
    :param key: Segment ID
    """
    try:
        collection = get_collection(lang)
        segment = collection[key]
        return {
            "segmentnr": segment["segmentnr"],
            "segment": segment["segment"],
            "lang": segment["lang"],
        }
    except (DocumentNotFoundError, KeyError) as error:
        return error




@APP.post("/parallels-for-middle/")
async def get_parallels_for_middle(parallels: ParallelsCollection):
    """
    :return: List of parallels for text view (middle)
    """
    language = get_language_from_filename(parallels.file_name)
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        parallels.limit_collection, language
    )
    query_result = get_db().AQLQuery(
        query=main_queries.QUERY_PARALLELS_FOR_MIDDLE_TEXT,
        batchSize=10000,
        bindVars={
            "segmentnr": parallels.segmentnr,
            "score": parallels.score,
            "parlength": parallels.par_length,
            "coocc": parallels.co_occ,
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
        },
    )
    return {"parallels": query_result.result}


@APP.get("/files/{file_name}/segments")
async def get_segments_for_file(
    file_name: str,
    page: int,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Returns filtered segments belonging to a specified file.
    :return: List of segments
    """
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )

    try:
        database = get_db()
        segments_query = database.AQLQuery(
            query=main_queries.QUERY_FILE_SEGMENTS_PARALLELS,
            batchSize=10000,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
                "page": page,
            },
        )

        segments_result, collection_keys = collect_segment_results(
            segments_query.result
        )

        return {
            "collections": database.AQLQuery(
                query=menu_queries.QUERY_COLLECTION_NAMES,
                bindVars={
                    "collections": collection_keys,
                    "language": get_language_from_filename(file_name),
                },
            ).result,
            "segments": segments_result,
        }

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/files/{file_name}/table")
async def get_table_view(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
    page: int = 0,
    sort_method: str = "position",
):
    """
    Endpoint for the table view. Accepts filters.
    :return: List of segments and parallels for the table view.
    """
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )
    sort_key = ""
    if sort_method == "position":
        sort_key = "parallels_sorted_by_src_pos"
    if sort_method == "quoted-text":
        sort_key = "parallels_sorted_by_tgt_pos"
    if sort_method == "length":
        sort_key = "parallels_sorted_by_length_src"
    if sort_method == "length2":
        sort_key = "parallels_sorted_by_length_tgt"

    try:
        query = get_db().AQLQuery(
            query=main_queries.QUERY_TABLE_VIEW,
            bindVars={
                "filename": file_name,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "sortkey": sort_key,
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
                "page": page,
            },
        )
        return query.result

    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/menus/{language}")
async def get_files_for_menu(language: str):
    """
    Endpoint that returns list of file IDs in a given language
    """
    try:
        language_menu_query_result = get_db().AQLQuery(
            query=menu_queries.QUERY_FILES_FOR_LANGUAGE,
            batchSize=10000,
            bindVars={"language": language},
        )
        return {"result": language_menu_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/menus/filter/{language}")
async def get_files_for_filter_menu(language: str):
    """
    Given a language, return list of files for the category menu
    """
    try:
        file_filter_query_result = get_db().AQLQuery(
            query=menu_queries.QUERY_FILES_FOR_CATEGORY,
            batchSize=10000,
            bindVars={"language": language},
        )
        return {"filteritems": file_filter_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/menus/category/{language}")
async def get_categories_for_filter_menu(language: str):
    """
    Given a language, return list of categories for the filter menu
    """
    try:
        category_filter_query_result = get_db().AQLQuery(
            query=menu_queries.QUERY_CATEGORIES_FOR_LANGUAGE,
            batchSize=500,
            bindVars={"language": language},
        )
        return {"categoryitems": category_filter_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/files/{file_name}/textandparallels")
async def get_file_text_segments_and_parallels(
    file_name: str,
    active_segment: str = "none",
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Endpoint for text view
    """
    #parallel_ids_type = "parallel_ids_limited"
    parallel_ids_type = "parallel_ids"
    # when the limit_collection filter is active,
    # we have to fetch all possible parallels.
    if len(limit_collection) > 0:
        parallel_ids_type = "parallel_ids"
    start_int = 0
    limit = 800
    if active_segment != "none":
        active_segment = unquote(active_segment)
        try:
            text_segment_count_query_result = get_db().AQLQuery(
                query=main_queries.QUERY_SEGMENT_COUNT,
                bindVars={"segmentnr": active_segment},
            )
            start_int = text_segment_count_query_result.result[0] - 400
        except DocumentNotFoundError as error:
            print(error)
            raise HTTPException(status_code=404, detail="Item not found") from error
        except AQLQueryError as error:
            print("AQLQueryError: ", error)
            raise HTTPException(status_code=400, detail=error.errors) from error
        except KeyError as error:
            print("KeyError: ", error)
            raise HTTPException(status_code=400) from error
    if start_int < 0:
        start_int = 0
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )
    try:
        text_segments_query_result = get_db().AQLQuery(
            query=main_queries.QUERY_TEXT_AND_PARALLELS,
            bindVars={
                "parallel_ids_type": parallel_ids_type,
                "filename": file_name,
                "limit": limit,
                "startint": start_int,
                "score": score,
                "parlength": par_length,
                "coocc": co_occ,
                "limitcollection_positive": limitcollection_positive,
                "limitcollection_negative": limitcollection_negative,
            },
        )
        return text_segments_query_result.result[0]

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/files/{file_name}/searchtext")
async def search_file_text_segments(file_name: str, search_string: str):
    """
    Searches segments in given file for a search_string.
    """
    try:
        search_string = search_string.lower()
        search_string = search_string.replace("’", "'")
        text_segments_query_result = get_db().AQLQuery(
            query=main_queries.QUERY_TEXT_SEARCH,
            batchSize=100000,
            bindVars={
                "filename": file_name,
                "search_string": "%" + search_string + "%",
            },
        )
        return {"result": text_segments_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/files/{file_name}/graph")
# pylint: disable=too-many-locals
async def get_graph_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    target_collection: List[str] = Query([]),
):
    """
    Endpoint for graph view
    """
    database = get_db()
    query_graph_result = database.AQLQuery(
        query=main_queries.QUERY_GRAPH_VIEW,
        batchSize=15000,
        bindVars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "coocc": co_occ,
            "targetcollection": target_collection,
        },
    )

    collection_keys = []
    total_collection_dict = {}
    total_histogram_dict = {}

    # extract a dictionary of collection numbers and number of parallels for each
    for parallel in query_graph_result.result:
        count_this_parallel = parallel["parlength"]
        target_filename = parallel["textname"]
        if target_filename in total_histogram_dict.keys():
            total_histogram_dict[target_filename] += count_this_parallel
        else:
            total_histogram_dict[target_filename] = count_this_parallel

        collection_key = re.search(COLLECTION_PATTERN, target_filename)

        if not collection_key:
            continue

        collection = collection_key.group()
        if collection not in total_collection_dict.keys():
            total_collection_dict[collection] = count_this_parallel
        else:
            total_collection_dict[collection] += count_this_parallel
        if collection not in collection_keys:
            collection_keys.append(collection)

    # find the proper full names vor each collection
    collections = database.AQLQuery(
        query=menu_queries.QUERY_COLLECTION_NAMES,
        bindVars={
            "collections": collection_keys,
            "language": get_language_from_filename(file_name),
        },
    )

    collections_with_full_name = {}
    for collection_result in collections.result[0]:
        collections_with_full_name.update(collection_result)

    parallel_graph_name_list = {}
    for key in total_collection_dict:
        parallel_graph_name_list.update(
            {key + " " + collections_with_full_name[key]: total_collection_dict[key]}
        )

    unsorted_graphdata_list = list(map(list, parallel_graph_name_list.items()))

    histogram_data = []
    for name, count in total_histogram_dict.items():
        histogram_data.append([name, count])

    # returns a list of the data as needed by Google Graphs
    return {
        "piegraphdata": sorted(
            unsorted_graphdata_list, reverse=True, key=lambda x: x[1]
        ),
        "histogramgraphdata": sorted(histogram_data, reverse=True, key=lambda x: x[1]),
    }


@APP.get("/visual/{searchterm}")
async def get_visual_view_for_file(
    # TODO: what is "selected"? Find better name
    searchterm: str,
    language: str,
    selected: List[str] = Query([]),
):
    """
    Endpoint for visual view
    """
    database = get_db()
    language_search_term = language + "_" + searchterm
    query_collection_list = database.AQLQuery(
        query=main_queries.QUERY_COLLECTION_TOTALS,
        bindVars={"sourcecollection": language_search_term, "selected": selected},
    )
    graph_data = []
    if len(selected) == 1 or re.search(r"^[A-Z][a-z]+$", searchterm):
        graph_data = query_collection_list.result[0]
    else:
        query_results = query_collection_list.result[0]
        query_results_keys = []
        for key in query_results:
            if not key[0] in query_results_keys:
                query_results_keys.append(key[0])

        for key in query_results_keys:
            for result_item in query_results:
                if result_item[0] == key:
                    graph_data.append(result_item)

    return {"graphdata": graph_data}


@APP.get("/collections")
async def get_all_collections():
    """
    Returns list of all available collections.
    """
    try:
        collections_query_result = get_db().AQLQuery(
            query=menu_queries.QUERY_ALL_COLLECTIONS
        )
        return {"result": collections_query_result.result}

    except DocumentNotFoundError as error:
        print(error)
        raise HTTPException(status_code=404, detail="Item not found") from error
    except AQLQueryError as error:
        print("AQLQueryError: ", error)
        raise HTTPException(status_code=400, detail=error.errors) from error
    except KeyError as error:
        print("KeyError: ", error)
        raise HTTPException(status_code=400) from error


@APP.get("/parallels/{file_name}/count")
async def get_counts_for_file(
    file_name: str,
    score: int = 0,
    par_length: int = 0,
    co_occ: int = 0,
    limit_collection: List[str] = Query([]),
):
    """
    Returns number of filtered parallels
    """
    limitcollection_positive, limitcollection_negative = get_collection_files_regex(
        limit_collection, get_language_from_filename(file_name)
    )
    query_graph_result = get_db().AQLQuery(
        query=main_queries.QUERY_TOTAL_NUMBERS,
        batchSize=100000,
        bindVars={
            "filename": file_name,
            "score": score,
            "parlength": par_length,
            "coocc": co_occ,
            "limitcollection_positive": limitcollection_positive,
            "limitcollection_negative": limitcollection_negative,
        },
    )
    return {"parallel_count": query_graph_result.result[0]}


@APP.get("/files/{file_name}/folios")
async def get_folios_for_file(file_name: str):
    """
    Returns number of folios (TIB) / facsimiles (CHN) / suttas (PLI)
    """
    lang = get_language_from_filename(file_name)
    if lang == "skt" or (
        lang == "pli" and not re.search(r"(^[as]n[0-9]|^dhp)", file_name)
    ):
        return
    query_graph_result = get_db().AQLQuery(
        query=main_queries.QUERY_FOLIOS,
        batchSize=100000,
        bindVars={"filename": file_name},
    )
    folios = query_graph_result.result[0]
    return {"folios": folios}


@APP.get("/menus/sidebar/{language}")
async def get_data_for_sidebar_menu(language: str):
    """
    Endpoint for sidebar menu
    """
    database = get_db()
    query_sidebar_menu = database.AQLQuery(
        query=menu_queries.QUERY_TOTAL_MENU, bindVars={"language": language}
    )

    return {"navigationmenudata": query_sidebar_menu.result}


@APP.get("/search/{search_string}")
async def get_search_results(search_string: str):
    """
    Returns search results for given search string.
    :return: List of search results
    """
    database = get_db()
    result = []

    search_strings = search_utils.preprocess_search_string(
        search_string[:150]
    )
    query_search = database.AQLQuery(
        query=search_queries.QUERY_SEARCH,
        bindVars={
            "search_string_tib": search_strings['tib'],
            "search_string_chn": search_strings['chn'],
            "search_string_skt": search_strings['skt'],
            "search_string_pli": search_strings['pli'],
            "search_string_skt_fuzzy": search_strings['skt_fuzzy']
        },
        batchSize=300,
        rawResults=True,
    )
    query_result = query_search.result[0]
    result = search_utils.postprocess_results(search_string, query_result)
    return {"searchResults": result}


@APP.get("/sanskrittagger/{sanskrit_string}")
async def tag_sanskrit(sanskrit_string: str):
    """
    Stemming + Tagging for Sanskrit
    :return: String with tagged Sanskrit
    """
    result = search_utils.tag_sanskrit(sanskrit_string).replace("\n"," # ")
    print("TAGGED RESULT",result)
    return {"tagged": result}

@APP.get("/displayname/{segmentnr}")
async def get_displayname(segmentnr: str):
    """
    Returns the displayName for a segmentnr.
    """
    lang = get_language_from_filename(segmentnr)
    filename = segmentnr.split(':')[0]
    if lang == "chn":
        filename = re.sub(r"_[0-9]+", "", filename)
    database = get_db()
    query_displayname = database.AQLQuery(
        query=main_queries.QUERY_DISPLAYNAME,
        bindVars={
            "filename": filename
        },
        rawResults=True
    )
    query_result = query_displayname.result[0]
    return {"displayData": query_result}


@APP.get("/gretillink/{segmentnr}")
async def get_displayname(segmentnr: str):
    """
    Returns the displayName for a segmentnr.
    """
    lang = get_language_from_filename(segmentnr)
    if lang == "skt":
        filename = segmentnr.split(':')[0]
        database = get_db()
        query_displayname = database.AQLQuery(
            query=main_queries.QUERY_GRETIL_LINK,
            bindVars={
                "filename": filename
            },
            rawResults=True
        )
        query_result = query_displayname.result[0]
        return {"gretilLink": query_result}
    else:
        return {"gretilLink": ""}
