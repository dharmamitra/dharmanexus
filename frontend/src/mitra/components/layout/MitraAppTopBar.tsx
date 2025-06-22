import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { Link } from "@components/common/Link";
import LocaleSelector from "@components/layout/LocaleSelector";
import { DatabaseMenu } from "@components/layout/TopBarDatabaseMenu";
import { getBasePath, getDeployment } from "@mitra/utils";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Box, Button, IconButton, Toolbar, useTheme, Link as MuiLink } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useColorScheme } from "@mui/material/styles";
import imgMitraLogo from "@public/assets/logos/dm-logo-flat.png";
import { MITRA_URL } from "@mitra/constants";

const logoWidePaths: Record<Deployment, string> = {
  dharmamitra: "/assets/logos/dn-logo-title.png",
  kumarajiva: "/assets/logos/kp-logo-full.png",
};

const deployment = getDeployment();
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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <MuiLink
              sx={{
                display: "block",
                height: "28px",
              }}
              href={MITRA_URL}
              underline="none"
            >
              <Image src={imgMitraLogo.src} alt="DharmaMitra logo" width={80} height={24} />
            </MuiLink>

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
                  display: "block",
                }}
                href="/"
                underline="none"
              >
                <Box
                  component="img"
                  src={getBasePath() + logoWideSrc}
                  sx={{
                    height: 24,
                    width: "auto",
                    [materialTheme.breakpoints.down("sm")]: {
                      height: 20,
                    },
                  }}
                  alt="logo"
                />
              </Link>
            </Box>
          </Box>

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
                {t("search.search")}
              </Button>

              <AppBarLink title={t("header.about")} href="/about" />
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
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
});
