import { Metadata } from 'next';
import { AnalyticsPage } from '@/components/analytics/analytics-page';

export const metadata: Metadata = {
  title: 'Analytics | InvoiceForge',
  description: 'View your invoicing performance metrics, revenue charts, and client insights.',
};

export default function Page() {
  return <AnalyticsPage />;
}
