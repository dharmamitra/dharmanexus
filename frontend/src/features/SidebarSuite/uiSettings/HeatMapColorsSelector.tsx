import React from "react";
import { useTranslation } from "next-i18next";
import { heatMapThemeAtom } from "@atoms";
import {
  MATCH_HEAT_MAP_THEMES,
  MatchHeatMapTheme,
} from "@features/textView/constants";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useAtom } from "jotai";

export const HeatMapColorsSelector = () => {
  const { t } = useTranslation("settings");

  const [currentHeatMapTheme, setCurrentHeatMapTheme] =
    useAtom(heatMapThemeAtom);

  return (
    <FormControl sx={{ width: 1, my: 2 }}>
      <InputLabel id="heat-map-selector-label">
        {t(`optionsLabels.heatMapTheme`)}
      </InputLabel>
      <Select
        labelId="heat-map-selector-label"
        id="heat-map-selector"
        aria-labelledby="heat-map-selector-label"
        data-testid="heat-map-selector"
        inputProps={{
          id: "heat-map-selector",
        }}
        input={<OutlinedInput label={t(`optionsLabels.heatMapTheme`)} />}
        value={currentHeatMapTheme}
        onChange={(e: SelectChangeEvent) =>
          setCurrentHeatMapTheme(e.target.value as MatchHeatMapTheme)
        }
      >
        {MATCH_HEAT_MAP_THEMES.map((theme) => (
          <MenuItem key={theme} value={theme}>
            {t(`heatMapThemeOptions.${theme}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
