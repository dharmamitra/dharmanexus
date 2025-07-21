"""
Contains all database queries for the matches endpoint
"""

QUERY_MATCHES = """
FOR seg_nr IN @segment_nrs
    FOR p IN parallels
        FILTER seg_nr IN p.root_segnr
        
        LET root_segtext = (
            FOR segment IN segments
                FILTER segment.segmentnr IN p.root_segnr
                RETURN segment.original
        )
        
        LET par_segtext = (
            FOR segment IN segments
                FILTER segment.segmentnr IN p.par_segnr
                RETURN segment.original
        )
        
        LET par_full_names = (
            FOR file in files
                FILTER file.filename == p.par_filename
                RETURN {"display_name": file.displayName,
                "text_name": file.textname}
        )
        
        LET root_full_names = (
            FOR file in files
                FILTER file.filename == p.root_filename
                RETURN {"display_name": file.displayName,
                "text_name": file.textname}
        )
        
        RETURN {
            id: p._key,
            root_segnr: p.root_segnr,
            par_segnr: p.par_segnr,
            root_offset_beg: p.root_offset_beg,
            root_offset_end: p.root_offset_end,
            par_offset_beg: p.par_offset_beg,
            par_offset_end: p.par_offset_end,
            score: p.score * 100,
            par_length: p.par_length,
            root_text: root_segtext,
            par_text: par_segtext,
            par_full_names: par_full_names[0] || {},
            root_full_names: root_full_names[0] || {}
        }
""" 