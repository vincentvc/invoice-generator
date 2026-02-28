import { Metadata } from 'next';
import { DashboardPage } from '@/components/dashboard/dashboard-page';

export const metadata: Metadata = {
  title: 'Dashboard - InvoiceForge',
  description: 'View, manage, and organize all your invoices in one place. Search, filter, and take action on your invoices.',
};

export default function Dashboard() {
  return <DashboardPage />;
}
