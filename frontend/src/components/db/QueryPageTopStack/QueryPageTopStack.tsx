import * as React from "react";
import CurrentResultChips from "@components/db/CurrentResultChips";
import { useIsRenderedInReaderMode } from "@components/hooks/useIsRenderedInReaderMode";
import { Box, Stack, Typography } from "@mui/material";
import { RESULT_PAGE_TITLE_GROUP_ID } from "@utils/constants";

import { DbFileButtons } from "./DbFileButtons";
import { QueryPageButtons } from "./QueryPageButtons";

export const QueryPageTopStack = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  const isRenderedInReaderMode = useIsRenderedInReaderMode();

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

        {isRenderedInReaderMode ? <CurrentResultChips /> : null}
      </Stack>
    </Stack>
  );
};
