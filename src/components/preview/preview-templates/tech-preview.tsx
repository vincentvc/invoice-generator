'use client';

import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';
import { formatCurrency } from '@/lib/currencies';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function TechPreview({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const labelStyle: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#10B981', fontWeight: 600, marginBottom: '0.4em' };

  return (
    <div style={{ padding: '3em', fontFamily: 'Consolas, Monaco, Courier New, monospace', color: '#E2E8F0', fontSize: '1em', height: '100%', backgroundColor: '#1E293B', lineHeight: 1.6 }}>
      {/* Header */}
      {vis.header && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '1.5em', marginBottom: '1.5em' }}>
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '12em', marginBottom: '1em', objectFit: 'contain' }} />
            )}
            <div style={{ fontSize: '0.7em', color: '#10B981', marginBottom: '0.3em' }}>{'>'} {labels.invoiceTitle}</div>
            <h1 style={{ fontSize: '2em', margin: 0, color: '#10B981', fontWeight: 400 }}>{invoice.invoiceNumber}</h1>
          </div>
          <div style={{ textAlign: 'right', backgroundColor: '#0F172A', padding: '1em 1.5em', borderRadius: '0.3em', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75em', color: '#64748B' }}>
              <div><span style={{ color: '#10B981' }}>{labels.issueDateLabel.toLowerCase()}:</span> {new Date(invoice.issueDate).toLocaleDateString()}</div>
              <div><span style={{ color: '#10B981' }}>{labels.dueDateLabel.toLowerCase()}:</span> {new Date(invoice.dueDate).toLocaleDateString()}</div>
              {invoice.paymentTerms && <div><span style={{ color: '#10B981' }}>{labels.paymentTermsLabel.toLowerCase()}:</span> {invoice.paymentTerms}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Parties */}
      {vis.addresses && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2em', marginBottom: '2em' }}>
          <div style={{ flex: 1, backgroundColor: '#0F172A', padding: '1em', borderRadius: '0.3em', border: '1px solid #334155' }}>
            <div style={labelStyle}>{labels.fromLabel}</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3em', color: '#F8FAFC' }}>{invoice.sender.name}</div>
            {invoice.sender.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#94A3B8' }}>{invoice.sender.address}</div>}
            {invoice.sender.email && <div style={{ fontSize: '0.8em', color: '#94A3B8' }}>{invoice.sender.email}</div>}
            {invoice.sender.phone && <div style={{ fontSize: '0.8em', color: '#94A3B8' }}>{invoice.sender.phone}</div>}
          </div>
          <div style={{ flex: 1, backgroundColor: '#0F172A', padding: '1em', borderRadius: '0.3em', border: '1px solid #334155' }}>
            <div style={labelStyle}>{labels.billToLabel}</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3em', color: '#F8FAFC' }}>{invoice.recipient.name}</div>
            {invoice.recipient.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#94A3B8' }}>{invoice.recipient.address}</div>}
            {invoice.recipient.email && <div style={{ fontSize: '0.8em', color: '#94A3B8' }}>{invoice.recipient.email}</div>}
            {invoice.recipient.phone && <div style={{ fontSize: '0.8em', color: '#94A3B8' }}>{invoice.recipient.phone}</div>}
          </div>
          {invoice.hasShipTo && (
            <div style={{ flex: 1, backgroundColor: '#0F172A', padding: '1em', borderRadius: '0.3em', border: '1px solid #334155' }}>
              <div style={labelStyle}>{labels.shipToLabel}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.3em', color: '#F8FAFC' }}>{invoice.shipTo?.name}</div>
              {invoice.shipTo?.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#94A3B8' }}>{invoice.shipTo?.address}</div>}
            </div>
          )}
        </div>
      )}

      {/* Items Table */}
      {vis.lineItems && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '0.8em 1em', textAlign: 'left', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10B981' }}>{labels.descriptionLabel.toLowerCase()}</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10B981', width: '8%' }}>{labels.quantityLabel.toLowerCase()}</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10B981', width: '15%' }}>{labels.rateLabel.toLowerCase()}</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10B981', width: '15%' }}>{labels.amountLabel.toLowerCase()}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #1E293B', backgroundColor: index % 2 === 0 ? 'transparent' : '#0F172A' }}>
                <td style={{ padding: '0.7em 1em', fontSize: '0.85em' }}>{item.description}</td>
                <td style={{ padding: '0.7em 1em', textAlign: 'center', fontSize: '0.85em', color: '#94A3B8' }}>{item.quantity}</td>
                <td style={{ padding: '0.7em 1em', textAlign: 'right', fontSize: '0.85em', color: '#94A3B8' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                <td style={{ padding: '0.7em 1em', textAlign: 'right', fontSize: '0.85em', color: '#10B981' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Totals */}
      {vis.totals && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2em' }}>
          <div style={{ width: '24em', backgroundColor: '#0F172A', padding: '1em', borderRadius: '0.3em', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
              <span style={{ color: '#64748B' }}>{labels.subtotalLabel.toLowerCase()}</span><span>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            {(taxAmount > 0 || itemTax > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#64748B' }}>{labels.taxLabel.toLowerCase()}</span><span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#64748B' }}>{labels.discountLabel.toLowerCase()}</span><span>-{formatCurrency(discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#64748B' }}>{labels.shippingLabel.toLowerCase()}</span><span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8em 0 0.2em', borderTop: '1px solid #334155', marginTop: '0.4em', fontSize: '1.2em', fontWeight: 700, color: '#10B981' }}>
              <span>{labels.totalLabel.toLowerCase()} =</span><span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes & Terms */}
      {vis.noteTerms && (invoice.notes || invoice.terms) && (
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5em', display: 'flex', gap: '2em' }}>
          {invoice.notes && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.notesLabel}</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#94A3B8' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.termsLabel}</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#94A3B8' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
