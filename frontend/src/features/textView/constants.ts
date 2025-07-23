// segment highlighting based on colors used for BuddhaNexus v1 site
// corrected for accessibility and with dark mode addition.
// original codes: https://github.com/search?q=repo%3ABuddhaNexus/buddhanexus-frontend%20SEGMENT_COLORS&type=code

export const STANDARD_MATCH_HEAT_THEME_LIGHT_MODE = [
  "#00224E", // 1 match - deeper navy (WCAG AA)
  "#004C7A",
  "#00724B",
  "#485C00",
  "#7A4500",
  "#993600",
  "#B0481C",
  "#C62800",
  "#D51E00",
  "#E9152C", // most matches
] as const;

// colours are "counter-filtered" to adjust for css dark mode filters
// including invert(1) and hue-rotate(90deg).
// rendered on a #2f313f background
// These colours are WCAG compliant, although some colour
// contrast checkers will not recognize the css invert and give a false
// fail on the a11y test.
export const STANDARD_MATCH_HEAT_THEME_DARK_MODE = [
  "#4f2742", // 1 match
  "#53323c",
  "#564c36",
  "#50652e",
  "#3e7426",
  "#2b7e1e",
  "#1b8714",
  "#0e900a",
  "#009904",
  "#00a200", // most matches
] as const;

// Stark match highlighting is not WCAG compliant
export const VIVID_MATCH_HEAT_THEME_LIGHT_MODE = [
  "#0cc0e8", // 1 match
  "#0039ff",
  "#610ce8",
  "#aa00ff",
  "#dc0ce8",
  "#ff0093",
  "#e80c0c",
  "#e85650",
  "#f2611a",
  "#ff8300", // 10 or more matches
] as const;

export const VIVID_MATCH_HEAT_THEME_DARK_MODE = [
  "#0cc0e8", // 1 match
  "#0039ff",
  "#610ce8",
  "#aa00ff",
  "#dc0ce8",
  "#ff0093",
  "#e80c0c",
  "#e85650",
  "#f2611a",
  "#ff8300", // 10 or more matches
] as const;

export const MATCH_HEAT_MAP_THEMES = [
  "standard",
  "monochrome",
  "vivid",
] as const;
export type MatchHeatMapTheme = (typeof MATCH_HEAT_MAP_THEMES)[number];
