import type { FC, PropsWithChildren } from "react";
import {
  Box,
  Breakpoint,
  Container,
  LinearProgress,
  SxProps,
} from "@mui/material";

import Footer from "./Footer";
import { QueryResultsPageContent } from "./QueryResultsPageContent";

interface Props extends PropsWithChildren {
  maxWidth?: Breakpoint | false;
  isQueryResultsPage?: boolean;
  isLoading?: boolean;
}

export const PageContainer: FC<Props> = ({
  children,
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
      {isQueryResultsPage ? (
        <QueryResultsPageContent
          maxWidth={maxWidth}
          containerStyles={containerStyles}
        >
          {children}
        </QueryResultsPageContent>
      ) : (
        <>
          <div>
            <Container
              component="main"
              maxWidth={maxWidth}
              sx={containerStyles}
            >
              {children}
            </Container>
            {isLoading ? <LinearProgress /> : <Box sx={{ height: 4 }} />}
          </div>
          <Footer />
        </>
      )}
    </>
  );
};
