import { createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f98f45",
      contrastText: "#ffffff",
    },
    text: {
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: 'sohne, "Helvetica Neue", 6Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    body2: {
      color: "#757575",
      fontSize: "1rem",
    },
    caption: {
      color: "#757575",
    },
  },
});

export default theme;
