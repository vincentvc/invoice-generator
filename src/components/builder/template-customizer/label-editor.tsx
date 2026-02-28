'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTemplateConfigStore } from '@/stores/template-config-store';
import { TemplateLabels } from '@/types/template-config';

const LABEL_GROUPS: { title: string; fields: { key: keyof TemplateLabels; label: string }[] }[] = [
  {
    title: 'Document',
    fields: [
      { key: 'invoiceTitle', label: 'Title' },
      { key: 'invoiceNumberLabel', label: 'Invoice #' },
    ],
  },
  {
    title: 'Addresses',
    fields: [
      { key: 'fromLabel', label: 'From' },
      { key: 'billToLabel', label: 'Bill To' },
      { key: 'shipToLabel', label: 'Ship To' },
    ],
  },
  {
    title: 'Dates & Terms',
    fields: [
      { key: 'issueDateLabel', label: 'Issue Date' },
      { key: 'dueDateLabel', label: 'Due Date' },
      { key: 'paymentTermsLabel', label: 'Terms' },
      { key: 'poNumberLabel', label: 'PO Number' },
    ],
  },
  {
    title: 'Line Items',
    fields: [
      { key: 'descriptionLabel', label: 'Description' },
      { key: 'quantityLabel', label: 'Quantity' },
      { key: 'rateLabel', label: 'Rate' },
      { key: 'amountLabel', label: 'Amount' },
    ],
  },
  {
    title: 'Totals',
    fields: [
      { key: 'subtotalLabel', label: 'Subtotal' },
      { key: 'taxLabel', label: 'Tax' },
      { key: 'discountLabel', label: 'Discount' },
      { key: 'shippingLabel', label: 'Shipping' },
      { key: 'totalLabel', label: 'Total' },
    ],
  },
  {
    title: 'Footer',
    fields: [
      { key: 'notesLabel', label: 'Notes' },
      { key: 'termsLabel', label: 'Terms' },
    ],
  },
];

export function LabelEditor() {
  const labels = useTemplateConfigStore((s) => s.config.labels);
  const updateLabel = useTemplateConfigStore((s) => s.updateLabel);

  return (
    <div className="space-y-4">
      {LABEL_GROUPS.map((group) => (
        <div key={group.title}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {group.title}
          </h4>
          <div className="grid gap-2">
            {group.fields.map((field) => (
              <div key={field.key} className="flex items-center gap-2">
                <Label className="text-xs w-20 shrink-0 text-muted-foreground">{field.label}</Label>
                <Input
                  value={labels[field.key]}
                  onChange={(e) => updateLabel(field.key, e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
