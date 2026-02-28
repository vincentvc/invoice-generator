'use client';

import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';
import { formatCurrency } from '@/lib/currencies';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function RetroPreview({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const labelStyle: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#B45309', fontWeight: 700, marginBottom: '0.4em' };

  return (
    <div style={{ padding: '3em', fontFamily: 'Georgia, Times New Roman, serif', color: '#451A03', fontSize: '1em', height: '100%', backgroundColor: '#FFFBEB', lineHeight: 1.6 }}>
      {vis.header && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px dotted #D97706', paddingBottom: '1.5em', marginBottom: '1.5em' }}>
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '12em', marginBottom: '1em', objectFit: 'contain' }} />
            )}
            <h1 style={{ fontSize: '2.2em', margin: 0, color: '#92400E', fontStyle: 'italic', letterSpacing: '0.05em' }}>{labels.invoiceTitle}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8em', color: '#78350F', marginBottom: '0.3em' }}>Invoice No.</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#92400E', marginBottom: '0.8em' }}>{invoice.invoiceNumber}</div>
            <div style={{ fontSize: '0.8em', color: '#78350F' }}>
              <div>{labels.issueDateLabel}: {new Date(invoice.issueDate).toLocaleDateString()}</div>
              <div>{labels.dueDateLabel}: {new Date(invoice.dueDate).toLocaleDateString()}</div>
              {invoice.paymentTerms && <div style={{ marginTop: '0.3em' }}>{labels.paymentTermsLabel}: {invoice.paymentTerms}</div>}
            </div>
          </div>
        </div>
      )}
      {vis.addresses && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2em', marginBottom: '2em' }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>{labels.fromLabel}</div>
            <div style={{ border: '2px dotted #D97706', padding: '1em', borderRadius: '0.3em' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3em' }}>{invoice.sender.name}</div>
              {invoice.sender.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>}
              {invoice.sender.email && <div style={{ fontSize: '0.8em' }}>{invoice.sender.email}</div>}
              {invoice.sender.phone && <div style={{ fontSize: '0.8em' }}>{invoice.sender.phone}</div>}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>{labels.billToLabel}</div>
            <div style={{ border: '2px dotted #D97706', padding: '1em', borderRadius: '0.3em' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.3em' }}>{invoice.recipient.name}</div>
              {invoice.recipient.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line' }}>{invoice.recipient.address}</div>}
              {invoice.recipient.email && <div style={{ fontSize: '0.8em' }}>{invoice.recipient.email}</div>}
              {invoice.recipient.phone && <div style={{ fontSize: '0.8em' }}>{invoice.recipient.phone}</div>}
            </div>
          </div>
          {invoice.hasShipTo && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.shipToLabel}</div>
              <div style={{ border: '2px dotted #D97706', padding: '1em', borderRadius: '0.3em' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.3em' }}>{invoice.shipTo?.name}</div>
                {invoice.shipTo?.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line' }}>{invoice.shipTo?.address}</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Items Table */}
      {vis.lineItems && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em' }}>
          <thead>
            <tr>
              <th style={{ backgroundColor: '#92400E', color: '#FFFBEB', padding: '0.8em 1em', textAlign: 'left', fontStyle: 'italic' }}>{labels.descriptionLabel}</th>
              <th style={{ backgroundColor: '#92400E', color: '#FFFBEB', padding: '0.8em 1em', textAlign: 'center', fontStyle: 'italic', width: '8%' }}>{labels.quantityLabel}</th>
              <th style={{ backgroundColor: '#92400E', color: '#FFFBEB', padding: '0.8em 1em', textAlign: 'right', fontStyle: 'italic', width: '15%' }}>{labels.rateLabel}</th>
              <th style={{ backgroundColor: '#92400E', color: '#FFFBEB', padding: '0.8em 1em', textAlign: 'right', fontStyle: 'italic', width: '15%' }}>{labels.amountLabel}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#FEF3C7' : '#FFFBEB' }}>
                <td style={{ padding: '0.7em 1em', borderBottom: '1px dotted #D97706' }}>{item.description}</td>
                <td style={{ padding: '0.7em 1em', textAlign: 'center', borderBottom: '1px dotted #D97706' }}>{item.quantity}</td>
                <td style={{ padding: '0.7em 1em', textAlign: 'right', borderBottom: '1px dotted #D97706' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                <td style={{ padding: '0.7em 1em', textAlign: 'right', borderBottom: '1px dotted #D97706' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Totals */}
      {vis.totals && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2em' }}>
          <div style={{ width: '24em', border: '2px dotted #D97706', padding: '1em' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
              <span>{labels.subtotalLabel}</span><span>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            {(taxAmount > 0 || itemTax > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em', color: '#78350F' }}>
                <span>{labels.taxLabel}</span><span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em', color: '#78350F' }}>
                <span>{labels.discountLabel}</span><span>-{formatCurrency(discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em', color: '#78350F' }}>
                <span>{labels.shippingLabel}</span><span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6em 0 0.2em', borderTop: '2px dotted #D97706', marginTop: '0.4em', fontSize: '1.2em', fontWeight: 'bold', color: '#92400E', fontStyle: 'italic' }}>
              <span>{labels.totalLabel}</span><span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Notes & Terms */}
      {vis.noteTerms && (invoice.notes || invoice.terms) && (
        <div style={{ borderTop: '3px dotted #D97706', paddingTop: '1.5em', display: 'flex', gap: '2em' }}>
          {invoice.notes && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.notesLabel}</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#78350F' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>{labels.termsLabel}</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#78350F' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
