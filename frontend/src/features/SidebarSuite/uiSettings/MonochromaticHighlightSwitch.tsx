import React from "react";
import { useTranslation } from "next-i18next";
import { shouldUseMonochromaticSegmentColorsAtom } from "@atoms";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { useAtom } from "jotai/index";

export const MonochromaticHighlightSwitch = () => {
  const { t } = useTranslation("settings");

  const [shouldUseMonochromaticSegmentColors, setShouldUseOldSegmentColors] =
    useAtom(shouldUseMonochromaticSegmentColorsAtom);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={shouldUseMonochromaticSegmentColors}
            onChange={(event) =>
              setShouldUseOldSegmentColors(event.target.checked)
            }
          />
        }
        label={
          <Typography lineHeight={1.25}>
            {t("optionsLabels.useMonochromaticSegmentColors")}
          </Typography>
        }
      />
    </FormGroup>
  );
};
