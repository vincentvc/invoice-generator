'use client';

import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';
import { formatCurrency } from '@/lib/currencies';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function PastelPreview({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const labelStyle: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EC4899', fontWeight: 600, marginBottom: '0.4em' };

  return (
    <div style={{ padding: '3em', fontFamily: 'Inter, Helvetica Neue, sans-serif', color: '#1F2937', fontSize: '1em', height: '100%', backgroundColor: '#FDF2F8', lineHeight: 1.6 }}>
      {/* Header */}
      {vis.header && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5em' }}>
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '12em', marginBottom: '1em', objectFit: 'contain' }} />
            )}
            <h1 style={{ fontSize: '2em', margin: 0, color: '#EC4899', fontWeight: 300, letterSpacing: '0.15em' }}>{labels.invoiceTitle}</h1>
          </div>
          <div style={{ textAlign: 'right', backgroundColor: '#FFFFFF', padding: '1.2em 1.5em', borderRadius: '1em', boxShadow: '0 2px 8px rgba(236,72,153,0.1)' }}>
            <div style={{ fontSize: '0.8em', color: '#EC4899', marginBottom: '0.2em' }}>Invoice</div>
            <div style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: '0.5em' }}>{invoice.invoiceNumber}</div>
            <div style={{ fontSize: '0.75em', color: '#9CA3AF' }}>
              <div>{labels.issueDateLabel}: {new Date(invoice.issueDate).toLocaleDateString()}</div>
              <div>{labels.dueDateLabel}: {new Date(invoice.dueDate).toLocaleDateString()}</div>
              {invoice.paymentTerms && <div>{labels.paymentTermsLabel}: {invoice.paymentTerms}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Parties */}
      {vis.addresses && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5em', marginBottom: '2.5em' }}>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '1.2em', borderRadius: '0.8em' }}>
            <div style={labelStyle}>{labels.fromLabel}</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.sender.name}</div>
            {invoice.sender.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#6B7280' }}>{invoice.sender.address}</div>}
            {invoice.sender.email && <div style={{ fontSize: '0.8em', color: '#6B7280' }}>{invoice.sender.email}</div>}
            {invoice.sender.phone && <div style={{ fontSize: '0.8em', color: '#6B7280' }}>{invoice.sender.phone}</div>}
          </div>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '1.2em', borderRadius: '0.8em' }}>
            <div style={labelStyle}>{labels.billToLabel}</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.recipient.name}</div>
            {invoice.recipient.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#6B7280' }}>{invoice.recipient.address}</div>}
            {invoice.recipient.email && <div style={{ fontSize: '0.8em', color: '#6B7280' }}>{invoice.recipient.email}</div>}
            {invoice.recipient.phone && <div style={{ fontSize: '0.8em', color: '#6B7280' }}>{invoice.recipient.phone}</div>}
          </div>
          {invoice.hasShipTo && (
            <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '1.2em', borderRadius: '0.8em' }}>
              <div style={labelStyle}>{labels.shipToLabel}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.shipTo?.name}</div>
              {invoice.shipTo?.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#6B7280' }}>{invoice.shipTo?.address}</div>}
            </div>
          )}
        </div>
      )}

      {/* Items Table */}
      {vis.lineItems && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em', backgroundColor: '#FFFFFF', borderRadius: '0.8em', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.8em 1em', textAlign: 'left', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EC4899', backgroundColor: '#FDF2F8' }}>{labels.descriptionLabel}</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EC4899', backgroundColor: '#FDF2F8', width: '8%' }}>{labels.quantityLabel}</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EC4899', backgroundColor: '#FDF2F8', width: '15%' }}>{labels.rateLabel}</th>
              <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EC4899', backgroundColor: '#FDF2F8', width: '15%' }}>{labels.amountLabel}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #FCE7F3' }}>
                <td style={{ padding: '0.8em 1em', fontSize: '0.85em' }}>{item.description}</td>
                <td style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.85em', color: '#6B7280' }}>{item.quantity}</td>
                <td style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.85em', color: '#6B7280' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                <td style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.85em', fontWeight: 600 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Totals */}
      {vis.totals && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2em' }}>
          <div style={{ width: '24em', backgroundColor: '#FFFFFF', padding: '1.2em', borderRadius: '0.8em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
              <span style={{ color: '#9CA3AF' }}>{labels.subtotalLabel}</span><span>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            {(taxAmount > 0 || itemTax > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#9CA3AF' }}>{labels.taxLabel}</span><span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#9CA3AF' }}>{labels.discountLabel}</span><span>-{formatCurrency(discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
                <span style={{ color: '#9CA3AF' }}>{labels.shippingLabel}</span><span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8em 0 0.2em', borderTop: '2px solid #FCE7F3', marginTop: '0.4em', fontSize: '1.2em', fontWeight: 700, color: '#EC4899' }}>
              <span>{labels.totalLabel}</span><span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes & Terms */}
      {vis.noteTerms && (invoice.notes || invoice.terms) && (
        <div style={{ display: 'flex', gap: '1.5em', marginTop: '1em' }}>
          {invoice.notes && (
            <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '1.2em', borderRadius: '0.8em' }}>
              <div style={labelStyle}>{labels.notesLabel}</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#6B7280' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '1.2em', borderRadius: '0.8em' }}>
              <div style={labelStyle}>{labels.termsLabel}</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#6B7280' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
