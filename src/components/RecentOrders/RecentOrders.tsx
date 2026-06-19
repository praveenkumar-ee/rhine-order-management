'use client';

import { Box, Stack, Typography } from '@mui/material';

import type { Order } from '@/src/providers/warehouse/Types';
import { ChevronRightIcon, OrdersBoxIcon } from '../Icons';
import { formatDate, formatOrderId } from '@/src/utils/formatter';

type RecentOrdersProps = {
  orders: Order[];
};

const statusStyles: Record<string, { label: string; color: string }> = {
  hold: { label: 'On Hold', color: '#d32f2f' },
  packing: { label: 'Packing', color: '#ed6c02' },
  shipped: { label: 'Shipped', color: '#2e7d32' },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Recent Orders
        </Typography>
        <Typography
          component="span"
          variant="body2"
          sx={{ color: 'secondary.main', fontWeight: 600, cursor: 'pointer' }}
        >
          See all
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {recentOrders.length === 0 ? (
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              px: 2,
              py: 3,
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              No orders yet.
            </Typography>
          </Box>
        ) : (
          recentOrders.map((order) => {
            const status = statusStyles[order.status] ?? {
              label: order.status,
              color: '#64748B',
            };

            return (
              <Stack
                key={order.id}
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                  px: 2,
                  py: 1.75,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: '#F2F2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <OrdersBoxIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {formatOrderId(order.id)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    Updated {formatDate(order.updatedAt)}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={0.25}
                  sx={{ flexShrink: 0, alignItems: 'center' }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: status.color, fontWeight: 700, textTransform: 'capitalize' }}
                  >
                    {status.label}
                  </Typography>
                  <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </Stack>
              </Stack>
            );
          })
        )}
      </Stack>
    </Box>
  );
}
