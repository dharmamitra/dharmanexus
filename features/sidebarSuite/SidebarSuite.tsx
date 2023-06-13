import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TabContext } from "@mui/lab/";
import { Box, Drawer, IconButton, Toolbar } from "@mui/material";
import { atom, useAtom } from "jotai";
import { StringParam, useQueryParam } from "use-query-params";

import {
  DrawerHeader,
  SETTINGS_DRAWER_WIDTH,
} from "./common/MuiStyledSidebarComponents";
import {
  DbFilePageSidebarTabPanels,
  SearchPageSidebarTabPanels,
  SidebarTabList,
} from "./SidebarTabs";

export const isSidebarOpenAtom = atom(true);
const activeSettingsTabAtom = atom("0");

// TODO: remove once full settings suit is complete
export const StandinSetting = (setting: string) => (
  <div>
    <small>{setting} setting coming to a sidebar near your soon!</small>
  </div>
);

export function SidebarSuite() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const [activeTab, setActiveTab] = useAtom(activeSettingsTabAtom);

  const { route } = useRouter();
  const isSearchRoute = route.startsWith("/search");
  const isTableRoute = route.startsWith("/table");

  const { settingsList } = useDbQueryParams();

  const [, setSortMethod] = useQueryParam(
    settingsList.queryParams.sortMethod,
    StringParam
  );

  useEffect(() => {
    if (!isTableRoute) {
      setSortMethod(undefined);
    }

    setActiveTab("0");
  }, []);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue);
    },
    [setActiveTab]
  );

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
      open={isSidebarOpen}
    >
      <Toolbar />
      <aside>
        <Box sx={{ width: 1 }}>
          <TabContext value={activeTab}>
            <DrawerHeader>
              <Box sx={{ width: 1, borderBottom: 1, borderColor: "divider" }}>
                <SidebarTabList
                  isSearchRoute={isSearchRoute}
                  onTabChange={handleTabChange}
                />
              </Box>

              <IconButton onClick={() => setIsSidebarOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </DrawerHeader>

            {isSearchRoute ? (
              <SearchPageSidebarTabPanels />
            ) : (
              <DbFilePageSidebarTabPanels />
            )}
          </TabContext>
        </Box>
      </aside>
    </Drawer>
  );
}
