import React from "react";
import { fontSizeAtom } from "@atoms";
import { Box, Slider, Typography } from "@mui/material";
import { useAtom } from "jotai";

export const FontSizeSlider = () => {
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  return (
    <Box>
      <Typography id="font-size-slider" gutterBottom>
        Font Size
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
