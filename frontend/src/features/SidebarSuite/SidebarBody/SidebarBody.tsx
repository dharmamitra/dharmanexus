import { useIncludeMatchesParam } from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { CollapsibleSection } from "@features/SidebarSuite/common/CollapsibleSection";
import { DrawerHeader } from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import { CompactHighlightSwitch } from "@features/SidebarSuite/uiSettings/CompactHighlightSwitch";
import DbSourceFilter from "@features/SidebarSuite/uiSettings/DbSourceFilter";
import { DbViewSelector } from "@features/SidebarSuite/uiSettings/DbViewSelector";
import FolioOption from "@features/SidebarSuite/uiSettings/FolioOption";
import { FontSizeSlider } from "@features/SidebarSuite/uiSettings/FontSizeSlider";
import { MonochromaticHighlightSwitch } from "@features/SidebarSuite/uiSettings/MonochromaticHighlightSwitch";
import MultiLingualSelector from "@features/SidebarSuite/uiSettings/MultiLingualSelector";
import ParLengthFilter from "@features/SidebarSuite/uiSettings/ParLengthFilter";
import { ResetFiltersButton } from "@features/SidebarSuite/uiSettings/ResetFiltersButton";
import ScoreFilter from "@features/SidebarSuite/uiSettings/ScoreFilter";
import { ShowSegmentNumbersSwitch } from "@features/SidebarSuite/uiSettings/ShowSegmentNumbersSwitch";
import TextScriptOption from "@features/SidebarSuite/uiSettings/TextScriptOption";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, Typography } from "@mui/material";

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
  return (
    <IconButton
      aria-label="close settings"
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
  const { dbLanguage } = useDbPageRouterParams();

  return (
    <>
      <DrawerHeader>
        <Box sx={HeaderBoxSyles}>
          <Typography variant="h6">Settings</Typography>
          <CloseButton setIsSettingsOpen={setIsSettingsOpen} />
        </Box>
      </DrawerHeader>

      <Box sx={{ p: 2 }}>
        <DbViewSelector />
        <CollapsibleSection title="General Display Settings" defaultExpanded>
          <ShowSegmentNumbersSwitch />
          {dbLanguage === "bo" && <TextScriptOption />}
          <FontSizeSlider />
          <UtilityOptionsSection />
        </CollapsibleSection>

        <CollapsibleSection title="Intertextual Matching">
          <Box
            sx={{
              pointerEvents: includeMatches ? "auto" : "none",
              opacity: includeMatches ? 1 : 0.5,
            }}
          >
            <MultiLingualSelector />
            <ScoreFilter />
            <ParLengthFilter />
            <DbSourceFilter filterName="exclude_sources" />
            <DbSourceFilter filterName="include_sources" />
            <FolioOption />
            <ResetFiltersButton />
          </Box>
        </CollapsibleSection>

        <CollapsibleSection title="Match Highlighting & Display Style">
          <Box
            sx={{
              pointerEvents: includeMatches ? "auto" : "none",
              opacity: includeMatches ? 1 : 0.5,
            }}
          >
            <MonochromaticHighlightSwitch />
            <CompactHighlightSwitch />
          </Box>
        </CollapsibleSection>
      </Box>
    </>
  );
}
