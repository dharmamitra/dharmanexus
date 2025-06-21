import { DesignTokenParams } from "@components/theme";
import { grey } from "@mui/material/colors";
// eslint-disable-next-line no-restricted-imports
import type { CssVarsThemeOptions } from "@mui/material/styles/experimental_extendTheme";

import {
  commonPaletteColors,
  DB_LANGUAGE_COLORS_DARK,
  DB_LANGUAGE_COLORS_LIGHT,
} from "./base";

const defaultPrimary = "#11305d";
const defaultPrimaryDark = "#becfe7";
const defaultPrimaryBgLight = "#f2eeee";
const defaultPrimaryBgDark = "#151515";
// const defaultPrimaryBgDark = "#312e2e";

export const getDharmamitraDesignTokens = ({
  dbLanguage,
}: DesignTokenParams): CssVarsThemeOptions => ({
  colorSchemes: {
    light: {
      palette: {
        common: commonPaletteColors,
        primary: {
          main: defaultPrimary,
        },
        background: {
          default: "#f7f7f7",
          paper: "#ffffff",
          accent: grey[50],
          header: dbLanguage
            ? DB_LANGUAGE_COLORS_LIGHT[dbLanguage]
            : defaultPrimaryBgLight,
          card: grey[200],
          inverted: grey[800],
        },
        text: {
          primary: grey[900],
          secondary: grey[700],
          inverted: grey[50],
        },
        divider: "rgba(54,31,13,0.12)",
      },
    },
    dark: {
      // palette values for dark mode
      palette: {
        common: commonPaletteColors,
        primary: {
          main: defaultPrimaryDark,
          contrastText: "#fff",
        },
        secondary: {
          main: "#C23211",
        },
        error: {
          main: "#972222",
        },
        warning: {
          main: "#FE8027",
        },
        info: {
          main: "#0DC0E8",
        },
        success: {
          main: "#10A60B",
        },
        background: {
          default: "#242222",
          paper: "#151515",
          accent: grey[900],
          header: dbLanguage
            ? DB_LANGUAGE_COLORS_DARK.main[dbLanguage]
            : defaultPrimaryBgDark,
          card: defaultPrimaryBgDark,
        },
        text: {
          primary: grey[100],
          secondary: grey[300],
          inverted: grey[900],
        },
        divider: "rgba(54,31,13,0.12)",
      },
    },
  },
});
