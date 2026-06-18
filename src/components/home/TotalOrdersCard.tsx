'use client';

import { Box, Stack, Typography } from '@mui/material';

import { TruckIcon } from './icons';

type TotalOrdersCardProps = {
  totalOrders: number;
};

export default function TotalOrdersCard({ totalOrders }: TotalOrdersCardProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        px: { xs: 2.5, md: 3 },
        py: { xs: 2.5, md: 3 },
        minHeight: { xs: 148, md: 168 },
      }}
    >
      <Stack
        direction="row"
        sx={{
          position: 'relative',
          zIndex: 1,
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <Stack spacing={0.75} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total orders
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {totalOrders}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            successfully dispatched
          </Typography>
        </Stack>

        <Box
          aria-hidden
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: { xs: 120, md: 160 },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 88, md: 112 },
              height: { xs: 88, md: 112 },
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.14)',
              transform: 'translateX(12px)',
            }}
          >
            <TruckIcon sx={{ fontSize: { xs: 52, md: 64 }, opacity: 0.95 }} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
