import React from "react";
import {
  nullToUndefined,
  useExcludeCategoriesParam,
  useExcludeCollectionsParam,
  useExcludeFilesParam,
  useFolioParam,
  useIncludeCategoriesParam,
  useIncludeCollectionsParam,
  useIncludeFilesParam,
  useLanguagesParam,
  useParLengthParam,
  useScoreParam,
} from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { AllAPIRequestProps } from "@utils/api/types";

export const useDbQueryFilters = () => {
  const [score] = useScoreParam();
  const [par_length] = useParLengthParam();
  const [exclude_collections] = useExcludeCollectionsParam();
  const [exclude_categories] = useExcludeCategoriesParam();
  const [exclude_files] = useExcludeFilesParam();
  const [include_collections] = useIncludeCollectionsParam();
  const [include_categories] = useIncludeCategoriesParam();
  const [include_files] = useIncludeFilesParam();
  const [languages] = useLanguagesParam();

  const filters: AllAPIRequestProps["filters"] = {
    score,
    par_length,
    exclude_collections: nullToUndefined(exclude_collections),
    exclude_categories: nullToUndefined(exclude_categories),
    exclude_files: nullToUndefined(exclude_files),
    include_collections: nullToUndefined(include_collections),
    include_categories: nullToUndefined(include_categories),
    include_files: nullToUndefined(include_files),
    languages: nullToUndefined(languages),
  };

  return filters;
};

export const useStandardViewBaseQueryParams = () => {
  /** For Text Table, and Numbers view queries.
   * text: + active_segment
   * table & numbers: + sort_method
   */

  const { fileName: filename } = useDbPageRouterParams();
  const [folio] = useFolioParam();

  return {
    filename,
    folio: nullToUndefined(folio) ?? "",
    filters: useDbQueryFilters(),
  };
};

export const useClearDbSourceFilterQueryParams = () => {
  const [, setExcludeCollections] = useExcludeCollectionsParam();
  const [, setExcludeCategories] = useExcludeCategoriesParam();
  const [, setExcludeFiles] = useExcludeFilesParam();
  const [, setIncludeCollections] = useIncludeCollectionsParam();
  const [, setIncludeCategories] = useIncludeCategoriesParam();
  const [, setIncludeFiles] = useIncludeFilesParam();

  const handleClearDbSourceFilterParams = React.useCallback(async () => {
    await Promise.all([
      setExcludeCollections(null),
      setExcludeCategories(null),
      setExcludeFiles(null),
      setIncludeCollections(null),
      setIncludeCategories(null),
      setIncludeFiles(null),
    ]);
  }, [
    setExcludeCollections,
    setExcludeCategories,
    setExcludeFiles,
    setIncludeCollections,
    setIncludeCategories,
    setIncludeFiles,
  ]);

  return handleClearDbSourceFilterParams;
};
