import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, IconButton, SxProps } from "@mui/material";

const URLS = {
  email: "mailto:dharmamitra.project@gmail.com",
  github: "https://github.com/dharmamitra",
  youtube: "https://www.youtube.com/@dharmamitra_ucb",
  x: "https://x.com/dharmamitra_ucb",
  facebook:
    "https://www.facebook.com/people/Dharmamitra-Project/61578013388240/",
};

const Socials = ({ sx }: { sx?: SxProps }) => {
  return (
    <Box sx={{ display: "flex", gap: 1, ...sx }}>
      <IconButton href={URLS.email} target="_blank" rel="noopener noreferrer">
        <AlternateEmailIcon />
      </IconButton>
      <IconButton href={URLS.github} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
      </IconButton>
      <IconButton href={URLS.youtube} target="_blank" rel="noopener noreferrer">
        <YouTubeIcon />
      </IconButton>
      <IconButton href={URLS.x} target="_blank" rel="noopener noreferrer">
        <XIcon />
      </IconButton>
      <IconButton
        href={URLS.facebook}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon />
      </IconButton>
    </Box>
  );
};

export default Socials;
