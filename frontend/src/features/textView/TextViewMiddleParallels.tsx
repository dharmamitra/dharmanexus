import React, { useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";
import {
  activeSegmentMatchesAtom,
  hoveredOverParallelIdAtom,
  textViewIsMiddlePanePointingLeftAtom,
} from "@atoms";
import { LoadingCard } from "@components/common/Loading";
import {
  useActiveSegmentParam,
  useLeftPaneActiveMatchParam,
  useRightPaneActiveMatchParam,
  useRightPaneActiveSegmentParam,
} from "@components/hooks/params";
import { ParallelSegment } from "@features/tableView/ParallelSegment";
import { ArrowForward, Numbers } from "@mui/icons-material";
import { Box, CardContent, CardHeader, Chip, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { useAtomValue, useSetAtom } from "jotai";

import { CloseTextViewPaneButton } from "./CloseTextViewPaneButton";

type Props = {
  onClose: () => void;
};

export default function TextViewMiddleParallels({ onClose }: Props) {
  const { t } = useTranslation();

  const activeSegmentMatches = useAtomValue(activeSegmentMatchesAtom);
  const setHoveredOverParallelId = useSetAtom(hoveredOverParallelIdAtom);

  const isMiddlePanePointingLeft = useAtomValue(
    textViewIsMiddlePanePointingLeftAtom,
  );

  const { data, isLoading } = useQuery({
    queryKey: DbApi.TextViewMiddle.makeQueryKey(activeSegmentMatches),
    queryFn: () =>
      DbApi.TextViewMiddle.call({ parallel_ids: activeSegmentMatches }),
    enabled: activeSegmentMatches.length > 0,
  });

  const [activeSegmentId, setActiveSegmentId] = useActiveSegmentParam();
  const [rightPaneActiveSegmentId, setRightPaneActiveSegmentId] =
    useRightPaneActiveSegmentParam();
  const [, setLeftPaneActiveMatch] = useLeftPaneActiveMatchParam();
  const [, setRightPaneActiveMatch] = useRightPaneActiveMatchParam();

  const activeMiddleSegmentId = React.useRef(activeSegmentId);

  React.useEffect(() => {
    activeMiddleSegmentId.current = activeSegmentId;
  }, [activeSegmentId]);

  const openTextPane = useCallback(
    async (id: string, textSegmentNumber: string) => {
      if (isMiddlePanePointingLeft) {
        await Promise.all([
          setLeftPaneActiveMatch(id ?? ""),
          setActiveSegmentId(textSegmentNumber),
        ]);
      } else {
        await Promise.all([
          setRightPaneActiveMatch(id ?? ""),
          setRightPaneActiveSegmentId(textSegmentNumber),
        ]);
      }
    },
    [
      isMiddlePanePointingLeft,
      setLeftPaneActiveMatch,
      setRightPaneActiveMatch,
      setActiveSegmentId,
      setRightPaneActiveSegmentId,
    ],
  );

  const parallelsToDisplay = useMemo(
    () =>
      data
        // hide empty parallels
        ?.filter((parallel) => parallel.parallelFullText)
        .map(
          (
            {
              id,
              fileName,
              displayName,
              parallelLength,
              parallelFullText,
              parallelSegmentNumber,
              parallelSegmentNumberRange,
              score,
              targetLanguage,
            },
            index,
          ) => (
            <ParallelSegment
              key={fileName + score + parallelLength + index}
              id={id}
              displayName={displayName}
              language={targetLanguage}
              length={parallelLength}
              text={parallelFullText}
              score={score}
              textSegmentNumber={parallelSegmentNumber}
              textSegmentNumberRange={parallelSegmentNumberRange}
              segmentIdToMatch={
                isMiddlePanePointingLeft
                  ? activeSegmentId
                  : rightPaneActiveSegmentId
              }
              onHover={setHoveredOverParallelId}
              onClick={openTextPane}
            />
          ),
        ),
    [
      activeSegmentId,
      data,
      isMiddlePanePointingLeft,
      openTextPane,
      rightPaneActiveSegmentId,
      setHoveredOverParallelId,
    ],
  );

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <CardHeader
        data-testid="middle-view-header"
        sx={{
          backgroundColor: "background.header",
          borderBottom: "2px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: 2,
          width: "100%",
        }}
        action={<CloseTextViewPaneButton handlePress={onClose} />}
        title={
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${activeSegmentMatches.length} ${t("db.segmentMatches")}`}
              variant="outlined"
              size="small"
              icon={<Numbers fontSize="inherit" />}
            />
            <ArrowForward
              sx={{
                transition: "transform 250ms ease-out",
                transform: `rotate(${isMiddlePanePointingLeft ? "180deg" : "0deg"})`,
              }}
              fontSize="inherit"
            />
          </Stack>
        }
      />

      <CardContent>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          : parallelsToDisplay}
      </CardContent>
    </Box>
  );
}
