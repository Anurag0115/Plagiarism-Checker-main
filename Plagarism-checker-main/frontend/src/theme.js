// src/theme.js

import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    // ... your other palette settings
  },
  // Add this 'components' section
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f4f6f8' : '#121212',
        }
      }
    }
  }
});

export default createAppTheme;