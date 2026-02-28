'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCIES } from '@/lib/currencies';
import type { Invoice } from '@/types/invoice';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onUpdateField: <K extends keyof Invoice>(field: K, value: Invoice[K]) => void;
}

export function InvoiceDetails({ invoice, onUpdateField }: InvoiceDetailsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Invoice Details
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="invoiceNumber" className="text-xs">
            Invoice #
          </Label>
          <Input
            id="invoiceNumber"
            placeholder="INV-001"
            value={invoice.invoiceNumber}
            onChange={(e) => onUpdateField('invoiceNumber', e.target.value)}
            className="h-9"
          />
        </div>
        <div>
          <Label htmlFor="currency" className="text-xs">
            Currency
          </Label>
          <Select
            value={invoice.currency}
            onValueChange={(value) => onUpdateField('currency', value)}
          >
            <SelectTrigger id="currency" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol}) - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date" className="text-xs">
            Invoice Date
          </Label>
          <Input
            id="date"
            type="date"
            value={invoice.date}
            onChange={(e) => onUpdateField('date', e.target.value)}
            className="h-9"
          />
        </div>
        <div>
          <Label htmlFor="dueDate" className="text-xs">
            Due Date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={invoice.dueDate}
            onChange={(e) => onUpdateField('dueDate', e.target.value)}
            className="h-9"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="poNumber" className="text-xs">
            PO Number
          </Label>
          <Input
            id="poNumber"
            placeholder="Purchase order number (optional)"
            value={invoice.poNumber}
            onChange={(e) => onUpdateField('poNumber', e.target.value)}
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}
