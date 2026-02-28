'use client';

import Link from 'next/link';
import { Mail, Phone, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Client } from '@/types/client';
import { InvoiceData } from '@/types/invoice';
import { computeInvoiceTotal } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currencies';

interface ClientCardProps {
  client: Client;
  invoices: InvoiceData[];
}

export function ClientCard({ client, invoices }: ClientCardProps) {
  const clientInvoices = invoices.filter((inv) => inv.clientId === client.id);
  const totalRevenue = clientInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + computeInvoiceTotal(inv), 0);

  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader className="pb-2">
          <h3 className="font-heading text-base font-semibold text-foreground truncate">
            {client.name}
          </h3>
        </CardHeader>
        <CardContent className="space-y-2">
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{client.phone}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-2 mt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span>{clientInvoices.length} invoice{clientInvoices.length !== 1 ? 's' : ''}</span>
            </div>
            {totalRevenue > 0 && (
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(totalRevenue, 'USD')}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
