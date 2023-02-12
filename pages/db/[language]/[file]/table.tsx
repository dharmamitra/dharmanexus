import type { GetStaticPaths } from "next";
import { DbViewSelector } from "@components/db/DbViewSelector";
import { useDbQueryParams } from "@components/hooks/useDbQueryParams";
import { useSourceFile } from "@components/hooks/useSourceFile";
import { PageContainer } from "@components/layout/PageContainer";
import { CircularProgress } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import TableView from "features/tableView/TableView";
import type { PagedResponse } from "types/api/common";
import type { TablePageData } from "types/api/table";
import { DbApi, getLanguageMenuData } from "utils/api/db";
import { ALL_LOCALES, SourceLanguage } from "utils/constants";

export { getI18NextStaticProps as getStaticProps } from "utils/nextJsHelpers";

export default function TablePage() {
  const { sourceLanguage, fileName } = useDbQueryParams();
  const { isFallback } = useSourceFile();

  // TODO: add error handling
  const { data, fetchNextPage, fetchPreviousPage, isInitialLoading } =
    useInfiniteQuery<PagedResponse<TablePageData>>({
      queryKey: DbApi.TableView.makeQueryKey(fileName),
      queryFn: ({ pageParam = 0 }) => DbApi.TableView.call(fileName, pageParam),
      getNextPageParam: (lastPage) => lastPage.pageNumber + 1,
      getPreviousPageParam: (lastPage) =>
        lastPage.pageNumber === 0
          ? lastPage.pageNumber
          : lastPage.pageNumber - 1,
    });

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" backgroundName={sourceLanguage}>
      <DbViewSelector currentView="table" />

      {isInitialLoading || !data ? (
        <CircularProgress color="inherit" sx={{ flex: 1 }} />
      ) : (
        <TableView
          data={data.pages.flatMap((page) => page.data)}
          onEndReached={fetchNextPage}
          onStartReached={fetchPreviousPage}
        />
      )}
    </PageContainer>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const languageMenuData = await getLanguageMenuData(SourceLanguage.PALI);
  const pliFilenames = languageMenuData.map((menuData) => menuData.fileName);
  // todo: also do this for other languages

  /**
   * Returns object like:
   * [
   *   { params: { language: 'pli', file: 'dn1' }, locale: 'en' },
   *   { params: { language: 'pli', file: 'dn1' }, locale: 'de' },
   *   { params: { language: 'pli', file: 'dn2' }, locale: 'en' },
   *   ...
   * ]
   */
  return {
    paths: pliFilenames.flatMap((file) =>
      ALL_LOCALES.map((locale) => ({
        params: { language: SourceLanguage.PALI, file },
        locale,
      }))
    ),
    fallback: true,
  };
};
