import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useContext } from 'react';
import WarehouseProvider from './Provider';
import WarehouseContext from './Context';
import { Order, Package, Inventory, Product, ShipOrderItem } from './Types';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock crypto.randomUUID
const mockUUID = jest.fn();
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockUUID,
  },
});

// Mock data
const mockOrders: Order[] = [
  {
    id: 'order-1',
    status: 'pending',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'order-2',
    status: 'shipped',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
];

const mockPackages: Package[] = [
  {
    id: 'package-1',
    orderId: 'order-1',
    productId: 'product-1',
    quantity: 2,
  },
  {
    id: 'package-2',
    orderId: 'order-2',
    productId: 'product-2',
    quantity: 1,
  },
];

const mockInventories: Inventory[] = [
  {
    id: 'inventory-1',
    productId: 'product-1',
    quantity: 10,
  },
  {
    id: 'inventory-2',
    productId: 'product-2',
    quantity: 5,
  },
];

const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Product 1',
    description: 'Description 1',
    price: 10.99,
    image: 'image1.jpg',
  },
  {
    id: 'product-2',
    name: 'Product 2',
    description: 'Description 2',
    price: 20.99,
    image: 'image2.jpg',
  },
];

// Test component that consumes the context
const TestConsumer = () => {
  const context = useContext(WarehouseContext);
  
  return (
    <div>
      <div data-testid="loading">{context.isLoading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="orders-count">{context.orders.length}</div>
      <div data-testid="packages-count">{context.packages.length}</div>
      <div data-testid="inventories-count">{context.inventories.length}</div>
      <div data-testid="products-count">{context.products.length}</div>
      <button
        data-testid="ship-order-btn"
        onClick={() => context.shipOrder([{ productId: 'product-1', quantity: 2 }])}
      >
        Ship Order
      </button>
      <button
        data-testid="hold-order-btn"
        onClick={() => context.holdOrder([{ productId: 'product-2', quantity: 1 }])}
      >
        Hold Order
      </button>
    </div>
  );
};

describe('WarehouseProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Mock successful fetch responses
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ orders: mockOrders }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ packages: mockPackages }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ inventories: mockInventories }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ products: mockProducts }),
      });

    // Mock UUID generation
    mockUUID
      .mockReturnValueOnce('new-order-id')
      .mockReturnValueOnce('new-package-id-1')
      .mockReturnValueOnce('new-package-id-2');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Initial Loading', () => {
    it('should show loading state initially', () => {
      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('should fetch data from correct endpoints in development', async () => {
      process.env = {
        ...process.env,
        NODE_ENV: 'development',
      };

      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      // Fast-forward the loading delay and wait for state updates
      await act(async () => {
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/data/orders.json');
        expect(mockFetch).toHaveBeenCalledWith('/data/packages.json');
        expect(mockFetch).toHaveBeenCalledWith('/data/inventories.json');
        expect(mockFetch).toHaveBeenCalledWith('/data/products.json');
      });
    });

    it('should fetch data from correct endpoints in production', async () => {
      process.env = {
        ...process.env,
        NODE_ENV: 'production',
      };

      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      // Fast-forward the loading delay and wait for state updates
      await act(async () => {
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/rhine-order-management/data/orders.json');
        expect(mockFetch).toHaveBeenCalledWith('/rhine-order-management/data/packages.json');
        expect(mockFetch).toHaveBeenCalledWith('/rhine-order-management/data/inventories.json');
        expect(mockFetch).toHaveBeenCalledWith('/rhine-order-management/data/products.json');
      });
    });

    it('should load data and update loading state after delay', async () => {
      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      // Fast-forward the loading delay and wait for state updates
      await act(async () => {
        jest.advanceTimersByTime(3000);
        await Promise.resolve(); // Allow promises to resolve
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });

      expect(screen.getByTestId('orders-count')).toHaveTextContent('2');
      expect(screen.getByTestId('packages-count')).toHaveTextContent('2');
      expect(screen.getByTestId('inventories-count')).toHaveTextContent('2');
      expect(screen.getByTestId('products-count')).toHaveTextContent('2');
    });
  });

  describe('Data Loading', () => {
    it('should handle fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      // Fast-forward the loading delay
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // The component should still render even if fetch fails
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

      consoleSpy.mockRestore();
    });

    it('should load all data types correctly', async () => {
      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      // Fast-forward the loading delay and wait for state updates
      await act(async () => {
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });

      // Verify all data was loaded
      expect(screen.getByTestId('orders-count')).toHaveTextContent('2');
      expect(screen.getByTestId('packages-count')).toHaveTextContent('2');
      expect(screen.getByTestId('inventories-count')).toHaveTextContent('2');
      expect(screen.getByTestId('products-count')).toHaveTextContent('2');
    });
  });

  describe('Order Creation', () => {
    beforeEach(async () => {
      render(
        <WarehouseProvider>
          <TestConsumer />
        </WarehouseProvider>
      );

      // Wait for initial data load
      await act(async () => {
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });

    it('should create a shipped order with correct data', async () => {
      const shipOrderItems: ShipOrderItem[] = [
        { productId: 'product-1', quantity: 2 }
      ];

      act(() => {
        screen.getByTestId('ship-order-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('orders-count')).toHaveTextContent('3');
        expect(screen.getByTestId('packages-count')).toHaveTextContent('3');
      });

      // Verify inventory was updated (10 - 2 = 8)
      expect(screen.getByTestId('inventories-count')).toHaveTextContent('2');
    });

    it('should create a hold order with correct data', async () => {
      const holdOrderItems: ShipOrderItem[] = [
        { productId: 'product-2', quantity: 1 }
      ];

      act(() => {
        screen.getByTestId('hold-order-btn').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('orders-count')).toHaveTextContent('3');
        expect(screen.getByTestId('packages-count')).toHaveTextContent('3');
      });

      // Verify inventory was updated (5 - 1 = 4)
      expect(screen.getByTestId('inventories-count')).toHaveTextContent('2');
    });
  });

  describe('Multiple Order Items', () => {
    it('should handle orders with multiple items', async () => {
      const MultiItemTestConsumer = () => {
        const context = useContext(WarehouseContext);
        
        return (
          <div>
            <div data-testid="loading">{context.isLoading ? 'Loading' : 'Loaded'}</div>
            <div data-testid="orders-count">{context.orders.length}</div>
            <div data-testid="packages-count">{context.packages.length}</div>
            <button
              data-testid="multi-item-order-btn"
              onClick={() => context.shipOrder([
                { productId: 'product-1', quantity: 2 },
                { productId: 'product-2', quantity: 1 }
              ])}
            >
              Ship Multi-Item Order
            </button>
          </div>
        );
      };

      render(
        <WarehouseProvider>
          <MultiItemTestConsumer />
        </WarehouseProvider>
      );

      // Wait for initial data load
      await act(async () => {
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });

      // Mock UUIDs for the multi-item order
      mockUUID
        .mockReturnValueOnce('multi-order-id')
        .mockReturnValueOnce('multi-package-id-1')
        .mockReturnValueOnce('multi-package-id-2');

      act(() => {
        screen.getByTestId('multi-item-order-btn').click();
      });

      await waitFor(() => {
        // Should create 1 order with 2 packages
        expect(screen.getByTestId('orders-count')).toHaveTextContent('3');
        expect(screen.getByTestId('packages-count')).toHaveTextContent('4'); // 2 initial + 2 new
      });
    });
  });
});