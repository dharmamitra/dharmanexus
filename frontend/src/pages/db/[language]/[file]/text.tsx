import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InfiniteLoadingSpinner } from "@components/common/LoadingSpinner";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { PageContainer } from "@components/layout/PageContainer";
import { DbSourceBrowserDrawer } from "@features/sourceTextBrowserDrawer/sourceTextBrowserDrawer";
import { TextView } from "@features/textView/TextView";

export default function TextPage() {
  const { isFallback } = useDbPageRouterParams();

  if (isFallback) {
    return (
      <PageContainer maxWidth="xl" isQueryResultsPage>
        <InfiniteLoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" isQueryResultsPage>
      <TextView />
      <DbSourceBrowserDrawer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "settings"])),
  },
});
