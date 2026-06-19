'use client';

import { getGreeting } from '@/src/utils/greetings';
import { Avatar, Box, Stack, Typography } from '@mui/material';

export default function DashboardHeader() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Avatar
          alt="Warehouse operative"
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'secondary.main',
            fontSize: '1rem',
            fontWeight: 700,
          }}
        >
          U
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Hi, User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getGreeting()}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
