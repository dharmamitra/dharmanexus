import React, { memo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import { AppBar as MuiAppBar, Box, Button, Toolbar } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

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

// TODO: multi deployment config if needed
const SEARCH_URL = `${process.env.NEXT_PUBLIC_MITRA_SEARCH_URL}`;

interface AppBarLinkProps {
  title: string;
  href: string;
}

const AppBarLink = ({ title, href }: AppBarLinkProps) => (
  <Button variant="text" color="inherit">
    <Link variant="button" color="text.primary" href={href} underline="none">
      {title}
    </Link>
  </Button>
);

export const AppTopBar = memo(function AppTopBar() {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation();

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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <LogoBlock mode={mode} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="nav"
              sx={{
                display: "flex",
                gap: 0.75,
              }}
            >
              <DatabaseMenu />

              <Button variant="text" color="inherit" href={SEARCH_URL}>
                {t("header.search")}
              </Button>

              <AppBarLink title={t("header.about")} href="/about" />
            </Box>

            <UtilityButtons mode={mode} setMode={setMode} />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
});
