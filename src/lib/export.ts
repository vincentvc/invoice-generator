'use client';

import { InvoiceData } from '@/types/invoice';
import { computeInvoiceTotal } from '@/lib/analytics';

function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US');
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function exportToCSV(invoices: InvoiceData[]): void {
  const headers = [
    'Invoice #',
    'Status',
    'Client',
    'Client Email',
    'Issue Date',
    'Due Date',
    'Currency',
    'Total',
    'Paid Amount',
    'Payment Terms',
  ];

  const rows = invoices.map((inv) => {
    const total = computeInvoiceTotal(inv);
    return [
      inv.invoiceNumber,
      getStatusLabel(inv.status),
      inv.recipient.name,
      inv.recipient.email,
      formatDateString(inv.issueDate),
      formatDateString(inv.dueDate),
      inv.currency,
      total.toFixed(2),
      (inv.paidAmount || 0).toFixed(2),
      inv.paymentTerms,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToExcel(invoices: InvoiceData[]): Promise<void> {
  const XLSX = await import('xlsx');

  const data = invoices.map((inv) => {
    const total = computeInvoiceTotal(inv);
    return {
      'Invoice #': inv.invoiceNumber,
      'Status': getStatusLabel(inv.status),
      'Client': inv.recipient.name,
      'Client Email': inv.recipient.email,
      'Issue Date': formatDateString(inv.issueDate),
      'Due Date': formatDateString(inv.dueDate),
      'Currency': inv.currency,
      'Total': total,
      'Paid Amount': inv.paidAmount || 0,
      'Outstanding': total - (inv.paidAmount || 0),
      'Payment Terms': inv.paymentTerms,
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
  XLSX.writeFile(wb, `invoices-${new Date().toISOString().split('T')[0]}.xlsx`);
}
