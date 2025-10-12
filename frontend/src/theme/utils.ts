import type { Theme } from "@mui/material/styles";

/**
 * Returns a CSS-variable friendly selected background color.
 * It prefers `theme.vars.palette.background.selected` because it is responsive to the active (dark or light) color scheme, and falls back to `theme.palette.background.selected` if the CSS variable is not available.
 */
export function selectedBg(theme: Theme): string {
  return (
    (theme as any)?.vars?.palette?.background?.selected ??
    theme.palette.background.selected
  );
}

/**
 * Returns a hover color mixed from the selected background toward a target color using CSS color-mix.
 * Avoids `lighten()` because JS color utilities cannot compute against CSS variables at runtime.
 * Defaults to mixing 90% selected with 10% white for a subtle highlight.
 *
 * @param theme MUI theme, used to read CSS-variable backed palette values.
 * @param ratio Proportion of the selected color (0..1). Default: 0.9 (90%).
 * @param toward Target color to blend toward. Default: 'white'.
 */
export function selectedHoverBg({
  theme,
  ratio = 0.9,
  toward = "white",
}: {
  theme: Theme;
  ratio?: number;
  toward?: string;
}) {
  const selectedColor = selectedBg(theme);
  const selectedProportion = Math.max(0, Math.min(1, ratio));
  const selectedColorAmount = Math.round(selectedProportion * 100);
  const towardColorAmount = 100 - selectedColorAmount;
  return `color-mix(in srgb, ${selectedColor} ${selectedColorAmount}%, ${toward} ${towardColorAmount}%)`;
}
