'use client';

import { Box, Stack, Typography } from '@mui/material';

import HomeDashboard from '@/src/components/HomeDashboard';
import useWarehouse from '@/src/providers/warehouse/useWarehouse';
import Loader from '@/src/components/Loader';

export default function Home() {
  const { isLoading } = useWarehouse();

  if (isLoading) {
    return (
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', padding: 2 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', bgcolor: 'primary.main', px: 4, py: 2, borderRadius: 2, fontWeight: 700, color: 'primary.contrastText' }}>
            R
          </Typography>
          <Loader label="Loading warehouse data" />
          <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center' }}>
            Greetings! Loading Warehouse...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return <HomeDashboard />;
}
