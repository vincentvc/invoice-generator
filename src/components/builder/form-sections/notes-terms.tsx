'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvoiceStore } from '@/stores/invoice-store';

export function NotesTerms() {
  const notes = useInvoiceStore((s) => s.invoice.notes);
  const terms = useInvoiceStore((s) => s.invoice.terms);
  const updateField = useInvoiceStore((s) => s.updateField);

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes for the client (e.g., payment instructions, thank you note)"
          value={notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          className="mt-1 resize-none"
        />
      </div>
      <div>
        <Label htmlFor="terms" className="text-xs font-medium">Terms & Conditions</Label>
        <Textarea
          id="terms"
          placeholder="Terms and conditions (e.g., late payment fees, refund policy)"
          value={terms}
          onChange={(e) => updateField('terms', e.target.value)}
          rows={3}
          className="mt-1 resize-none"
        />
      </div>
    </div>
  );
}
