import { useTranslation } from "next-i18next";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { dbLanguages } from "@utils/api/constants";
import { StringParam, useQueryParam } from "use-query-params";
import { allUIComponentParamNames } from "@features/sidebarSuite/uiSettingsDefinition";

const SearchLanguageSelector = () => {
  const { t } = useTranslation(["common", "settings"]);

  const [currentLang, setCurrentDbLang] = useQueryParam(
    allUIComponentParamNames.language,
    StringParam
  );

  return (
    <FormControl variant="filled" sx={{ width: 1, mb: 2 }}>
      <InputLabel id="db-language-selector-label" sx={{ mb: 1 }}>
        {t(`settings:generic.selectLanguage`)}
      </InputLabel>
      <Select
        labelId="db-language-selector-label"
        aria-labelledby="db-language-selector-label"
        id="db-language-selector"
        value={currentLang ?? "all"}
        onChange={(e) =>
          setCurrentDbLang(
            e.target.value === "all" ? undefined : e.target.value
          )
        }
      >
        <MenuItem key="all" value="all">
          {t(`language.all`)}
        </MenuItem>
        {dbLanguages.map((option) => (
          <MenuItem key={option} value={option}>
            {t(`language.${option}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SearchLanguageSelector;
