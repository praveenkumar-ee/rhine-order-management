export type WarehouseProviderProps = {
  children: React.ReactNode;
};

export type Order = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Package = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
};

export type Inventory = {
  id: string;
  productId: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type ShipOrderItem = {
  productId: string;
  quantity: number;
};

export type WarehouseContextProps = {
  orders: Order[];
  packages: Package[];
  inventories: Inventory[];
  products: Product[];
  isLoading: boolean;
  shipOrder: (items: ShipOrderItem[]) => void;
  holdOrder: (items: ShipOrderItem[]) => void;
};
