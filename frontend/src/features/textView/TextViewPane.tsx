import React, {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { fontSizeAtom, tibetanScriptSelectionAtom } from "@atoms";
import {
  EmptyPlaceholder,
  ListLoadingIndicator,
} from "@components/db/ListComponents";
import { TextSegment } from "@features/textView/TextSegment";
import { useTextViewPane } from "@features/textView/useTextViewPane";
import {
  findSegmentIndexInParallelsData,
  getTextViewColorScale,
} from "@features/textView/utils";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import {
  ParsedTextViewParallel,
  ParsedTextViewParallels,
} from "@utils/api/endpoints/text-view/text-parallels";
import { useAtomValue } from "jotai";
import debounce from "lodash/debounce";

export interface TextViewPaneProps {
  isRightPane: boolean;
  activeSegmentId: string;
  setActiveSegmentId: (id: string) => Promise<URLSearchParams>;
  activeSegmentIndex: number;
  setActiveSegmentIndex: (index: number) => Promise<URLSearchParams>;
  initialActiveSegment?: string;
}

const debounceEdgeReachedFunction =
  (callback: () => Promise<void>) => async (isReached: boolean) => {
    if (!isReached) return;
    const debouncedEdgeReachedFunction = debounce(
      async () => await callback(),
      1000,
      { leading: true },
    );
    await debouncedEdgeReachedFunction();
  };

export const TextViewPane = ({
  isRightPane,
  activeSegmentId,
  setActiveSegmentId,
  activeSegmentIndex,
  setActiveSegmentIndex,
  initialActiveSegment,
}: TextViewPaneProps) => {
  const tibetanScript = useAtomValue(tibetanScriptSelectionAtom);
  const fontSize = useAtomValue(fontSizeAtom);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const wasDataJustAppended: RefObject<boolean> = useRef(false);
  const [initialSegmentId] = useState(initialActiveSegment ?? activeSegmentId);
  const isInitialLoad = useRef(true);
  const previousActiveSegmentId = useRef(activeSegmentId);
  const isFolioNavigation = useRef(false);

  // For left pane: use activeSegmentId if it has changed from initial, otherwise use initialSegmentId
  // This allows folio navigation to work while preventing middle pane interactions from reloading
  let effectiveActiveSegment: string;
  if (isRightPane) {
    effectiveActiveSegment = activeSegmentId;
  } else if (activeSegmentId === initialSegmentId) {
    effectiveActiveSegment = initialSegmentId;
  } else {
    effectiveActiveSegment = activeSegmentId;
  }

  const {
    // [TODO] add error handling
    // isError,
    // error,
    isFetching,
    allParallels,
    firstItemIndex,
    isFetchingPreviousPage,
    isFetchingNextPage,
    handleFetchingPreviousPage,
    handleFetchingNextPage,
    isLoading,
    clearActiveMatch,
    initialActiveSegment: initialActiveSegmentFromHook,
  } = useTextViewPane({
    activeSegment: effectiveActiveSegment,
    isRightPane,
  });

  // assign data to a ref to avoid re-running the effect when items are appended during endless loading.
  const allParallelsRef = useRef<ParsedTextViewParallels>(allParallels);

  useLayoutEffect(() => {
    allParallelsRef.current = allParallels;
  }, [allParallels]);

  const colorScale = useMemo(
    () => getTextViewColorScale(allParallels),
    [allParallels],
  );

  const scrollToActiveSegment = useCallback(() => {
    if (isLoading) return;
    const index = findSegmentIndexInParallelsData(
      allParallelsRef.current,
      activeSegmentId,
    );
    if (index === -1) return;
    virtuosoRef.current?.scrollToIndex({ index, align: "center" });
  }, [activeSegmentId, isLoading]);

  useEffect(() => {
    // We want to scroll in two cases:
    // 1. On the initial load of the component when a segment is active.
    // 2. In the right pane, any time the active segment changes.
    // 3. In the left pane, when the active segment changes due to folio navigation (not segment clicks)
    const shouldScroll =
      isRightPane || isInitialLoad.current || isFolioNavigation.current;

    // We can only scroll once the data has finished loading.
    if (shouldScroll && !isLoading) {
      scrollToActiveSegment();
      // [workaround/hack] - it doesn't always consistently scroll to the activeSegment, even with this hack, but it helps
      setTimeout(() => scrollToActiveSegment(), 1000);

      if (isInitialLoad.current) {
        // We've completed the initial scroll, so we disable it for subsequent renders.
        isInitialLoad.current = false;
      }

      // Reset the folio navigation flag after scrolling
      if (isFolioNavigation.current) {
        isFolioNavigation.current = false;
      }
    }

    // Update the previous active segment ID
    previousActiveSegmentId.current = activeSegmentId;
  }, [
    isRightPane,
    isLoading,
    scrollToActiveSegment,
    activeSegmentId,
    initialSegmentId,
  ]);

  // Listen for folio navigation changes
  useEffect(() => {
    // Detect if this is folio navigation (activeSegmentId changed from initialSegmentId)
    if (
      !isRightPane &&
      activeSegmentId !== initialSegmentId &&
      activeSegmentId !== previousActiveSegmentId.current
    ) {
      isFolioNavigation.current = true;
    }
  }, [activeSegmentId, initialSegmentId, isRightPane]);

  const handleStartReached = useCallback(async () => {
    wasDataJustAppended.current = true;
    await handleFetchingPreviousPage();
    // fixes issue with scrolling to segment automatically on endless scrolling
    setTimeout(() => (wasDataJustAppended.current = false));
  }, [handleFetchingPreviousPage]);

  const handleBottomReached = useCallback(async () => {
    wasDataJustAppended.current = true;
    await handleFetchingNextPage();
    // fixes issue with scrolling to segment automatically on endless scrolling
    setTimeout(() => (wasDataJustAppended.current = false));
  }, [handleFetchingNextPage]);

  const itemContent = useCallback(
    (index: number, dataSegment: ParsedTextViewParallel) => (
      <TextSegment
        data={dataSegment}
        colorScale={colorScale}
        activeSegmentId={activeSegmentId}
        setActiveSegmentId={setActiveSegmentId}
        activeSegmentIndex={activeSegmentIndex}
        setActiveSegmentIndex={setActiveSegmentIndex}
        clearActiveMatch={clearActiveMatch}
        isRightPane={isRightPane}
        initialActiveSegment={initialActiveSegmentFromHook}
        tibetanScript={tibetanScript}
        fontSize={fontSize}
      />
    ),
    [
      activeSegmentId,
      activeSegmentIndex,
      clearActiveMatch,
      colorScale,
      isRightPane,
      setActiveSegmentId,
      setActiveSegmentIndex,
      initialActiveSegmentFromHook,
      tibetanScript,
      fontSize,
    ],
  );

  return (
    <Card sx={{ height: "100%" }}>
      <Box sx={{ height: "100%", py: 2, px: 2 }}>
        <Virtuoso<ParsedTextViewParallel>
          ref={virtuosoRef}
          firstItemIndex={firstItemIndex}
          increaseViewportBy={1000}
          skipAnimationFrameInResizeObserver={true}
          components={{
            Header: isFetchingPreviousPage ? ListLoadingIndicator : undefined,
            Footer: isFetchingNextPage ? ListLoadingIndicator : undefined,
            EmptyPlaceholder: isFetching
              ? ListLoadingIndicator
              : EmptyPlaceholder,
          }}
          itemContent={itemContent}
          data={allParallels}
          atTopStateChange={debounceEdgeReachedFunction(handleStartReached)}
          atBottomStateChange={debounceEdgeReachedFunction(handleBottomReached)}
        />
      </Box>
    </Card>
  );
};
