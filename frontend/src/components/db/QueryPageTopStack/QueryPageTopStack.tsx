import * as React from "react";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useViewMatches } from "@components/hooks/useViewMatches";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@constants/base";
import { TextViewMatchesSwitch } from "@features/SidebarSuite/uiSettings/TextViewMatchesSwitch";
import { Box, Stack, Typography } from "@mui/material";

import { DbFileButtons } from "./DbFileButtons";
import { QueryPageButtons } from "./QueryPageButtons";

export const QueryPageTopStack = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  const matchOptions = useViewMatches();

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "left" }}
      spacing={{ xs: 0, md: 2 }}
      mt={2}
      pb={1}
    >
      <Box
        component="hgroup"
        id={RESULT_PAGE_TITLE_GROUP_ID}
        style={{ maxWidth: "880px" }}
      >
        <Typography variant="h5" component="h1" fontWeight={400}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            variant="subtitle2"
            component="p"
            mb={1}
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        ) : null}
        <TextViewMatchesSwitch
          isRendered={matchOptions.matchesSwitchVisible}
          {...matchOptions}
        />
      </Box>

      <Stack
        direction={{ xs: "row-reverse", md: "column" }}
        justifyContent={{ xs: "flex-end", sm: "space-between" }}
        alignItems={{ xs: "center", md: "flex-end" }}
        spacing={{ xs: 0, md: 2 }}
      >
        <QueryPageButtons>
          <DbFileButtons />
        </QueryPageButtons>

        <CurrentResultChips isRendered={matchOptions.matchesVisible} />
      </Stack>
    </Stack>
  );
};
