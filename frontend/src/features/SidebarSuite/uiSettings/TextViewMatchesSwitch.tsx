import React from "react";
import { useTranslation } from "next-i18next";
import { useIncludeMatchesParam } from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";

export const TextViewMatchesSwitch = () => {
  const { t } = useTranslation("settings");

  const [includeMatches, setIncludeMatches] = useIncludeMatchesParam();
  const { dbLanguageName } = useDbPageRouterParams();

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
        label={
          <Typography lineHeight={1.25}>
            {t("optionsLabels.showTextViewMatches", {
              lang: dbLanguageName,
            })}
          </Typography>
        }
      />
    </FormGroup>
  );
};
