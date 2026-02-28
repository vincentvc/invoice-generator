'use client';

import { InvoiceData } from '@/types/invoice';
import { InvoiceTableRow } from './invoice-table-row';

interface InvoiceTableViewProps {
  invoices: InvoiceData[];
}

export function InvoiceTableView({ invoices }: InvoiceTableViewProps) {
  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice #</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Issue Date</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <InvoiceTableRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
