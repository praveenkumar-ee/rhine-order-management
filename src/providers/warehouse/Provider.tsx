'use client';

import { useEffect, useState } from 'react';

import {
  Order,
  Package,
  Inventory,
  Product,
  ShipOrderItem,
  WarehouseProviderProps,
} from './Types';
import WarehouseContext from './Context';

const WarehouseProvider = ({ children }: WarehouseProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loadingDelay = new Promise<void>((resolve) => {
        setTimeout(resolve, 3000);
      });

      const dataPromise = (async () => {
        const [ordersRes, packagesRes, inventoriesRes, productsRes] = await Promise.all([
          fetch('/data/orders.json'),
          fetch('/data/packages.json'),
          fetch('/data/inventories.json'),
          fetch('/data/products.json'),
        ]);

        const [ordersData, packagesData, inventoriesData, productsData] = await Promise.all([
          ordersRes.json(),
          packagesRes.json(),
          inventoriesRes.json(),
          productsRes.json(),
        ]);

        return {
          orders: ordersData.orders,
          packages: packagesData.packages,
          inventories: inventoriesData.inventories,
          products: productsData.products,
        };
      })();

      const [data] = await Promise.all([dataPromise, loadingDelay]);

      setOrders(data.orders);
      setPackages(data.packages);
      setInventories(data.inventories);
      setProducts(data.products);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const createOrder = (items: ShipOrderItem[], status: string) => {
    const now = new Date().toISOString();
    const orderId = crypto.randomUUID();

    const newOrder: Order = {
      id: orderId,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const newPackages: Package[] = items.map((item) => ({
      id: crypto.randomUUID(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
    }));

    setOrders((previous) => [...previous, newOrder]);
    setPackages((previous) => [...previous, ...newPackages]);
    setInventories((previous) =>
      previous.map((inventory) => {
        const packedItem = items.find((item) => item.productId === inventory.productId);
        if (!packedItem) return inventory;

        return {
          ...inventory,
          quantity: Math.max(0, inventory.quantity - packedItem.quantity),
        };
      }),
    );
  };

  const shipOrder = (items: ShipOrderItem[]) => createOrder(items, 'shipped');
  const holdOrder = (items: ShipOrderItem[]) => createOrder(items, 'hold');

  return (
    <WarehouseContext.Provider value={{
      orders,
      packages,
      inventories,
      products,
      isLoading,
      shipOrder,
      holdOrder,
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseProvider;