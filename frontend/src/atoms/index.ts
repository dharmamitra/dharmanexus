import { NodeApi, TreeApi } from "react-arborist";
import { DbSourceTreeNode } from "@components/db/SearchableDbSourceTree/types";
import { DbViewEnum, DEFAULT_DB_VIEW } from "@constants/view";
import type { TibetanScript } from "@features/SidebarSuite/types";
import { DbSourceFiltersSelectedIds } from "@features/SidebarSuite/types";
import { MatchHeatMapTheme } from "@features/textView/constants";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

/**
 * GENERAL
 */

export const currentDbViewAtom = atomWithStorage<DbViewEnum>(
  "db-view",
  DEFAULT_DB_VIEW,
);

/**
 * SOURCE DATA TREE
 */

export const isDbSourceBrowserDrawerOpenAtom = atom(false);
export const activeDbSourceTreeAtom = atom<
  TreeApi<DbSourceTreeNode> | null | undefined
>(null);
export const activeDbSourceTreeBreadcrumbsAtom = atom<
  NodeApi<DbSourceTreeNode>[]
>([]);
export const focusedDbSourceTreeNodeAtom = atom<
  NodeApi<DbSourceTreeNode> | null | undefined
>(null);

/**
 * SETTINGS SIDEBAR
 */

export const tibetanScriptSelectionAtom = atomWithStorage<TibetanScript>(
  "tibetan-script-selection",
  "Unicode",
);

export const isSettingsOpenAtom = atomWithStorage<boolean>(
  "isSettingsOpen",
  false,
);
export const dbSourceFiltersSelectedIdsAtom = atom<DbSourceFiltersSelectedIds>({
  exclude_sources: [],
  include_sources: [],
});

export const isSearchDrawerOpenAtom = atom(false);
export const isSettingsDrawerOpenAtom = atom(false);

/**
 * TEXT VIEW
 */
export const textViewFilterComparisonAtom = atom<string | undefined>(undefined);
export const textViewRightPaneFileNameAtom = atom<string | undefined>(
  undefined,
);
export const textViewIsMiddlePanePointingLeftAtom = atom(true);
export const shouldShowSegmentNumbersAtom = atomWithStorage<boolean>(
  "shouldShowSegmentNumbers",
  true,
);
export const shouldUseMonochromaticSegmentColorsAtom = atomWithStorage<boolean>(
  "shouldUseMonochromaticSegmentColors",
  true,
);
export const heatMapThemeAtom = atomWithStorage<MatchHeatMapTheme>(
  "heatMapTheme",
  "standard",
);

export const fontSizeAtom = atomWithStorage<number>("fontSize", 18);

export const includeMatchesAtom = atomWithStorage<boolean>(
  "includeMatches",
  false,
);

export const activeSegmentMatchesAtom = atom<string[]>([]);

export const hoveredOverParallelIdAtom = atom<string | null>(null);

export const isMiddlePaneMovingAtom = atom(false);
