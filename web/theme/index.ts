import { createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ca5b33",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: 'sohne, "Helvetica Neue", 6Helvetica, Arial, sans-serif',
    h3: {
      fontWeight: 200,
    },
    h4: {
      fontWeight: 700,
    },
    body2: {
      color: "#757575",
    },
    caption: {
      color: "#757575",
    },
  },
});

export default theme;
