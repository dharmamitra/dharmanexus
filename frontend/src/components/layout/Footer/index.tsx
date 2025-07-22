import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Credit from "./Credit";
import LogoBlock from "./LogoBlock";
import Socials from "./Socials";

export function Footer() {
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
        <Credit />
        <Socials />
      </Box>
    </Box>
  );
}
