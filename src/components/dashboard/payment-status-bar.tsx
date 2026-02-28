'use client';

import { formatCurrency } from '@/lib/currencies';

interface PaymentStatusBarProps {
  total: number;
  paidAmount: number;
  currency: string;
}

export function PaymentStatusBar({ total, paidAmount, currency }: PaymentStatusBarProps) {
  if (paidAmount <= 0) return null;

  const percentage = Math.min((paidAmount / total) * 100, 100);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Paid: {formatCurrency(paidAmount, currency)}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
