import React from "react";
import { compactHighlightModeAtom } from "@atoms";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { useAtom } from "jotai";

export const CompactHighlightSwitch = () => {
  const [compactMode, setCompactMode] = useAtom(compactHighlightModeAtom);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={compactMode}
            onChange={(event) => setCompactMode(event.target.checked)}
          />
        }
        label={
          <Typography lineHeight={1.25}>Compact highlight mode</Typography>
        }
      />
    </FormGroup>
  );
};
