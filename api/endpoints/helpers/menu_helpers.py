import unidecode
from collections import defaultdict
from ..models.menu_models import Collection, Category, File
from natsort import natsorted


def create_searchfield(result):
    """Create search field, handling null values gracefully"""
    def safe_str(value):
        return str(value) if value is not None else ""
    
    def safe_unidecode(value):
        return unidecode.unidecode(str(value)).lower() if value is not None else ""
    
    display_name = result.get("displayName")
    category_display_name = result.get("category_display_name")
    collection_display_name = result.get("collection_display_name")
    textname = result.get("textname")
    
    display_name = safe_str(display_name)
    category_display_name = safe_str(category_display_name)
    collection_display_name = safe_str(collection_display_name)
    textname = safe_str(textname)
    
    return (
        display_name
        + " "
        + safe_unidecode(display_name)
        + " "
        + category_display_name
        + " "
        + safe_unidecode(category_display_name)
        + " "
        + collection_display_name
        + " "
        + safe_unidecode(collection_display_name)
        + " "
        + textname
    ).strip()


def create_cat_searchfield(result):
    """Create category search field, handling null values gracefully"""
    def safe_str(value):
        return str(value) if value is not None else ""
    
    def safe_unidecode(value):
        return unidecode.unidecode(str(value)).lower() if value is not None else ""
    
    category_display_name = result.get("category_display_name")
    category = result.get("category")
    
    category_display_name = safe_str(category_display_name)
    category = safe_str(category)
    
    return (
        category_display_name
        + " "
        + safe_unidecode(category_display_name)
        + " "
        + category
    ).strip()


def create_col_searchfield(result):
    """Create collection search field, handling null values gracefully"""
    def safe_str(value):
        return str(value) if value is not None else ""
    
    def safe_unidecode(value):
        return unidecode.unidecode(str(value)).lower() if value is not None else ""
    
    collection_display_name = result.get("collection_display_name")
    collection = result.get("collection")
    
    collection_display_name = safe_str(collection_display_name)
    collection = safe_str(collection)
    
    return (
        collection_display_name
        + " "
        + safe_unidecode(collection_display_name)
        + " "
        + collection
    ).strip()


def structure_menu_data(query_result, language):
    result = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))

    for file in query_result:
        # Check for null values in critical fields
        collection = file.get("collection")
        category = file.get("category")
            
        # Skip files with missing critical data
        if not collection or not category:
            continue
            
        # Check for null values in required fields
        filename = file.get("filename")
        textname = file.get("textname") 
        display_name = file.get("displayName")
            
        if not filename or not textname or not display_name:
            continue
        
        # Check for null values in optional fields and warn
        category_display_name = file.get("category_display_name")
        collection_display_name = file.get("collection_display_name")
        category_position = file.get("category_position")
        collection_position = file.get("collection_position")
            
        # Set fallback values
        category_display_name = category_display_name if category_display_name is not None else category
        collection_display_name = collection_display_name if collection_display_name is not None else collection
        category_position = category_position if category_position is not None else 999999
        collection_position = collection_position if collection_position is not None else 999999
        
        # Create File object with safe values
        file_info = File(
            filename=filename,
            textname=textname,
            displayName=display_name,
            search_field=create_searchfield(file),
        )

        result[collection][category]["category"] = category
        result[collection][category]["categorydisplayname"] = category_display_name
        result[collection][category]["category_position"] = category_position
        result[collection][category]["categorysearchfield"] = create_cat_searchfield(
            file
        )
        result[collection][category]["files"].append(file_info)
        
        # Store collection display name, search field, and position at collection level
        result[collection]["_collection_display_name"] = collection_display_name
        result[collection]["_collection_position"] = collection_position
        result[collection]["_collection_search_field"] = create_col_searchfield(file)

    navigation_menu_data = []

    if language == "pa":
        navigation_menu_data = [
            Collection(
                collection=collection,
                collectiondisplayname=categories.get("_collection_display_name", collection),
                collectionsearchfield=categories.get("_collection_search_field", collection),
                categories=[
                    Category(
                        category=cat_info["category"],
                        categorydisplayname=cat_info["categorydisplayname"],
                        categorysearch_field=cat_info["categorysearchfield"],
                        files=cat_info["files"],
                    )
                    for cat_key, cat_info in categories.items()
                    if not cat_key.startswith("_")
                ],
            )
            for collection, categories in result.items()
        ]

    else:
        navigation_menu_data = [
            Collection(
                collection=collection,
                collectiondisplayname=categories.get("_collection_display_name", collection),
                collectionsearchfield=categories.get("_collection_search_field", collection),
                categories=[
                    Category(
                        category=cat_info["category"],
                        categorydisplayname=cat_info["categorydisplayname"],
                        categorysearch_field=cat_info["categorysearchfield"],
                        files=natsorted(cat_info["files"], key=lambda x: x.filename),
                    )
                    for cat_key, cat_info in sorted(
                        [(k, v) for k, v in categories.items() if not k.startswith("_")], 
                        key=lambda x: x[1].get("category_position", 999999)
                    )
                ],
            )
            for collection, categories in sorted(result.items(), key=lambda x: x[1].get("_collection_position", 999999))
        ]

    return navigation_menu_data
