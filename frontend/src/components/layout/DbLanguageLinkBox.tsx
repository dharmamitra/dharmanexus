import type { FC } from "react";
import React from "react";
import { Link } from "@components/common/Link";
import { Typography } from "@mui/material";

interface Props {
  title: string;
  href: string;
}

export const DbLanguageLinkBox: FC<Props> = ({ title, href }) => {
  return (
    <Link
      href={href}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "inherit",
        textDecoration: "none",
        border: `1px solid`,
        borderColor: "divider",
        borderRadius: 0.5,
        px: 2,
        py: 1.5,
        m: 1,
        minWidth: 140,
        transition: "background-color 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "action.hover",
          textDecoration: "none",
        },
      }}
      data-testid="db-language-tile"
    >
      <Typography
        component="li"
        variant="h6"
        sx={{
          fontWeight: 500,
          mb: 0,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
    </Link>
  );
};
