import Image from "next/image";
import { Box, Link } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { getBasePath } from "@utils/deployments";
import { setLogoModeFilter } from "@utils/helpers";

const dharmamitraLogo = {
  src: `${getBasePath()}/assets/logos/dm-logo-full-no-tagline.png`,
  width: 334,
  height: 334,
};

const tsadraLogo = {
  src: `${getBasePath()}/assets/logos/tsadra.png`,
  width: 180,
  height: 140,
};

const linkStyles = {
  display: "flex",
  alignItems: "flex-end",
  textDecoration: "none",
} as const;

const MitraLogoImage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "264px", lg: "324px", xl: "334px" },
        height: "auto",
      }}
    >
      <Image
        src={dharmamitraLogo.src}
        alt="Mitra Logo"
        sizes="(max-width: 1200px) 264px, (max-width: 1536px) 324px, 334px"
        width={dharmamitraLogo.width}
        height={dharmamitraLogo.height}
        style={{
          width: "100%",
          height: "auto",
        }}
        priority
      />
    </Box>
  );
};

export default function LogoBlockComponent() {
  const { mode } = useColorScheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        width: "100%",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        filter: setLogoModeFilter(mode),
      }}
    >
      <Link
        href="https://dharmamitra.org/"
        sx={linkStyles}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MitraLogoImage />
      </Link>

      <Link
        href="https://tsadra.org/"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          ...linkStyles,
          height: "auto",
          width: "100%",
          maxWidth: { xs: "140px", lg: "180px" },
        }}
      >
        <Image
          src={tsadraLogo.src}
          alt="Tsadra Foundation Logo"
          sizes="(max-width: 1200px) 140px, 180px"
          width={tsadraLogo.width}
          height={tsadraLogo.height}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Link>
    </Box>
  );
}
