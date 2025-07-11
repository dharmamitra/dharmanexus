import * as React from "react";
import { useTranslation } from "next-i18next";
import { isDbSourceBrowserDrawerOpenAtom } from "@atoms";
import {
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
  useLanguagesParam,
  useParLengthParam,
  useScoreParam,
} from "@components/hooks/params";
import { useIsRenderedInReaderMode } from "@components/hooks/useIsRenderedInReaderMode";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import RotateLeftOutlinedIcon from "@mui/icons-material/RotateLeftOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import { Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSetAtom } from "jotai";

export const DbFileButtons = () => {
  const { t } = useTranslation("settings");

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const setIsSourceTreeOpen = useSetAtom(isDbSourceBrowserDrawerOpenAtom);
  const { setIsSettingsOpen } = useSettingsDrawer();
  const isRenderedInReaderMode = useIsRenderedInReaderMode();

  const [, setScoreParam] = useScoreParam();
  const [, setParLengthParam] = useParLengthParam();
  const [, setExcludeCollectionsParam] = useExcludeCollectionsParam();
  const [, setExcludeCategoriesParam] = useExcludeCategoriesParam();
  const [, setExcludeFilesParam] = useExcludeFilesParam();
  const [, setIncludeCollectionsParam] = useIncludeCollectionsParam();
  const [, setIncludeCategoriesParam] = useIncludeCategoriesParam();
  const [, setIncludeFilesParam] = useIncludeFilesParam();
  const [, setLanguagesParam] = useLanguagesParam();

  const handleReset = React.useCallback(async () => {
    await Promise.all([
      setScoreParam(null),
      setParLengthParam(null),
      setExcludeCollectionsParam(null),
      setExcludeCategoriesParam(null),
      setExcludeFilesParam(null),
      setIncludeCollectionsParam(null),
      setIncludeCategoriesParam(null),
      setIncludeFilesParam(null),
      setLanguagesParam(null),
    ]);
  }, [
    setScoreParam,
    setParLengthParam,
    setExcludeCollectionsParam,
    setExcludeCategoriesParam,
    setExcludeFilesParam,
    setIncludeCollectionsParam,
    setIncludeCategoriesParam,
    setIncludeFilesParam,
    setLanguagesParam,
  ]);

  return (
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

      {isRenderedInReaderMode ? (
        <Button
          variant="outlined"
          data-testid="db-results-clear-settings-button"
          aria-label={t(`resultsHead.resetTip`)}
          title={t(`resultsHead.resetTip`)}
          sx={{
            lineHeight: 1.2,
          }}
          startIcon={isMd && <RotateLeftOutlinedIcon />}
          onClick={handleReset}
        >
          {t(`resultsHead.reset`)}
        </Button>
      ) : null}

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
  );
};
