export interface Address {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate?: number;
}

import { RecurrenceConfig } from './recurring';
import { PaymentRecord } from './payment';
import { TemplateConfig } from './template-config';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export type DiscountType = 'percentage' | 'flat';
export type TaxType = 'percentage' | 'flat';

export interface TaxEntry {
  id: string;
  name: string;
  rate: number;
  type: TaxType;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  logo: string | null;
  sender: Address;
  recipient: Address;
  shipTo: Address | null;
  hasShipTo: boolean;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  poNumber: string;
  items: LineItem[];
  currency: string;
  taxes: TaxEntry[];
  discountType: DiscountType;
  discountValue: number;
  shipping: number;
  notes: string;
  terms: string;
  template: string;
  clientId?: string;
  recurrence: RecurrenceConfig | null;
  payments: PaymentRecord[];
  paidAmount: number;
  templateConfig: TemplateConfig | null;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_ADDRESS: Address = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

export const DEFAULT_LINE_ITEM: Omit<LineItem, 'id'> = {
  description: '',
  quantity: 1,
  rate: 0,
  amount: 0,
};

export const DEFAULT_INVOICE: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt'> = {
  invoiceNumber: 'INV-0001',
  status: 'draft',
  logo: null,
  sender: { ...DEFAULT_ADDRESS },
  recipient: { ...DEFAULT_ADDRESS },
  shipTo: null,
  hasShipTo: false,
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentTerms: 'net30',
  poNumber: '',
  items: [],
  currency: 'USD',
  taxes: [],
  discountType: 'percentage',
  discountValue: 0,
  shipping: 0,
  notes: '',
  terms: '',
  template: 'modern',
  clientId: undefined,
  recurrence: null,
  payments: [],
  paidAmount: 0,
  templateConfig: null,
};
