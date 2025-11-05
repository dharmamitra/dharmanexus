import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { NumberField } from "@base-ui-components/react/number-field";
import { useScoreParam } from "@components/hooks/params";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, FormLabel, Slider } from "@mui/material";
import debounce from "lodash/debounce";

import styles from "./number-field.module.css";

function valueToString(value: number) {
  return `${value}`;
}

function normalizeValue(value: number | null | undefined) {
  if (!value || value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
}

export default function ScoreFilter() {
  const { t } = useTranslation("settings");

  const id = useId();

  const [scoreParam, setScoreParam] = useScoreParam();
  const [scoreValue, setScoreValue] = useState(scoreParam);

  useEffect(() => {
    setScoreValue(scoreParam);
  }, [scoreParam]);

  const setDebouncedScoreParam = useMemo(
    () => debounce(setScoreParam, 600),
    [setScoreParam],
  );

  const handleChange = useCallback(
    async (value: number) => {
      const normalizedValue = normalizeValue(value);
      setScoreValue(value);
      await setDebouncedScoreParam(normalizedValue);
    },
    [setScoreValue, setDebouncedScoreParam],
  );

  const marks = [
    {
      value: 0,
      label: `${0}%`,
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <FormLabel id="score-input-label">{t("filtersLabels.score")}</FormLabel>
      <NumberField.Root
        id={id}
        value={scoreValue}
        min={0}
        max={100}
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
          value={scoreValue}
          aria-labelledby="score-input-label"
          getAriaValueText={valueToString}
          min={0}
          max={100}
          marks={marks}
          onChange={(_, value) => handleChange(Number(value))}
        />
      </Box>
    </Box>
  );
}
