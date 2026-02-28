export interface CompanyInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  website: string;
  taxId: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface TaxConfig {
  enabled: boolean;
  label: string;
  type: 'percentage' | 'flat';
  value: number;
}

export interface DiscountConfig {
  enabled: boolean;
  type: 'percentage' | 'flat';
  value: number;
}

export interface ShippingConfig {
  enabled: boolean;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'bold';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  templateId: TemplateId;
  currency: string;
  logo: string | null;
  from: CompanyInfo;
  to: CompanyInfo;
  date: string;
  dueDate: string;
  poNumber: string;
  items: LineItem[];
  tax: TaxConfig;
  tax2: TaxConfig;
  discount: DiscountConfig;
  shipping: ShippingConfig;
  notes: string;
  terms: string;
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  primaryColor: string;
}
