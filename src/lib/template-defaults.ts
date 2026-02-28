import { TemplateLabels, SectionId, SectionVisibility, TemplateConfig } from '@/types/template-config';

export const DEFAULT_LABELS: TemplateLabels = {
  invoiceTitle: 'INVOICE',
  fromLabel: 'From',
  billToLabel: 'Bill To',
  shipToLabel: 'Ship To',
  issueDateLabel: 'Issue Date',
  dueDateLabel: 'Due Date',
  paymentTermsLabel: 'Payment Terms',
  poNumberLabel: 'PO Number',
  invoiceNumberLabel: 'Invoice #',
  descriptionLabel: 'Description',
  quantityLabel: 'Qty',
  rateLabel: 'Rate',
  amountLabel: 'Amount',
  subtotalLabel: 'Subtotal',
  taxLabel: 'Tax',
  discountLabel: 'Discount',
  shippingLabel: 'Shipping',
  totalLabel: 'Total',
  notesLabel: 'Notes',
  termsLabel: 'Terms & Conditions',
};

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'header',
  'addresses',
  'meta',
  'lineItems',
  'totals',
  'noteTerms',
];

export const DEFAULT_VISIBILITY: SectionVisibility = {
  header: true,
  addresses: true,
  meta: true,
  lineItems: true,
  totals: true,
  noteTerms: true,
};

export const TEMPLATE_PRESET_OVERRIDES: Record<string, Partial<TemplateLabels>> = {
  tech: {
    invoiceTitle: '// INVOICE',
    fromLabel: '// sender',
    billToLabel: '// bill_to',
    shipToLabel: '// ship_to',
    descriptionLabel: 'item',
    quantityLabel: 'qty',
    rateLabel: 'rate',
    amountLabel: 'total',
  },
  retro: {
    invoiceTitle: 'INVOICE',
    fromLabel: 'SOLD BY',
    billToLabel: 'SOLD TO',
  },
  corporate: {
    fromLabel: 'Sender',
    billToLabel: 'Billed To',
  },
};

export function createDefaultConfig(templateType: string): TemplateConfig {
  return {
    baseTemplate: templateType,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    labels: { ...DEFAULT_LABELS },
    visibility: { ...DEFAULT_VISIBILITY },
  };
}

export function createPresetConfig(templateType: string): TemplateConfig {
  const config = createDefaultConfig(templateType);
  const overrides = TEMPLATE_PRESET_OVERRIDES[templateType];
  if (overrides) {
    config.labels = { ...config.labels, ...overrides };
  }
  return config;
}
