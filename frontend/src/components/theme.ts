import { Noto_Serif, Source_Sans_3 } from "next/font/google";
import { getBaseDesignTokens } from "@mitra/themes/base";
import { getDharmamitraDesignTokens } from "@mitra/themes/dharmamitra";
import { getKumarajivaDesignTokens } from "@mitra/themes/kumarajiva";
import { getDeployment } from "@mitra/utils";
// eslint-disable-next-line no-restricted-imports
import type { CssVarsThemeOptions } from "@mui/material/styles/experimental_extendTheme";
import { DbLanguage } from "@utils/api/types";
import { merge } from "lodash";

export const sourceSerif = Noto_Serif({ subsets: ["latin", "latin-ext"] });
export const sourceSans = Source_Sans_3({ subsets: ["latin", "latin-ext"] });

declare module "@mui/material/styles" {
  interface TypeBackground {
    header: string;
    accent: string;
    card: string;
    inverted: string;
  }
  interface TypeText {
    inverted: string;
  }
}

export interface DesignTokenParams {
  // some theme elements depend on the source language selected
  dbLanguage?: DbLanguage;
}

const getDeploytmentCustomTheming =
  getDeployment() === "dharmamitra"
    ? getDharmamitraDesignTokens
    : getKumarajivaDesignTokens;

export const getDesignTokens = ({
  dbLanguage,
}: DesignTokenParams): CssVarsThemeOptions => {
  const baseTheme = getBaseDesignTokens({ dbLanguage });
  const deploymentTheme = getDeploytmentCustomTheming({ dbLanguage });
  return merge(baseTheme, deploymentTheme);
};

export type ThemeType = ReturnType<typeof getDesignTokens>;
