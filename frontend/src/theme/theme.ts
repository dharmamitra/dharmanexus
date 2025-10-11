import { Noto_Serif, Source_Sans_3 } from "next/font/google";
import { getDeployment } from "@mitra/utils";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { getDharmamitraDesignTokens } from "@theme/variants/dharmamitra";
import { getKumarajivaDesignTokens } from "@theme/variants/kumarajiva";
import { DbLanguage } from "@utils/api/types";
import { merge } from "lodash";
import { getBaseDesignTokens } from "src/theme/base";

export const sourceSerif = Noto_Serif({ subsets: ["latin", "latin-ext"] });
export const sourceSans = Source_Sans_3({ subsets: ["latin", "latin-ext"] });

export interface DesignTokenParams {
  // some theme elements depend on the source language selected
  dbLanguage?: DbLanguage;
}

const getDeploytmentCustomTheming =
  getDeployment() === "dharmamitra"
    ? getDharmamitraDesignTokens
    : getKumarajivaDesignTokens;

export const getDeploymentTheme = ({ dbLanguage }: DesignTokenParams) => {
  const baseTokens = getBaseDesignTokens({ dbLanguage });
  const deploymentTokens = getDeploytmentCustomTheming({ dbLanguage });

  const tokens = merge({}, baseTokens, deploymentTokens);

  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: "data-mui-color-scheme",
    },
    ...tokens,
  });

  return responsiveFontSizes(theme);
};
