import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";
import { DbLanguage } from "@utils/api/types";
import chroma from "chroma-js";

import {
  STANDARD_MATCH_HEAT_THEME_DARK_MODE,
  STANDARD_MATCH_HEAT_THEME_LIGHT_MODE,
  VIVID_MATCH_HEAT_THEME,
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
    return VIVID_MATCH_HEAT_THEME;
  }

  return [];
};

export const buildSegmentClassName = ({
  styles,
  isDarkTheme,
  isSelected,
  isSegmentPartSelected,
  isActiveMatch,
  isSegmentPartHoveredOverInMiddleView,
  isSegmentSelected,
  isFolioTextViewNavigation,
  isRightPane,
}: {
  styles: Record<string, string>;
  isDarkTheme: boolean;
  isSelected: boolean;
  isSegmentPartSelected: boolean;
  isActiveMatch?: boolean;
  isSegmentPartHoveredOverInMiddleView: boolean;
  isSegmentSelected: boolean;
  isFolioTextViewNavigation: boolean;
  isRightPane: boolean;
}) => {
  const classNames = [styles.segment];

  if (isDarkTheme && styles["segment--dark"])
    classNames.push(styles["segment--dark"]);
  if (isSelected && styles["segment--selected"])
    classNames.push(styles["segment--selected"]);
  if (
    isSegmentPartSelected &&
    !isActiveMatch &&
    styles["segment--part-selected"]
  )
    classNames.push(styles["segment--part-selected"]);
  if (
    isSegmentPartHoveredOverInMiddleView &&
    styles["segment--parallel-hovered"]
  )
    classNames.push(styles["segment--parallel-hovered"]);
  if (
    isSegmentSelected &&
    isFolioTextViewNavigation &&
    styles["segment--active"]
  )
    classNames.push(styles["segment--active"]);
  if (isSegmentSelected && isRightPane && styles["segment--active"])
    classNames.push(styles["segment--active"]);

  return classNames.join(" ");
};
