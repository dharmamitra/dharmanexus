import * as React from "react";
import { useTranslation } from "next-i18next";
import { SetAtom, tibetanScriptSelectionAtom } from "@atoms";
import type { Script } from "@features/SidebarSuite/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { DbLanguage } from "@utils/api/types";
import { SetStateAction, useAtom } from "jotai";

const SCRIPT_OPTIONS: Partial<Record<DbLanguage, Script[]>> = {
  bo: ["Unicode", "Wylie"],
};

function TextScriptOptionFrame<T extends Script>({
  children,
  defaultValue,
  value,
  onChange,
  label,
}: {
  children: React.ReactNode;
  defaultValue: T;
  value: T;
  onChange: SetAtom<[SetStateAction<T>], void>;
  label: string;
}) {
  return (
    <FormControl sx={{ width: 1, mt: 4, mb: 2 }}>
      <InputLabel id="text-script-selection-label">{label}</InputLabel>

      <Select
        labelId="text-script-selection-label"
        aria-labelledby="sort-option-selector-label"
        defaultValue={defaultValue}
        inputProps={{
          id: "sort-option-selector",
        }}
        input={<OutlinedInput label={label} />}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {children}
      </Select>
    </FormControl>
  );
}

export function TibetanScriptSelector() {
  const [tibetanScriptSelection, setTibetanScriptSelection] = useAtom(
    tibetanScriptSelectionAtom,
  );
  const { t } = useTranslation("settings");

  return (
    <TextScriptOptionFrame
      defaultValue="Unicode"
      value={tibetanScriptSelection}
      label={t("optionsLabels.tibetanScript")}
      onChange={setTibetanScriptSelection}
    >
      {SCRIPT_OPTIONS.bo?.map((scriptOption) => {
        return (
          <MenuItem key={scriptOption} value={scriptOption}>
            {scriptOption}
          </MenuItem>
        );
      })}
    </TextScriptOptionFrame>
  );
}
