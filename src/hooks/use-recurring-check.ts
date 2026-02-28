'use client';

import { useEffect } from 'react';
import { useHistoryStore } from '@/stores/history-store';
import { InvoiceData } from '@/types/invoice';
import { RecurrenceFrequency } from '@/types/recurring';
import { toast } from '@/hooks/use-toast';

function getNextDate(currentDate: string, frequency: RecurrenceFrequency): string {
  const date = new Date(currentDate);
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date.toISOString().split('T')[0];
}

export function useRecurringCheck() {
  const invoices = useHistoryStore((s) => s.invoices);
  const saveInvoice = useHistoryStore((s) => s.saveInvoice);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    let generated = 0;

    for (const invoice of invoices) {
      if (!invoice.recurrence?.enabled) continue;
      if (invoice.recurrence.endDate && invoice.recurrence.endDate < today) continue;
      if (invoice.recurrence.nextDueDate > today) continue;

      // Generate new invoice from recurring template
      const now = new Date().toISOString();
      const newInvoice: InvoiceData = {
        ...invoice,
        id: Math.random().toString(36).substring(2, 9),
        invoiceNumber: `${invoice.invoiceNumber}-R`,
        status: 'draft',
        issueDate: today,
        dueDate: getNextDate(today, invoice.recurrence.frequency),
        payments: [],
        paidAmount: 0,
        recurrence: null,
        createdAt: now,
        updatedAt: now,
      };

      saveInvoice(newInvoice);

      // Update original invoice's recurrence dates
      const updatedOriginal: InvoiceData = {
        ...invoice,
        recurrence: {
          ...invoice.recurrence,
          lastGeneratedDate: today,
          nextDueDate: getNextDate(invoice.recurrence.nextDueDate, invoice.recurrence.frequency),
        },
      };
      saveInvoice(updatedOriginal);
      generated++;
    }

    if (generated > 0) {
      toast({
        title: 'Recurring invoices',
        description: `${generated} recurring invoice${generated > 1 ? 's' : ''} generated`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices.length]); // Only run when invoice count changes (on load)
}
