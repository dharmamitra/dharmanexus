import { currentDbViewAtom } from "@atoms";
import { useIncludeMatchesParam } from "@components/hooks/params";
import { DbViewEnum } from "@utils/constants";
import { useAtomValue } from "jotai";

export const useIsRenderedInReaderMode = () => {
  const [includeMatches] = useIncludeMatchesParam();
  const currentView = useAtomValue(currentDbViewAtom);

  if (currentView !== DbViewEnum.TEXT) return true;

  return includeMatches;
};
