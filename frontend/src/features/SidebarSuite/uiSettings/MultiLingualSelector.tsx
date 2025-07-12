import {
  Box,
  Checkbox,
  Fade,
  FormControl,
  FormLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import {
  Popper,
  PopperMsgBox,
} from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import { allUIComponentParamNames } from "@features/SidebarSuite/uiSettings/config";
import { DbLanguage, dbLanguages } from "@utils/api/constants";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import * as React from "react";

function getStyles(
  name: DbLanguage,
  selectedLanguages: DbLanguage[],
  theme: Theme,
) {
  return {
    fontWeight: selectedLanguages.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const MultiLingualSelector = () => {
  const { t } = useTranslation(["settings", "common"]);
  const router = useRouter();
  const theme = useTheme();

  const [paramValue, setParamValue] = React.useState<DbLanguage[]>([
    ...dbLanguages,
  ]);

  const handleChange = async (event: any) => {
    // TODO: confirm desired handling.
    const {
      target: { value },
    } = event;
    setParamValue(value);

    if (value.length === 0) {
      return;
    }

    await router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        // A string is given here to avoid NextJS setting params with repeated keys. This allows default value comparison in CurrentResultChips.
        [allUIComponentParamNames.languages]: value.toString(),
      },
    });
  };

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const selectorLabel = t("optionsLabels.multiLingual");
  const getRenderValue = (selected: DbLanguage[]) => {
    return selected.length > 0 ? (
      selected.map((selection) => t(`common:language.${selection}`)).join(", ")
    ) : (
      <em style={{ color: theme.palette.text.secondary }}>
        {t("generic.noSelection")}
      </em>
    );
  };

  return (
    <Box ref={anchorRef} sx={{ width: 1, mt: 1, mb: 2 }}>
      <FormControl sx={{ width: 1 }} error={paramValue.length === 0}>
        <FormLabel sx={{ mb: 1 }} id="multi-lingual-selector-label">
          {selectorLabel}
        </FormLabel>
        <Select
          labelId="multi-lingual-selector-label"
          aria-describedby="multi-lingual-selector-helper-text"
          value={paramValue}
          inputProps={{
            id: "multi-lingual-selector",
          }}
          renderValue={getRenderValue}
          multiple
          displayEmpty
          onChange={handleChange}
        >
          {dbLanguages.map((langKey: DbLanguage) => (
            <MenuItem
              key={langKey}
              value={langKey}
              style={getStyles(langKey, paramValue, theme)}
            >
              <Checkbox checked={paramValue?.includes(langKey)} />
              <ListItemText primary={t(`common:language.${langKey}`)} />
            </MenuItem>
          ))}
        </Select>

        <Popper
          id="multi-lingual-selector-helper-text"
          open={paramValue.length === 0}
          anchorEl={anchorRef.current}
          placement="top"
          sx={{ maxWidth: 320 }}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 20],
              },
            },
          ]}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <PopperMsgBox>
                {t("optionsLabels.multiLingualError")}
              </PopperMsgBox>
            </Fade>
          )}
        </Popper>
      </FormControl>
    </Box>
  );
};

export default MultiLingualSelector;
