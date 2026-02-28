'use client';

import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';
import { formatCurrency } from '@/lib/currencies';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function ModernPreview({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A', fontSize: '1em', height: '100%' }}>
      {/* Blue Header */}
      {vis.header && (
        <div style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '2.5em 3em', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '15em', marginBottom: '0.8em', objectFit: 'contain' }} />
            )}
            <div style={{ fontSize: '1.4em', fontWeight: 700 }}>{invoice.sender.name || 'Your Company'}</div>
            {invoice.sender.email && <div style={{ fontSize: '0.85em', opacity: 0.9, marginTop: '0.3em' }}>{invoice.sender.email}</div>}
            {invoice.sender.phone && <div style={{ fontSize: '0.85em', opacity: 0.9 }}>{invoice.sender.phone}</div>}
            {invoice.sender.address && <div style={{ fontSize: '0.85em', opacity: 0.9, whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.2em', fontWeight: 800, letterSpacing: '0.05em' }}>{labels.invoiceTitle}</div>
            <div style={{ fontSize: '0.95em', marginTop: '0.5em' }}>#{invoice.invoiceNumber}</div>
          </div>
        </div>
      )}

      <div style={{ padding: '2em 3em 3em' }}>
        {vis.addresses && vis.meta && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2em', gap: '2em' }}>
            {vis.addresses && (
              <>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75em', fontWeight: 600, textTransform: 'uppercase', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '0.5em' }}>{labels.billToLabel}</div>
                  <div style={{ fontWeight: 600 }}>{invoice.recipient.name}</div>
                  {invoice.recipient.email && <div style={{ fontSize: '0.85em', color: '#64748B' }}>{invoice.recipient.email}</div>}
                  {invoice.recipient.phone && <div style={{ fontSize: '0.85em', color: '#64748B' }}>{invoice.recipient.phone}</div>}
                  {invoice.recipient.address && <div style={{ fontSize: '0.85em', color: '#64748B', whiteSpace: 'pre-line' }}>{invoice.recipient.address}</div>}
                </div>

                {invoice.hasShipTo && (
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 600, textTransform: 'uppercase', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '0.5em' }}>{labels.shipToLabel}</div>
                    <div style={{ fontWeight: 600 }}>{invoice.shipTo?.name}</div>
                    {invoice.shipTo?.address && <div style={{ fontSize: '0.85em', color: '#64748B', whiteSpace: 'pre-line' }}>{invoice.shipTo?.address}</div>}
                  </div>
                )}
              </>
            )}

            {vis.meta && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '0.5em' }}>
                  <span style={{ fontSize: '0.75em', color: '#64748B' }}>{labels.issueDateLabel + ':'} </span>
                  <span style={{ fontWeight: 500 }}>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}</span>
                </div>
                <div style={{ marginBottom: '0.5em' }}>
                  <span style={{ fontSize: '0.75em', color: '#64748B' }}>{labels.dueDateLabel + ':'} </span>
                  <span style={{ fontWeight: 500 }}>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</span>
                </div>
                {invoice.paymentTerms && (
                  <div style={{ marginBottom: '0.5em' }}>
                    <span style={{ fontSize: '0.75em', color: '#64748B' }}>{labels.paymentTermsLabel + ':'} </span>
                    <span style={{ fontWeight: 500 }}>{invoice.paymentTerms}</span>
                  </div>
                )}
                {invoice.poNumber && (
                  <div>
                    <span style={{ fontSize: '0.75em', color: '#64748B' }}>{labels.poNumberLabel + ':'} </span>
                    <span style={{ fontWeight: 500 }}>{invoice.poNumber}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {vis.lineItems && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em' }}>
            <thead>
              <tr style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}>
                <th style={{ padding: '0.8em 1em', textAlign: 'left', fontSize: '0.8em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{labels.descriptionLabel}</th>
                <th style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.8em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{labels.quantityLabel}</th>
                <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.8em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{labels.rateLabel}</th>
                <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.8em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{labels.amountLabel}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#F8FAFC' : '#FFFFFF' }}>
                  <td style={{ padding: '0.75em 1em', borderBottom: '1px solid #E2E8F0' }}>{item.description}</td>
                  <td style={{ padding: '0.75em 1em', textAlign: 'center', borderBottom: '1px solid #E2E8F0' }}>{item.quantity}</td>
                  <td style={{ padding: '0.75em 1em', textAlign: 'right', borderBottom: '1px solid #E2E8F0' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                  <td style={{ padding: '0.75em 1em', textAlign: 'right', borderBottom: '1px solid #E2E8F0' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {vis.totals && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '28em' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 0', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ color: '#64748B' }}>{labels.subtotalLabel}</span>
                <span>{formatCurrency(subtotal, invoice.currency)}</span>
              </div>
              {(taxAmount > 0 || itemTax > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>{labels.taxLabel}</span>
                  <span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>{labels.discountLabel}</span>
                  <span>-{formatCurrency(discountAmount, invoice.currency)}</span>
                </div>
              )}
              {invoice.shipping > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B' }}>{labels.shippingLabel}</span>
                  <span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8em 1em', backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 700, fontSize: '1.1em', marginTop: '0.5em', borderRadius: '0.3em' }}>
                <span>{labels.totalLabel}</span>
                <span>{formatCurrency(total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        )}

        {vis.noteTerms && (invoice.notes || invoice.terms) && (
          <div style={{ marginTop: '2.5em', display: 'flex', gap: '2em' }}>
            {invoice.notes && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75em', fontWeight: 600, textTransform: 'uppercase', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '0.4em' }}>{labels.notesLabel}</div>
                <div style={{ fontSize: '0.85em', color: '#64748B', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
              </div>
            )}
            {invoice.terms && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75em', fontWeight: 600, textTransform: 'uppercase', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: '0.4em' }}>{labels.termsLabel}</div>
                <div style={{ fontSize: '0.85em', color: '#64748B', whiteSpace: 'pre-line' }}>{invoice.terms}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
