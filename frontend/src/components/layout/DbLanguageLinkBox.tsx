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
      sx={{
        display: "block",
        color: "inherit",
        textDecoration: "none",
        "&:hover": { 
          textDecoration: "underline"
        },
      }}
      data-testid="db-language-tile"
    >
      <Typography 
        component="li" 
        variant="h6" 
        sx={{ 
          color: color,
          fontWeight: 500,
          mb: 1
        }}
      >
        {title}
      </Typography>
    </Link>
  );
};
