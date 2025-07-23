import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { useIncludeMatchesParam } from "@components/hooks/params";
import { CollapsibleSection } from "@features/SidebarSuite/common/CollapsibleSection";
import { DrawerHeader } from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import DbSourceFilter from "@features/SidebarSuite/uiSettings/DbSourceFilter";
import { DbViewSelector } from "@features/SidebarSuite/uiSettings/DbViewSelector";
import FolioOption from "@features/SidebarSuite/uiSettings/FolioOption";
import { FontSizeSlider } from "@features/SidebarSuite/uiSettings/FontSizeSlider";
import { HeatMapColorsSelector } from "@features/SidebarSuite/uiSettings/HeatMapColorsSelector";
import MultiLingualSelector from "@features/SidebarSuite/uiSettings/MultiLingualSelector";
import ParLengthFilter from "@features/SidebarSuite/uiSettings/ParLengthFilter";
import { ResetFiltersButton } from "@features/SidebarSuite/uiSettings/ResetFiltersButton";
import ScoreFilter from "@features/SidebarSuite/uiSettings/ScoreFilter";
import { ShowSegmentNumbersSwitch } from "@features/SidebarSuite/uiSettings/ShowSegmentNumbersSwitch";
import { TibetanScriptSelector } from "@features/SidebarSuite/uiSettings/TextScriptSelectors";
import TextViewFolioNavigation from "@features/SidebarSuite/uiSettings/TextViewFolioNavigation";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, Typography } from "@mui/material";
import { DbViewEnum } from "@utils/constants";
import { useAtomValue } from "jotai";

import { UtilityOptionsSection } from "./UtilityOptionsSection/UtilityOptionsSection";

export const HeaderBoxSyles = {
  width: 1,
  borderBottom: 1,
  borderColor: "divider",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem 1rem",
};

function CloseButton({
  setIsSettingsOpen,
}: {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useTranslation("settings");
  return (
    <IconButton
      aria-label={t("generic.close")}
      onClick={() => setIsSettingsOpen(false)}
    >
      <CloseRoundedIcon />
    </IconButton>
  );
}

export function SidebarBody({
  setIsSettingsOpen,
}: {
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [includeMatches] = useIncludeMatchesParam();
  const { t } = useTranslation("settings");
  const currentView = useAtomValue(currentDbViewAtom);

  return (
    <>
      <DrawerHeader>
        <Box sx={HeaderBoxSyles}>
          <Typography variant="h6" component="h2">
            {t("headings.settings")}
          </Typography>
          <CloseButton setIsSettingsOpen={setIsSettingsOpen} />
        </Box>
      </DrawerHeader>

      <Box sx={{ p: 2 }}>
        <DbViewSelector />
        <CollapsibleSection
          title={t("headings.display")}
          defaultExpanded={true}
        >
          <ShowSegmentNumbersSwitch />
          <HeatMapColorsSelector />
          <TibetanScriptSelector />
          <FontSizeSlider />
          {currentView === DbViewEnum.TEXT && <TextViewFolioNavigation />}
        </CollapsibleSection>

        <CollapsibleSection title={t("headings.filters")}>
          <Box
            sx={{
              pointerEvents: includeMatches ? "auto" : "none",
              opacity: includeMatches ? 1 : 0.5,
            }}
          >
            <ResetFiltersButton />
            {currentView === DbViewEnum.TEXT && <MultiLingualSelector />}
            <ScoreFilter />
            <ParLengthFilter />
            <DbSourceFilter filterName="exclude_sources" />
            <DbSourceFilter filterName="include_sources" />
            {currentView !== DbViewEnum.TEXT && <FolioOption />}
          </Box>
        </CollapsibleSection>

        <CollapsibleSection title={t("headings.tools")}>
          <Box
            sx={{
              pointerEvents: includeMatches ? "auto" : "none",
              opacity: includeMatches ? 1 : 0.5,
            }}
          >
            <UtilityOptionsSection />
          </Box>
        </CollapsibleSection>
      </Box>
    </>
  );
}
