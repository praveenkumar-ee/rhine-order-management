'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import { ArrowBackIcon } from '@/src/components/Icons';
import useWarehouse from '@/src/providers/warehouse/useWarehouse';
import Loader from '@/src/components/Loader';
import { formatPrice } from '@/src/utils/formatter';
import { generatePackingOrder, PackingItem } from '@/src/utils/generator';

type OrderAction = 'shipped' | 'hold' | null;

export default function PackingPage() {
  const router = useRouter();
  const { products, inventories, isLoading, shipOrder, holdOrder } = useWarehouse();
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [orderGenerated, setOrderGenerated] = useState(false);
  const [orderAction, setOrderAction] = useState<OrderAction>(null);

  useEffect(() => {
    if (!isLoading && !orderGenerated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPackingItems(generatePackingOrder(products, inventories));
      setOrderGenerated(true);
    }
  }, [isLoading, orderGenerated, products, inventories]);

  useEffect(() => {
    if (!orderAction) return;

    const timeoutId = window.setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [orderAction, router]);

  const allConfirmed = packingItems.length > 0 && packingItems.every((item) => item.confirmed);
  const totalQuantity = useMemo(
    () => packingItems.reduce((sum, item) => sum + item.quantity, 0),
    [packingItems],
  );

  const handleConfirm = (itemId: string) => {
    setPackingItems((previous) =>
      previous.map((item) =>
        item.id === itemId ? { ...item, confirmed: true } : item,
      ),
    );
  };

  const orderItems = packingItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const isCompleted = orderAction !== null;

  const handleProceed = () => {
    if (!allConfirmed || isCompleted) return;

    shipOrder(orderItems);
    setOrderAction('shipped');
  };

  const handleHold = () => {
    if (!allConfirmed || isCompleted) return;

    holdOrder(orderItems);
    setOrderAction('hold');
  };

  if (isLoading || !orderGenerated) {
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
        <Loader label="Generating a new package..." />
        <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center' }}>
          Hold on! Generating a new package...
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
        pb: { xs: 12, md: 14 },
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
              Start Packing
            </Typography>
          </Stack>

          {isCompleted && (
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'success.contrastText',
                borderRadius: 3,
                px: 2,
                py: 1.5,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
                Order complete! Redirecting to home page in 3 seconds
              </Typography>
            </Box>
          )}

          {packingItems.length === 0 ? (
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
                No inventory available to pack right now.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {packingItems.map((item) => {
                const product = products.find((entry) => entry.id === item.productId);

                return (
                  <Box
                    key={item.id}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 4,
                      p: 1.5,
                      display: 'flex',
                      gap: 1.5,
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: 108,
                        minWidth: 108,
                        height: 108,
                        bgcolor: '#F0F0F4',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                      }}
                    >
                      {product?.image ? (
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No image
                        </Typography>
                      )}
                    </Box>

                    <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, pr: 10 }}>
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
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product?.description ?? 'No description available.'}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                        <Chip
                          label={`Qty ${item.quantity}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(18, 29, 153, 0.1)',
                            color: 'primary.main',
                            fontWeight: 600,
                            height: 24,
                          }}
                        />
                      </Stack>

                      {product && (
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {formatPrice(product.price)}
                        </Typography>
                      )}
                    </Stack>

                    <Button
                      onClick={() => handleConfirm(item.id)}
                      disabled={item.confirmed || isCompleted}
                      aria-label={item.confirmed ? 'Product added' : 'Confirm product'}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        minWidth: 108,
                        borderRadius: '20px 0 20px 0',
                        bgcolor: item.confirmed ? 'success.main' : 'secondary.main',
                        color: 'secondary.contrastText',
                        fontWeight: 700,
                        fontSize: 12,
                        px: 1.5,
                        py: 1.25,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: item.confirmed ? 'success.dark' : 'secondary.dark',
                        },
                        '&.Mui-disabled': {
                          bgcolor: item.confirmed ? 'success.main' : undefined,
                          color: item.confirmed ? 'primary.contrastText' : undefined,
                          opacity: item.confirmed ? 1 : undefined,
                        },
                      }}
                    >
                      {item.confirmed ? 'Added' : 'Confirm product'}
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Box>

      {packingItems.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            px: { xs: 2, md: 3 },
            py: 2,
            boxShadow: '0 -8px 24px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Box
            sx={{
              maxWidth: 720,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {packingItems.filter((item) => item.confirmed).length}/{packingItems.length} confirmed
              · {totalQuantity} item{totalQuantity === 1 ? '' : 's'}
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="secondary"
                disabled={!allConfirmed || isCompleted}
                onClick={handleHold}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.25,
                  fontWeight: 700,
                  textTransform: 'none',
                  minWidth: 120,
                }}
              >
                {orderAction === 'hold' ? 'On hold' : 'Hold'}
              </Button>

              <Button
                variant="contained"
                disabled={!allConfirmed || isCompleted}
                onClick={handleProceed}
                sx={{
                  borderRadius: 999,
                  px: 4,
                  py: 1.25,
                  fontWeight: 700,
                  textTransform: 'none',
                  minWidth: 160,
                }}
              >
                {orderAction === 'shipped' ? 'Shipped' : 'Proceed'}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
