'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { formatCurrency } from '@/lib/currencies';
import type { TaxConfig, DiscountConfig, ShippingConfig } from '@/types/invoice';

interface TaxCalculatorProps {
  subtotal: number;
  tax: TaxConfig;
  tax2: TaxConfig;
  discount: DiscountConfig;
  shipping: ShippingConfig;
  totalTax: number;
  totalDiscount: number;
  total: number;
  currency: string;
  onUpdateTax: (taxField: 'tax' | 'tax2', field: keyof TaxConfig, value: TaxConfig[keyof TaxConfig]) => void;
  onUpdateDiscount: (field: keyof DiscountConfig, value: DiscountConfig[keyof DiscountConfig]) => void;
  onUpdateShipping: (field: keyof ShippingConfig, value: ShippingConfig[keyof ShippingConfig]) => void;
}

export function TaxCalculator({
  subtotal,
  tax,
  tax2,
  discount,
  shipping,
  totalTax,
  totalDiscount,
  total,
  currency,
  onUpdateTax,
  onUpdateDiscount,
  onUpdateShipping,
}: TaxCalculatorProps) {
  return (
    <div className="space-y-3 pt-4 border-t">
      {/* Subtotal */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
      </div>

      {/* Discount */}
      {discount.enabled ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">Discount</span>
          <div className="flex items-center gap-1 ml-auto">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={discount.value || ''}
              onChange={(e) => onUpdateDiscount('value', parseFloat(e.target.value) || 0)}
              className="h-8 w-20 text-right"
            />
            <Select
              value={discount.type}
              onValueChange={(v) => onUpdateDiscount('type', v as 'percentage' | 'flat')}
            >
              <SelectTrigger className="h-8 w-16">
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
              className="h-8 w-8 text-destructive"
              onClick={() => onUpdateDiscount('enabled', false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : null}

      {totalDiscount > 0 && (
        <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
          <span>Discount</span>
          <span>-{formatCurrency(totalDiscount, currency)}</span>
        </div>
      )}

      {/* Tax 1 */}
      {tax.enabled ? (
        <div className="flex items-center gap-2">
          <Input
            value={tax.label}
            onChange={(e) => onUpdateTax('tax', 'label', e.target.value)}
            className="h-8 w-24 text-sm"
            placeholder="Tax"
          />
          <div className="flex items-center gap-1 ml-auto">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={tax.value || ''}
              onChange={(e) => onUpdateTax('tax', 'value', parseFloat(e.target.value) || 0)}
              className="h-8 w-20 text-right"
            />
            <Select
              value={tax.type}
              onValueChange={(v) => onUpdateTax('tax', 'type', v as 'percentage' | 'flat')}
            >
              <SelectTrigger className="h-8 w-16">
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
              className="h-8 w-8 text-destructive"
              onClick={() => onUpdateTax('tax', 'enabled', false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Tax 2 */}
      {tax2.enabled ? (
        <div className="flex items-center gap-2">
          <Input
            value={tax2.label}
            onChange={(e) => onUpdateTax('tax2', 'label', e.target.value)}
            className="h-8 w-24 text-sm"
            placeholder="Tax 2"
          />
          <div className="flex items-center gap-1 ml-auto">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={tax2.value || ''}
              onChange={(e) => onUpdateTax('tax2', 'value', parseFloat(e.target.value) || 0)}
              className="h-8 w-20 text-right"
            />
            <Select
              value={tax2.type}
              onValueChange={(v) => onUpdateTax('tax2', 'type', v as 'percentage' | 'flat')}
            >
              <SelectTrigger className="h-8 w-16">
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
              className="h-8 w-8 text-destructive"
              onClick={() => onUpdateTax('tax2', 'enabled', false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : null}

      {totalTax > 0 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatCurrency(totalTax, currency)}</span>
        </div>
      )}

      {/* Shipping */}
      {shipping.enabled ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">Shipping</span>
          <div className="flex items-center gap-1 ml-auto">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={shipping.amount || ''}
              onChange={(e) => onUpdateShipping('amount', parseFloat(e.target.value) || 0)}
              className="h-8 w-24 text-right"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onUpdateShipping('enabled', false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Add buttons for disabled sections */}
      <div className="flex flex-wrap gap-2">
        {!discount.enabled && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => onUpdateDiscount('enabled', true)}
          >
            <Plus className="h-3 w-3" />
            Discount
          </Button>
        )}
        {!tax.enabled && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => onUpdateTax('tax', 'enabled', true)}
          >
            <Plus className="h-3 w-3" />
            Tax
          </Button>
        )}
        {tax.enabled && !tax2.enabled && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => onUpdateTax('tax2', 'enabled', true)}
          >
            <Plus className="h-3 w-3" />
            Tax 2
          </Button>
        )}
        {!shipping.enabled && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => onUpdateShipping('enabled', true)}
          >
            <Plus className="h-3 w-3" />
            Shipping
          </Button>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t">
        <span className="text-base font-semibold">Total</span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  );
}
