import React from "react";
import { useIncludeMatchesParam } from "@components/hooks/params";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";

export const TextViewMatchesSwitch = () => {
  const [includeMatches, setIncludeMatches] = useIncludeMatchesParam();

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={includeMatches}
            onChange={async (event) => {
              await setIncludeMatches(event.target.checked);
            }}
          />
        }
        label={<Typography lineHeight={1.25}>Show matches</Typography>}
      />
    </FormGroup>
  );
};
