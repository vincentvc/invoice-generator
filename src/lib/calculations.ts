import { LineItem, TaxEntry, DiscountType } from '@/types/invoice';

export function calcLineItemAmount(quantity: number, rate: number): number {
  return Math.round(quantity * rate * 100) / 100;
}

export function calcSubtotal(items: LineItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
}

export function calcItemTax(items: LineItem[]): number {
  return Math.round(
    items.reduce((sum, item) => {
      if (item.taxRate && item.taxRate > 0) {
        return sum + (item.amount * item.taxRate) / 100;
      }
      return sum;
    }, 0) * 100
  ) / 100;
}

export function calcTaxAmount(subtotal: number, taxes: TaxEntry[]): number {
  return Math.round(
    taxes.reduce((sum, tax) => {
      if (tax.type === 'percentage') {
        return sum + (subtotal * tax.rate) / 100;
      }
      return sum + tax.rate;
    }, 0) * 100
  ) / 100;
}

export function calcDiscountAmount(
  subtotal: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountValue <= 0) return 0;
  if (discountType === 'percentage') {
    return Math.round((subtotal * discountValue) / 100 * 100) / 100;
  }
  return Math.round(discountValue * 100) / 100;
}

export function calcTotal(
  subtotal: number,
  taxAmount: number,
  itemTax: number,
  discountAmount: number,
  shipping: number
): number {
  return Math.round((subtotal + taxAmount + itemTax - discountAmount + shipping) * 100) / 100;
}
