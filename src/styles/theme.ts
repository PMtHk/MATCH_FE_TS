import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3d3939',
    },
    secondary: {
      main: '#adadad',
    },
    error: {
      main: '#E63946',
    },
    warning: {
      main: '#FF9F1C',
    },
    info: {
      main: '#3D5A80',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'sans-serif',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
    ].join(','),
  },
});

export default theme;
