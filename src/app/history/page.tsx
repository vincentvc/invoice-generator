'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Trash2, Copy, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getAllInvoices, deleteInvoice, saveCurrentInvoice } from '@/lib/storage';
import { formatCurrency } from '@/lib/currencies';
import type { Invoice, InvoiceStatus } from '@/types/invoice';

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function HistoryPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setInvoices(getAllInvoices());
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(query) ||
      inv.from.name.toLowerCase().includes(query) ||
      inv.to.name.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const handleEdit = (invoice: Invoice) => {
    saveCurrentInvoice(invoice);
    router.push('/');
  };

  const handleDuplicate = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: `${invoice.invoiceNumber}-copy`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCurrentInvoice(duplicated);
    router.push('/');
  };

  const handleDownload = async (invoice: Invoice) => {
    const { generateAndDownloadPDF } = await import('@/lib/pdf-generator');
    await generateAndDownloadPDF(invoice);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoice History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button onClick={() => router.push('/')} className="gap-2">
          <FileText className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by invoice #, company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-1">
            {searchQuery ? 'No invoices found' : 'No invoices yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first invoice to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push('/')}>Create Invoice</Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv) => (
            <Card
              key={inv.id}
              className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleEdit(inv)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {inv.invoiceNumber || 'No number'}
                      </span>
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[inv.status]}
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      {inv.to.name && (
                        <span className="truncate">{inv.to.name}</span>
                      )}
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3" />
                        {new Date(inv.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-lg">
                    {formatCurrency(inv.total, inv.currency)}
                  </span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(inv)}
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDuplicate(inv)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(inv.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
