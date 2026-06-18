'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import WarehouseProvider from './warehouse/Provider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#121D99',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#99121D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7F7FB',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), Arial, Helvetica, sans-serif',
  },
});

type AppProvidersProps = {
  children: React.ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WarehouseProvider>{children}</WarehouseProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default AppProviders;
