import { create } from 'zustand';
import { InvoiceData, LineItem, Address, TaxEntry, DiscountType, DEFAULT_INVOICE, DEFAULT_ADDRESS } from '@/types/invoice';
import { calcLineItemAmount } from '@/lib/calculations';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createNewInvoice(): InvoiceData {
  const now = new Date().toISOString();
  return {
    ...DEFAULT_INVOICE,
    id: generateId(),
    sender: { ...DEFAULT_ADDRESS },
    recipient: { ...DEFAULT_ADDRESS },
    items: [
      {
        id: generateId(),
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: now,
    updatedAt: now,
  };
}

interface UndoState {
  past: InvoiceData[];
  future: InvoiceData[];
}

interface InvoiceStore {
  invoice: InvoiceData;
  undoState: UndoState;

  // Setters
  setInvoice: (invoice: InvoiceData) => void;
  updateField: <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => void;
  updateSender: (field: keyof Address, value: string) => void;
  updateRecipient: (field: keyof Address, value: string) => void;
  updateShipTo: (field: keyof Address, value: string) => void;
  toggleShipTo: () => void;
  setLogo: (logo: string | null) => void;

  // Line items
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, field: keyof LineItem, value: string | number) => void;
  reorderLineItems: (items: LineItem[]) => void;

  // Taxes
  addTax: () => void;
  removeTax: (id: string) => void;
  updateTax: (id: string, field: keyof TaxEntry, value: string | number) => void;

  // Discount
  setDiscountType: (type: DiscountType) => void;
  setDiscountValue: (value: number) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Reset
  clearInvoice: () => void;
  loadInvoice: (invoice: InvoiceData) => void;
}

function pushToHistory(state: UndoState, current: InvoiceData): UndoState {
  return {
    past: [...state.past.slice(-49), current],
    future: [],
  };
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoice: createNewInvoice(),
  undoState: { past: [], future: [] },

  setInvoice: (invoice) => {
    const current = get().invoice;
    set({
      invoice,
      undoState: pushToHistory(get().undoState, current),
    });
  },

  updateField: (field, value) => {
    const current = get().invoice;
    set({
      invoice: { ...current, [field]: value, updatedAt: new Date().toISOString() },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  updateSender: (field, value) => {
    const current = get().invoice;
    set({
      invoice: {
        ...current,
        sender: { ...current.sender, [field]: value },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateRecipient: (field, value) => {
    const current = get().invoice;
    set({
      invoice: {
        ...current,
        recipient: { ...current.recipient, [field]: value },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateShipTo: (field, value) => {
    const current = get().invoice;
    const shipTo = current.shipTo || { ...DEFAULT_ADDRESS };
    set({
      invoice: {
        ...current,
        shipTo: { ...shipTo, [field]: value },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  toggleShipTo: () => {
    const current = get().invoice;
    set({
      invoice: {
        ...current,
        hasShipTo: !current.hasShipTo,
        shipTo: !current.hasShipTo ? { ...DEFAULT_ADDRESS } : null,
        updatedAt: new Date().toISOString(),
      },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  setLogo: (logo) => {
    const current = get().invoice;
    set({
      invoice: { ...current, logo, updatedAt: new Date().toISOString() },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  addLineItem: () => {
    const current = get().invoice;
    const newItem: LineItem = {
      id: generateId(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    set({
      invoice: {
        ...current,
        items: [...current.items, newItem],
        updatedAt: new Date().toISOString(),
      },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  removeLineItem: (id) => {
    const current = get().invoice;
    if (current.items.length <= 1) return;
    set({
      invoice: {
        ...current,
        items: current.items.filter((item) => item.id !== id),
        updatedAt: new Date().toISOString(),
      },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  updateLineItem: (id, field, value) => {
    const current = get().invoice;
    set({
      invoice: {
        ...current,
        items: current.items.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = calcLineItemAmount(
              field === 'quantity' ? (value as number) : item.quantity,
              field === 'rate' ? (value as number) : item.rate
            );
          }
          return updated;
        }),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  reorderLineItems: (items) => {
    const current = get().invoice;
    set({
      invoice: { ...current, items, updatedAt: new Date().toISOString() },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  addTax: () => {
    const current = get().invoice;
    const newTax: TaxEntry = {
      id: generateId(),
      name: 'Tax',
      rate: 0,
      type: 'percentage',
    };
    set({
      invoice: {
        ...current,
        taxes: [...current.taxes, newTax],
        updatedAt: new Date().toISOString(),
      },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  removeTax: (id) => {
    const current = get().invoice;
    set({
      invoice: {
        ...current,
        taxes: current.taxes.filter((t) => t.id !== id),
        updatedAt: new Date().toISOString(),
      },
      undoState: pushToHistory(get().undoState, current),
    });
  },

  updateTax: (id, field, value) => {
    const current = get().invoice;
    set({
      invoice: {
        ...current,
        taxes: current.taxes.map((t) =>
          t.id === id ? { ...t, [field]: value } : t
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  setDiscountType: (type) => {
    const current = get().invoice;
    set({
      invoice: { ...current, discountType: type, updatedAt: new Date().toISOString() },
    });
  },

  setDiscountValue: (value) => {
    const current = get().invoice;
    set({
      invoice: { ...current, discountValue: value, updatedAt: new Date().toISOString() },
    });
  },

  undo: () => {
    const { undoState, invoice } = get();
    if (undoState.past.length === 0) return;
    const previous = undoState.past[undoState.past.length - 1];
    set({
      invoice: previous,
      undoState: {
        past: undoState.past.slice(0, -1),
        future: [invoice, ...undoState.future],
      },
    });
  },

  redo: () => {
    const { undoState, invoice } = get();
    if (undoState.future.length === 0) return;
    const next = undoState.future[0];
    set({
      invoice: next,
      undoState: {
        past: [...undoState.past, invoice],
        future: undoState.future.slice(1),
      },
    });
  },

  canUndo: () => get().undoState.past.length > 0,
  canRedo: () => get().undoState.future.length > 0,

  clearInvoice: () => {
    const current = get().invoice;
    set({
      invoice: createNewInvoice(),
      undoState: pushToHistory(get().undoState, current),
    });
  },

  loadInvoice: (invoice) => {
    set({
      invoice,
      undoState: { past: [], future: [] },
    });
  },
}));
