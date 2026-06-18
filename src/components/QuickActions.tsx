'use client';

import Link from 'next/link';
import { Box, Stack, Typography } from '@mui/material';
import type { ElementType } from 'react';

import { BellIcon, InventoryIcon, PackageIcon, TruckIcon } from './Icons';

type QuickAction = {
  label: string;
  href: string;
  icon: ElementType<{ sx?: object }>;
  disabled?: boolean;
};

const actions: QuickAction[] = [
  { label: 'Inventory', href: '/inventory', icon: InventoryIcon },
  { label: 'Start Packing', href: '/packing', icon: PackageIcon },
  { label: 'Orders', href: '/orders', icon: TruckIcon },
  { label: 'Notify Me!', href: '#', icon: BellIcon, disabled: true },
];

export default function QuickActions() {
  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Quick Actions
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: { xs: 'column', lg: 'row' },
          gridAutoColumns: { xs: 'minmax(108px, 1fr)', lg: 'unset' },
          gridTemplateColumns: { lg: 'repeat(4, minmax(0, 1fr))' },
          gap: 1.5,
          overflowX: { xs: 'auto', lg: 'visible' },
          pb: { xs: 0.5, lg: 0 },
          mx: { xs: -0.5, lg: 0 },
          px: { xs: 0.5, lg: 0 },
          scrollSnapType: { xs: 'x mandatory', lg: 'none' },
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {actions.map(({ label, href, icon: Icon, disabled }) => (
          <Box
            key={label}
            component={href === '#' ? 'div' : Link}
            href={href === '#' ? undefined : href}
            sx={{
              scrollSnapAlign: 'start',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Stack
              spacing={1.25}
              sx={{
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: 3,
                px: 1.5,
                py: 2,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                cursor: disabled ? 'default' : 'pointer',
                '&:hover': href === '#'
                  ? undefined
                  : {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.1)',
                    },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: disabled ? '#777': 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <Icon sx={{ fontSize: 24 }} />
              </Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}
              >
                {label}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
