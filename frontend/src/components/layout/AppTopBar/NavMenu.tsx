import React from "react";
import { useTranslation } from "next-i18next";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Link, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { DOCS_URL, SEARCH_URL } from "@utils/constants";

import { DbLanguageMenu } from "./DbLanguageMenu";

export const Desktop = () => {
  const { t } = useTranslation();

  return (
    <Box component="nav" sx={{ display: { xs: "none", md: "flex" } }}>
      <DbLanguageMenu type="database" />
      <Button
        color="inherit"
        href={SEARCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<ArrowOutwardIcon />}
      >
        {t("header.search")}
      </Button>
      <Button
        color="inherit"
        href={DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<ArrowOutwardIcon />}
      >
        {t("header.docs")}
      </Button>
    </Box>
  );
};

export const NavMenu = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isMdUp) {
    return <Desktop />;
  }

  return (
    <Box component="nav">
      <IconButton
        size="large"
        aria-label="navigation menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        keepMounted
        onClose={handleMenuClose}
      >
        <MenuItem>
          <DbLanguageMenu type="database" isMobile />
        </MenuItem>
        <MenuItem>
          <Link
            href={SEARCH_URL}
            color="inherit"
            variant="button"
            underline="none"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 1 }}
          >
            {t("header.search")}
          </Link>
          <ArrowOutwardIcon color="action" />
        </MenuItem>
        <MenuItem>
          <Link
            href={DOCS_URL}
            color="inherit"
            variant="button"
            underline="none"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 1 }}
          >
            {t("header.docs")}
          </Link>
          <ArrowOutwardIcon color="action" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
