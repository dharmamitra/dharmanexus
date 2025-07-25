import type { JSX } from "react";
import React, { useMemo } from "react";
import { currentDbViewAtom } from "@atoms";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
import { UtilityUIOptionName } from "@features/SidebarSuite/types";
import { utilityUISettings } from "@features/SidebarSuite/uiSettings/config";
import { getAvailableSettings } from "@features/SidebarSuite/utils";
import List from "@mui/material/List";
import { useAtomValue } from "jotai";

import { UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES } from "./config";
import { CopyResultInfoButton } from "./CopyResultInfoButton";
import { DownloadResultsButton } from "./DownloadResultsButton";
import { EmailResultInfoButton } from "./EmailResultInfoButton";

export const UtilityUiomponents: Record<
  UtilityUIOptionName,
  JSX.Element | null
> = {
  download_data: <DownloadResultsButton />,
  copyResultInfo: <CopyResultInfoButton />,
  emailResultInfo: <EmailResultInfoButton />,
};

export const UtilityOptionsSection = () => {
  const currentView = useAtomValue(currentDbViewAtom);
  const { dbLanguage } = useNullableDbRouterParams();

  const uiOptions = useMemo(() => {
    if (dbLanguage) {
      return getAvailableSettings<UtilityUIOptionName>({
        dbLanguage,
        uiSettings: utilityUISettings,
        unavailableSettingsForViewOrLang:
          UNAVAILABLE_DB_SOURCE_PAGE_UI_UTILITIES[currentView] ?? {},
      });
    }

    return [];
  }, [dbLanguage, currentView]);

  if (uiOptions.length === 0) {
    return null;
  }

  return (
    <List sx={{ m: 0 }}>
      {uiOptions.map((filter) => {
        const Component = UtilityUiomponents[filter];
        const key = `filter-setting-${filter}`;

        if (!Component) return null;
        return React.cloneElement(Component, { key });
      })}
    </List>
  );
};
