import React, { memo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import { LogoLink } from "./LogoLink";
import { NavMenu } from "./NavMenu";
import { UtilityButtonsLoading } from "./UtilityButtons";

// Aviods i18n content server/client mismatch hydration issue.
const UtilityButtons = dynamic(
  () => import("./UtilityButtons").then((module) => module.UtilityButtons),
  {
    ssr: false,
    loading: UtilityButtonsLoading,
  },
);

export const AppTopBar = memo(function AppTopBar() {
  const materialTheme = useTheme();
  const { route } = useRouter();
  const isHomeRoute = route === "/";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: materialTheme.zIndex.drawer + 1,
        borderBottom: `1px solid ${materialTheme.palette.background.grey}`,
      }}
      data-testid="app-bar"
    >
      <Toolbar sx={{ mx: 2 }} disableGutters>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            grow: 1,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <LogoLink showText={!isHomeRoute} />
        </Box>

        <NavMenu />

        <UtilityButtons />
      </Toolbar>
    </AppBar>
  );
});
