import type { FC, PropsWithChildren } from "react";
import {
  Box,
  Breakpoint,
  Container,
  LinearProgress,
  SxProps,
} from "@mui/material";
import { DbLanguage } from "@utils/api/types";

import Footer from "./Footer";
import { QueryResultsPageContent } from "./QueryResultsPageContent";

export type BackgroundName = DbLanguage | "welcome";

interface Props extends PropsWithChildren {
  backgroundName?: BackgroundName;
  maxWidth?: Breakpoint | false;
  isQueryResultsPage?: boolean;
  isLoading?: boolean;
}

export const PageContainer: FC<Props> = ({
  children,
  backgroundName,
  maxWidth = "md",
  isQueryResultsPage,
  isLoading,
}) => {
  const containerStyles: SxProps = {
    pt: { xs: 0, sm: 2 },
    px: { xs: 0, sm: 0, lg: 1 },
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      {backgroundName && (
        <Container
          maxWidth={false}
          sx={(theme) => ({
            opacity: 0.05,
            // @ts-expect-error MUI css variable type mismatch
            [theme.getColorSchemeSelector("dark")]: {
              opacity: 0.02,
            },
            height: "100%",
            minWidth: "100vw",
            position: "fixed",
            zIndex: -1,
          })}
        />
      )}
      {isQueryResultsPage ? (
        <QueryResultsPageContent
          maxWidth={maxWidth}
          containerStyles={containerStyles}
        >
          {children}
        </QueryResultsPageContent>
      ) : (
        <>
          <Container component="main" maxWidth={maxWidth} sx={containerStyles}>
            {children}
          </Container>
          {isLoading ? <LinearProgress /> : <Box sx={{ height: 4 }} />}
          <Footer />
        </>
      )}
    </>
  );
};
