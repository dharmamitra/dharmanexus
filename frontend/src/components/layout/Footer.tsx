import Container from "@mui/material/Container";

export const Footer = () => {
  return (
    <Container
      maxWidth="md"
      component="footer"
      sx={{
        py: [4, 6],
        justifyContent: "flex-end",
        flexDirection: "column",
        display: "flex",
        flex: 1,
      }}
    />
  );
};
