import React from "react";
import Image from "next/image";
import { Link } from "@components/common/Link";
import { MITRA_URL } from "@mitra/constants";
import { getBasePath } from "@mitra/utils";
import { Box, Link as MuiLink, useTheme } from "@mui/material";
import imgMitraLogo from "@public/assets/logos/dm-logo-flat.png";

const logoWidePaths: Record<Deployment, string> = {
  dharmamitra: "/assets/logos/dn-logo-title.png",
  kumarajiva: "/assets/logos/kp-logo-full.png",
};

export const LogoBlock = () => {
  const materialTheme = useTheme();

  return (
    <Box>
      <MuiLink
        sx={{
          display: "block",
          height: "28px",
        }}
        href={MITRA_URL}
        underline="none"
      >
        <Image
          src={imgMitraLogo.src}
          alt="DharmaMitra logo"
          width={80}
          height={24}
        />
      </MuiLink>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          grow: 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Link
          color="inherit"
          sx={{
            display: "block",
          }}
          href="/"
          underline="none"
        >
          <Box
            component="img"
            src={getBasePath() + logoWidePaths.dharmamitra}
            sx={{
              height: 24,
              width: "auto",
              [materialTheme.breakpoints.down("sm")]: {
                height: 20,
              },
            }}
            alt="logo"
          />
        </Link>
      </Box>
    </Box>
  );
};
