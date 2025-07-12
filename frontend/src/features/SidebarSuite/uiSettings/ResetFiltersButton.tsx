import React from "react";
import { useTranslation } from "next-i18next";
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
import { Button } from "@mui/material";

export const ResetFiltersButton = () => {
  const { t } = useTranslation("settings");

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
    <Button variant="outlined" onClick={handleReset} sx={{ mt: 2, width: "100%" }}>
      {t("resultsHead.reset")}
    </Button>
  );
}; 