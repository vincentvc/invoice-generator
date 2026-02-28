export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'paypal' | 'other';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  notes: string;
}
