import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import LogoBlock from "./LogoBlock";
import Statements from "./Statements";

export default function Footer() {
  const materialTheme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        py: 6,
        px: { xs: 3, md: 4 },
        mt: { xs: 3, md: 10 },
        bgcolor: materialTheme.palette.background.accent,
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
        <LogoBlock />
        <Statements />
      </Box>
    </Box>
  );
}
