import React, { useState } from "react";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import { Box, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { SidebarBody } from "./SidebarBody";

export function SidebarSuite() {
  const { isSettingsOpen, setIsSettingsOpen, drawerWidth } =
    useSettingsDrawer();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          border: "none",
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      variant={isMd ? "persistent" : "temporary"}
      anchor="right"
      open={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
    >
      {/* Offsets app bar */}
      <Toolbar />
      <aside
        id="db-results-settings-sidebar"
        aria-label="settings and info tabs"
        style={{ borderLeft: "solid 1px var(--mui-palette-divider)" }}
      >
        <Box sx={{ width: 1 }}>
          <SidebarBody setIsSettingsOpen={setIsSettingsOpen} />
        </Box>
      </aside>
    </Drawer>
  );
}
