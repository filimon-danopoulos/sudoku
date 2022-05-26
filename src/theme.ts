import { createMuiTheme } from '@material-ui/core/styles';

const theme = (nightMode: boolean) => {
  return createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      type: nightMode ? 'dark' : 'light',
      primary: {
        main: '#424242',
      },
      secondary: {
        main: '#616161',
      },
    },
  });
};

export default theme;
