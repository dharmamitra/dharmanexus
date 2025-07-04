import React from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { DbLanguageLinkBox } from "@components/layout/DbLanguageLinkBox";
import { PageContainer } from "@components/layout/PageContainer";
import { sourceSerif } from "@components/theme";
import { getBasePath, getDeployment } from "@mitra/utils";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { DbLanguage } from "@utils/api/types";
import { getI18NextStaticProps } from "@utils/nextJsHelpers";
import merge from "lodash/merge";

const logoPaths: Record<Deployment, string> = {
  dharmamitra: `${getBasePath()}/assets/logos/dn-logo-full.png`,
  kumarajiva: `${getBasePath()}/assets/logos/kp-logo-full.png`,
};

const logoDimensions: Record<Deployment, { width: number; height: number }> = {
  dharmamitra: { width: 397, height: 334 },
  kumarajiva: { width: 392, height: 216 },
};

const deployment = getDeployment();
const logoSrc = logoPaths[deployment];
const logoSize = logoDimensions[deployment];

const dbLanguagePaths: Record<DbLanguage, string> = {
  bo: "/db/bo",
  pa: "/db/pa",
  sa: "/db/sa",
  zh: "/db/zh",
};

export default function Home() {
  const { t } = useTranslation();

  const materialTheme = useTheme();

  return (
    <PageContainer>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          p: 4,
          mt: 8,
          [materialTheme.breakpoints.down("sm")]: {
            p: 3,
            m: 2,
          },
          backgroundColor: materialTheme.palette.background.accent,
          borderBottom: `1px solid ${materialTheme.palette.background.grey}`,
          borderRadiusTopLeft: 1,
          borderRadiusTopRights: 1,
        }}
      >
        <Image src={logoSrc} alt="logo" {...logoSize} />
      </Box>
      <Paper
        elevation={1}
        sx={{
          py: { xs: 4, md: 8 },
          px: 4,
          mt: 0,
          mb: 4,
          [materialTheme.breakpoints.down("sm")]: {
            p: 3,
            mx: 2,
            mb: 2,
          },
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
          <DbLanguageLinkBox
            title="Pāli"
            href={dbLanguagePaths.pa}
            color={materialTheme.palette.common.pali}
          />
          <DbLanguageLinkBox
            title="Sanskrit"
            href={dbLanguagePaths.sa}
            color={materialTheme.palette.common.sanskrit}
          />
          <DbLanguageLinkBox
            title="Tibetan"
            href={dbLanguagePaths.bo}
            color={materialTheme.palette.common.tibetan}
          />
          <DbLanguageLinkBox
            title="Chinese"
            href={dbLanguagePaths.zh}
            color={materialTheme.palette.common.chinese}
          />
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
