import React from "react";
import { useAtom } from "jotai";
import { fontSizeAtom } from "@atoms";
import { Typography, Slider, Box } from "@mui/material";

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
        value={fontSize}
        onChange={handleSliderChange}
        aria-labelledby="font-size-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={12}
        max={24}
      />
    </Box>
  );
}; 