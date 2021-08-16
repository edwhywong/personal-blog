import { createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: 'sohne, "Helvetica Neue", 6Helvetica, Arial, sans-serif',
    h3: {
      fontWeight: 200,
    },
  },
});

export default theme;
