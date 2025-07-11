import { useTranslation } from "next-i18next";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

const LoadingText = () => {
  const { t } = useTranslation("common");

  return (
    <Typography
      variant="h6"
      component="p"
      sx={{
        opacity: 0,
        animation: "fadeInOut 3s ease-in-out infinite",
        "@keyframes fadeInOut": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.7,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      {t("prompts.loading")}
    </Typography>
  );
};

const LoadingCard = () => {
  const { t } = useTranslation("common");

  return (
    <Box
      sx={{
        py: 1,
      }}
    >
      <Card sx={{ flex: 1, wordBreak: "break-all" }} elevation={1}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.header",
            flexDirection: { xs: "column", sm: "row" },
            minHeight: "72px",
          }}
        >
          <Box sx={{ alignItems: "center", display: "flex", flexWrap: "wrap" }}>
            <Typography variant="h6">{t("prompts.loading")}</Typography>
          </Box>
        </CardContent>

        <Divider />

        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export { LoadingCard, LoadingText };

export default LoadingText;
