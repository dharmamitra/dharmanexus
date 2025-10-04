import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  activeSegmentMatchesAtom,
  heatMapThemeAtom,
  hoveredOverParallelIdAtom,
  middlePaneOpenAtom,
  shouldShowSegmentNumbersAtom,
  textViewIsMiddlePanePointingLeftAtom,
} from "@atoms";
import { sourceSans } from "@components/theme";
import { TibetanScript } from "@features/SidebarSuite/types";
import { enscriptSegment } from "@features/SidebarSuite/utils";
import {
  buildSegmentClassName,
  createURLToSegment,
  getMatchHeatColors,
} from "@features/textView/utils";
import {
  Box,
  Link as MuiLink,
  useColorScheme,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ParsedTextViewParallel } from "@utils/api/endpoints/text-view/text-parallels";
import type { Scale } from "chroma-js";
import { useAtomValue, useSetAtom } from "jotai";

import styles from "./textSegment.module.css";

type TextSegmentProps = {
  isRightPane: boolean;
  data: ParsedTextViewParallel;
  colorScale: Scale;
  activeSegmentId: string;
  activeSegmentIndex: number;
  isFolioTextViewNavigation: boolean;
  tibetanScript: TibetanScript;
  fontSize: number;
};

export const TextSegment = ({
  isRightPane,
  data,
  colorScale,
  activeSegmentId,
  activeSegmentIndex,
  isFolioTextViewNavigation,
  tibetanScript,
  fontSize,
}: TextSegmentProps) => {
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.up("sm"));
  const { mode } = useColorScheme();
  const isDarkTheme = mode === "dark";

  const heatMapTheme = useAtomValue(heatMapThemeAtom);
  const shouldShowSegmentNumbers = useAtomValue(shouldShowSegmentNumbersAtom);
  const hoveredOverParallelId = useAtomValue(hoveredOverParallelIdAtom);
  const setSelectedSegmentMatches = useSetAtom(activeSegmentMatchesAtom);
  const setMiddlePaneOpen = useSetAtom(middlePaneOpenAtom);
  const isSegmentSelected = activeSegmentId === data?.segmentNumber;

  const setIsMiddlePanePointingLeft = useSetAtom(
    textViewIsMiddlePanePointingLeftAtom,
  );

  const matchHeatColors = getMatchHeatColors(heatMapTheme, isDarkTheme);

  const handleSegmentClick = useCallback(
    (matches: string[]) => {
      setIsMiddlePanePointingLeft(isRightPane);
      setSelectedSegmentMatches(matches);
      setMiddlePaneOpen(true);
    },
    [
      isRightPane,
      setIsMiddlePanePointingLeft,
      setSelectedSegmentMatches,
      setMiddlePaneOpen,
    ],
  );

  const matchSets = useMemo(() => {
    return data?.segmentText.map((textChunk) => new Set(textChunk.matches));
  }, [data?.segmentText]);

  if (!data) return null;

  const urlToSegment = createURLToSegment({
    segmentNumber: data.segmentNumber,
    language: data.language,
  });

  // segnr also contains the file name - we need to strip it away
  const [, segmentNumber] = data.segmentNumber.split(":");

  return (
    <div className={styles.segmentWrapper}>
      <Box
        className={`${styles.segmentNumber} ${
          isSegmentSelected && styles["segmentNumber--selected"]
        } ${!shouldShowSegmentNumbers && styles["segmentNumber--hidden"]}`}
      >
        <Link href={urlToSegment} passHref legacyBehavior>
          <MuiLink
            data-segmentnumber={segmentNumber}
            className={styles.segmentNumber__link}
          />
        </Link>
      </Box>

      <span>
        {data.segmentText.map(
          ({ text, highlightColor, matches, isActiveMatch }, i) => {
            const segmentKey = segmentNumber ? segmentNumber + i : undefined;
            const textContent = enscriptSegment({
              text,
              tibetanScript,
              segmentLanguage: data.language,
            });

            // [hack/workaround]: in the right pane, we don't know the correct segment index
            // because it is opened by clicking a parallel in the middle view. We highlight the whole segment instead.

            const isSegmentPartSelected =
              isSegmentSelected &&
              (activeSegmentIndex === null ||
                activeSegmentIndex === i ||
                activeSegmentIndex > data.segmentText.length);

            const isSegmentPartHoveredOverInMiddleView =
              matchSets && hoveredOverParallelId
                ? (matchSets[i]?.has(hoveredOverParallelId) ?? false)
                : false;

            const isSelected = isSegmentSelected
              ? isSegmentPartSelected
              : isActiveMatch;

            const segmentClassName = buildSegmentClassName({
              styles,
              isDarkTheme,
              isSelected,
              isSegmentPartSelected,
              isActiveMatch,
              isSegmentPartHoveredOverInMiddleView,
              isSegmentSelected,
              isFolioTextViewNavigation,
              isRightPane,
            });

            if (matches.length === 0) {
              return (
                <span
                  key={segmentKey}
                  className={`${segmentClassName} ${styles["segment--noMatches"]}`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {textContent}
                </span>
              );
            }

            const color: string =
              heatMapTheme === "monochrome"
                ? colorScale(highlightColor).hex()
                : (matchHeatColors[highlightColor] ??
                  matchHeatColors.at(-1) ??
                  "");

            return (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <span
                key={segmentKey}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                className={`${segmentClassName} ${styles.segment__button}`}
                style={{
                  fontFamily: sourceSans.style.fontFamily,
                  color,
                  fontSize: `${fontSize}px`,
                }}
                onClick={() => {
                  handleSegmentClick(matches);
                }}
                onKeyDown={(event) => {
                  // allow selecting the segments by pressing space or enter
                  if (event.key !== " " && event.key !== "Enter") return;
                  event.preventDefault();
                  handleSegmentClick(matches);
                }}
              >
                {textContent}
              </span>
            );
          },
        )}
      </span>
    </div>
  );
};
