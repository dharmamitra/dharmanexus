import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import { useResultPageType } from "@components/hooks/useResultPageType";
import LocaleSelector from "@components/layout/LocaleSelector";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import { GlobalSearch } from "@features/globalSearch";
import { getDeployment } from "@mitra/utils";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { IconButton, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

const logoSquarePaths: Record<Deployment, string> = {
  dharmamitra: "/assets/logos/dm-logo-1x1.png",
  kumarajiva: "/assets/logos/kp-logo-1x1.png",
};

const logoWidePaths: Record<Deployment, string> = {
  dharmamitra: "/assets/logos/dm-logo-flat.png",
  kumarajiva: "/assets/logos/kp-logo-full.png",
};

const deployment = getDeployment();
const logoSquareSrc = logoSquarePaths[deployment];
const logoWideSrc = logoWidePaths[deployment];

interface AppBarLinkProps {
  title: string;
  href: string;
}

const AppBarLink = ({ title, href }: AppBarLinkProps) => (
  <Link
    variant="button"
    color="primary.contrastText"
    href={href}
    underline="hover"
    sx={{ my: 1, mx: 1.5 }}
  >
    {title}
  </Link>
);

export const AppTopBar = memo(function AppTopBar() {
  const materialTheme = useTheme();

  const { mode, setMode } = useColorScheme();

  const { route } = useRouter();
  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);

  const isHomeRoute = route === "/";
  const { isSearchPage } = useResultPageType();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Box bgcolor="background.paper">
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          zIndex: materialTheme.zIndex.drawer + 1,
          borderBottom: `1px solid ${materialTheme.palette.background.accent}`,
        }}
        data-testid="app-bar"
      >
        <Toolbar sx={{ py: 2 }}>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              grow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Link
              color="inherit"
              sx={{
                display: "inline-flex",
                alignItems: "center",
              }}
              href="/"
              underline="none"
              noWrap
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  [materialTheme.breakpoints.up("sm")]: {
                    pr: 1,
                  },
                }}
              >
                {isHomeRoute ? (
                  <Box
                    component="img"
                    src={logoSquareSrc}
                    width={68}
                    sx={{
                      maxHeight: 48,
                      minWidth: 48,
                      [materialTheme.breakpoints.down("sm")]: {
                        maxHeight: 36,
                      },
                    }}
                    alt="logo"
                  />
                ) : (
                  <Box
                    component="img"
                    src={logoWideSrc}
                    // width={144}
                    sx={{
                      maxHeight: 80,
                      [materialTheme.breakpoints.down("sm")]: {
                        display: "none",
                      },
                    }}
                    alt="BuddhaNexus"
                  />
                )}
              </Box>
            </Link>

            {!isSearchPage && <GlobalSearch />}
          </Box>
          <Box
            component="nav"
            sx={{
              display: "flex",
              overflow: "auto",
            }}
          >
            <>
              <DatabaseMenu />
              <AppBarLink title={t("header.guide")} href="/guide" />
            </>
          </Box>
          <IconButton
            sx={{ mr: 1 }}
            color="inherit"
            // TODO i18n
            aria-label="Toggle theme"
            data-testid="theme-toggle"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {isMounted ? (
              mode === "dark" ? (
                <Brightness1Icon fontSize="inherit" />
              ) : (
                <Brightness2Icon fontSize="inherit" />
              )
            ) : (
              <HourglassEmptyIcon fontSize="inherit" />
            )}
          </IconButton>
          <LocaleSelector />
        </Toolbar>
      </AppBar>
    </Box>
  );
});