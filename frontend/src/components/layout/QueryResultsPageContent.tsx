import { type FC, type PropsWithChildren, useSyncExternalStore } from "react";
import { DbViewPageHead } from "@components/db/DbViewPageHead";
import { useNullableDbRouterParams } from "@components/hooks/useDbRouterParams";
import { useSettingsDrawer } from "@components/hooks/useSettingsDrawer";
import { SidebarSuite } from "@features/SidebarSuite";
import { Main } from "@features/SidebarSuite/common/MuiStyledSidebarComponents";
import type { Breakpoint, SxProps } from "@mui/material";
import { Container, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const emptySubscribe = () => () => {};

interface Props extends PropsWithChildren {
  maxWidth: Breakpoint | false;
  containerStyles: SxProps;
}
export const QueryResultsPageContent: FC<Props> = ({
  children,
  maxWidth,
  containerStyles,
}) => {
  const { fileName } = useNullableDbRouterParams();
  const { isSettingsOpen } = useSettingsDrawer();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Prevents layout shift issue on initial render
  if (!isMounted) {
    return (
      <main style={{ height: "100%" }}>
        <Typography component="h1" sx={visuallyHidden}>
          {fileName}
        </Typography>
      </main>
    );
  }

  return (
    <Main open={isSettingsOpen}>
      <Container
        maxWidth={maxWidth}
        sx={{ minHeight: "calc(100vh - 100px)", ...containerStyles }}
      >
        {fileName ? <DbViewPageHead /> : null}
        {children}
      </Container>
      <SidebarSuite />
    </Main>
  );
};
