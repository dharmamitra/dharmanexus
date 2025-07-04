import React, { memo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Toolbar,
  useTheme,
} from "@mui/material";

import { LogoBlock } from "./LogoBlock";
import { UtilityButtonsLoading } from "./UtilityButtons";

// Aviods i18n content server/client mismatch hydration issue.
const UtilityButtons = dynamic(
  () => import("./UtilityButtons").then((module) => module.UtilityButtons),
  {
    ssr: false,
    loading: UtilityButtonsLoading,
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
  const materialTheme = useTheme();
  const { t } = useTranslation();

  return (
    <Box bgcolor="background.paper">
      <MuiAppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          zIndex: materialTheme.zIndex.drawer + 1,
          borderBottom: `1px solid ${materialTheme.palette.divider}`,
        }}
        data-testid="app-bar"
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <LogoBlock />

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

            <UtilityButtons />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
});
