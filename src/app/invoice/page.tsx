import { Metadata } from 'next';
import { InvoiceBuilder } from '@/components/builder/invoice-builder';

export const metadata: Metadata = {
  title: 'Create Invoice - InvoiceForge',
  description: 'Create a professional invoice with our free online invoice generator. Live preview, PDF download, and more.',
};

export default function InvoicePage() {
  return <InvoiceBuilder />;
}
