'use client';

import { useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency } from '@/lib/currencies';
import { computeInvoiceTotal } from '@/lib/analytics';
import { PaymentMethod } from '@/types/payment';

export function PaymentRecords() {
  const invoice = useInvoiceStore((s) => s.invoice);
  const addPayment = useInvoiceStore((s) => s.addPayment);
  const removePayment = useInvoiceStore((s) => s.removePayment);

  const [isAdding, setIsAdding] = useState(false);
  const [newPayment, setNewPayment] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    method: 'bank_transfer' as PaymentMethod,
    reference: '',
    notes: '',
  });

  const total = computeInvoiceTotal(invoice);
  const remaining = total - (invoice.paidAmount || 0);

  const handleAdd = () => {
    if (newPayment.amount <= 0) return;
    addPayment(newPayment);
    setNewPayment({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      method: 'bank_transfer',
      reference: '',
      notes: '',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Payment Records
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-3 w-3" />
          Add Payment
        </Button>
      </div>

      {invoice.payments.length > 0 && (
        <div className="rounded-lg border divide-y">
          {invoice.payments.map((payment) => {
            const methodLabel = PAYMENT_METHODS.find((m) => m.value === payment.method)?.label || payment.method;
            return (
              <div key={payment.id} className="flex items-center justify-between px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium">{formatCurrency(payment.amount, invoice.currency)}</span>
                    <span className="text-muted-foreground">via {methodLabel}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(payment.date).toLocaleDateString()}
                    {payment.reference && ` - Ref: ${payment.reference}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removePayment(payment.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Paid: {formatCurrency(invoice.paidAmount || 0, invoice.currency)}</span>
        <span className={`font-medium ${remaining <= 0 ? 'text-emerald-600' : 'text-foreground'}`}>
          {remaining <= 0 ? 'Fully Paid' : `Remaining: ${formatCurrency(remaining, invoice.currency)}`}
        </span>
      </div>

      {isAdding && (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Amount</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={newPayment.amount || ''}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                className="mt-1 h-8 text-xs"
                placeholder={remaining.toFixed(2)}
              />
            </div>
            <div>
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                className="mt-1 h-8 text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Method</Label>
              <Select
                value={newPayment.method}
                onValueChange={(v) => setNewPayment({ ...newPayment, method: v as PaymentMethod })}
              >
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Reference</Label>
              <Input
                value={newPayment.reference}
                onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                className="mt-1 h-8 text-xs"
                placeholder="Check #, Txn ID..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={handleAdd}>Save Payment</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
