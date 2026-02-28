'use client';

import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function BrandedPreview({ invoice }: { invoice: InvoiceData }) {
  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const primary = '#3B82F6';
  const primaryLight = '#EFF6FF';
  const labelStyle: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.12em', color: primary, fontWeight: 600, marginBottom: '0.4em' };

  return (
    <div style={{ padding: '3em', fontFamily: 'Inter, Helvetica Neue, sans-serif', color: '#1E293B', fontSize: '1em', height: '100%', backgroundColor: '#FFFFFF', lineHeight: 1.6 }}>
      {/* Header with brand bar */}
      <div style={{ height: '4px', backgroundColor: primary, marginBottom: '2em' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5em' }}>
        <div>
          {invoice.logo && (
            <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '14em', marginBottom: '1em', objectFit: 'contain' }} />
          )}
          <div style={{ fontSize: '0.85em', fontWeight: 500, color: '#475569' }}>{invoice.sender.name}</div>
          {invoice.sender.email && <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>{invoice.sender.email}</div>}
          {invoice.sender.phone && <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>{invoice.sender.phone}</div>}
          {invoice.sender.address && <div style={{ fontSize: '0.75em', color: '#94A3B8', whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '2em', margin: '0 0 0.3em 0', color: primary, fontWeight: 700, letterSpacing: '0.08em' }}>INVOICE</h1>
          <div style={{ fontSize: '1em', fontWeight: 600, marginBottom: '0.5em' }}>{invoice.invoiceNumber}</div>
          <div style={{ fontSize: '0.75em', color: '#94A3B8' }}>
            <div>Issued: {new Date(invoice.issueDate).toLocaleDateString()}</div>
            <div>Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
            {invoice.paymentTerms && <div>Terms: {invoice.paymentTerms}</div>}
          </div>
        </div>
      </div>

      {/* Parties */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2em', marginBottom: '2.5em', padding: '1.5em', backgroundColor: primaryLight, borderRadius: '0.5em' }}>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Bill To</div>
          <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.recipient.name}</div>
          {invoice.recipient.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#64748B' }}>{invoice.recipient.address}</div>}
          {invoice.recipient.email && <div style={{ fontSize: '0.8em', color: '#64748B' }}>{invoice.recipient.email}</div>}
          {invoice.recipient.phone && <div style={{ fontSize: '0.8em', color: '#64748B' }}>{invoice.recipient.phone}</div>}
        </div>
        {invoice.hasShipTo && (
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Ship To</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.shipTo?.name}</div>
            {invoice.shipTo?.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#64748B' }}>{invoice.shipTo?.address}</div>}
          </div>
        )}
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #3B82F6' }}>
            <th style={{ padding: '0.8em 1em', textAlign: 'left', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary }}>Description</th>
            <th style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, width: '8%' }}>Qty</th>
            <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, width: '15%' }}>Rate</th>
            <th style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, width: '15%' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: index % 2 === 0 ? 'transparent' : primaryLight }}>
              <td style={{ padding: '0.8em 1em', fontSize: '0.85em' }}>{item.description}</td>
              <td style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.85em', color: '#64748B' }}>{item.quantity}</td>
              <td style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.85em', color: '#64748B' }}>{formatCurrency(item.rate, invoice.currency)}</td>
              <td style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.85em', fontWeight: 600 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2em' }}>
        <div style={{ width: '24em' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
            <span style={{ color: '#94A3B8' }}>Subtotal</span><span>{formatCurrency(subtotal, invoice.currency)}</span>
          </div>
          {(taxAmount > 0 || itemTax > 0) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
              <span style={{ color: '#94A3B8' }}>Tax</span><span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
              <span style={{ color: '#94A3B8' }}>Discount</span><span>-{formatCurrency(discountAmount, invoice.currency)}</span>
            </div>
          )}
          {invoice.shipping > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.85em' }}>
              <span style={{ color: '#94A3B8' }}>Shipping</span><span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8em 1em', marginTop: '0.5em', backgroundColor: primary, color: '#FFFFFF', borderRadius: '0.3em', fontSize: '1.1em', fontWeight: 700 }}>
            <span>Total</span><span>{formatCurrency(total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5em', display: 'flex', gap: '2em' }}>
          {invoice.notes && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Notes</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#64748B' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Terms & Conditions</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#64748B' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}

      {/* Bottom brand bar */}
      <div style={{ height: '4px', backgroundColor: primary, marginTop: '2em' }} />
    </div>
  );
}
