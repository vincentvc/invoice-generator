'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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
import { RecurringBadge } from './recurring-badge';
import { PaymentStatusBar } from './payment-status-bar';

interface InvoiceCardProps {
  invoice: InvoiceData;
}

function getStatusBadgeClasses(status: string): string {
  const found = INVOICE_STATUSES.find((s) => s.value === status);
  return found?.color ?? 'bg-slate-100 text-slate-700';
}

function getStatusLabel(status: string): string {
  const found = INVOICE_STATUSES.find((s) => s.value === status);
  return found?.label ?? status;
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

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteInvoice = useHistoryStore((s) => s.deleteInvoice);
  const duplicateInvoice = useHistoryStore((s) => s.duplicateInvoice);
  const loadInvoice = useInvoiceStore((s) => s.loadInvoice);

  const total = computeInvoiceTotal(invoice);
  const clientName = invoice.recipient.name || 'Unnamed Client';

  const handleEdit = () => {
    loadInvoice(invoice);
    router.push('/invoice');
  };

  const handleDuplicate = () => {
    const duplicated = duplicateInvoice(invoice.id);
    if (duplicated) {
      toast({
        title: 'Invoice duplicated',
        description: `Created ${duplicated.invoiceNumber}`,
      });
    }
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    setIsDeleteOpen(false);
    toast({
      title: 'Invoice deleted',
      description: `${invoice.invoiceNumber} has been removed`,
    });
  };

  const handleDownloadPdf = () => {
    loadInvoice(invoice);
    router.push('/invoice');
  };

  return (
    <>
      <Card className="group transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-heading text-sm font-semibold text-foreground">
                {invoice.invoiceNumber}
              </p>
              <Badge className={`shrink-0 ${getStatusBadgeClasses(invoice.status)}`}>
                {getStatusLabel(invoice.status)}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {clientName}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="font-heading text-2xl font-bold text-foreground">
            {formatCurrency(total, invoice.currency)}
          </p>
          <PaymentStatusBar
            total={total}
            paidAmount={invoice.paidAmount || 0}
            currency={invoice.currency}
          />
          <div className="mt-2 flex gap-1">
            <RecurringBadge recurrence={invoice.recurrence} />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Issued {formatDate(invoice.issueDate)}</span>
          </div>
          <span>Due {formatDate(invoice.dueDate)}</span>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{' '}
              <span className="font-semibold text-foreground">
                {invoice.invoiceNumber}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
