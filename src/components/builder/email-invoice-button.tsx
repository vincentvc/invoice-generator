'use client';

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvoiceStore } from '@/stores/invoice-store';
import { computeInvoiceTotal } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currencies';
import { toast } from '@/hooks/use-toast';

export function EmailInvoiceButton() {
  const invoice = useInvoiceStore((s) => s.invoice);

  const handleClick = () => {
    const total = computeInvoiceTotal(invoice);
    const recipientEmail = invoice.recipient.email;

    if (!recipientEmail) {
      toast({ title: 'No email', description: 'Add a recipient email address first' });
      return;
    }

    const subject = encodeURIComponent(
      `Invoice ${invoice.invoiceNumber} from ${invoice.sender.name || 'InvoiceForge'}`
    );

    const body = encodeURIComponent(
      [
        `Hello ${invoice.recipient.name || ''},`,
        '',
        `Please find attached invoice ${invoice.invoiceNumber}.`,
        '',
        `Invoice Details:`,
        `  Amount: ${formatCurrency(total, invoice.currency)}`,
        `  Issue Date: ${invoice.issueDate}`,
        `  Due Date: ${invoice.dueDate}`,
        invoice.paymentTerms ? `  Payment Terms: ${invoice.paymentTerms}` : '',
        '',
        `Thank you for your business.`,
        '',
        `Best regards,`,
        invoice.sender.name || '',
      ].filter(Boolean).join('\n')
    );

    window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, '_blank');
    toast({ title: 'Email client opened', description: 'Attach the PDF before sending' });
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleClick}>
      <Mail className="h-4 w-4" />
      <span className="hidden sm:inline">Email</span>
    </Button>
  );
}
