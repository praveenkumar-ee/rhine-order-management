'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { ArrowBackIcon } from '@/src/components/home/icons';
import useWarehouse from '@/src/providers/warehouse/useWarehouse';

export default function InventoryPage() {
  const { inventories, products } = useWarehouse();
  const [search, setSearch] = useState('');

  const inventoryItems = useMemo(
    () =>
      inventories
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          return { item, product };
        })
        .filter(({ product }) => {
          if (!product) return true;
          const query = search.trim().toLowerCase();
          if (!query) return true;

          return (
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
          );
        }),
    [inventories, products, search],
  );

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
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
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
              Inventory
            </Typography>
          </Stack>

          <TextField
            fullWidth
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary" sx={{ pl: 0.5, fontSize: 40 }}>
                      ⌕
                    </Typography>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 999,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
                },
              },
            }}
          />

          {inventoryItems.length === 0 ? (
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
                No products match your search.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {inventoryItems.map(({ item, product }) => (
                <Box
                  key={item.id}
                  sx={{
                    bgcolor: '#F0F0F4',
                    borderRadius: 4,
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      minHeight: { xs: 180, md: 200 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                    }}
                  >
                    {product?.image ? (
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 160,
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No image
                      </Typography>
                    )}
                  </Box>

                  <Stack spacing={1} sx={{ px: 0.5, pb: 0.5, flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product?.name ?? 'Unknown product'}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '3em',
                      }}
                      aria-label={product?.description}
                    >
                      {product?.description ?? 'No description available.'}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: 'secondary.main', mt: 'auto' }}
                    >
                      Qty: {item.quantity}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
