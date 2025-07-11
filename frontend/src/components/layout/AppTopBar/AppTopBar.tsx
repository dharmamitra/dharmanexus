import React, { memo } from "react";
import dynamic from "next/dynamic";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar as MuiAppBar, Box, Toolbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

import { Desktop as NavMenuDesktop } from "./NavMenu";
import { UtilityButtonsLoading } from "./UtilityButtons";

// Aviods server/client mismatch hydration issues for server side rendered components.
const UtilityButtons = dynamic(
  () => import("./UtilityButtons").then((module) => module.UtilityButtons),
  {
    ssr: false,
    loading: UtilityButtonsLoading,
  },
);

const LogoBlock = dynamic(
  () => import("./LogoBlock").then((module) => module.LogoBlock),
  {
    ssr: false,
    loading: () => <div />,
  },
);

const NavMenu = dynamic(
  () => import("./NavMenu").then((module) => module.NavMenu),
  {
    ssr: false,
    loading: () => (
      <>
        <IconButton
          size="large"
          aria-label="navigation menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          sx={{ display: { md: "none" } }}
          disabled
        >
          <MenuIcon />
        </IconButton>

        <NavMenuDesktop />
      </>
    ),
  },
);

export const AppTopBar = memo(function AppTopBar() {
  const { mode, setMode } = useColorScheme();

  return (
    <Box bgcolor="background.paper">
      <MuiAppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          zIndex: "1201",
          borderBottom: `1px solid`,
          borderBottomColor: "divider",
        }}
        data-testid="app-bar"
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "background.paper",
          }}
        >
          <LogoBlock mode={mode} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavMenu />
            <UtilityButtons mode={mode} setMode={setMode} />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
});
