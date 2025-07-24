// segment highlighting based on colors used for BuddhaNexus v1 site
// corrected for accessibility and with dark mode addition.
// original codes: https://github.com/search?q=repo%3ABuddhaNexus/buddhanexus-frontend%20SEGMENT_COLORS&type=code

export const STANDARD_MATCH_HEAT_THEME_LIGHT_MODE = [
  "#00224E", // 1 match
  "#004C7A",
  "#00724B",
  "#485C00",
  "#7A4500",
  "#993600",
  "#B0481C",
  "#C62800",
  "#D51E00",
  "#E9152C", // 10 or more matches
] as const;

// colours are "counter-filtered" to adjust for css dark mode filters
// including invert(1) and hue-rotate(90deg).
// rendered on a #2f313f background
// These colours are WCAG compliant, although some colour
// contrast checkers will not recognize the css invert and give a false
// fail on the a11y test.
export const STANDARD_MATCH_HEAT_THEME_DARK_MODE = [
  "#42222b", // 1 match
  "#4f2742",
  "#2a3f59",
  "#22514a",
  "#3e682b",
  "#2c6a28",
  "#327b1e",
  "#438a12",
  "#808410",
  "#849703", // 10 or more matches
] as const;

// Vivid theme is not WCAG AA compliant
export const VIVID_MATCH_HEAT_THEME = [
  "#0cc0e8", // 1 match
  "#0039ff",
  "#610ce8",
  "#aa00ff",
  "#dc0ce8",
  "#ff0093",
  "#f32b72",
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
