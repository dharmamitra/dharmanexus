import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { selectedBg, selectedHoverBg } from "@theme/utils";

export const NodeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  flex: 1,
  height: "100%",
  display: "flex",
  alignItems: "center",
  fontSize: 16,
  ...(isSelected && {
    backgroundColor: selectedBg(theme),
    fontWeight: 500,
  }),
  "&:hover": {
    backgroundColor: selectedHoverBg({ theme }),
    fontWeight: 500,
  },
}));

export const RowBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export const TextNameTypography = styled(Typography)({
  overflow: "clip",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "inherit",
});

export const NodeLabelsBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  width: "100%",
});
