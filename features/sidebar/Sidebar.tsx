import { useTranslation } from "react-i18next";
import { useCoercedQueryValues } from "@components/hooks/useCoercedQueryValues";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TabContext, TabList, TabPanel } from "@mui/lab/";
import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Tab,
  Toolbar,
} from "@mui/material";
import { atom, useAtom, useAtomValue } from "jotai";
import { parLengthFilterValueAtom } from "utils/dbUISettings";

import { DisplayOptionsSection } from "./DisplayOptionsSection";
import { ExternalLinksSection } from "./ExternalLinksSection";
import { FilterSettings } from "./FilterSettings";
import { Info } from "./Info";
import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./MuiStyledSidebarComponents";
import { UtilityOptionsSection } from "./UtilityOptionsSection";

export const sidebarIsOpenAtom = atom(true);
const activeTabAtom = atom("1");

// TODO: remove once full settings suit is complete
export const StandinSetting = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function Sidebar() {
  useCoercedQueryValues();
  const [sidebarIsOpen, setSidebarIsOpen] = useAtom(sidebarIsOpenAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  const initiatedValues = useAtomValue(parLengthFilterValueAtom);

  const { t } = useTranslation("settings");

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
      <Toolbar />
      <aside>
        <Box sx={{ width: 1, typography: "body1" }}>
          <TabContext value={activeTab}>
            <DrawerHeader>
              <Box sx={{ width: 1, borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  aria-label="Filters, desplay options and other settings"
                  onChange={handleTabChange}
                >
                  <Tab label={t("tabs.options")} value="1" />
                  <Tab label={t("tabs.filters")} value="2" />
                  <Tab label={t("tabs.info")} value="3" />
                </TabList>
              </Box>

              <IconButton onClick={handleDrawerClose}>
                <CloseRoundedIcon />
              </IconButton>
            </DrawerHeader>

            {initiatedValues ? (
              <>
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
              </>
            ) : (
              <CircularProgress color="inherit" sx={{ m: 2, flex: 1 }} />
            )}
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
