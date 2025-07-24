import * as React from "react";
import { useTranslation } from "next-i18next";
import { isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Button, ButtonGroup } from "@mui/material";
import { useSetAtom } from "jotai";

export const DbFileButtons = ({
  isSmallScreen,
}: {
  isSmallScreen: boolean;
}) => {
  const { t } = useTranslation("settings");

  const setIsSourceTreeOpen = useSetAtom(isDbSourceBrowserDrawerOpenAtom);
  const { setIsSettingsOpen } = useSettingsDrawer();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "flex-end",
        alignItems: "center",
        minWidth: "220px",
        pb: 1,
      }}
    >
      <ButtonGroup variant="outlined" orientation="horizontal">
        <Button
          variant="outlined"
          data-testid="db-results-text-select-modal-button"
          aria-label={t(`resultsHead.textSelectTip`)}
          title={t(`resultsHead.textSelectTip`)}
          sx={{
            lineHeight: 1.2,
          }}
          startIcon={isSmallScreen ? null : <GradingOutlinedIcon />}
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
          startIcon={isSmallScreen ? null : <TuneIcon />}
          onClick={() => setIsSettingsOpen((prev) => !prev)}
        >
          {t(`resultsHead.settings`)}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
