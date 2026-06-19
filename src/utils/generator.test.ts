import { Inventory, Product } from "../providers/warehouse/Types";
import { generatePackingOrder } from "./generator";

describe('generator', () => {
  describe('generatePackingOrder', () => {
    it('should generate a packing order with valid products and inventories', () => {
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

      const packingOrder = generatePackingOrder(mockProducts, mockInventories);
      expect(packingOrder.length).toBeGreaterThan(0);
      packingOrder.forEach((item) => {
        expect(mockProducts.some((p) => p.id === item.productId)).toBe(true);
        expect(item.quantity).toBeGreaterThan(0);
        expect(item.confirmed).toBe(false);
      });
    });    
  });
});
