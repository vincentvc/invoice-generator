import type { LineItem, TaxConfig, DiscountConfig, ShippingConfig } from '@/types/invoice';

export function calculateLineItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100;
}

export function calculateSubtotal(items: readonly LineItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateTaxAmount(subtotal: number, tax: TaxConfig): number {
  if (!tax.enabled || tax.value <= 0) return 0;
  if (tax.type === 'percentage') {
    return Math.round(subtotal * (tax.value / 100) * 100) / 100;
  }
  return tax.value;
}

export function calculateDiscountAmount(
  subtotal: number,
  discount: DiscountConfig
): number {
  if (!discount.enabled || discount.value <= 0) return 0;
  if (discount.type === 'percentage') {
    return Math.round(subtotal * (discount.value / 100) * 100) / 100;
  }
  return discount.value;
}

export function calculateTotal(
  subtotal: number,
  tax1Amount: number,
  tax2Amount: number,
  discountAmount: number,
  shipping: ShippingConfig
): number {
  const shippingAmount = shipping.enabled ? shipping.amount : 0;
  return Math.round((subtotal + tax1Amount + tax2Amount - discountAmount + shippingAmount) * 100) / 100;
}

export function calculateInvoiceTotals(
  items: readonly LineItem[],
  tax: TaxConfig,
  tax2: TaxConfig,
  discount: DiscountConfig,
  shipping: ShippingConfig
) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscountAmount(subtotal, discount);
  const taxableAmount = subtotal - discountAmount;
  const tax1Amount = calculateTaxAmount(taxableAmount, tax);
  const tax2Amount = calculateTaxAmount(taxableAmount, tax2);
  const total = calculateTotal(subtotal, tax1Amount, tax2Amount, discountAmount, shipping);

  return {
    subtotal,
    totalTax: tax1Amount + tax2Amount,
    totalDiscount: discountAmount,
    total,
  };
}
