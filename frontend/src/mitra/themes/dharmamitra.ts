import { grey } from "@mui/material/colors";
// eslint-disable-next-line no-restricted-imports
import type { CssVarsThemeOptions } from "@mui/material/styles/experimental_extendTheme";

import { commonPaletteColors } from "./base";

export const getDharmamitraDesignTokens = (): CssVarsThemeOptions => ({
  colorSchemes: {
    light: {
      palette: {
        common: commonPaletteColors,
        primary: {
          main: "#972e3a",
        },
        background: {
          default: "#f7f7f7",
          paper: "#ffffff",
          grey: grey[50],
          accent: "#f2eeee",
          header: grey[200],
          active: grey[300],
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
          main: "#eae0d8",
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
          default: "#21232d",
          paper: "#232634",
          grey: grey[900],
          accent: "#1a1c20",
          header: "#2a2a39",
          active: "#1e202b",
        },
        text: {
          primary: grey[200],
          secondary: grey[300],
          inverted: grey[900],
        },
        divider: "rgba(247, 245, 244, 0.12)",
      },
    },
  },
});
