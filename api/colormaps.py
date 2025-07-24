"""
This file holds the functions for creating the colormaps.
"""

from .utils import shorten_segment_names, prettify_score


def create_segmented_text(text, colormap, matchmap, active_map):
    """Create segmented text based on the given colormap and matchmap."""

    def filter_and_sort(matches):
        """Filter out None values and sort the matches."""
        return sorted([x for x in matches if x is not None])

    result_segments = []
    current_segment = ""
    last_matches = filter_and_sort(matchmap[0])
    last_color = colormap[0]
    last_active_match = active_map[0]
    for i, char in enumerate(text):
        current_color = colormap[i]
        current_matches = filter_and_sort(matchmap[i])
        current_active_match = active_map[i]
        if current_matches != last_matches:
            result_segments.append(
                {
                    "text": current_segment,
                    "highlightColor": last_color,
                    "matches": last_matches,
                    "is_active_match": last_active_match,
                }
            )
            current_segment = ""

        current_segment += char
        last_matches = current_matches
        last_color = current_color
        last_active_match = current_active_match
    # Add the last segment
    result_segments.append(
        {
            "text": current_segment,
            "highlightColor": last_color,
            "matches": last_matches,
            "is_active_match": last_active_match,
        }
    )
    return result_segments


def create_segmented_text_color_only(text, colormap):
    """create segmented text color"""
    result_segments = []
    current_segment = ""
    last_color = colormap[0]
    for i, _ in enumerate(text):
        current_color = colormap[i]
        if current_color != last_color:
            result_segments.append(
                {"text": current_segment, "highlightColor": last_color}
            )
            current_segment = ""
        current_segment += text[i]
        last_color = current_color
    result_segments.append({"text": current_segment, "highlightColor": last_color})
    return result_segments


def abbreviate(text):
    """Abbreviates long matches with an ellipsis"""
    newtext = ""
    if len(text) > 300:
        newtext = text[:50] + " … " + text[-50:]
    else:
        newtext = text
    return newtext


def trim_long_text(text, language="en"):
    """Trims long text to show beginning and end with ellipsis in the middle.
    Args:
        text: The text to trim (can be plain text or segmented text)
        language: Language code to determine max length (zh=100, others=1000)
    Returns:
        Trimmed text with ellipsis in the middle
    """
    # Check if text is segmented (list of dicts) or plain text
    if isinstance(text, list):
        return trim_segmented_text(text, language)
    max_length = 100 if language == "zh" else 1000
    half_length = 500 if language == "zh" else 500
    if len(text) <= max_length:
        return text
    # Use a creative unicode ellipsis: ⋯ (horizontal ellipsis)
    ellipsis = " ⋯ "
    available_length = max_length - len(ellipsis)
    # Calculate how much text to show at beginning and end
    first_part_length = min(half_length, available_length // 2)
    last_part_length = available_length - first_part_length
    first_part = text[:first_part_length]
    last_part = text[-last_part_length:]
    return first_part + ellipsis + last_part


def trim_segmented_text(segmented_text, language="en"):
    """Trims segmented text while preserving color information.
    Args:
        segmented_text: List of dicts with 'text' and 'highlightColor' keys
        language: Language code to determine max length (zh=100, others=1000)
    Returns:
        Trimmed segmented text with ellipsis in the middle
    """
    max_length = 100 if language == "zh" else 1000
    half_length = 500 if language == "zh" else 500
    # Calculate total text length
    total_length = sum(len(segment["text"]) for segment in segmented_text)
    if total_length <= max_length:
        return segmented_text
    # Use a creative unicode ellipsis: ⋯ (horizontal ellipsis)
    ellipsis = " ⋯ "
    available_length = max_length - len(ellipsis)
    # Calculate how much text to show at beginning and end
    first_part_length = min(half_length, available_length // 2)
    last_part_length = available_length - first_part_length
    # Build first part
    first_part = []
    current_length = 0
    for segment in segmented_text:
        if current_length >= first_part_length:
            break
        remaining_needed = first_part_length - current_length
        if len(segment["text"]) <= remaining_needed:
            first_part.append(segment)
            current_length += len(segment["text"])
        else:
            # Need to split this segment
            first_part.append({
                "text": segment["text"][:remaining_needed],
                "highlightColor": segment["highlightColor"]
            })
            break
    # Build last part
    last_part = []
    current_length = 0
    for segment in reversed(segmented_text):
        if current_length >= last_part_length:
            break
        remaining_needed = last_part_length - current_length
        if len(segment["text"]) <= remaining_needed:
            last_part.insert(0, segment)
            current_length += len(segment["text"])
        else:
            # Need to split this segment
            last_part.insert(0, {
                "text": segment["text"][-remaining_needed:],
                "highlightColor": segment["highlightColor"]
            })
            break
    # Create ellipsis segment with neutral color (assuming 0 is neutral)
    ellipsis_segment = {"text": ellipsis, "highlightColor": 0}
    return first_part + [ellipsis_segment] + last_part


def _apply_parallel_to_maps(parallel, segnr, segtext_len, colormap, matchmap):
    start = 0
    end = segtext_len
    if parallel["root_segnr"][0] == segnr:
        start = parallel["root_offset_beg"]
    if parallel["root_segnr"][-1] == segnr:
        end = parallel["root_offset_end"]
    end = min(end, segtext_len)
    for i in range(start, end):
        colormap[i] += 1
        if parallel["id"] not in matchmap[i]:
            matchmap[i].append(parallel["id"])


def _apply_active_match_to_maps(active_match, segnr, segtext_len, colormap, active_map):
    start, end = 0, segtext_len
    active_flag = False
    if active_match["par_segnr"][0] == segnr:
        start = active_match["par_offset_beg"]
        active_flag = True
    if active_match["par_segnr"][-1] == segnr:
        end = active_match["par_offset_end"]
    end = min(end, segtext_len)
    if active_flag:
        for i in range(start, end):
            colormap[i] += 1
            active_map[i] = True
    return active_flag and active_match["par_segnr"][-1] != segnr


def calculate_color_maps_text_view(data, active_match=None):
    """calculates the color maps for the text view"""
    if not data or "textleft" not in data or "parallel_ids" not in data or "parallels" not in data:
        return []
    textleft = data["textleft"]
    parallels_dict = {p["id"]: p for p in data["parallels"]}

    for entry in textleft:
        segtext_len = len(entry["segtext"])
        current_colormap = [0] * segtext_len
        current_active_map = [False] * segtext_len
        current_matchmap = [[] for _ in range(segtext_len)]
        for parallel_id in entry["parallel_ids"]:
            if parallel_id in parallels_dict:
                _apply_parallel_to_maps(
                    parallels_dict[parallel_id],
                    entry["segnr"],
                    segtext_len,
                    current_colormap,
                    current_matchmap,
                )
        if active_match:
            _apply_active_match_to_maps(
                active_match,
                entry["segnr"],
                segtext_len,
                current_colormap,
                current_active_map,
            )
        entry["segtext"] = create_segmented_text(
            entry["segtext"], current_colormap, current_matchmap, current_active_map
        )
    for entry in textleft:
        del entry["parallel_ids"]
    return textleft


def calculate_color_maps_table_view(data):
    """calculates the color maps for the table view"""

    for entry in data:
        join_element_root = ""
        join_element_par = ""
        if not entry["src_lang"] == "zh":
            join_element_root = " "
        if not entry["tgt_lang"] == "zh":
            join_element_par = " "

        root_fulltext = join_element_root.join(entry["root_seg_text"])
        root_colormap = [0] * len(root_fulltext)

        root_end = len(root_fulltext) - (
            len(entry["root_seg_text"][-1]) - entry["root_offset_end"]
        )
        root_end = min(root_end, len(root_fulltext))
        root_start = entry["root_offset_beg"]
        root_colormap[root_start:root_end] = [1] * (root_end - root_start)
        root_fulltext = create_segmented_text_color_only(root_fulltext, root_colormap)
        # Trim long text for display
        root_fulltext = trim_long_text(root_fulltext, entry["src_lang"])
        entry["root_fulltext"] = root_fulltext

        par_fulltext = join_element_par.join(entry["par_segment"])
        par_colormap = [0] * len(par_fulltext)
        par_end = len(par_fulltext) - (
            len(entry["par_segment"][-1]) - entry["par_offset_end"]
        )
        par_end = min(par_end, len(par_fulltext))
        par_start = entry["par_offset_beg"]
        par_colormap[par_start:par_end] = [1] * (par_end - par_start)
        par_fulltext = create_segmented_text_color_only(par_fulltext, par_colormap)
        # Trim long text for display
        par_fulltext = trim_long_text(par_fulltext, entry["tgt_lang"])
        entry["par_fulltext"] = par_fulltext
        entry["par_segnr_range"] = shorten_segment_names(entry["par_segnr"])
        entry["root_segnr_range"] = shorten_segment_names(entry["root_segnr"])
        entry["score"] = prettify_score(entry["score"])
        del entry["par_segment"]
        del entry["root_seg_text"]
        del entry["root_offset_beg"]
        del entry["root_offset_end"]
        del entry["par_offset_beg"]
        del entry["par_offset_end"]
        del entry["par_pos_beg"]
        del entry["par_segnr"]
        del entry["root_segnr"]

    return data


def calculate_color_maps_middle_view(data):
    """same procdeure as table-view but we ommit the inquiry text data"""
    # Safety check for empty or invalid data
    if not data:
        return []
    for entry in data:
        # it is _not_ nice that we need to test for the length of these elements;
        # it should be dealt with at data-loader level...
        if len(entry["par_segtext"]) > 0:
            join_element_par = ""
            if not entry["tgt_lang"] == "zh":
                join_element_par = " "
            par_fulltext = join_element_par.join(entry["par_segtext"])
            par_colormap = [0] * len(par_fulltext)
            par_end = len(par_fulltext) - (
                len(entry["par_segtext"][-1]) - entry["par_offset_end"]
            )
            par_end = min(par_end, len(par_fulltext))
            par_start = entry["par_offset_beg"]
            par_colormap[par_start:par_end] = [1] * (par_end - par_start)
            par_fulltext = create_segmented_text_color_only(par_fulltext, par_colormap)
            # Trim long text for display
            par_fulltext = trim_long_text(par_fulltext, entry["tgt_lang"])
            entry["par_fulltext"] = par_fulltext
            entry["score"] = prettify_score(entry["score"])
            # Handle par_segnr safely - ensure it's a list and not empty
            entry["par_segnr_range"] = shorten_segment_names(entry["par_segnr"])
            entry["par_segnr"] = entry["par_segnr"][0]
            del entry["par_offset_beg"]
            del entry["par_offset_end"]
        else:
            print(f"Warning: Empty par_segtext for entry: {entry}")
            # Set default values for missing data
            entry["par_fulltext"] = []
            entry["score"] = prettify_score(entry["score"])
            # Handle par_segnr safely
            entry["par_segnr_range"] = shorten_segment_names(entry["par_segnr"])
            entry["par_segnr"] = entry["par_segnr"][0]
            # Remove offset fields if they exist
            if "par_offset_beg" in entry:
                del entry["par_offset_beg"]
            if "par_offset_end" in entry:
                del entry["par_offset_end"]
    return data
