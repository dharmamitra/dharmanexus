import os

DB_NAME = os.environ["ARANGO_BASE_DB_NAME"]
ARANGO_USER = os.environ["ARANGO_USER"]
ARANGO_PASSWORD = os.environ["ARANGO_ROOT_PASSWORD"]
ARANGO_HOST = f"http://{os.environ['ARANGO_HOST']}:{os.environ['ARANGO_PORT']}"
DEFAULT_SOURCE_URL = os.environ["SOURCE_FILES_URL"]

LANG_TIBETAN = "tib"
LANG_SANSKRIT = "skt"
LANG_CHINESE = "chn"
LANG_PALI = "pli"
LANG_ENGLISH = "en"
LANG_AI = "ai"
DEFAULT_LANGS = (
    LANG_CHINESE,
    LANG_SANSKRIT,
    LANG_TIBETAN,
    LANG_PALI,
    LANG_ENGLISH,
    LANG_AI,
)

COLLECTION_PARALLELS = "parallels"
COLLECTION_PARALLELS_MULTI = "parallels_multi"
COLLECTION_PARALLELS_SORTED_BY_FILE = "parallels_sorted_file"
COLLECTION_SEGMENTS = "segments"
COLLECTION_LANGUAGES = "languages"
COLLECTION_FILES = "files"
COLLECTION_MENU_COLLECTIONS = "menu_collections"
COLLECTION_MENU_CATEGORIES = "menu_categories"
COLLECTION_FILES_PARALLEL_COUNT = "files_parallel_count"
COLLECTION_CATEGORIES_PARALLEL_COUNT = "categories_parallel_count"


COLLECTION_SEARCH_INDEX_TIB = "search_index_tib"
COLLECTION_SEARCH_INDEX_SKT = "search_index_skt"
COLLECTION_SEARCH_INDEX_PLI = "search_index_pli"
COLLECTION_SEARCH_INDEX_CHN = "search_index_chn"

SKT_SEARCH_DATA_PATH = DEFAULT_SOURCE_URL + "search_index_sanskrit.json.gz"
PLI_SEARCH_DATA_PATH = DEFAULT_SOURCE_URL + "search_index_pali.json.gz"
TIB_SEARCH_DATA_PATH = DEFAULT_SOURCE_URL + "search_index_tibetan.json.gz"
CHN_SEARCH_DATA_PATH = DEFAULT_SOURCE_URL + "search_index_chn.json.gz"


VIEW_SEARCH_INDEX_TIB = "search_index_tib_view"
VIEW_SEARCH_INDEX_TIB_FUZZY = "search_index_tib_fuzzy_view"
VIEW_SEARCH_INDEX_SKT = "search_index_skt_view"
VIEW_SEARCH_INDEX_PLI = "search_index_pli_view"
VIEW_SEARCH_INDEX_CHN = "search_index_chn_view"

TIBETAN_ANALYZER = "tibetan_analyzer"
TIBETAN_FUZZY_ANALYZER = "tibetan_fuzzy_analyzer"
SANSKRIT_ANALYZER = "sanskrit_analyzer"
PALI_ANALYZER = "pali_analyzer"
CHINESE_ANALYZER = "text_zh"

ANALYZER_NAMES = (
    TIBETAN_ANALYZER,
    SANSKRIT_ANALYZER,
    PALI_ANALYZER,
    TIBETAN_FUZZY_ANALYZER,
)

INDEX_VIEW_NAMES = (
    VIEW_SEARCH_INDEX_SKT,
    VIEW_SEARCH_INDEX_PLI,
    VIEW_SEARCH_INDEX_CHN,
    VIEW_SEARCH_INDEX_TIB,
    VIEW_SEARCH_INDEX_TIB_FUZZY,
)

INDEX_COLLECTION_NAMES = (
    COLLECTION_SEARCH_INDEX_TIB,
    COLLECTION_SEARCH_INDEX_SKT,
    COLLECTION_SEARCH_INDEX_PLI,
    COLLECTION_SEARCH_INDEX_CHN,
)

COLLECTION_NAMES = (
    COLLECTION_PARALLELS,
    COLLECTION_PARALLELS_MULTI,
    COLLECTION_PARALLELS_SORTED_BY_FILE,
    COLLECTION_SEGMENTS,
    COLLECTION_LANGUAGES,
    COLLECTION_FILES,
    COLLECTION_MENU_COLLECTIONS,
    COLLECTION_MENU_CATEGORIES,
    COLLECTION_FILES_PARALLEL_COUNT,
    COLLECTION_CATEGORIES_PARALLEL_COUNT,
)

# Edge collections
EDGE_COLLECTION_LANGUAGE_HAS_COLLECTIONS = "language_has_collections"
EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES = "collection_has_categories"
EDGE_COLLECTION_CATEGORY_HAS_FILES = "category_has_files"
EDGE_COLLECTION_FILE_HAS_SEGMENTS = "file_has_segments"
EDGE_COLLECTION_SEGMENT_HAS_PARALLELS = "segment_has_parallels"
EDGE_COLLECTION_FILE_HAS_PARALLELS = "file_has_parallels"

EDGE_COLLECTION_NAMES = (
    EDGE_COLLECTION_LANGUAGE_HAS_COLLECTIONS,
    EDGE_COLLECTION_COLLECTION_HAS_CATEGORIES,
    EDGE_COLLECTION_CATEGORY_HAS_FILES,
    EDGE_COLLECTION_FILE_HAS_SEGMENTS,
    EDGE_COLLECTION_SEGMENT_HAS_PARALLELS,
    EDGE_COLLECTION_FILE_HAS_PARALLELS,
)

GRAPH_COLLECTIONS_CATEGORIES = "collections_categories"

COLLECTION_REGEX = r"^(pli-tv-b[ui]-vb|XX|OT|NG|[A-Z]+[0-9]+|[a-z\-]+)"
