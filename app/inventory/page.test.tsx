import { Inventory, Product } from '@/src/providers/warehouse/Types';
import InventoryPage from './page';
import { render } from '@testing-library/react';

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
let mockIsLoading = false;
jest.mock('@/src/providers/warehouse/useWarehouse', () => () => ({
  inventories: mockInventories,
  products: mockProducts,
  isLoading: mockIsLoading,
}));

describe('inventory/page', () => {
  it('should show loading state', () => {
    mockIsLoading = true;
    const { queryByText } = render(<InventoryPage />);
    expect(queryByText('Loading inventory...')).not.toBeNull();
  });

  it('should show the list of inventory items', () => {
    mockIsLoading = false;
    const { queryByText } = render(<InventoryPage />);

    mockInventories.forEach((item) => {
      const product = mockProducts.find((p) => p.id === item.productId);
      expect(queryByText(product?.name || '')).not.toBeNull();
      expect(queryByText(`Qty: ${item.quantity}`)).not.toBeNull();
    });
  });
});
