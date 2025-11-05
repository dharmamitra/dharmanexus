import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStandardViewBaseQueryParams } from "@components/hooks/groupedQueryParams";
import {
  useIncludeMatchesParam,
  useLeftPaneActiveMatchParam,
  useRightPaneActiveMatchParam,
} from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { useSetDbViewFromPath } from "@components/hooks/useDbView";
import { DEFAULT_PARAM_VALUES } from "@features/SidebarSuite/uiSettings/config";
import { PaginationState } from "@features/textView/utils";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DbApi } from "@utils/api/dbApi";
import { ParsedTextViewParallels } from "@utils/api/endpoints/text-view/text-parallels";

// arbitrarily high number, as per virtuoso docs
const START_INDEX = 1_000_000;

interface UseTextPageReturn {
  allParallels: ParsedTextViewParallels;
  firstItemIndex: number;
  handleFetchingNextPage: () => Promise<void>;
  handleFetchingPreviousPage: () => Promise<void>;
  clearActiveMatch: () => Promise<void>;
  isError: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  error: Error | null;
}

interface Props {
  activeSegment: string;
  isRightPane?: boolean;
}

export function useTextViewPane({
  activeSegment,
  isRightPane,
}: Props): UseTextPageReturn {
  useSetDbViewFromPath();
  const requestBodyBase = useStandardViewBaseQueryParams();
  const [includeMatches] = useIncludeMatchesParam();

  const { fileName: fileNameUrlParam } = useDbPageRouterParams();
  const [leftPaneActiveMatchId, setLeftPaneActiveMatchId] =
    useLeftPaneActiveMatchParam();
  const [rightPaneActiveMatchId, setRightPaneActiveMatchId] =
    useRightPaneActiveMatchParam();

  const [fileNameFromActiveSegment, segment] = activeSegment.split(":");

  let processedFileName = fileNameFromActiveSegment;

  // TODO: This looks like a hack. We should confirm if there is an issue with elsewhere that prevents consistent file name handling.
  if (
    fileNameFromActiveSegment?.includes("ZH_") &&
    segment &&
    /_\d{3}$/.test(fileNameFromActiveSegment)
  ) {
    processedFileName = fileNameFromActiveSegment.replace(/_\d{3}$/, "");
  }

  const fileName = processedFileName ?? fileNameUrlParam;

  const initialPageParam =
    activeSegment === DEFAULT_PARAM_VALUES.active_segment ? 0 : undefined;

  const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);

  const paginationState = useRef<PaginationState>([0, 0]);

  // in the right pane, everything is only filtered by active file
  const requestFilters = isRightPane
    ? { ...requestBodyBase.filters, include_files: [fileNameUrlParam] }
    : requestBodyBase.filters;

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    isFetching,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery<
    Awaited<ReturnType<typeof DbApi.TextView.call>>,
    Error,
    InfiniteData<Awaited<ReturnType<typeof DbApi.TextView.call>>>,
    ReturnType<typeof DbApi.TextView.makeQueryKey>,
    number | undefined
  >({
    enabled: Boolean(fileName),
    placeholderData: (previousData, previousQuery) => {
      if (!previousQuery) return undefined;
      // Compare filenames without using refs during render. This keeps data only if viewing the same file.
      const prevParams = previousQuery.queryKey[1];
      const prevFileName =
        typeof prevParams === "object" && prevParams?.filename;
      return prevFileName === fileName ? previousData : undefined;
    },
    initialPageParam,
    queryKey: DbApi.TextView.makeQueryKey({
      ...requestBodyBase,
      include_matches: includeMatches,
      active_segment: activeSegment,
      filters: requestFilters,
    }),
    queryFn: async ({ pageParam }) => {
      // We pass the active_segment and active_match_id, but only on the first page load when a segment is active.
      // On subsequent fetches (for pagination), we do not pass them, so the BE can use the `page` param.
      // `pageParam` is only `undefined` on the very first fetch when a segment is active.
      const isInitialFetchWithSegment = pageParam === undefined;

      const activeSegmentParam = isInitialFetchWithSegment
        ? activeSegment
        : DEFAULT_PARAM_VALUES.active_segment;

      let activeMatchIdParam: string;
      if (isInitialFetchWithSegment) {
        activeMatchIdParam = isRightPane
          ? rightPaneActiveMatchId
          : leftPaneActiveMatchId;
      } else {
        activeMatchIdParam = DEFAULT_PARAM_VALUES.active_match;
      }

      return DbApi.TextView.call({
        ...requestBodyBase,
        include_matches: includeMatches,
        page: pageParam ?? 0,
        filename:
          fileNameFromActiveSegment === "none"
            ? fileNameUrlParam
            : (processedFileName ?? ""),
        active_segment: activeSegmentParam,
        active_match_id: activeMatchIdParam,
        filters: requestFilters,
      });
    },

    getPreviousPageParam: () => {
      // if it's the first page, don't fetch more
      const [startEdge] = paginationState.current;
      if (startEdge === undefined || startEdge === 0) return undefined;
      return startEdge - 1;
    },

    getNextPageParam: (lastPage) => {
      const [, endEdge] = paginationState.current;
      if (endEdge === undefined || endEdge === lastPage.data.totalPages - 1) {
        // last page, as indicated by the BE response
        return undefined;
      }
      return endEdge + 1;
    },
  });

  useEffect(
    function handleApiResponse() {
      if (!data?.pages[0]) {
        return;
      }
      const currentPageCount = data?.pages?.length;
      // when the first page is loaded, set the current page number to the one received from the BE
      if (currentPageCount === 1) {
        paginationState.current[0] = data?.pages[0].data.page;
        paginationState.current[1] = data?.pages[0].data.page;
      }
    },
    [data?.pages],
  );

  const handleFetchingPreviousPage = useCallback(async () => {
    // already on first page
    if (paginationState.current[0] === 0) return;

    const { data: responseData } = await fetchPreviousPage();

    paginationState.current = [
      responseData?.pages[0]?.data.page,
      paginationState.current[1],
    ];

    const fetchedPageSize = responseData?.pages[0]?.data.items?.length;
    if (!fetchedPageSize) return;

    // the user is scrolling up.
    // offset the new list items when prepending them to the page.
    setFirstItemIndex((prevState) => prevState - fetchedPageSize);
  }, [fetchPreviousPage]);

  const handleFetchingNextPage = useCallback(async () => {
    const response = await fetchNextPage();
    const newEndEdge = response.data?.pages.at(-1)?.data.page;
    paginationState.current = [paginationState.current[0], newEndEdge];
  }, [fetchNextPage]);

  const allParallels = useMemo(
    () => (data?.pages ? data.pages.flatMap((page) => page.data.items) : []),
    [data],
  );

  const clearActiveMatch = useCallback(async () => {
    if (isRightPane) {
      await setRightPaneActiveMatchId(DEFAULT_PARAM_VALUES.active_match);
    } else {
      await setLeftPaneActiveMatchId(DEFAULT_PARAM_VALUES.active_match);
    }
  }, [isRightPane, setLeftPaneActiveMatchId, setRightPaneActiveMatchId]);

  return {
    allParallels,
    firstItemIndex,
    handleFetchingNextPage,
    handleFetchingPreviousPage,
    clearActiveMatch,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    error,
  };
}
