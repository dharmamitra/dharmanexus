import * as React from "react";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useViewMatches } from "@components/hooks/useViewMatches";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@constants/base";
import { DbViewEnum } from "@constants/view";
import { TextViewMatchesSwitch } from "@features/SidebarSuite/uiSettings/TextViewMatchesSwitch";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { DbFileButtons } from "./DbFileButtons";

export const QueryPageTopStack = ({
  title,
  subtitle,
  dbView,
}: {
  title: string;
  subtitle?: string;
  dbView: DbViewEnum;
}) => {
  const matchOptions = useViewMatches();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "left", sm: "flex-start" }}
        spacing={{ xs: 0, sm: 2 }}
        mt={1}
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
        </Box>

        {isMdUp ? <DbFileButtons isSmallScreen={isSmallScreen} /> : null}
      </Stack>

      <Stack
        direction="row"
        justifyContent={
          dbView === DbViewEnum.TEXT ? "space-between" : "flex-end"
        }
        alignItems="center"
        spacing={{ xs: 0, md: 2 }}
        mb={1}
      >
        <TextViewMatchesSwitch
          isRendered={matchOptions.matchesSwitchVisible}
          isSmallScreen={isSmallScreen}
          {...matchOptions}
        />

        {isMdUp ? null : <DbFileButtons isSmallScreen={isSmallScreen} />}

        <CurrentResultChips isRendered={matchOptions.matchesVisible} />
      </Stack>
    </>
  );
};
