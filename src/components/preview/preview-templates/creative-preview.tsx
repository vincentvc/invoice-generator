'use client';

import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function CreativePreview({ invoice }: { invoice: InvoiceData }) {
  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const purple = '#7C3AED';
  const purpleLight = '#EDE9FE';
  const purpleMid = '#A78BFA';
  const purpleDark = '#5B21B6';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1E1B4B', fontSize: '1em', height: '100%', backgroundColor: '#FAFAFE' }}>
      {/* Purple Header Block */}
      <div style={{
        background: 'linear-gradient(135deg, ' + purple + ' 0%, ' + purpleDark + ' 100%)',
        color: '#FFFFFF',
        padding: '2.5em 3em',
        borderRadius: '0 0 2em 2em',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-3em', right: '-2em', width: '10em', height: '10em', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-4em', left: '30%', width: '14em', height: '14em', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            {invoice.logo && (
              <img src={invoice.logo} alt="Logo" style={{ maxHeight: '4.5em', maxWidth: '14em', marginBottom: '0.8em', objectFit: 'contain' }} />
            )}
            <div style={{ fontSize: '1.3em', fontWeight: 700 }}>{invoice.sender.name || 'Your Company'}</div>
            {invoice.sender.email && <div style={{ fontSize: '0.8em', opacity: 0.85, marginTop: '0.2em' }}>{invoice.sender.email}</div>}
            {invoice.sender.phone && <div style={{ fontSize: '0.8em', opacity: 0.85 }}>{invoice.sender.phone}</div>}
            {invoice.sender.address && <div style={{ fontSize: '0.8em', opacity: 0.85, whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2em', fontWeight: 800, letterSpacing: '0.06em' }}>INVOICE</div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3em 0.8em', borderRadius: '2em', fontSize: '0.8em', marginTop: '0.5em' }}>
              #{invoice.invoiceNumber}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '2em 3em 3em' }}>
        {/* Date pills */}
        <div style={{ display: 'flex', gap: '1em', marginBottom: '2em', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: purpleLight, padding: '0.6em 1.2em', borderRadius: '2em', fontSize: '0.8em' }}>
            <span style={{ color: purple, fontWeight: 600 }}>Issued: </span>
            {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}
          </div>
          <div style={{ backgroundColor: purpleLight, padding: '0.6em 1.2em', borderRadius: '2em', fontSize: '0.8em' }}>
            <span style={{ color: purple, fontWeight: 600 }}>Due: </span>
            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
          </div>
          {invoice.paymentTerms && (
            <div style={{ backgroundColor: purpleLight, padding: '0.6em 1.2em', borderRadius: '2em', fontSize: '0.8em' }}>
              <span style={{ color: purple, fontWeight: 600 }}>Terms: </span>
              {invoice.paymentTerms}
            </div>
          )}
          {invoice.poNumber && (
            <div style={{ backgroundColor: purpleLight, padding: '0.6em 1.2em', borderRadius: '2em', fontSize: '0.8em' }}>
              <span style={{ color: purple, fontWeight: 600 }}>PO: </span>
              {invoice.poNumber}
            </div>
          )}
        </div>

        {/* Client Cards */}
        <div style={{ display: 'flex', gap: '1.5em', marginBottom: '2.5em' }}>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '1em', padding: '1.5em', boxShadow: '0 2px 8px rgba(124,58,237,0.08)', border: '1px solid #EDE9FE' }}>
            <div style={{ fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', color: purple, letterSpacing: '0.1em', marginBottom: '0.5em' }}>Bill To</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.recipient.name}</div>
            {invoice.recipient.email && <div style={{ fontSize: '0.82em', color: '#6B7280' }}>{invoice.recipient.email}</div>}
            {invoice.recipient.phone && <div style={{ fontSize: '0.82em', color: '#6B7280' }}>{invoice.recipient.phone}</div>}
            {invoice.recipient.address && <div style={{ fontSize: '0.82em', color: '#6B7280', whiteSpace: 'pre-line' }}>{invoice.recipient.address}</div>}
          </div>

          {invoice.hasShipTo && (
            <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '1em', padding: '1.5em', boxShadow: '0 2px 8px rgba(124,58,237,0.08)', border: '1px solid #EDE9FE' }}>
              <div style={{ fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', color: purple, letterSpacing: '0.1em', marginBottom: '0.5em' }}>Ship To</div>
              <div style={{ fontWeight: 600, marginBottom: '0.3em' }}>{invoice.shipTo?.name}</div>
              {invoice.shipTo?.address && <div style={{ fontSize: '0.82em', color: '#6B7280', whiteSpace: 'pre-line' }}>{invoice.shipTo?.address}</div>}
            </div>
          )}
        </div>

        {/* Items Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1em', overflow: 'hidden', boxShadow: '0 2px 8px rgba(124,58,237,0.08)', marginBottom: '2em', border: '1px solid #EDE9FE' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, ' + purple + ', ' + purpleMid + ')', color: '#FFFFFF' }}>
                <th style={{ padding: '0.8em 1.2em', textAlign: 'left', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                <th style={{ padding: '0.8em 1.2em', textAlign: 'center', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                <th style={{ padding: '0.8em 1.2em', textAlign: 'right', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate</th>
                <th style={{ padding: '0.8em 1.2em', textAlign: 'right', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFF' }}>
                  <td style={{ padding: '0.75em 1.2em', borderBottom: '1px solid #F3F0FF' }}>{item.description}</td>
                  <td style={{ padding: '0.75em 1.2em', textAlign: 'center', borderBottom: '1px solid #F3F0FF', color: '#6B7280' }}>{item.quantity}</td>
                  <td style={{ padding: '0.75em 1.2em', textAlign: 'right', borderBottom: '1px solid #F3F0FF', color: '#6B7280' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                  <td style={{ padding: '0.75em 1.2em', textAlign: 'right', borderBottom: '1px solid #F3F0FF', fontWeight: 500 }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '28em', backgroundColor: '#FFFFFF', borderRadius: '1em', padding: '1.2em 1.5em', boxShadow: '0 2px 8px rgba(124,58,237,0.08)', border: '1px solid #EDE9FE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
              <span style={{ color: '#6B7280' }}>Subtotal</span>
              <span>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            {(taxAmount > 0 || itemTax > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
                <span style={{ color: '#6B7280' }}>Tax</span>
                <span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
                <span style={{ color: '#6B7280' }}>Discount</span>
                <span>-{formatCurrency(discountAmount, invoice.currency)}</span>
              </div>
            )}
            {invoice.shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', fontSize: '0.9em' }}>
                <span style={{ color: '#6B7280' }}>Shipping</span>
                <span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.8em 1em',
              marginTop: '0.5em',
              background: 'linear-gradient(135deg, ' + purple + ', ' + purpleDark + ')',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.1em',
              borderRadius: '0.6em',
            }}>
              <span>Total</span>
              <span>{formatCurrency(total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div style={{ marginTop: '2.5em', display: 'flex', gap: '1.5em' }}>
            {invoice.notes && (
              <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '1em', padding: '1.2em 1.5em', boxShadow: '0 2px 8px rgba(124,58,237,0.06)', border: '1px solid #EDE9FE' }}>
                <div style={{ fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', color: purple, letterSpacing: '0.1em', marginBottom: '0.4em' }}>Notes</div>
                <div style={{ fontSize: '0.82em', color: '#6B7280', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
              </div>
            )}
            {invoice.terms && (
              <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '1em', padding: '1.2em 1.5em', boxShadow: '0 2px 8px rgba(124,58,237,0.06)', border: '1px solid #EDE9FE' }}>
                <div style={{ fontSize: '0.7em', fontWeight: 600, textTransform: 'uppercase', color: purple, letterSpacing: '0.1em', marginBottom: '0.4em' }}>Terms & Conditions</div>
                <div style={{ fontSize: '0.82em', color: '#6B7280', whiteSpace: 'pre-line' }}>{invoice.terms}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
