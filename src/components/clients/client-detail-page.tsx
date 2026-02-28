'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useClientStore } from '@/stores/client-store';
import { useHistoryStore } from '@/stores/history-store';
import { InvoiceCard } from '@/components/dashboard/invoice-card';
import { ClientEditDialog } from './client-edit-dialog';
import { computeInvoiceTotal } from '@/lib/analytics';
import { formatCurrency } from '@/lib/currencies';
import { toast } from '@/hooks/use-toast';

interface ClientDetailPageProps {
  clientId: string;
}

export function ClientDetailPage({ clientId }: ClientDetailPageProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const clients = useClientStore((s) => s.clients);
  const loadClients = useClientStore((s) => s.loadClients);
  const deleteClient = useClientStore((s) => s.deleteClient);
  const invoices = useHistoryStore((s) => s.invoices);
  const loadInvoices = useHistoryStore((s) => s.loadInvoices);

  useEffect(() => {
    loadClients();
    loadInvoices();
  }, [loadClients, loadInvoices]);

  const client = clients.find((c) => c.id === clientId);
  const clientInvoices = invoices.filter((inv) => inv.clientId === clientId);
  const totalRevenue = clientInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + computeInvoiceTotal(inv), 0);

  if (!client) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h2 className="font-heading text-xl font-semibold">Client not found</h2>
          <p className="mt-2 text-muted-foreground">This client may have been deleted.</p>
          <Link href="/clients" className="mt-4 inline-block">
            <Button variant="outline">Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteClient(client.id);
    setIsDeleteOpen(false);
    toast({ title: 'Client deleted', description: `${client.name} has been removed` });
    router.push('/clients');
  };

  const fullAddress = [client.address, client.city, client.state, client.zip, client.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {client.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Client since {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Info</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            {client.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            {fullAddress && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{fullAddress}</span>
              </div>
            )}
            {!client.email && !client.phone && !fullAddress && (
              <p className="text-sm text-muted-foreground">No contact info</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{formatCurrency(totalRevenue, 'USD')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Invoices</h3>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-2xl font-bold">{clientInvoices.length}</p>
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">Invoice History</h2>
        {clientInvoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices yet for this client.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clientInvoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </div>

      <ClientEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} client={client} />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Delete <span className="font-semibold">{client.name}</span>? This will not delete their invoices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
