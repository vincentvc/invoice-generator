'use client';

import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';
import { formatCurrency } from '@/lib/currencies';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function MinimalPreview({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const labelStyle: React.CSSProperties = { fontSize: '0.65em', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8', fontWeight: 500, marginBottom: '0.3em' };

  return (
    <div style={{ padding: '4em', fontFamily: 'Inter, Helvetica Neue, sans-serif', color: '#1E293B', fontSize: '1em', height: '100%', lineHeight: 1.6 }}>
      {/* Header */}
      {vis.header && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4em' }}>
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" style={{ maxHeight: '4em', maxWidth: '12em', marginBottom: '1em', objectFit: 'contain' }} />
            )}
            <div style={{ fontSize: '0.9em', fontWeight: 500, color: '#475569' }}>{invoice.sender.name}</div>
            {invoice.sender.email && <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>{invoice.sender.email}</div>}
            {invoice.sender.phone && <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>{invoice.sender.phone}</div>}
            {invoice.sender.address && <div style={{ fontSize: '0.75em', color: '#94A3B8', whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 300, letterSpacing: '0.2em', color: '#CBD5E1' }}>{labels.invoiceTitle}</div>
            <div style={{ fontSize: '0.8em', color: '#94A3B8', marginTop: '0.5em' }}>{invoice.invoiceNumber}</div>
          </div>
        </div>
      )}

      {/* Info Grid */}
      {(vis.addresses || vis.meta) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3.5em', gap: '3em' }}>
          {vis.addresses && (
            <>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>{labels.billToLabel}</div>
                <div style={{ fontSize: '0.85em', fontWeight: 500 }}>{invoice.recipient.name}</div>
                {invoice.recipient.email && <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>{invoice.recipient.email}</div>}
                {invoice.recipient.phone && <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>{invoice.recipient.phone}</div>}
                {invoice.recipient.address && <div style={{ fontSize: '0.75em', color: '#94A3B8', whiteSpace: 'pre-line' }}>{invoice.recipient.address}</div>}
              </div>

              {invoice.hasShipTo && (
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>{labels.shipToLabel}</div>
                  <div style={{ fontSize: '0.85em', fontWeight: 500 }}>{invoice.shipTo?.name}</div>
                  {invoice.shipTo?.address && <div style={{ fontSize: '0.75em', color: '#94A3B8', whiteSpace: 'pre-line' }}>{invoice.shipTo?.address}</div>}
                </div>
              )}
            </>
          )}

          {vis.meta && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '0.8em' }}>
                <div style={labelStyle}>{labels.issueDateLabel}</div>
                <div style={{ fontSize: '0.8em' }}>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}</div>
              </div>
              <div style={{ marginBottom: '0.8em' }}>
                <div style={labelStyle}>{labels.dueDateLabel}</div>
                <div style={{ fontSize: '0.8em' }}>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</div>
              </div>
              {invoice.paymentTerms && (
                <div style={{ marginBottom: '0.8em' }}>
                  <div style={labelStyle}>{labels.paymentTermsLabel}</div>
                  <div style={{ fontSize: '0.8em' }}>{invoice.paymentTerms}</div>
                </div>
              )}
              {invoice.poNumber && (
                <div>
                  <div style={labelStyle}>{labels.poNumberLabel}</div>
                  <div style={{ fontSize: '0.8em' }}>{invoice.poNumber}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Items Table */}
      {vis.lineItems && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3em' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '0.8em 0', textAlign: 'left', fontSize: '0.65em', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8' }}>{labels.descriptionLabel}</th>
              <th style={{ padding: '0.8em 0', textAlign: 'center', fontSize: '0.65em', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8' }}>{labels.quantityLabel}</th>
              <th style={{ padding: '0.8em 0', textAlign: 'right', fontSize: '0.65em', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8' }}>{labels.rateLabel}</th>
              <th style={{ padding: '0.8em 0', textAlign: 'right', fontSize: '0.65em', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8' }}>{labels.amountLabel}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.8em 0', fontSize: '0.85em' }}>{item.description}</td>
                <td style={{ padding: '0.8em 0', textAlign: 'center', fontSize: '0.85em', color: '#64748B' }}>{item.quantity}</td>
                <td style={{ padding: '0.8em 0', textAlign: 'right', fontSize: '0.85em', color: '#64748B' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                <td style={{ padding: '0.8em 0', textAlign: 'right', fontSize: '0.85em' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Totals */}
      {vis.totals && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '24em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
              <span style={{ color: '#94A3B8' }}>{labels.subtotalLabel}</span>
              <span>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            {(taxAmount > 0 || itemTax > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#94A3B8' }}>{labels.taxLabel}</span>
                <span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#94A3B8' }}>{labels.discountLabel}</span>
                <span>-{formatCurrency(discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#94A3B8' }}>{labels.shippingLabel}</span>
                <span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8em 0 0', marginTop: '0.5em', borderTop: '1px solid #E2E8F0', fontWeight: 600, fontSize: '1.1em' }}>
              <span>{labels.totalLabel}</span>
              <span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes and Terms */}
      {vis.noteTerms && (invoice.notes || invoice.terms) && (
        <div style={{ marginTop: '4em', display: 'flex', gap: '3em' }}>
          {invoice.notes && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.notesLabel}</div>
              <div style={{ fontSize: '0.75em', color: '#94A3B8', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.termsLabel}</div>
              <div style={{ fontSize: '0.75em', color: '#94A3B8', whiteSpace: 'pre-line' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
