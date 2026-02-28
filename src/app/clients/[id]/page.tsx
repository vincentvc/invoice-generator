import { Metadata } from 'next';
import { ClientDetailPage } from '@/components/clients/client-detail-page';

export const metadata: Metadata = {
  title: 'Client Details | InvoiceForge',
  description: 'View client details and invoice history.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ClientDetailPage clientId={id} />;
}
