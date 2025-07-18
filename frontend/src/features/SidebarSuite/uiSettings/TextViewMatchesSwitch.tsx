import React from "react";
import { useTranslation } from "next-i18next";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";

type TextViewMatchesSwitchComponentProps = {
  matchesVisible: boolean;
  setIncludeMatches: (value: boolean) => void;
};

export const TextViewMatchesSwitchComponent = ({
  matchesVisible,
  setIncludeMatches,
}: TextViewMatchesSwitchComponentProps) => {
  const { t } = useTranslation("settings");

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={matchesVisible}
            size="small"
            onChange={(event) => {
              setIncludeMatches(event.target.checked);
            }}
          />
        }
        label={
          <Typography lineHeight={1.25}>
            {t("optionsLabels.showMatches")}
          </Typography>
        }
      />
    </FormGroup>
  );
};

export const TextViewMatchesSwitch = ({
  isRendered,
  ...props
}: { isRendered: boolean } & TextViewMatchesSwitchComponentProps) => {
  if (!isRendered) return null;

  return <TextViewMatchesSwitchComponent {...props} />;
};
