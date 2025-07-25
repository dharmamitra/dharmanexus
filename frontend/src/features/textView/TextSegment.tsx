import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  activeSegmentMatchesAtom,
  heatMapThemeAtom,
  hoveredOverParallelIdAtom,
  shouldShowSegmentNumbersAtom,
  textViewIsMiddlePanePointingLeftAtom,
} from "@atoms";
import { sourceSans } from "@components/theme";
import { TibetanScript } from "@features/SidebarSuite/types";
import { enscriptSegment } from "@features/SidebarSuite/utils";
import {
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
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import styles from "./textSegment.module.scss";

type TextSegmentProps = {
  isRightPane: boolean;
  data: ParsedTextViewParallel;
  colorScale: Scale;
  activeSegmentId: string;
  activeSegmentIndex: number;
  setActiveSegmentId: (id: string) => Promise<URLSearchParams>;
  setActiveSegmentIndex: (index: number) => Promise<URLSearchParams>;
  clearActiveMatch: () => Promise<void>;
  initialActiveSegment?: string;
  tibetanScript: TibetanScript;
  fontSize: number;
};

export const TextSegment = ({
  isRightPane,
  data,
  colorScale,
  activeSegmentId,
  activeSegmentIndex,
  setActiveSegmentId,
  setActiveSegmentIndex,
  clearActiveMatch,
  initialActiveSegment,
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
  const isSegmentSelected = activeSegmentId === data?.segmentNumber;
  const isInitialActiveSegment =
    initialActiveSegment === data?.segmentNumber &&
    activeSegmentId === initialActiveSegment;

  const [, setIsMiddlePanePointingLeft] = useAtom(
    textViewIsMiddlePanePointingLeftAtom,
  );

  const matchHeatColors = getMatchHeatColors(heatMapTheme, isDarkTheme);

  const updateSelectedLocationInGlobalState = useCallback(
    async (location: { id: string; index: number; matches: string[] }) => {
      setIsMiddlePanePointingLeft(isRightPane);
      setSelectedSegmentMatches(location.matches);
      await Promise.all([
        setActiveSegmentId(location.id),
        setActiveSegmentIndex(location.index),
        clearActiveMatch(),
      ]);
    },
    [
      clearActiveMatch,
      isRightPane,
      setActiveSegmentId,
      setActiveSegmentIndex,
      setIsMiddlePanePointingLeft,
      setSelectedSegmentMatches,
    ],
  );

  const matchSets = useMemo(() => {
    // optimisation - don't run the map function if there are no active segments (middle view is closed)
    if (activeSegmentId === "none") return undefined;
    return data?.segmentText.map((textChunk) => new Set(textChunk.matches));
  }, [activeSegmentId, data?.segmentText]);

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
            target="_blank"
            rel="noopener noreferrer"
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
                ? matchSets[i]?.has(hoveredOverParallelId)
                : false;

            const isSelected = isSegmentSelected
              ? isSegmentPartSelected
              : isActiveMatch;

            const segmentClassName = `${styles.segment} ${
              isDarkTheme && styles["segment--dark"]
            } ${isSelected && styles["segment--selected"]} ${
              isSegmentPartSelected &&
              !isActiveMatch &&
              styles["segment--part-selected"]
            } ${
              isSegmentPartHoveredOverInMiddleView &&
              styles["segment--parallel-hovered"]
            } ${isInitialActiveSegment && styles["segment--initial-active"]}`;

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
                onClick={async () => {
                  await updateSelectedLocationInGlobalState({
                    id: data.segmentNumber,
                    matches,
                    index: i,
                  });
                }}
                onKeyDown={async (event) => {
                  // allow selecting the segments by pressing space or enter
                  if (event.key !== " " && event.key !== "Enter") return;
                  event.preventDefault();
                  await updateSelectedLocationInGlobalState({
                    id: data.segmentNumber,
                    matches,
                    index: i,
                  });
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
