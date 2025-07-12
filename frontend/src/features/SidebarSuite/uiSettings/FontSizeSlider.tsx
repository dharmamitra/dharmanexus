import { fontSizeAtom } from "@atoms";
import { Box, Slider, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

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
        marks
        min={12}
        max={24}
        onChange={handleSliderChange}
      />
    </Box>
  );
}; 