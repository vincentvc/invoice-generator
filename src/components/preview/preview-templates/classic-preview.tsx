'use client';

import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function ClassicPreview({ invoice }: { invoice: InvoiceData }) {
  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const divider = { borderBottom: '2px solid #000000', marginBottom: '1.5em', paddingBottom: '1.5em' };

  return (
    <div style={{ padding: '3em', fontFamily: 'Georgia, Times New Roman, serif', color: '#000000', fontSize: '1em', height: '100%' }}>
      {/* Header */}
      <div style={{ ...divider, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {invoice.logo && (
            <img src={invoice.logo} alt="Logo" style={{ maxHeight: '5em', maxWidth: '15em', marginBottom: '0.8em', objectFit: 'contain' }} />
          )}
          <div style={{ fontSize: '1.3em', fontWeight: 700 }}>{invoice.sender.name || 'Your Company'}</div>
          {invoice.sender.email && <div style={{ fontSize: '0.85em', color: '#333333', marginTop: '0.2em' }}>{invoice.sender.email}</div>}
          {invoice.sender.phone && <div style={{ fontSize: '0.85em', color: '#333333' }}>{invoice.sender.phone}</div>}
          {invoice.sender.address && <div style={{ fontSize: '0.85em', color: '#333333', whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2em', fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.03em' }}>INVOICE</div>
          <div style={{ fontSize: '0.95em', marginTop: '0.3em' }}>No. {invoice.invoiceNumber}</div>
        </div>
      </div>

      {/* Addresses and Details */}
      <div style={{ ...divider, display: 'flex', justifyContent: 'space-between', gap: '2em' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4em', letterSpacing: '0.05em' }}>Bill To:</div>
          <div style={{ fontWeight: 600 }}>{invoice.recipient.name}</div>
          {invoice.recipient.email && <div style={{ fontSize: '0.85em', color: '#333333' }}>{invoice.recipient.email}</div>}
          {invoice.recipient.phone && <div style={{ fontSize: '0.85em', color: '#333333' }}>{invoice.recipient.phone}</div>}
          {invoice.recipient.address && <div style={{ fontSize: '0.85em', color: '#333333', whiteSpace: 'pre-line' }}>{invoice.recipient.address}</div>}
        </div>

        {invoice.hasShipTo && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4em', letterSpacing: '0.05em' }}>Ship To:</div>
            <div style={{ fontWeight: 600 }}>{invoice.shipTo?.name}</div>
            {invoice.shipTo?.address && <div style={{ fontSize: '0.85em', color: '#333333', whiteSpace: 'pre-line' }}>{invoice.shipTo?.address}</div>}
          </div>
        )}

        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '0.4em' }}>
            <span style={{ fontSize: '0.8em', fontWeight: 700 }}>Issue Date: </span>
            <span>{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}</span>
          </div>
          <div style={{ marginBottom: '0.4em' }}>
            <span style={{ fontSize: '0.8em', fontWeight: 700 }}>Due Date: </span>
            <span>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</span>
          </div>
          {invoice.paymentTerms && (
            <div style={{ marginBottom: '0.4em' }}>
              <span style={{ fontSize: '0.8em', fontWeight: 700 }}>Payment Terms: </span>
              <span>{invoice.paymentTerms}</span>
            </div>
          )}
          {invoice.poNumber && (
            <div>
              <span style={{ fontSize: '0.8em', fontWeight: 700 }}>PO Number: </span>
              <span>{invoice.poNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5em' }}>
        <thead>
          <tr style={{ borderTop: '2px solid #000000', borderBottom: '2px solid #000000' }}>
            <th style={{ padding: '0.7em 0.5em', textAlign: 'left', fontSize: '0.85em', fontWeight: 700 }}>Description</th>
            <th style={{ padding: '0.7em 0.5em', textAlign: 'center', fontSize: '0.85em', fontWeight: 700 }}>Qty</th>
            <th style={{ padding: '0.7em 0.5em', textAlign: 'right', fontSize: '0.85em', fontWeight: 700 }}>Rate</th>
            <th style={{ padding: '0.7em 0.5em', textAlign: 'right', fontSize: '0.85em', fontWeight: 700 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #CCCCCC' }}>
              <td style={{ padding: '0.6em 0.5em' }}>{item.description}</td>
              <td style={{ padding: '0.6em 0.5em', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ padding: '0.6em 0.5em', textAlign: 'right' }}>{formatCurrency(item.rate, invoice.currency)}</td>
              <td style={{ padding: '0.6em 0.5em', textAlign: 'right' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '26em' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', borderBottom: '1px solid #CCCCCC' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, invoice.currency)}</span>
          </div>
          {(taxAmount > 0 || itemTax > 0) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', borderBottom: '1px solid #CCCCCC' }}>
              <span>Tax</span>
              <span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', borderBottom: '1px solid #CCCCCC' }}>
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount, invoice.currency)}</span>
            </div>
          )}
          {invoice.shipping > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4em 0', borderBottom: '1px solid #CCCCCC' }}>
              <span>Shipping</span>
              <span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6em 0', borderTop: '2px solid #000000', borderBottom: '2px solid #000000', fontWeight: 700, fontSize: '1.1em', marginTop: '0.3em' }}>
            <span>Total</span>
            <span>{formatCurrency(total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <div style={{ marginTop: '2.5em', borderTop: '1px solid #CCCCCC', paddingTop: '1.5em', display: 'flex', gap: '2em' }}>
          {invoice.notes && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85em', fontWeight: 700, marginBottom: '0.3em' }}>Notes</div>
              <div style={{ fontSize: '0.85em', color: '#333333', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85em', fontWeight: 700, marginBottom: '0.3em' }}>Terms & Conditions</div>
              <div style={{ fontSize: '0.85em', color: '#333333', whiteSpace: 'pre-line' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
