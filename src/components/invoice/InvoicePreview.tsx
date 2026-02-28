'use client';

import { formatCurrency } from '@/lib/currencies';
import { getTemplate } from '@/lib/templates';
import type { Invoice } from '@/types/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const template = getTemplate(invoice.templateId);
  const accentColor = template.primaryColor;

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-[210mm] mx-auto text-sm leading-relaxed">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.logo ? (
            <img
              src={invoice.logo}
              alt="Logo"
              className="max-h-16 max-w-[180px] object-contain mb-3"
            />
          ) : (
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: accentColor }}
            >
              {invoice.from.name || 'Your Company'}
            </div>
          )}
          {invoice.logo && invoice.from.name && (
            <div className="font-semibold text-base">{invoice.from.name}</div>
          )}
          {invoice.from.address && (
            <div className="text-gray-600 text-xs mt-1 whitespace-pre-line">
              {invoice.from.address}
            </div>
          )}
          {invoice.from.email && (
            <div className="text-gray-600 text-xs">{invoice.from.email}</div>
          )}
          {invoice.from.phone && (
            <div className="text-gray-600 text-xs">{invoice.from.phone}</div>
          )}
        </div>
        <div className="text-right">
          <div
            className="text-3xl font-bold uppercase tracking-wider mb-2"
            style={{ color: accentColor }}
          >
            Invoice
          </div>
          {invoice.invoiceNumber && (
            <div className="text-gray-600">
              <span className="font-medium">#{invoice.invoiceNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bill To & Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: accentColor }}
          >
            Bill To
          </div>
          {invoice.to.name && (
            <div className="font-semibold">{invoice.to.name}</div>
          )}
          {invoice.to.address && (
            <div className="text-gray-600 text-xs whitespace-pre-line">
              {invoice.to.address}
            </div>
          )}
          {invoice.to.email && (
            <div className="text-gray-600 text-xs">{invoice.to.email}</div>
          )}
          {invoice.to.phone && (
            <div className="text-gray-600 text-xs">{invoice.to.phone}</div>
          )}
          {invoice.to.taxId && (
            <div className="text-gray-600 text-xs">Tax ID: {invoice.to.taxId}</div>
          )}
        </div>
        <div className="text-right space-y-1">
          {invoice.date && (
            <div>
              <span className="text-gray-500 text-xs">Date: </span>
              <span className="text-xs font-medium">
                {new Date(invoice.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {invoice.dueDate && (
            <div>
              <span className="text-gray-500 text-xs">Due Date: </span>
              <span className="text-xs font-medium">
                {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          {invoice.poNumber && (
            <div>
              <span className="text-gray-500 text-xs">PO #: </span>
              <span className="text-xs font-medium">{invoice.poNumber}</span>
            </div>
          )}
          {invoice.from.taxId && (
            <div>
              <span className="text-gray-500 text-xs">Tax ID: </span>
              <span className="text-xs font-medium">{invoice.from.taxId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: accentColor }}>
              <th className="text-left text-white text-xs font-semibold py-2 px-3 rounded-tl">
                Description
              </th>
              <th className="text-right text-white text-xs font-semibold py-2 px-3 w-20">
                Qty
              </th>
              <th className="text-right text-white text-xs font-semibold py-2 px-3 w-24">
                Rate
              </th>
              <th className="text-right text-white text-xs font-semibold py-2 px-3 w-28 rounded-tr">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="text-xs py-2 px-3">
                  {item.description || 'Item description'}
                </td>
                <td className="text-xs py-2 px-3 text-right">
                  {item.quantity}
                </td>
                <td className="text-xs py-2 px-3 text-right">
                  {formatCurrency(item.rate, invoice.currency)}
                </td>
                <td className="text-xs py-2 px-3 text-right font-medium">
                  {formatCurrency(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1">
          <div className="flex justify-between text-xs py-1">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </span>
          </div>
          {invoice.totalDiscount > 0 && (
            <div className="flex justify-between text-xs py-1 text-green-600">
              <span>
                Discount
                {invoice.discount.type === 'percentage'
                  ? ` (${invoice.discount.value}%)`
                  : ''}
              </span>
              <span>
                -{formatCurrency(invoice.totalDiscount, invoice.currency)}
              </span>
            </div>
          )}
          {invoice.totalTax > 0 && (
            <div className="flex justify-between text-xs py-1">
              <span className="text-gray-600">Tax</span>
              <span>
                {formatCurrency(invoice.totalTax, invoice.currency)}
              </span>
            </div>
          )}
          {invoice.shipping.enabled && invoice.shipping.amount > 0 && (
            <div className="flex justify-between text-xs py-1">
              <span className="text-gray-600">Shipping</span>
              <span>
                {formatCurrency(invoice.shipping.amount, invoice.currency)}
              </span>
            </div>
          )}
          <div
            className="flex justify-between py-2 border-t-2 mt-1"
            style={{ borderColor: accentColor }}
          >
            <span className="font-bold text-sm">Total</span>
            <span className="font-bold text-base" style={{ color: accentColor }}>
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="border-t pt-4 space-y-3">
          {invoice.notes && (
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: accentColor }}
              >
                Notes
              </div>
              <p className="text-xs text-gray-600 whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: accentColor }}
              >
                Terms & Conditions
              </div>
              <p className="text-xs text-gray-600 whitespace-pre-line">
                {invoice.terms}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
