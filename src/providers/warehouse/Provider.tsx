'use client';

import { useEffect, useState } from 'react';

import { Order, Package, Inventory, Product, WarehouseProviderProps } from './Types';
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

  return (
    <WarehouseContext.Provider value={{
      orders,
      packages,
      inventories,
      products,
      isLoading,
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export default WarehouseProvider;