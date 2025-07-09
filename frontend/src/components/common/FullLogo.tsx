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

export const logoSpacing = {
  p: { xs: 3, sm: 4 },
  mx: 2,
  mt: 8,
  mb: 0,
} as const;

export const FullLogo = () => {
  const materialTheme = useTheme();
  const { mode } = useColorScheme();
  const { width, height } = logoDimensions.dharmamitra;

  return (
    <Box
      sx={{
        ...logoSpacing,
        display: "grid",
        placeItems: "center",
        backgroundColor: materialTheme.palette.background.header,
        borderBottom: `1px solid ${materialTheme.palette.divider}`,
        borderRadiusTopLeft: 1,
        borderRadiusTopRight: 1,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: `${width}px`,
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <Image
          src={logoPaths.dharmamitra}
          alt="logo"
          sizes="(max-width: 600px) 90vw, 397px"
          style={{
            objectFit: "contain",
            filter: setLogoModeFilter(mode),
          }}
          fill
        />
      </Box>
    </Box>
  );
};
