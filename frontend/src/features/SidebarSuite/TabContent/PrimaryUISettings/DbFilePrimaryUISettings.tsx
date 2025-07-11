import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useIsRenderedInReaderMode } from "@components/hooks/useIsRenderedInReaderMode";
import PanelHeading from "@features/SidebarSuite/common/PanelHeading";
import { AVAILABLE_DB_FILE_PAGE_FILTERS } from "@features/SidebarSuite/TabContent/config";
import { DbViewSelector } from "@features/SidebarSuite/uiSettings/DbViewSelector";
import { TextViewMatchesSwitch } from "@features/SidebarSuite/uiSettings/TextViewMatchesSwitch";
import { Box } from "@mui/material";
import { DbViewEnum } from "@utils/constants";
import { useAtomValue } from "jotai";

import FilterUISettings from "./FilterUISettings";

export default function DbFilePrimaryUISettings() {
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);

  const isRenderedInReaderMode = useIsRenderedInReaderMode();

  const filters = AVAILABLE_DB_FILE_PAGE_FILTERS[currentView];

  if (filters.length === 0) return null;

  return (
    <Box>
      <PanelHeading heading={t("tabs.settings")} />
      <DbViewSelector />

      {currentView === DbViewEnum.TEXT ? <TextViewMatchesSwitch /> : null}

      {isRenderedInReaderMode ? (
        <>
          <PanelHeading heading={t("headings.filters")} sx={{ mt: 2 }} />
          <FilterUISettings filterSettingNames={filters} />
        </>
      ) : null}
    </Box>
  );
}
