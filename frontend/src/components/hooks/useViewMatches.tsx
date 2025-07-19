import { currentDbViewAtom } from "@atoms";
import { useIncludeMatchesParam } from "@components/hooks/params";
import { DbViewEnum } from "@constants/view";
import { useAtomValue } from "jotai";

export const useViewMatches = () => {
  const [includeMatches, setIncludeMatches] = useIncludeMatchesParam();
  const currentView = useAtomValue(currentDbViewAtom);

  if (currentView !== DbViewEnum.TEXT)
    return {
      matchesSwitchVisible: false,
      matchesVisible: true,
      setIncludeMatches: () => {},
    };

  return {
    matchesSwitchVisible: true,
    matchesVisible: includeMatches,
    setIncludeMatches,
  };
};

export type MatchOptions = ReturnType<typeof useViewMatches>;
