'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';

import Loader from '@/src/components/Loader';
import { ArrowBackIcon } from '@/src/components/Icons';
import useWarehouse from '@/src/providers/warehouse/useWarehouse';
import { formatOrderId, formatPrice } from '@/src/utils/formatter';
import { getOrderDetails } from '@/src/utils/generator';

const statusConfig: Record<string, { label: string; bgcolor: string; color: string }> = {
  shipped: { label: 'Shipped', bgcolor: '#E8F5E9', color: '#2E7D32' },
  hold: { label: 'On Hold', bgcolor: '#FFEBEE', color: '#C62828' },
  packing: { label: 'Packing', bgcolor: '#FFF3E0', color: '#E65100' },
};

export default function OrdersPage() {
  const { orders, packages, products, isLoading } = useWarehouse();

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [orders],
  );

  if (isLoading) {
    return (
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          minHeight: 320,
          flexDirection: 'column',
        }}
      >
        <Loader label="Loading orders..." />
        <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center' }}>
          Loading orders...
        </Typography>
      </Box>
    );
  }

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
      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <IconButton
              component={Link}
              href="/"
              aria-label="Back to home"
              sx={{
                color: 'primary.main',
                bgcolor: 'primary.contrastText',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
                '&:hover': { color: 'primary.contrastText', bgcolor: 'primary.main' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Orders
            </Typography>
          </Stack>

          {sortedOrders.length === 0 ? (
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                px: 2,
                py: 4,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                No orders found.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                overflow: 'hidden',
              }}
            >
              {sortedOrders.map((order, index) => {
                const status = statusConfig[order.status] ?? {
                  label: order.status,
                  bgcolor: '#F1F5F9',
                  color: '#64748B',
                };
                const { productDescriptions, total } = getOrderDetails(
                  order.id,
                  packages,
                  products,
                );

                return (
                  <Stack
                    key={order.id}
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'start',
                      px: 2,
                      py: 2,
                      borderBottom:
                        index < sortedOrders.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {formatOrderId(order.id)}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        <ul>
                          {productDescriptions.split('|').map((item, pIndex) => (
                            <li key={pIndex}>{item}</li>
                          ))}
                        </ul>
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1 }}>
                        {formatPrice(total)}
                      </Typography>
                    </Box>

                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        flexShrink: 0,
                        fontWeight: 700,
                        bgcolor: status.bgcolor,
                        color: status.color,
                        borderRadius: 999,
                        px: 0.5,
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  </Stack>
                );
              })}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
