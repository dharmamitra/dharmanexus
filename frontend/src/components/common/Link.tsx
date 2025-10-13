import type { FC, PropsWithChildren } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { LinkProps } from "@mui/material/Link";
import MUILink from "@mui/material/Link";

export const Link: FC<PropsWithChildren<LinkProps>> = ({
  href,
  children,
  ...rest
}) => {
  const { locale } = useRouter();

  return (
    <MUILink component={NextLink} href={href ?? ""} locale={locale} {...rest}>
      {children}
    </MUILink>
  );
};
