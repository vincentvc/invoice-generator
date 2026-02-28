import { Metadata } from 'next';
import { SettingsPage } from '@/components/settings/settings-page';

export const metadata: Metadata = {
  title: 'Settings | InvoiceForge',
  description: 'Configure your InvoiceForge account and invoice defaults.',
};

export default function Page() {
  return <SettingsPage />;
}
