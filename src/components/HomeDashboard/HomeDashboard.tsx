'use client';

import { Box, Stack } from '@mui/material';

import useWarehouse from '@/src/providers/warehouse/useWarehouse';
import DashboardHeader from '../DashboardHeader';
import QuickActions from '../QuickActions';
import RecentOrders from '../RecentOrders';
import TotalOrdersCard from '../TotalOrdersCard';

export default function HomeDashboard() {
  const { orders } = useWarehouse();

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        bgcolor: 'background.default',
        px: { xs: 2, md: 3 },
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
        <Stack spacing={3}>
          <DashboardHeader />

          <Stack direction={{ sm: 'column', md: 'row' }} sx={{ gap: 3 }}>
            <Stack spacing={3} sx={{ flex: 0.6 }}>
              <TotalOrdersCard totalOrders={orders.length} />
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <QuickActions />
              </Box>
            </Stack>

            <Stack spacing={3} sx={{ flex: 0.4 }}>
              <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                <QuickActions />
              </Box>
              <RecentOrders orders={orders} />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
