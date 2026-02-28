'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useClientStore } from '@/stores/client-store';
import { useHistoryStore } from '@/stores/history-store';
import { ClientCard } from './client-card';
import { ClientEditDialog } from './client-edit-dialog';

export function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const clients = useClientStore((s) => s.clients);
  const loadClients = useClientStore((s) => s.loadClients);
  const searchClients = useClientStore((s) => s.searchClients);
  const invoices = useHistoryStore((s) => s.invoices);
  const loadInvoices = useHistoryStore((s) => s.loadInvoices);

  useEffect(() => {
    loadClients();
    loadInvoices();
  }, [loadClients, loadInvoices]);

  const filteredClients = searchQuery ? searchClients(searchQuery) : clients;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Clients
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {clients.length === 0
              ? 'Clients are auto-created when you save invoices'
              : `${clients.length} client${clients.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {clients.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">No clients yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Clients are automatically created when you save invoices with a recipient name.
            You can also add clients manually.
          </p>
          <Button className="mt-6 gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Your First Client
          </Button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-16 text-center">
          <h3 className="font-heading text-lg font-semibold text-foreground">No matching clients</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} invoices={invoices} />
          ))}
        </div>
      )}

      <ClientEditDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
