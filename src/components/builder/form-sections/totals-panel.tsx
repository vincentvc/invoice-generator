'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useInvoiceStore } from '@/stores/invoice-store';
import { formatCurrency } from '@/lib/currencies';
import {
  calcSubtotal,
  calcTaxAmount,
  calcItemTax,
  calcDiscountAmount,
  calcTotal,
} from '@/lib/calculations';

export function TotalsPanel() {
  const invoice = useInvoiceStore((s) => s.invoice);
  const addTax = useInvoiceStore((s) => s.addTax);
  const removeTax = useInvoiceStore((s) => s.removeTax);
  const updateTax = useInvoiceStore((s) => s.updateTax);
  const setDiscountType = useInvoiceStore((s) => s.setDiscountType);
  const setDiscountValue = useInvoiceStore((s) => s.setDiscountValue);
  const updateField = useInvoiceStore((s) => s.updateField);

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(
    subtotal,
    invoice.discountType,
    invoice.discountValue
  );
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal, invoice.currency)}</span>
      </div>

      {/* Taxes */}
      <div className="space-y-2">
        {invoice.taxes.map((tax) => (
          <div key={tax.id} className="flex items-center gap-2">
            <Input
              placeholder="Tax name"
              value={tax.name}
              onChange={(e) => updateTax(tax.id, 'name', e.target.value)}
              className="h-8 text-xs flex-1"
            />
            <Input
              type="number"
              placeholder="Rate"
              value={tax.rate || ''}
              onChange={(e) => updateTax(tax.id, 'rate', parseFloat(e.target.value) || 0)}
              className="h-8 text-xs w-20"
            />
            <Select
              value={tax.type}
              onValueChange={(val) => updateTax(tax.id, 'type', val)}
            >
              <SelectTrigger className="h-8 text-xs w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">%</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeTax(tax.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={addTax}>
          <Plus className="mr-1 h-3 w-3" />
          Add Tax
        </Button>
      </div>

      {(taxAmount > 0 || itemTax > 0) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">
            {formatCurrency(taxAmount + itemTax, invoice.currency)}
          </span>
        </div>
      )}

      {/* Discount */}
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground whitespace-nowrap">Discount</Label>
        <Input
          type="number"
          placeholder="0"
          value={invoice.discountValue || ''}
          onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
          className="h-8 text-xs w-20"
        />
        <Select
          value={invoice.discountType}
          onValueChange={(val) => setDiscountType(val as 'percentage' | 'flat')}
        >
          <SelectTrigger className="h-8 text-xs w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">%</SelectItem>
            <SelectItem value="flat">Flat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {discountAmount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span className="font-medium text-destructive">
            -{formatCurrency(discountAmount, invoice.currency)}
          </span>
        </div>
      )}

      {/* Shipping */}
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground whitespace-nowrap">Shipping</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={invoice.shipping || ''}
          onChange={(e) => updateField('shipping', parseFloat(e.target.value) || 0)}
          className="h-8 text-xs w-24"
        />
      </div>

      {invoice.shipping > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {formatCurrency(invoice.shipping, invoice.currency)}
          </span>
        </div>
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-foreground">Total</span>
        <span className="font-heading text-xl font-bold text-accent">
          {formatCurrency(total, invoice.currency)}
        </span>
      </div>
    </div>
  );
}
