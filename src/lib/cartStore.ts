// Backend integration point: Replace with server-side cart validation
// All prices must be recalculated server-side before Stripe PaymentIntent creation

export interface CartModifier {
  groupId: string;
  groupLabel: string;
  optionId: string;
  optionLabel: string;
  extraPrice: number; // pence
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  basePrice: number; // pence
  quantity: number;
  modifiers: CartModifier[];
  specialInstructions: string;
  image: string;
}

export function getItemTotal(item: CartItem): number {
  const modifierTotal = item.modifiers.reduce((sum, m) => sum + m.extraPrice, 0);
  return (item.basePrice + modifierTotal) * item.quantity;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0);
}

export function getCartVAT(subtotal: number, vatRate = 0.2): number {
  // VAT-inclusive pricing for UK restaurant
  // VAT = subtotal * vatRate / (1 + vatRate) for inclusive pricing
  return Math.round(subtotal * vatRate);
}

export function getCartTotal(items: CartItem[]): number {
  const subtotal = getCartSubtotal(items);
  const vat = getCartVAT(subtotal);
  return subtotal + vat;
}
function formatPrice(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: formatPrice is not implemented yet.', args);
  return null;
}

export { formatPrice };