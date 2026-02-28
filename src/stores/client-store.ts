import { create } from 'zustand';
import { Client } from '@/types/client';
import { Address } from '@/types/invoice';
import { getItem, setItem } from '@/lib/storage';
import { normalizeClientName, clientFromAddress } from '@/lib/client-utils';

const STORAGE_KEY = 'clients';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

interface ClientStore {
  clients: Client[];

  loadClients: () => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  getClientByName: (name: string) => Client | undefined;
  searchClients: (query: string) => Client[];
  getOrCreateClientFromAddress: (address: Address) => Client;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],

  loadClients: () => {
    const saved = getItem<Client[]>(STORAGE_KEY, []);
    set({ clients: saved });
  },

  addClient: (clientData) => {
    const now = new Date().toISOString();
    const client: Client = {
      ...clientData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...get().clients, client];
    set({ clients: updated });
    setItem(STORAGE_KEY, updated);
    return client;
  },

  updateClient: (id, updates) => {
    const updated = get().clients.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    set({ clients: updated });
    setItem(STORAGE_KEY, updated);
  },

  deleteClient: (id) => {
    const updated = get().clients.filter((c) => c.id !== id);
    set({ clients: updated });
    setItem(STORAGE_KEY, updated);
  },

  getClientById: (id) => {
    return get().clients.find((c) => c.id === id);
  },

  getClientByName: (name) => {
    const normalized = normalizeClientName(name);
    return get().clients.find((c) => normalizeClientName(c.name) === normalized);
  },

  searchClients: (query) => {
    if (!query.trim()) return get().clients;
    const lower = query.toLowerCase();
    return get().clients.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower)
    );
  },

  getOrCreateClientFromAddress: (address) => {
    if (!address.name.trim()) {
      return get().addClient(clientFromAddress(address));
    }

    const existing = get().getClientByName(address.name);
    if (existing) {
      // Update with latest address info
      const updates: Partial<Client> = {};
      if (address.email && address.email !== existing.email) updates.email = address.email;
      if (address.phone && address.phone !== existing.phone) updates.phone = address.phone;
      if (address.address && address.address !== existing.address) updates.address = address.address;
      if (address.city && address.city !== existing.city) updates.city = address.city;
      if (address.state && address.state !== existing.state) updates.state = address.state;
      if (address.zip && address.zip !== existing.zip) updates.zip = address.zip;
      if (address.country && address.country !== existing.country) updates.country = address.country;

      if (Object.keys(updates).length > 0) {
        get().updateClient(existing.id, updates);
        return { ...existing, ...updates };
      }
      return existing;
    }

    return get().addClient(clientFromAddress(address));
  },
}));
