'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import WarehouseProvider from './warehouse/Provider';

const theme = createTheme();

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
