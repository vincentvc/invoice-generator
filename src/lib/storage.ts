import type { Invoice } from '@/types/invoice';

const STORAGE_KEY = 'invoice-generator-invoices';
const CURRENT_INVOICE_KEY = 'invoice-generator-current';
const SETTINGS_KEY = 'invoice-generator-settings';

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function saveInvoice(invoice: Invoice): void {
  if (!isLocalStorageAvailable()) return;
  const invoices = getAllInvoices();
  const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
  const updatedInvoice = { ...invoice, updatedAt: new Date().toISOString() };

  const updatedInvoices = existingIndex >= 0
    ? invoices.map((inv, i) => i === existingIndex ? updatedInvoice : inv)
    : [updatedInvoice, ...invoices];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
}

export function getAllInvoices(): Invoice[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getInvoiceById(id: string): Invoice | null {
  const invoices = getAllInvoices();
  return invoices.find(inv => inv.id === id) ?? null;
}

export function deleteInvoice(id: string): void {
  if (!isLocalStorageAvailable()) return;
  const invoices = getAllInvoices().filter(inv => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function saveCurrentInvoice(invoice: Invoice): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(CURRENT_INVOICE_KEY, JSON.stringify(invoice));
}

export function getCurrentInvoice(): Invoice | null {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(CURRENT_INVOICE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export interface AppSettings {
  currency: string;
  language: string;
  defaultTemplate: string;
  showAds: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  language: 'en',
  defaultTemplate: 'modern',
  showAds: true,
};

export function getSettings(): AppSettings {
  if (!isLocalStorageAvailable()) return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (!isLocalStorageAvailable()) return;
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
}
