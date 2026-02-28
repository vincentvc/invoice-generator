import { Metadata } from 'next';
import { ClientsPage } from '@/components/clients/clients-page';

export const metadata: Metadata = {
  title: 'Clients | InvoiceForge',
  description: 'Manage your clients and view their invoice history.',
};

export default function Page() {
  return <ClientsPage />;
}
