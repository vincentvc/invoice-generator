import { InvoiceData } from '@/types/invoice';

export function migrateInvoiceData(data: Partial<InvoiceData>): InvoiceData {
  return {
    id: data.id || Math.random().toString(36).substring(2, 9),
    invoiceNumber: data.invoiceNumber || 'INV-0001',
    status: data.status || 'draft',
    logo: data.logo ?? null,
    sender: data.sender || { name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '' },
    recipient: data.recipient || { name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: '' },
    shipTo: data.shipTo ?? null,
    hasShipTo: data.hasShipTo ?? false,
    issueDate: data.issueDate || new Date().toISOString().split('T')[0],
    dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: data.paymentTerms || 'net30',
    poNumber: data.poNumber || '',
    items: data.items || [],
    currency: data.currency || 'USD',
    taxes: data.taxes || [],
    discountType: data.discountType || 'percentage',
    discountValue: data.discountValue ?? 0,
    shipping: data.shipping ?? 0,
    notes: data.notes || '',
    terms: data.terms || '',
    template: data.template || 'modern',
    clientId: data.clientId,
    recurrence: data.recurrence ?? null,
    payments: data.payments || [],
    paidAmount: data.paidAmount ?? 0,
    templateConfig: data.templateConfig ?? null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export function migrateInvoicesArray(invoices: Partial<InvoiceData>[]): InvoiceData[] {
  return invoices.map(migrateInvoiceData);
}
