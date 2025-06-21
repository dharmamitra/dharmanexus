import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { currentDbViewAtom } from "@atoms";
import { getAvailableDBViews } from "@components/hooks/useDbView";
import { Button, Menu, MenuItem } from "@mui/material";
import { dbLanguages } from "@utils/api/constants";
import { DEFAULT_DB_VIEW } from "@utils/constants";
import { getValidDbLanguage } from "@utils/validators";
import { useAtom } from "jotai";

export const DatabaseMenu = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentView, setCurrentView] = useAtom(currentDbViewAtom);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = React.useCallback(
    async (language: string) => {
      const availableViews = getAvailableDBViews(getValidDbLanguage(language));
      if (!availableViews.includes(currentView)) {
        setCurrentView(DEFAULT_DB_VIEW);
      }
      await router.push(`/db/${language}`);
      handleClose();
    },
    [router, currentView, setCurrentView],
  );

  return (
    <>
      <Button
        variant="text"
        color="inherit"
        aria-controls="database-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {t("header.database")}
      </Button>
      <Menu
        id="database-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted
        onClose={handleClose}
      >
        {dbLanguages.map((language) => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
          >
            {t(`language.${language}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
