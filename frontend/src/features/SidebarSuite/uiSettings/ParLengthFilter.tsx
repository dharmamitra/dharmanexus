import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { NumberField } from "@base-ui-components/react/number-field";
import { useParLengthParam } from "@components/hooks/params";
import { useDbPageRouterParams } from "@components/hooks/useDbRouterParams";
import { MIN_PAR_LENGTH_VALUES } from "@features/SidebarSuite/uiSettings/config";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, FormLabel, Slider } from "@mui/material";
import debounce from "lodash/debounce";

import styles from "./number-field.module.css";

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number, min: number) {
  if (!value || value < min) {
    return min;
  }

  // TODO set dynamic max
  if (value > 4000) {
    return 4000;
  }

  return value;
}

export default function ParLengthFilter() {
  const { t } = useTranslation("settings");

  const { dbLanguage } = useDbPageRouterParams();

  const id = useId();

  const [parLengthParam, setParLengthParam] = useParLengthParam();
  const [parLengthValue, setparLengthValue] = useState(parLengthParam);

  const minValue = MIN_PAR_LENGTH_VALUES[dbLanguage];

  useEffect(() => {
    setparLengthValue(parLengthParam);
  }, [parLengthParam]);

  const setDebouncedParLengthParam = useMemo(
    () => debounce(setParLengthParam, 600),
    [setParLengthParam],
  );

  const handleChange = useCallback(
    async (value: number) => {
      const normalizedValue = normalizeValue(value, minValue);
      setparLengthValue(value);
      await setDebouncedParLengthParam(normalizedValue);
    },
    [minValue, setparLengthValue, setDebouncedParLengthParam],
  );

  const marks = [
    {
      value: minValue,
      label: `${minValue}`,
    },
    // TODO set dynamic max
    {
      value: 4000,
      label: "4000",
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <FormLabel id="min-match-input-label">
        {t("filtersLabels.minMatch")}
      </FormLabel>

      <NumberField.Root
        id={id}
        value={parLengthValue}
        min={minValue}
        max={4000}
        className={styles.Field}
        onValueChange={(value) => handleChange(Number(value))}
      >
        <NumberField.Group className={styles.Group}>
          <NumberField.Decrement className={styles.Decrement}>
            <RemoveIcon />
          </NumberField.Decrement>
          <NumberField.Input className={styles.Input} />
          <NumberField.Increment className={styles.Increment}>
            <AddIcon />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>

      <Box sx={{ ml: 1, width: "96%" }}>
        <Slider
          value={parLengthValue}
          aria-labelledby="min-match-input-label"
          getAriaValueText={valueToString}
          min={minValue}
          max={4000}
          marks={marks}
          onChange={(_, value) => handleChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
