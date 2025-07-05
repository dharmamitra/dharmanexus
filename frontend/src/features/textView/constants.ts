// segment highlighting based on colors used for BuddhaNexus v1 site
// corrected for accessibility and with dark mode addition.
// original codes: https://github.com/search?q=repo%3ABuddhaNexus/buddhanexus-frontend%20SEGMENT_COLORS&type=code

export const LIGHT_MODE_MATCH_HEAT_COLORS = [
  "#1B365D", // fewest matches
  "#165666",
  "#0B6E5F",
  "#0A5B3D",
  "#1B6B2C",
  "#485C00",
  "#7A4500",
  "#993600",
  "#B0481C",
  "#C6103B", // most matches
] as const;

// colours are "counter-filtered" to adjust for css dark mode filters
// including invert(1) and hue-rotate(90deg).
// rendered on a #2f313f background
// These colours should be WCAG compliant, although some colour
// contrast checkers will not recognize the css invert and give a false
// fail on the a11y test.
export const DARK_MODE_MATCH_HEAT_INVERTED_COLORS = [
  "#532d45", // fewest matches
  "#55303f",
  "#55333b",
  "#584a37",
  "#554d2f",
  "#484b2a",
  "#3a4324",
  "#29411f",
  "#1a7e0e",
  "#0f7701", // most matches
] as const;
