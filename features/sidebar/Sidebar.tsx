import { useTranslation } from "react-i18next";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import { Box, Drawer, IconButton, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { atom, useAtom } from "jotai";

import { DisplayOptionsSection } from "./DisplayOptionsSection";
import { ExternalLinksSection } from "./ExternalLinksSection";
import { FilterSettings } from "./FilterSettings";
import { Info } from "./Info";
import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./MuiStyledSidebarComponents";
import { UtilityOptionsSection } from "./UtilityOptionsSection";

// https://buddhanexus.kc-tbts.uni-hamburg.de/api/menus/sidebar/pli

export const sidebarIsOpenAtom = atom(true);
const activeTabAtom = atom("1");

export const StandinFilter = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function Sidebar() {
  const theme = useTheme();
  const { t } = useTranslation("settings");

  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);

  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  const handleDrawerClose = () => {
    setSidebarIsOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Drawer
      sx={{
        width: SETTINGS_DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SETTINGS_DRAWER_WIDTH,
        },
      }}
      variant="persistent"
      anchor="right"
      open={sidebarIsOpen}
    >
      <aside>
        <DrawerHeader
          sx={{
            bgcolor: "background.header",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>

            <IconButton href="/guide" target="_blank" rel="noopener noreferrer">
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                aria-label="Filters, desplay options and other settings"
                onChange={handleTabChange}
              >
                <Tab label={t("tabs.options")} value="1" />
                <Tab label={t("tabs.filters")} value="2" />
                <Tab label={t("tabs.info")} value="3" />
              </TabList>
            </Box>

            <TabPanel value="1" sx={{ px: 0 }}>
              <DisplayOptionsSection />

              <UtilityOptionsSection />

              <ExternalLinksSection />
            </TabPanel>

            <TabPanel value="2" sx={{ px: 0 }}>
              <FilterSettings />
            </TabPanel>

            <TabPanel value="3">
              <Info />
            </TabPanel>
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
