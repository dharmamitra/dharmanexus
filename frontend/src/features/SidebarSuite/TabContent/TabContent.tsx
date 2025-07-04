import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton } from "@mui/material";
import { DrawerHeader } from "src/features/SidebarSuite/common/MuiStyledSidebarComponents";

import {
  DbFilePageSidebarTabPanels,
  SidebarTabListDbPage,
} from "./tabPanelGroups";

export const HeaderBoxSyles = {
  width: 1,
  borderBottom: 1,
  borderColor: "divider",
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

export function TabContent({
  handleTabChange,
  setIsSettingsOpen,
}: {
  handleTabChange: (event: React.SyntheticEvent, newValue: string) => void;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <DrawerHeader>
        <Box sx={HeaderBoxSyles}>
          <SidebarTabListDbPage onTabChange={handleTabChange} />
        </Box>

        <CloseButton setIsSettingsOpen={setIsSettingsOpen} />
      </DrawerHeader>

      <DbFilePageSidebarTabPanels />
    </>
  );
}
