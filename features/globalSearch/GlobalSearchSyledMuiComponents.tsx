import type { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

interface AppTopBarSearchBoxWrapperProps extends BoxProps {
  isOpen: boolean;
}

interface SearchBoxInputProps {
  isNarrow?: boolean;
}

export const AppTopBarSearchBoxWrapper = styled(
  "form"
)<AppTopBarSearchBoxWrapperProps>(({ theme, isOpen }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
  transform: `scaleX(${isOpen ? 1 : 0})`,
  transformOrigin: "left",
  opacity: `${isOpen ? 1 : 0}`,
  transition: `${
    isOpen ? "transform 200ms, opacity 100ms" : "transform 200ms, opacity 500ms"
  }`,
  overflow: "hidden",
}));

export const SearchBoxWrapper = styled("form")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `${theme.palette.primary.main} 1px solid`,
}));

export const SearchBoxInput = styled(TextField)<SearchBoxInputProps>(
  ({ theme, isNarrow }) => ({
    "& .MuiOutlinedInput-root": {
      padding: "0px",
      "& input": {
        padding: `${isNarrow ? "12px" : theme.spacing(2)}`,
      },
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
  })
);
