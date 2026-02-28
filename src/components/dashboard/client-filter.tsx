'use client';

import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHistoryStore } from '@/stores/history-store';
import { useClientStore } from '@/stores/client-store';

export function ClientFilter() {
  const clientFilter = useHistoryStore((s) => s.clientFilter);
  const setClientFilter = useHistoryStore((s) => s.setClientFilter);
  const clients = useClientStore((s) => s.clients);
  const loadClients = useClientStore((s) => s.loadClients);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const selectedClient = clients.find((c) => c.id === clientFilter);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedClient ? selectedClient.name : 'All Clients'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-h-64 overflow-auto">
        <DropdownMenuLabel>Filter by Client</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setClientFilter('')}
          className={!clientFilter ? 'bg-accent' : ''}
        >
          All Clients
        </DropdownMenuItem>
        {clients.map((client) => (
          <DropdownMenuItem
            key={client.id}
            onClick={() => setClientFilter(client.id)}
            className={clientFilter === client.id ? 'bg-accent' : ''}
          >
            {client.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
