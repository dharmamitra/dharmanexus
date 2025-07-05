import React from "react";
import Image from "next/image";
import { getBasePath } from "@mitra/utils";
import { Box, useColorScheme, useTheme } from "@mui/material";
import { setLogoModeFilter } from "@utils/helpers";

const logoPaths: Record<Deployment, string> = {
  dharmamitra: `${getBasePath()}/assets/logos/dn-logo-full.png`,
  kumarajiva: `${getBasePath()}/assets/logos/kp-logo-full.png`,
};

export const logoDimensions: Record<
  Deployment,
  { width: number; height: number }
> = {
  dharmamitra: { width: 397, height: 334 },
  kumarajiva: { width: 392, height: 216 },
};

export const FullLogo = () => {
  const materialTheme = useTheme();
  const { mode } = useColorScheme();

  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        p: { xs: 3, sm: 4 },
        mx: { xs: 2, sm: 0 },
        mt: 8,
        mb: 0,
        backgroundColor: materialTheme.palette.background.header,
        borderBottom: `1px solid ${materialTheme.palette.divider}`,
        borderRadiusTopLeft: 1,
        borderRadiusTopRights: 1,
      }}
    >
      <Image
        src={logoPaths.dharmamitra}
        alt="logo"
        {...logoDimensions.dharmamitra}
        style={{ filter: setLogoModeFilter(mode) }}
      />
    </Box>
  );
};
