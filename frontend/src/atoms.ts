import { Script } from "@features/SidebarSuite/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { DbViewEnum } from "./utils/constants";

export const tibetanScriptAtom = atom<"Unicode" | "Wylie">("Unicode");

export const scriptSelectionAtom = atomWithStorage<Script>(
  "scriptSelection",
  "Unicode",
);

export const activeSegmentMatchesAtom = atom<string[]>([]);
export const hoveredOverParallelIdAtom = atom<string | null>(null);
export const isMiddlePaneMovingAtom = atom(false);
export const textViewIsMiddlePanePointingLeftAtom = atom(true);

export const currentDbViewAtom = atom<DbViewEnum>(DbViewEnum.TEXT);
export const isSearchDrawerOpenAtom = atom(false);
export const isSettingsDrawerOpenAtom = atom(false);

export const isDbSourceBrowserDrawerOpenAtom = atom(false);

export const textViewRightPaneFileNameAtom = atom<string | undefined>(
  undefined,
);

export const fontSizeAtom = atomWithStorage("fontSize", 16);

export const shouldShowSegmentNumbersAtom = atomWithStorage(
  "shouldShowSegmentNumbers",
  false,
);

export const shouldUseMonochromaticSegmentColorsAtom = atomWithStorage(
  "shouldUseMonochromaticSegmentColors",
  false,
);
