import { Product, Inventory, Package } from '../providers/warehouse/Types';

export type PackingItem = {
  id: string;
  productId: string;
  quantity: number;
  confirmed: boolean;
};

export function generatePackingOrder(products: Product[], inventories: Inventory[]): PackingItem[] {
  const available = inventories
    .filter((inventory) => inventory.quantity > 0)
    .map((inventory) => ({
      inventory,
      product: products.find((entry) => entry.id === inventory.productId),
    }))
    .filter(
      (entry): entry is { inventory: Inventory; product: Product } => Boolean(entry.product),
    );

  if (available.length === 0) return [];

  const itemCount = Math.min(available.length, Math.floor(Math.random() * 4) + 1);
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, itemCount).map(({ inventory, product }) => ({
    id: crypto.randomUUID(),
    productId: product.id,
    quantity: Math.min(inventory.quantity, Math.random() < 0.5 ? 1 : 2),
    confirmed: false,
  }));
}

export function getOrderDetails(orderId: string, packages: Package[], products: Product[]) {
  const orderPackages = packages.filter((pkg) => pkg.orderId === orderId);

  const productDescriptions = orderPackages.map((pkg) => {
    const product = products.find((entry) => entry.id === pkg.productId);
    const name = product?.name ?? 'Unknown product';
    return `${name} * ${pkg.quantity}`;
  });

  const total = orderPackages.reduce((sum, pkg) => {
    const product = products.find((entry) => entry.id === pkg.productId);
    return sum + (product?.price ?? 0) * pkg.quantity;
  }, 0);

  return {
    productDescriptions: productDescriptions.join('|'),
    total,
  };
}
