import { InvoiceData } from '@/types/invoice';

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function encodeInvoiceForShare(invoice: InvoiceData): string {
  try {
    const json = JSON.stringify(invoice);
    if (typeof window !== 'undefined') {
      return btoa(encodeURIComponent(json));
    }
    return Buffer.from(json).toString('base64');
  } catch {
    return '';
  }
}

export function decodeInvoiceFromShare(encoded: string): InvoiceData | null {
  try {
    let json: string;
    if (typeof window !== 'undefined') {
      json = decodeURIComponent(atob(encoded));
    } else {
      json = Buffer.from(encoded, 'base64').toString();
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}
