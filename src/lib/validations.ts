import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  rate: z.number().min(0, 'Rate must be positive'),
  amount: z.number(),
  taxRate: z.number().optional(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  sender: addressSchema,
  recipient: addressSchema,
  items: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export const paymentRecordSchema = z.object({
  id: z.string(),
  date: z.string().min(1, 'Date is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['cash', 'check', 'bank_transfer', 'credit_card', 'paypal', 'other']),
  reference: z.string(),
  notes: z.string(),
});

export const recurrenceConfigSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  nextDueDate: z.string(),
  lastGeneratedDate: z.string().nullable(),
});

export const templateConfigSchema = z.object({
  baseTemplate: z.string(),
  sectionOrder: z.array(z.enum(['header', 'addresses', 'meta', 'lineItems', 'totals', 'noteTerms'])),
  labels: z.object({
    invoiceTitle: z.string(),
    fromLabel: z.string(),
    billToLabel: z.string(),
    shipToLabel: z.string(),
    issueDateLabel: z.string(),
    dueDateLabel: z.string(),
    paymentTermsLabel: z.string(),
    poNumberLabel: z.string(),
    invoiceNumberLabel: z.string(),
    descriptionLabel: z.string(),
    quantityLabel: z.string(),
    rateLabel: z.string(),
    amountLabel: z.string(),
    subtotalLabel: z.string(),
    taxLabel: z.string(),
    discountLabel: z.string(),
    shippingLabel: z.string(),
    totalLabel: z.string(),
    notesLabel: z.string(),
    termsLabel: z.string(),
  }),
  visibility: z.object({
    header: z.boolean(),
    addresses: z.boolean(),
    meta: z.boolean(),
    lineItems: z.boolean(),
    totals: z.boolean(),
    noteTerms: z.boolean(),
  }),
});

export const signUpSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const settingsSchema = z.object({
  company: z.object({
    name: z.string(),
    email: z.string().email('Invalid email').or(z.literal('')),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    taxId: z.string(),
    logo: z.string().nullable(),
  }),
  defaults: z.object({
    currency: z.string(),
    paymentTerms: z.string(),
    taxRates: z.array(z.number()),
    defaultNotes: z.string(),
    defaultTerms: z.string(),
  }),
  appearance: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    preferredTemplate: z.string(),
  }),
});
