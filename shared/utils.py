import re
import unidecode

def get_cat_from_segmentnr(segmentnr):
    """
    retrieves the category code from the segmentnumber
    Note that this function is also used in the dataloader and cannot be
    replaced by a query function.
    """
    return segmentnr.split("_")[1]


def get_filename_from_segmentnr(segnr):
    """
    Get the base filename from a segment number.
    Note that this function is also used in the dataloader and cannot be
    replaced by a query function.
    """
    segnr = segnr.replace(".json", "")
    if "ZH_" in segnr:
        segnr = re.sub("_[0-9]+:", ":", segnr)
        if re.match(r".*_[0-9]{3}$", segnr):
            segnr = re.sub("_[0-9]{3}$", "", segnr)
    else:
        segnr = re.sub(r"\$[0-9]+", "", segnr)
    return segnr.split(":")[0]


def get_language_from_filename(filename) -> str:
    """
    Given the file ID, returns its language.
    :param filename: The key of the file
    :return: Language of the file
    """
    lang = "unknown"
    if filename.startswith("BO_"):
        lang = "bo"
    elif filename.startswith("PA_"):
        lang = "pa"
    elif filename.startswith("SA_"):
        lang = "sa"
    elif filename.startswith("ZH_"):
        lang = "zh"
    else:
        print("ERROR: Language not found for filename: ", filename)
    return lang


def normalize_filename_for_key(filename: str) -> str:
    """
    Normalize a filename to be safe for use as an ArangoDB document key.
    This converts diacritical marks and other Unicode characters to ASCII equivalents.
    
    Args:
        filename: The original filename that may contain diacritical marks
        
    Returns:
        A normalized filename safe for use as an ArangoDB _key
    """
    # Convert Unicode characters (including diacriticals) to ASCII equivalents
    normalized = unidecode.unidecode(filename)
    
    # ArangoDB keys should only contain letters, digits, underscore, and hyphen
    # Replace any other characters with underscore
    normalized = re.sub(r'[^a-zA-Z0-9_-]', '_', normalized)
    
    # Ensure the key doesn't start with a number (ArangoDB requirement)
    if normalized and normalized[0].isdigit():
        normalized = '_' + normalized
        
    return normalized