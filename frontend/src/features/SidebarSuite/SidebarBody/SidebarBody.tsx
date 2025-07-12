import { useIncludeMatchesParam } from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, Typography } from "@mui/material";
import { CollapsibleSection } from "src/features/SidebarSuite/common/CollapsibleSection";
import { DrawerHeader } from "src/features/SidebarSuite/common/MuiStyledSidebarComponents";
import DbSourceFilter from "src/features/SidebarSuite/uiSettings/DbSourceFilter";
import FolioOption from "src/features/SidebarSuite/uiSettings/FolioOption";
import { MonochromaticHighlightSwitch } from "src/features/SidebarSuite/uiSettings/MonochromaticHighlightSwitch";
import MultiLingualSelector from "src/features/SidebarSuite/uiSettings/MultiLingualSelector";
import ParLengthFilter from "src/features/SidebarSuite/uiSettings/ParLengthFilter";
import ScoreFilter from "src/features/SidebarSuite/uiSettings/ScoreFilter";
import { ShowSegmentNumbersSwitch } from "src/features/SidebarSuite/uiSettings/ShowSegmentNumbersSwitch";
import TextScriptOption from "src/features/SidebarSuite/uiSettings/TextScriptOption";
import { UtilityOptionsSection } from "../SidebarBody/UtilityOptionsSection/UtilityOptionsSection";
import { FontSizeSlider } from "src/features/SidebarSuite/uiSettings/FontSizeSlider";
import { CompactHighlightSwitch } from "src/features/SidebarSuite/uiSettings/CompactHighlightSwitch";
import { ShowSourceTooltipsSwitch } from "src/features/SidebarSuite/uiSettings/ShowSourceTooltipsSwitch";
import { DbViewSelector } from "src/features/SidebarSuite/uiSettings/DbViewSelector";
import { ResetFiltersButton } from "src/features/SidebarSuite/uiSettings/ResetFiltersButton";

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
            <ShowSourceTooltipsSwitch />
          </Box>
        </CollapsibleSection>
      </Box>
    </>
  );
}
