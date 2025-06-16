import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Link } from "@components/common/Link";
import LocaleSelector from "@components/layout/LocaleSelector";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import { getDeployment } from "@mitra/utils";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Box, Button, IconButton, Toolbar, useTheme, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useColorScheme } from "@mui/material/styles";

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

export const MitraAppTopBar = memo(function MitraAppTopBar() {
  const materialTheme = useTheme();

  const { mode, setMode } = useColorScheme();

  const { t } = useTranslation();

  const [isMounted, setIsMounted] = useState(false);

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
          borderBottom: `1px solid ${materialTheme.palette.divider}`,
        }}
        data-testid="app-bar"
      >
        <Toolbar>
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
              href="https://dharmamitra.org"
              underline="none"
              noWrap
            >
              <Box
                component="img"
                src={logoWideSrc}
                sx={{
                  height: 48,
                  width: "auto",
                  [materialTheme.breakpoints.down("sm")]: {
                    height: 36,
                  },
                }}
                alt="logo"
              />
            </Link>
          </Box>

          <Link
            href="/"
            sx={{
              textDecoration: "none",
              "&:hover": {
                opacity: 0.9
              },
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#11305d",
                [materialTheme.breakpoints.down("sm")]: {
                  fontSize: "1rem",
                },
              }}
            >
              DharmaNexus
            </Typography>
          </Link>

          <Box
            component="nav"
            sx={{
              display: "flex",
              gap: 0.75,
            }}
          >
            <DatabaseMenu />

            <Button variant="text" color="inherit" href={SEARCH_URL}>
              {t("search.search")}
            </Button>

            <AppBarLink title={t("header.guide")} href="/guide" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <IconButton
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
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
});
