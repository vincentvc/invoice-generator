'use client';

import { InvoiceData } from '@/types/invoice';
import { TemplateConfig } from '@/types/template-config';
import { formatCurrency } from '@/lib/currencies';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function CorporatePreview({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;

  const subtotal = calcSubtotal(invoice.items);
  const itemTax = calcItemTax(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);

  const navy = '#1E3A5F';
  const navyLight = '#2C5282';
  const gold = '#D69E2E';

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#1A202C', fontSize: '1em', height: '100%' }}>
      {/* Navy Letterhead Header */}
      {vis.header && (
        <>
          <div style={{ backgroundColor: navy, color: '#FFFFFF', padding: '2em 3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em' }}>
              {invoice.logo && (
                <img src={invoice.logo} alt="Logo" style={{ maxHeight: '4.5em', maxWidth: '12em', objectFit: 'contain' }} />
              )}
              <div>
                <div style={{ fontSize: '1.3em', fontWeight: 700, letterSpacing: '0.02em' }}>{invoice.sender.name || 'Your Company'}</div>
                {invoice.sender.email && <div style={{ fontSize: '0.78em', opacity: 0.85 }}>{invoice.sender.email}</div>}
                {invoice.sender.phone && <div style={{ fontSize: '0.78em', opacity: 0.85 }}>{invoice.sender.phone}</div>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8em', fontWeight: 800, letterSpacing: '0.08em' }}>{labels.invoiceTitle}</div>
              <div style={{ height: '3px', backgroundColor: gold, marginTop: '0.3em', marginLeft: 'auto', width: '4em' }} />
            </div>
          </div>
          {/* Gold accent bar */}
          <div style={{ height: '4px', backgroundColor: gold }} />
        </>
      )}

      <div style={{ padding: '2em 3em 3em' }}>
        {/* Sender address and invoice meta */}
        {vis.meta && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5em', marginBottom: '2em', paddingBottom: '1.5em', borderBottom: '2px solid #E2E8F0' }}>
            <div>
              {invoice.sender.address && (
                <div style={{ fontSize: '0.8em', color: '#4A5568', whiteSpace: 'pre-line' }}>{invoice.sender.address}</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: '0.72em', fontWeight: 600, textTransform: 'uppercase', color: navy, letterSpacing: '0.08em', marginBottom: '0.3em' }}>Invoice Details</div>
              <div style={{ fontSize: '0.85em', marginBottom: '0.3em' }}><strong>Number:</strong> {invoice.invoiceNumber}</div>
              <div style={{ fontSize: '0.85em', marginBottom: '0.3em' }}><strong>{labels.issueDateLabel + ':'}</strong> {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}</div>
              <div style={{ fontSize: '0.85em', marginBottom: '0.3em' }}><strong>{labels.dueDateLabel + ':'}</strong> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</div>
              {invoice.paymentTerms && <div style={{ fontSize: '0.85em', marginBottom: '0.3em' }}><strong>{labels.paymentTermsLabel + ':'}</strong> {invoice.paymentTerms}</div>}
              {invoice.poNumber && <div style={{ fontSize: '0.85em' }}><strong>{labels.poNumberLabel + ':'}</strong> {invoice.poNumber}</div>}
            </div>
            <div />
          </div>
        )}

        {/* Bill To / Ship To */}
        {vis.addresses && (
          <div style={{ display: 'grid', gridTemplateColumns: invoice.hasShipTo ? '1fr 1fr' : '1fr', gap: '2em', marginBottom: '2em' }}>
            <div style={{ border: '1px solid #E2E8F0', padding: '1.2em', backgroundColor: '#F7FAFC' }}>
              <div style={{ fontSize: '0.72em', fontWeight: 600, textTransform: 'uppercase', color: navy, letterSpacing: '0.08em', marginBottom: '0.5em' }}>{labels.billToLabel}</div>
              <div style={{ fontWeight: 600 }}>{invoice.recipient.name}</div>
              {invoice.recipient.email && <div style={{ fontSize: '0.82em', color: '#4A5568' }}>{invoice.recipient.email}</div>}
              {invoice.recipient.phone && <div style={{ fontSize: '0.82em', color: '#4A5568' }}>{invoice.recipient.phone}</div>}
              {invoice.recipient.address && <div style={{ fontSize: '0.82em', color: '#4A5568', whiteSpace: 'pre-line' }}>{invoice.recipient.address}</div>}
            </div>

            {invoice.hasShipTo && (
              <div style={{ border: '1px solid #E2E8F0', padding: '1.2em', backgroundColor: '#F7FAFC' }}>
                <div style={{ fontSize: '0.72em', fontWeight: 600, textTransform: 'uppercase', color: navy, letterSpacing: '0.08em', marginBottom: '0.5em' }}>{labels.shipToLabel}</div>
                <div style={{ fontWeight: 600 }}>{invoice.shipTo?.name}</div>
                {invoice.shipTo?.address && <div style={{ fontSize: '0.82em', color: '#4A5568', whiteSpace: 'pre-line' }}>{invoice.shipTo?.address}</div>}
              </div>
            )}
          </div>
        )}

        {/* Items Table */}
        {vis.lineItems && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2em', border: '1px solid #CBD5E0' }}>
            <thead>
              <tr style={{ backgroundColor: navy, color: '#FFFFFF' }}>
                <th style={{ padding: '0.7em 1em', textAlign: 'left', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid ' + navyLight }}>{labels.descriptionLabel}</th>
                <th style={{ padding: '0.7em 1em', textAlign: 'center', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid ' + navyLight }}>{labels.quantityLabel}</th>
                <th style={{ padding: '0.7em 1em', textAlign: 'right', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid ' + navyLight }}>{labels.rateLabel}</th>
                <th style={{ padding: '0.7em 1em', textAlign: 'right', fontSize: '0.78em', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{labels.amountLabel}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F7FAFC' }}>
                  <td style={{ padding: '0.65em 1em', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>{item.description}</td>
                  <td style={{ padding: '0.65em 1em', textAlign: 'center', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>{item.quantity}</td>
                  <td style={{ padding: '0.65em 1em', textAlign: 'right', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                  <td style={{ padding: '0.65em 1em', textAlign: 'right', borderBottom: '1px solid #E2E8F0' }}>{formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Totals */}
        {vis.totals && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '28em', border: '1px solid #CBD5E0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 1em', borderBottom: '1px solid #E2E8F0' }}>
                <span style={{ color: '#4A5568' }}>{labels.subtotalLabel}</span>
                <span>{formatCurrency(subtotal, invoice.currency)}</span>
              </div>
              {(taxAmount > 0 || itemTax > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 1em', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#4A5568' }}>{labels.taxLabel}</span>
                  <span>{formatCurrency(taxAmount + itemTax, invoice.currency)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 1em', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#4A5568' }}>{labels.discountLabel}</span>
                  <span>-{formatCurrency(discountAmount, invoice.currency)}</span>
                </div>
              )}
              {invoice.shipping > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5em 1em', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#4A5568' }}>{labels.shippingLabel}</span>
                  <span>{formatCurrency(invoice.shipping, invoice.currency)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7em 1em', backgroundColor: navy, color: '#FFFFFF', fontWeight: 700, fontSize: '1.05em' }}>
                <span>{labels.totalLabel}</span>
                <span>{formatCurrency(total, invoice.currency)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes and Terms */}
        {vis.noteTerms && (invoice.notes || invoice.terms) && (
          <div style={{ marginTop: '2.5em', display: 'flex', gap: '2em' }}>
            {invoice.notes && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72em', fontWeight: 600, textTransform: 'uppercase', color: navy, letterSpacing: '0.08em', marginBottom: '0.4em' }}>{labels.notesLabel}</div>
                <div style={{ fontSize: '0.82em', color: '#4A5568', whiteSpace: 'pre-line' }}>{invoice.notes}</div>
              </div>
            )}
            {invoice.terms && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72em', fontWeight: 600, textTransform: 'uppercase', color: navy, letterSpacing: '0.08em', marginBottom: '0.4em' }}>{labels.termsLabel}</div>
                <div style={{ fontSize: '0.82em', color: '#4A5568', whiteSpace: 'pre-line' }}>{invoice.terms}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
