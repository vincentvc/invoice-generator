'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoryStore } from '@/stores/history-store';
import { DashboardFilters } from './dashboard-filters';
import { InvoiceList } from './invoice-list';

export function DashboardPage() {
  const loadInvoices = useHistoryStore((s) => s.loadInvoices);
  const invoices = useHistoryStore((s) => s.invoices);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            My Invoices
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {invoices.length === 0
              ? 'Create your first invoice to get started'
              : `${invoices.length} invoice${invoices.length === 1 ? '' : 's'} total`}
          </p>
        </div>
        <Link href="/invoice">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {invoices.length > 0 && <DashboardFilters />}

      <InvoiceList />
    </div>
  );
}
