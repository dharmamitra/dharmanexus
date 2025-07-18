import React from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import ParallelsChip from "@components/db/ParallelsChip";
import {
  DBSourceFilePageFilterUISettingName,
  DisplayUISettingName,
} from "@features/SidebarSuite/types";
import {
  dbSourceFileRequestFilters,
  displayUISettings,
} from "@features/SidebarSuite/uiSettings/config";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const dbSourceFileFilterSet = new Set(dbSourceFileRequestFilters);
const displayUISettingsSet = new Set(displayUISettings);

function getSettingCounts({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  let display = 0;
  let filter = 0;
  let isExcludeSet = false;
  let isIncludeSet = false;

  const params = Object.fromEntries(searchParams.entries());

  for (const key of Object.keys(params)) {
    if (key === "include_matches") {
      continue;
    }

    if (key.startsWith("exclude_") && !isExcludeSet) {
      filter += 1;
      isExcludeSet = true;
      continue;
    }

    if (key.startsWith("include_") && !isIncludeSet) {
      filter += 1;
      isIncludeSet = true;
      continue;
    }

    if (displayUISettingsSet.has(key as DisplayUISettingName)) {
      display += 1;
      continue;
    }

    if (dbSourceFileFilterSet.has(key as DBSourceFilePageFilterUISettingName)) {
      filter += 1;
    }
  }

  return { display, filter };
}

function CurrentResultChipsComponent() {
  const { t } = useTranslation("settings");

  const searchParams = useSearchParams();

  const count = React.useMemo(
    () =>
      getSettingCounts({
        searchParams,
      }),
    [searchParams],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        gap: 0.5,
      }}
    >
      <ParallelsChip />

      {count.filter > 0 && (
        <Chip
          size="small"
          label={t("resultsHead.filters", { value: count.filter })}
          sx={{ p: 0.5 }}
        />
      )}
      {count.display > 0 && (
        <Chip
          size="small"
          label={t("resultsHead.options", { value: count.display })}
          sx={{ p: 0.5 }}
        />
      )}
    </Box>
  );
}

export default function CurrentResultChips({
  isRendered,
}: {
  isRendered: boolean;
}) {
  if (!isRendered) return null;

  return <CurrentResultChipsComponent />;
}
