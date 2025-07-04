"""
Contains query for the total menudata.

"""

QUERY_TOTAL_DATA = """
FOR file IN files
    FILTER file.lang == @lang
    FILTER !(file.segment_keys == [])
    SORT file.filenr ASC
    LET category_info = FIRST(
        FOR cat IN category_names
        FILTER cat.category == file.category AND cat.lang == @lang
        RETURN { displayName: cat.displayName, position: cat.position }
    )
    LET collection_info = FIRST(
        FOR col IN collection_names
        FILTER col.collection == file.collection AND col.lang == @lang
        RETURN { displayName: col.displayName, position: col.position }
    )
    LET file_without_segment_keys = UNSET(file, 'segment_keys')
    RETURN MERGE(file_without_segment_keys, { 
        category_display_name: category_info ? category_info.displayName : file.category,
        category_position: category_info ? category_info.position : 999999,
        collection_display_name: collection_info ? collection_info.displayName : file.collection,
        collection_position: collection_info ? collection_info.position : 999999
    })
"""
