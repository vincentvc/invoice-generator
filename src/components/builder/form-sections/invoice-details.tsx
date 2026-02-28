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
import { useInvoiceStore } from '@/stores/invoice-store';
import { PAYMENT_TERMS } from '@/lib/constants';

export function InvoiceDetails() {
  const invoice = useInvoiceStore((s) => s.invoice);
  const updateField = useInvoiceStore((s) => s.updateField);

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-semibold text-foreground">Invoice Details</h3>
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="invoice-number" className="text-xs">Invoice #</Label>
            <Input
              id="invoice-number"
              placeholder="INV-0001"
              value={invoice.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="po-number" className="text-xs">PO Number</Label>
            <Input
              id="po-number"
              placeholder="Optional"
              value={invoice.poNumber}
              onChange={(e) => updateField('poNumber', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="issue-date" className="text-xs">Issue Date</Label>
            <Input
              id="issue-date"
              type="date"
              value={invoice.issueDate}
              onChange={(e) => updateField('issueDate', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="due-date" className="text-xs">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="payment-terms" className="text-xs">Payment Terms</Label>
          <Select
            value={invoice.paymentTerms}
            onValueChange={(val) => updateField('paymentTerms', val)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TERMS.map((term) => (
                <SelectItem key={term.value} value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
