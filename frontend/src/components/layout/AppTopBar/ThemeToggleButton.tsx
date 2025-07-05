import React from "react";
import { useTranslation } from "react-i18next";
import Brightness1Icon from "@mui/icons-material/Brightness4";
import Brightness2Icon from "@mui/icons-material/Brightness7";
import { IconButton } from "@mui/material";

export type ThemeToggleButtonProps = {
  mode?: string;
  setMode: (mode: "light" | "dark" | null) => void;
};

export const ThemeToggleButton = ({
  mode = "light",
  setMode,
}: ThemeToggleButtonProps) => {
  const { t } = useTranslation("common");

  return (
    <IconButton
      color="inherit"
      aria-label={t("header.toggleTheme")}
      data-testid="theme-toggle"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {mode === "dark" ? (
        <Brightness1Icon fontSize="inherit" />
      ) : (
        <Brightness2Icon fontSize="inherit" />
      )}
    </IconButton>
  );
};
