import React from "react";
import { useTranslation } from "next-i18next";
import { fontSizeAtom } from "@atoms";
import { Box, Slider, Typography } from "@mui/material";
import { useAtom } from "jotai";

export const FontSizeSlider = () => {
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const { t } = useTranslation("settings");

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  return (
    <Box>
      <Typography id="font-size-slider" gutterBottom>
        {t("optionsLabels.fontSize")}
      </Typography>
      <Slider
        aria-labelledby="font-size-slider"
        value={fontSize}
        valueLabelDisplay="auto"
        step={1}
        min={12}
        max={24}
        marks
        onChange={handleSliderChange}
      />
    </Box>
  );
};
