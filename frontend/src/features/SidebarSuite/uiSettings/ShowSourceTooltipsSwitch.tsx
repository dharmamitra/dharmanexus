import { showSourceTooltipsAtom } from "@atoms";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";

export const ShowSourceTooltipsSwitch = () => {
  const [showTooltips, setShowTooltips] = useAtom(showSourceTooltipsAtom);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={showTooltips}
            onChange={(event) => setShowTooltips(event.target.checked)}
          />
        }
        label={
          <Typography lineHeight={1.25}>
            Show source tooltips / preview match text
          </Typography>
        }
      />
    </FormGroup>
  );
}; 