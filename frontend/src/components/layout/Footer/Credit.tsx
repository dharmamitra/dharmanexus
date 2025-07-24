import { Trans } from "next-i18next";
import { Box, Link, Typography } from "@mui/material";

export default function Credit() {
  return (
    <Box
      sx={{
        maxWidth: "564px",
      }}
    >
      <Typography variant="body2" textAlign="center">
        <Trans i18nKey="footer.credit">
          <Link
            href="https://dharmamitra.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DharmaMitra
          </Link>
          {" in collaboration with the "}
          <Link
            href="https://tsadra.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tsadra Foundation
          </Link>
        </Trans>
      </Typography>
    </Box>
  );
}
