import { create } from 'zustand';
import { InvoiceData, InvoiceStatus } from '@/types/invoice';
import { getItem, setItem } from '@/lib/storage';

const STORAGE_KEY = 'saved-invoices';

interface HistoryStore {
  invoices: InvoiceData[];
  searchQuery: string;
  statusFilter: InvoiceStatus | 'all';
  sortBy: 'date' | 'amount' | 'client';
  sortOrder: 'asc' | 'desc';

  loadInvoices: () => void;
  saveInvoice: (invoice: InvoiceData) => void;
  deleteInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => InvoiceData | null;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: InvoiceStatus | 'all') => void;
  setSortBy: (sort: 'date' | 'amount' | 'client') => void;
  toggleSortOrder: () => void;

  getFilteredInvoices: () => InvoiceData[];
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  invoices: [],
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'date',
  sortOrder: 'desc',

  loadInvoices: () => {
    const saved = getItem<InvoiceData[]>(STORAGE_KEY, []);
    set({ invoices: saved });
  },

  saveInvoice: (invoice) => {
    const current = get().invoices;
    const existingIndex = current.findIndex((inv) => inv.id === invoice.id);
    let updated: InvoiceData[];
    if (existingIndex >= 0) {
      updated = current.map((inv, i) =>
        i === existingIndex ? { ...invoice, updatedAt: new Date().toISOString() } : inv
      );
    } else {
      updated = [...current, { ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    }
    set({ invoices: updated });
    setItem(STORAGE_KEY, updated);
  },

  deleteInvoice: (id) => {
    const updated = get().invoices.filter((inv) => inv.id !== id);
    set({ invoices: updated });
    setItem(STORAGE_KEY, updated);
  },

  duplicateInvoice: (id) => {
    const original = get().invoices.find((inv) => inv.id === id);
    if (!original) return null;
    const now = new Date().toISOString();
    const duplicate: InvoiceData = {
      ...original,
      id: Math.random().toString(36).substring(2, 9),
      invoiceNumber: `${original.invoiceNumber}-COPY`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...get().invoices, duplicate];
    set({ invoices: updated });
    setItem(STORAGE_KEY, updated);
    return duplicate;
  },

  updateInvoiceStatus: (id, status) => {
    const updated = get().invoices.map((inv) =>
      inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
    );
    set({ invoices: updated });
    setItem(STORAGE_KEY, updated);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),

  getFilteredInvoices: () => {
    const { invoices, searchQuery, statusFilter, sortBy, sortOrder } = get();
    let filtered = [...invoices];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.recipient.name.toLowerCase().includes(query) ||
          inv.sender.name.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'amount': {
          const totalA = a.items.reduce((sum, item) => sum + item.amount, 0);
          const totalB = b.items.reduce((sum, item) => sum + item.amount, 0);
          comparison = totalA - totalB;
          break;
        }
        case 'client':
          comparison = a.recipient.name.localeCompare(b.recipient.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  },
}));
