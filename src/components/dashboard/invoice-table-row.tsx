'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Copy, Trash2, MoreHorizontal, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useHistoryStore } from '@/stores/history-store';
import { useInvoiceStore } from '@/stores/invoice-store';
import { InvoiceData } from '@/types/invoice';
import { INVOICE_STATUSES } from '@/lib/constants';
import { formatCurrency } from '@/lib/currencies';
import { computeInvoiceTotal } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';

interface InvoiceTableRowProps {
  invoice: InvoiceData;
}

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteInvoice = useHistoryStore((s) => s.deleteInvoice);
  const duplicateInvoice = useHistoryStore((s) => s.duplicateInvoice);
  const loadInvoice = useInvoiceStore((s) => s.loadInvoice);

  const total = computeInvoiceTotal(invoice);
  const statusDef = INVOICE_STATUSES.find((s) => s.value === invoice.status);

  const handleEdit = () => {
    loadInvoice(invoice);
    router.push('/invoice');
  };

  const handleDuplicate = () => {
    const dup = duplicateInvoice(invoice.id);
    if (dup) toast({ title: 'Invoice duplicated', description: `Created ${dup.invoiceNumber}` });
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    setIsDeleteOpen(false);
    toast({ title: 'Invoice deleted', description: `${invoice.invoiceNumber} removed` });
  };

  return (
    <>
      <tr className="border-b transition-colors hover:bg-muted/30">
        <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
        <td className="px-4 py-3 text-muted-foreground">
          {invoice.recipient.name || 'Unnamed Client'}
        </td>
        <td className="px-4 py-3 text-right font-medium">
          {formatCurrency(total, invoice.currency)}
        </td>
        <td className="px-4 py-3 text-center">
          <Badge className={statusDef?.color || 'bg-slate-100 text-slate-700'}>
            {statusDef?.label || invoice.status}
          </Badge>
        </td>
        <td className="px-4 py-3 text-muted-foreground">{formatDate(invoice.issueDate)}</td>
        <td className="px-4 py-3 text-muted-foreground">{formatDate(invoice.dueDate)}</td>
        <td className="px-4 py-3 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Delete invoice <span className="font-semibold">{invoice.invoiceNumber}</span>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
