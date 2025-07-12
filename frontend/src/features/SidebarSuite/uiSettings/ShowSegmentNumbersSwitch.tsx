import React from "react";
import { useTranslation } from "next-i18next";
import { shouldShowSegmentNumbersAtom } from "@atoms";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useAtom } from "jotai/index";

export const ShowSegmentNumbersSwitch = () => {
  const { t } = useTranslation("settings");

  const [shouldShowSegmentNumbers, setShouldShowSegmentNumbers] = useAtom(
    shouldShowSegmentNumbersAtom,
  );

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={shouldShowSegmentNumbers}
            onChange={(event) =>
              setShouldShowSegmentNumbers(event.target.checked)
            }
          />
        }
        label={t("optionsLabels.showSegmentNumbers")}
      />
    </FormGroup>
  );
}; 