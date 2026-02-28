'use client';

import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoryStore } from '@/stores/history-store';
import { InvoiceCard } from './invoice-card';
import { InvoiceTableView } from './invoice-table-view';

export function InvoiceList() {
  const getFilteredInvoices = useHistoryStore((s) => s.getFilteredInvoices);
  const invoices = useHistoryStore((s) => s.invoices);
  const viewMode = useHistoryStore((s) => s.viewMode);
  const filteredInvoices = getFilteredInvoices();

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          No invoices yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first invoice to see it here. Your invoices are saved
          locally in your browser for quick access.
        </p>
        <Link href="/invoice" className="mt-6">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Invoice
          </Button>
        </Link>
      </div>
    );
  }

  if (filteredInvoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          No matching invoices
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try adjusting your search query or filters to find what you are looking for.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return <InvoiceTableView invoices={filteredInvoices} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredInvoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}
