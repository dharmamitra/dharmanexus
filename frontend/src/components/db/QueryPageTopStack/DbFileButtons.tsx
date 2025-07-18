import * as React from "react";
import { useTranslation } from "next-i18next";
import { isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSetAtom } from "jotai";

export const DbFileButtons = () => {
  const { t } = useTranslation("settings");

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const setIsSourceTreeOpen = useSetAtom(isDbSourceBrowserDrawerOpenAtom);
  const { setIsSettingsOpen } = useSettingsDrawer();

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <ButtonGroup
        variant="outlined"
        orientation={isSm ? "horizontal" : "vertical"}
      >
        <Button
          variant="outlined"
          data-testid="db-results-text-select-modal-button"
          aria-label={t(`resultsHead.textSelectTip`)}
          title={t(`resultsHead.textSelectTip`)}
          sx={{
            lineHeight: 1.2,
          }}
          startIcon={isMd && <GradingOutlinedIcon />}
          onClick={() => setIsSourceTreeOpen(true)}
        >
          {t(`resultsHead.textSelect`)}
        </Button>

        <Button
          variant="outlined"
          data-testid="db-results-settings-button"
          aria-label={t(`resultsHead.settingsTip`)}
          title={t(`resultsHead.settingsTip`)}
          sx={{
            lineHeight: 1.2,
          }}
          startIcon={isMd && <TuneIcon />}
          onClick={() => setIsSettingsOpen((prev) => !prev)}
        >
          {t(`resultsHead.settings`)}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
