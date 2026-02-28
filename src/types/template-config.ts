export type SectionId = 'header' | 'addresses' | 'meta' | 'lineItems' | 'totals' | 'noteTerms';

export interface TemplateLabels {
  invoiceTitle: string;
  fromLabel: string;
  billToLabel: string;
  shipToLabel: string;
  issueDateLabel: string;
  dueDateLabel: string;
  paymentTermsLabel: string;
  poNumberLabel: string;
  invoiceNumberLabel: string;
  descriptionLabel: string;
  quantityLabel: string;
  rateLabel: string;
  amountLabel: string;
  subtotalLabel: string;
  taxLabel: string;
  discountLabel: string;
  shippingLabel: string;
  totalLabel: string;
  notesLabel: string;
  termsLabel: string;
}

export interface SectionVisibility {
  header: boolean;
  addresses: boolean;
  meta: boolean;
  lineItems: boolean;
  totals: boolean;
  noteTerms: boolean;
}

export interface TemplateConfig {
  baseTemplate: string;
  sectionOrder: SectionId[];
  labels: TemplateLabels;
  visibility: SectionVisibility;
}
