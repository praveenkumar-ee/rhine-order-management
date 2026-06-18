'use client';

import { Box, Stack, Typography } from '@mui/material';

import useWarehouse from '@/src/providers/warehouse/useWarehouse';
import { Loader } from './style';

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
          <Loader aria-label="Loading warehouse data" />
          <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center' }}>
            Morning from Rhine. I&lsquo;m loading the warehouse data...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return null;
}
