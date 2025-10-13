import React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";
import { getBasePath } from "@utils/deployments";
import { setLogoModeFilter } from "@utils/helpers";
import { Deployment } from "src/types/index";

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
  const { mode } = useColorScheme();
  const { width, height } = logoDimensions.dharmamitra;

  return (
    <Box
      sx={{
        ...logoSpacing,
        display: "grid",
        placeItems: "center",
        backgroundColor: "background.header",
        borderBottom: "1px solid",
        borderBottomColor: "divider",
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
