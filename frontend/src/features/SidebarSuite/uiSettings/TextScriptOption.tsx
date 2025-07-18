import * as React from "react";
import { useTranslation } from "next-i18next";
import { scriptSelectionAtom, tibetanScriptAtom } from "@atoms";
import type { Script } from "@features/SidebarSuite/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { DbLanguage } from "@utils/api/types";
import { useAtom } from "jotai";

const SCRIPT_OPTIONS: Partial<Record<DbLanguage, Script[]>> = {
  bo: ["Unicode", "Wylie"],
};

function TextScriptOptionComponent({ dbLanguage }: { dbLanguage: DbLanguage }) {
  const { t } = useTranslation("settings");

  const [scriptSelection, setScriptSelection] = useAtom(scriptSelectionAtom);
  const [tibetanScript, setTibetanScript] = useAtom(tibetanScriptAtom);

  const isTibetan = dbLanguage === "bo";

  const script = isTibetan ? tibetanScript : scriptSelection;
  const setScript = isTibetan ? setTibetanScript : setScriptSelection;

  return (
    <FormControl sx={{ width: 1, mt: 4, mb: 2 }}>
      <InputLabel id="text-script-selection-label">
        {t("optionsLabels.script")}
      </InputLabel>

      <Select
        labelId="text-script-selection-label"
        aria-labelledby="sort-option-selector-label"
        defaultValue="position"
        inputProps={{
          id: "sort-option-selector",
        }}
        input={<OutlinedInput label={t("optionsLabels.script")} />}
        value={script}
        onChange={(e) => setScript(e.target.value as Script)}
      >
        {SCRIPT_OPTIONS[dbLanguage]?.map((scriptOption) => {
          return (
            <MenuItem key={scriptOption} value={scriptOption}>
              {scriptOption}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default function TextScriptOption({
  isRendered,
  dbLanguage,
}: {
  isRendered: boolean;
  dbLanguage: DbLanguage;
}) {
  if (!isRendered) {
    return null;
  }

  return <TextScriptOptionComponent dbLanguage={dbLanguage} />;
}
