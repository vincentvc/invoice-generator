'use client';

import { DollarSign, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { KPIData } from '@/types/analytics';
import { formatCurrency } from '@/lib/currencies';

interface KPICardsProps {
  data: KPIData;
  currency?: string;
}

export function KPICards({ data, currency = 'USD' }: KPICardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue, currency),
      icon: DollarSign,
      description: `${data.paidCount} paid invoice${data.paidCount !== 1 ? 's' : ''}`,
    },
    {
      title: 'Invoice Count',
      value: data.invoiceCount.toString(),
      icon: FileText,
      description: 'Total invoices created',
    },
    {
      title: 'Average Value',
      value: formatCurrency(data.averageInvoiceValue, currency),
      icon: TrendingUp,
      description: 'Per paid invoice',
    },
    {
      title: 'Outstanding',
      value: formatCurrency(data.outstandingAmount, currency),
      icon: AlertCircle,
      description: `${data.overdueCount} overdue`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
