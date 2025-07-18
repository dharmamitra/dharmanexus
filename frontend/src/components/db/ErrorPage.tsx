import { useTranslation } from "next-i18next";
import { PageContainer } from "@components/layout/PageContainer";
import { Typography } from "@mui/material";

export function ErrorPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Typography variant="h1">Error</Typography>
      <Typography variant="h3" sx={{ py: 2 }}>
        {t("prompts.genericErrorTitle")}
      </Typography>
      <Typography variant="body1">
        {t("prompts.genericErrorDescription")}
      </Typography>
    </PageContainer>
  );
}
