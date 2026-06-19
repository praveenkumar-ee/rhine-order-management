import { render } from '@testing-library/react';
import OrdersPage from './page';
import { Order, Package, Product } from '@/src/providers/warehouse/Types';

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
let mockIsLoading = false;
jest.mock('@/src/providers/warehouse/useWarehouse', () => () => ({
  orders: mockOrders,
  packages: mockPackages,
  products: mockProducts,
  isLoading: mockIsLoading,
}));

describe('orders/page', () => {
  it('show the loading state', () => {
    render(<OrdersPage />);
  });

  it('should show the loading state when isLoading is true', () => {
    mockIsLoading = true;

    const { queryByText } = render(<OrdersPage />);

    expect(queryByText('Loading orders...')).not.toBeNull();
  });

  it('should show the list of the orders', () => {
    mockIsLoading = false;
    const { queryByText } = render(<OrdersPage />);

    expect(queryByText('#ORDER-1')).not.toBeNull();
    expect(queryByText('#ORDER-2')).not.toBeNull();
  });
});
