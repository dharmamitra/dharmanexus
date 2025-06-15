import type { FC } from "react";
import React from "react";
import { Link } from "@components/common/Link";
import CircuitIcon from "@mitra/components/svg/Circuit";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  title: string;
  href: string;
  color: string;
}

export const DbLanguageLinkBox: FC<Props> = ({ title, href, color }) => {
  const materialTheme = useTheme();

  return (
    <Link
      href={href}
      sx={{
        display: "flex",
        my: 2,
        mx: 2,
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        color: "inherit",
        [materialTheme.breakpoints.down("sm")]: {
          justifyContent: "flex-start",
          flexDirection: "row",
        },
        "&:hover": { opacity: 0.9 },
        "&:active": { opacity: 1 },
      }}
      data-testid="db-language-tile"
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          height: 120,
          width: 120,
          p: 2,
          borderRadius: 2,
          border: `${color} 3px solid`,
          "&:hover": {
            filter: "opacity(80%)",
          },
        }}
      >
        <CircuitIcon fill={color} />
      </Box>
      <Typography component="h2" variant="h6" sx={{ mx: 2, mt: 1 }}>
        {title}
      </Typography>
    </Link>
  );
};
