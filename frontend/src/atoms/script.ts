import { Script } from "@features/SidebarSuite/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const tibetanScriptAtom = atom<"Unicode" | "Wylie">("Unicode");

// this is the main atom for the script selection.
// It is used for all languages except Tibetan.
export const scriptSelectionAtom = atomWithStorage<Script>(
  "scriptSelection",
  "Unicode",
);
