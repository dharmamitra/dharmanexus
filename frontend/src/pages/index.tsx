import React from "react";
import type { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { logoDimensions, logoSpacing } from "@components/common/FullLogo";
import { DbLanguageLinkBox } from "@components/layout/DbLanguageLinkBox";
import { PageContainer } from "@components/layout/PageContainer";
import { sourceSerif } from "@components/theme";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { DbLanguage } from "@utils/api/types";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import merge from "lodash/merge";

const dbLanguagePaths: Record<DbLanguage, { href: string }> = {
  bo: { href: "/db/bo" },
  pa: { href: "/db/pa" },
  sa: { href: "/db/sa" },
  zh: { href: "/db/zh" },
};

const LogoHeader = dynamic(
  () =>
    import("../components/common/FullLogo").then((module) => module.FullLogo),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          ...logoSpacing,
          border: "solid 1px",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: `${logoDimensions.dharmamitra.width}px`,
            aspectRatio: `${logoDimensions.dharmamitra.width} / ${logoDimensions.dharmamitra.height}`,
          }}
        />
      </Box>
    ),
  },
);

export default function Home() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <LogoHeader />

      <Paper
        elevation={1}
        sx={{
          py: { xs: 4, sm: 8 },
          px: { xs: 1, sm: 4 },
          mt: 0,
          mx: logoSpacing.mx,
          mb: { xs: 2, sm: 4 },
        }}
      >
        <Typography component="h1" sx={visuallyHidden}>
          {t("global.siteTitle")}
        </Typography>
        <Typography
          align="center"
          variant="body1"
          sx={{
            fontFamily: sourceSerif.style.fontFamily,
            maxWidth: "520px",
            mx: "auto",
          }}
        >
          {t("home:intro")}
        </Typography>

        <Box
          component="ul"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            mt: 3,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {Object.entries(dbLanguagePaths).map(([key, value]) => (
            <DbLanguageLinkBox
              key={key}
              title={t(`language.${key}`)}
              href={value.href}
            />
          ))}
        </Box>
      </Paper>
    </PageContainer>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18nProps = await getI18NextStaticProps(
    {
      locale,
    },
    ["home"],
  );

  const queryClient = new QueryClient();

  return merge(
    { props: { dehydratedState: dehydrate(queryClient) } },
    i18nProps,
  );
};
