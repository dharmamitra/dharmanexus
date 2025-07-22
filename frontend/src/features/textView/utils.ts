import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";
import { DbLanguage } from "@utils/api/types";
import chroma from "chroma-js";

import {
  STANDARD_MATCH_HEAT_THEME_DARK_MODE,
  STANDARD_MATCH_HEAT_THEME_LIGHT_MODE,
  VIVID_MATCH_HEAT_THEME_DARK_MODE,
  VIVID_MATCH_HEAT_THEME_LIGHT_MODE,
} from "./constants";

export function getTextViewColorScale(
  data: ParsedTextViewParallels,
): chroma.Scale {
  const colors = data.map((item) => item.segmentText[0]?.highlightColor ?? 0);
  const [minColor, maxColor] = [Math.min(...colors), Math.max(...colors)];

  return chroma
    .scale("Reds")
    .padding([0.7, 0])
    .domain([maxColor, minColor])
    .correctLightness(true);
}

export function findSegmentIndexInParallelsData(
  data: ParsedTextViewParallels,
  activeSegmentId: string,
) {
  if (data.length <= 0) return -1;
  const index = data.findIndex(
    (element) => element.segmentNumber === activeSegmentId,
  );
  if (index === -1) return -1;
  return index;
}

export type PaginationState = [startEdgePage?: number, endEdgePage?: number];

export const createURLToSegment = ({
  segmentNumber,
  language,
}: {
  segmentNumber: string;
  language: DbLanguage;
}) => {
  // Example: ["dn1:1.1.1_0", "dn1:1.1.2_0"] -> ["dn1", "1.1.1_0"]
  const [fileName] = segmentNumber.split(":");

  return `/db/${language}/${fileName}/text?active_segment=${segmentNumber}`;
};

export const getMatchHeatColors = (
  heatMapTheme: string,
  isDarkTheme: boolean,
) => {
  if (heatMapTheme === "standard") {
    if (isDarkTheme) return STANDARD_MATCH_HEAT_THEME_DARK_MODE;
    return STANDARD_MATCH_HEAT_THEME_LIGHT_MODE;
  }

  if (heatMapTheme === "vivid") {
    if (isDarkTheme) return VIVID_MATCH_HEAT_THEME_DARK_MODE;
    return VIVID_MATCH_HEAT_THEME_LIGHT_MODE;
  }

  return [];
};
