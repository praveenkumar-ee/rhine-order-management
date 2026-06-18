import { createContext } from 'react';

import { WarehouseContextProps } from './Types';

const WarehouseContext = createContext<WarehouseContextProps>({
  orders: [],
  packages: [],
  inventories: [],
  products: [],
  isLoading: true,
});

export default WarehouseContext;