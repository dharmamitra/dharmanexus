import type { FC, PropsWithChildren } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Breakpoint,
  Container,
  LinearProgress,
  SxProps,
} from "@mui/material";

import { QueryResultsPageContent } from "./QueryResultsPageContent";

const Footer = dynamic(
  () => import("./Footer").then((module) => module.Footer),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: "100%",
          py: 6,
          px: { xs: 3, md: 4 },
          mt: { xs: 3, md: 10 },
          bgcolor: "accent",
        }}
        component="footer"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ minHeight: 100 }} />
        </Box>
      </Box>
    ),
  },
);

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
