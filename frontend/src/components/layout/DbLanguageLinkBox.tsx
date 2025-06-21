import type { FC } from "react";
import React from "react";
import { Link } from "@components/common/Link";
import { Typography } from "@mui/material";

interface Props {
  title: string;
  href: string;
  color: string;
}

export const DbLanguageLinkBox: FC<Props> = ({ title, href, color }) => {
  return (
    <Link
      href={href}
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "inherit",
        textDecoration: "none",
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.shape.borderRadius * 0.5,
        px: 2,
        py: 1.5,
        m: 1,
        minWidth: 140,
        transition: "background-color 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          textDecoration: "none",
        },
      })}
      data-testid="db-language-tile"
    >
      <Typography
        component="li"
        variant="h6"
        sx={{
          color,
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
