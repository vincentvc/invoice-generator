'use client';

import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function BoldPreview({ invoice }: { invoice: InvoiceData }) {
  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const labelStyle: React.CSSProperties = { fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', fontWeight: 700, marginBottom: '0.4em' };

  return (
    <div style={{ padding: '3em', fontFamily: 'Arial, Helvetica, sans-serif', color: '#0F172A', fontSize: '1em', height: '100%', backgroundColor: '#FFFFFF', lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '2em', marginBottom: '2em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {invoice.logo && (
            <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '12em', marginBottom: '0.5em', objectFit: 'contain' }} />
          )}
          <h1 style={{ fontSize: '2.5em', margin: 0, fontWeight: 900, letterSpacing: '0.1em' }}>INVOICE</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1em', fontWeight: 700, marginBottom: '0.3em' }}>{invoice.invoiceNumber}</div>
          <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
            <div>Issued: {new Date(invoice.issueDate).toLocaleDateString()}</div>
            <div>Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
            {invoice.paymentTerms && <div>Terms: {invoice.paymentTerms}</div>}
          </div>
        </div>
      </div>

      {/* Parties */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2em', marginBottom: '2em' }}>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>From</div>
          <div style={{ borderLeft: '4px solid #EF4444', paddingLeft: '1em' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.3em', fontSize: '1em' }}>{invoice.sender.name}</div>
            {invoice.sender.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#475569' }}>{invoice.sender.address}</div>}
            {invoice.sender.email && <div style={{ fontSize: '0.8em', color: '#475569' }}>{invoice.sender.email}</div>}
            {invoice.sender.phone && <div style={{ fontSize: '0.8em', color: '#475569' }}>{invoice.sender.phone}</div>}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={labelStyle}>Bill To</div>
          <div style={{ borderLeft: '4px solid #EF4444', paddingLeft: '1em' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.3em', fontSize: '1em' }}>{invoice.recipient.name}</div>
            {invoice.recipient.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#475569' }}>{invoice.recipient.address}</div>}
            {invoice.recipient.email && <div style={{ fontSize: '0.8em', color: '#475569' }}>{invoice.recipient.email}</div>}
            {invoice.recipient.phone && <div style={{ fontSize: '0.8em', color: '#475569' }}>{invoice.recipient.phone}</div>}
          </div>
        </div>
        {invoice.hasShipTo && (
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Ship To</div>
            <div style={{ borderLeft: '4px solid #EF4444', paddingLeft: '1em' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.3em' }}>{invoice.shipTo?.name}</div>
              {invoice.shipTo?.address && <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#475569' }}>{invoice.shipTo?.address}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '4px', backgroundColor: '#EF4444', marginBottom: '1.5em' }} />

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em' }}>
        <thead>
          <tr style={{ backgroundColor: '#F1F5F9' }}>
            <th style={{ padding: '0.8em 1em', textAlign: 'left', fontWeight: 800, fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0F172A' }}>Description</th>
            <th style={{ padding: '0.8em 1em', textAlign: 'center', fontWeight: 800, fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0F172A', width: '8%' }}>Qty</th>
            <th style={{ padding: '0.8em 1em', textAlign: 'right', fontWeight: 800, fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0F172A', width: '15%' }}>Rate</th>
            <th style={{ padding: '0.8em 1em', textAlign: 'right', fontWeight: 800, fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0F172A', width: '15%' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '2px solid #E2E8F0' }}>
              <td style={{ padding: '0.8em 1em', fontSize: '0.9em' }}>{item.description}</td>
              <td style={{ padding: '0.8em 1em', textAlign: 'center', fontSize: '0.9em' }}>{item.quantity}</td>
              <td style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.9em' }}>{formatCurrency(item.rate, invoice.currency)}</td>
              <td style={{ padding: '0.8em 1em', textAlign: 'right', fontSize: '0.9em', fontWeight: 600 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2em' }}>
        <div style={{ width: '24em' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
            <span style={{ color: '#64748B' }}>Subtotal</span><span style={{ fontWeight: 600 }}>{formatCurrency(subtotal, invoice.currency)}</span>
          </div>
          {(taxAmount > 0 || itemTax > 0) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
              <span style={{ color: '#64748B' }}>Tax</span><span style={{ fontWeight: 600 }}>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
              <span style={{ color: '#64748B' }}>Discount</span><span style={{ fontWeight: 600 }}>-{formatCurrency(discountAmount, invoice.currency)}</span>
            </div>
          )}
          {invoice.shipping > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
              <span style={{ color: '#64748B' }}>Shipping</span><span style={{ fontWeight: 600 }}>{formatCurrency(invoice.shipping, invoice.currency)}</span>
            </div>
          )}
          <div style={{ height: '3px', backgroundColor: '#0F172A', margin: '0.5em 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 0', fontSize: '1.3em', fontWeight: 900 }}>
            <span>TOTAL</span><span style={{ color: '#EF4444' }}>{formatCurrency(total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div style={{ borderTop: '3px solid #0F172A', paddingTop: '1.5em', display: 'flex', gap: '2em' }}>
          {invoice.notes && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Notes</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#475569' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Terms & Conditions</div>
              <div style={{ fontSize: '0.8em', whiteSpace: 'pre-line', color: '#475569' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
