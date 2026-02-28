'use client';

import { Label } from '@/components/ui/label';
import type { Invoice } from '@/types/invoice';

interface PaymentInfoProps {
  notes: string;
  terms: string;
  onUpdateField: <K extends keyof Invoice>(field: K, value: Invoice[K]) => void;
}

export function PaymentInfo({ notes, terms, onUpdateField }: PaymentInfoProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="notes" className="text-xs">
          Notes
        </Label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Thank you for your business! Payment is due within 30 days."
          value={notes}
          onChange={(e) => onUpdateField('notes', e.target.value)}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      <div>
        <Label htmlFor="terms" className="text-xs">
          Terms & Conditions
        </Label>
        <textarea
          id="terms"
          rows={2}
          placeholder="Late payments may incur additional charges."
          value={terms}
          onChange={(e) => onUpdateField('terms', e.target.value)}
          className="flex min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
