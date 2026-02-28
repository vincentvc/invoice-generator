import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';
import { PdfWatermark } from '../pdf-watermark';
import { TemplateConfig } from '@/types/template-config';
import { DEFAULT_LABELS, DEFAULT_VISIBILITY } from '@/lib/template-defaults';

function fmt(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function formatAddress(addr: { name: string; address: string; city: string; state: string; zip: string; country: string }): string {
  const parts = [addr.address, [addr.city, addr.state, addr.zip].filter(Boolean).join(', '), addr.country].filter(Boolean);
  return parts.join('\n');
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  headerBar: {
    backgroundColor: '#3B82F6',
    height: 6,
    marginBottom: 24,
    marginTop: -40,
    marginLeft: -40,
    marginRight: -40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  invoiceTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#3B82F6',
    textAlign: 'right',
  },
  invoiceMeta: {
    textAlign: 'right',
    marginTop: 6,
  },
  metaLabel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  addressBlock: {
    width: '30%',
  },
  addressLabel: {
    fontSize: 8,
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  addressName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colDescription: { width: '40%' },
  colQty: { width: '15%', textAlign: 'center' },
  colRate: { width: '20%', textAlign: 'right' },
  colAmount: { width: '25%', textAlign: 'right' },
  totalsSection: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 250,
    paddingVertical: 4,
  },
  totalsLabel: {
    width: 130,
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 9,
    color: '#6B7280',
  },
  totalsValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 250,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    marginTop: 4,
  },
  totalLabel: {
    width: 130,
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#3B82F6',
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  notesSection: {
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  notesLabel: {
    fontSize: 8,
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  termsSection: {
    marginTop: 16,
  },
});

export function ModernPdf({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
  const labels = config?.labels ?? DEFAULT_LABELS;
  const vis = config?.visibility ?? DEFAULT_VISIBILITY;
  const subtotal = calcSubtotal(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const itemTax = calcItemTax(invoice.items);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);
  const cur = invoice.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar} />

        {vis.header && (
          <View style={styles.headerRow}>
            <View>
              {invoice.logo && <Image src={invoice.logo} style={styles.logo} />}
            </View>
            <View>
              <Text style={styles.invoiceTitle}>{labels.invoiceTitle}</Text>
              <View style={styles.invoiceMeta}>
                <Text style={styles.metaLabel}>{labels.invoiceNumberLabel}</Text>
                <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
                <Text style={styles.metaLabel}>{labels.issueDateLabel}</Text>
                <Text style={styles.metaValue}>{invoice.issueDate}</Text>
                <Text style={styles.metaLabel}>{labels.dueDateLabel}</Text>
                <Text style={styles.metaValue}>{invoice.dueDate}</Text>
                {invoice.poNumber ? (
                  <>
                    <Text style={styles.metaLabel}>{labels.poNumberLabel}</Text>
                    <Text style={styles.metaValue}>{invoice.poNumber}</Text>
                  </>
                ) : null}
                {invoice.paymentTerms ? (
                  <>
                    <Text style={styles.metaLabel}>{labels.paymentTermsLabel}</Text>
                    <Text style={styles.metaValue}>{invoice.paymentTerms}</Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        )}

        {vis.addresses && (
          <View style={styles.addressRow}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>{labels.fromLabel}</Text>
              <Text style={styles.addressName}>{invoice.sender.name}</Text>
              <Text style={styles.addressText}>{formatAddress(invoice.sender)}</Text>
              {invoice.sender.email ? <Text style={styles.addressText}>{invoice.sender.email}</Text> : null}
              {invoice.sender.phone ? <Text style={styles.addressText}>{invoice.sender.phone}</Text> : null}
            </View>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>{labels.billToLabel}</Text>
              <Text style={styles.addressName}>{invoice.recipient.name}</Text>
              <Text style={styles.addressText}>{formatAddress(invoice.recipient)}</Text>
              {invoice.recipient.email ? <Text style={styles.addressText}>{invoice.recipient.email}</Text> : null}
              {invoice.recipient.phone ? <Text style={styles.addressText}>{invoice.recipient.phone}</Text> : null}
            </View>
            {invoice.hasShipTo && invoice.shipTo ? (
              <View style={styles.addressBlock}>
                <Text style={styles.addressLabel}>{labels.shipToLabel}</Text>
                <Text style={styles.addressName}>{invoice.shipTo.name}</Text>
                <Text style={styles.addressText}>{formatAddress(invoice.shipTo)}</Text>
              </View>
            ) : null}
          </View>
        )}

        {vis.lineItems && (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colDescription]}>{labels.descriptionLabel}</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>{labels.quantityLabel}</Text>
              <Text style={[styles.tableHeaderText, styles.colRate]}>{labels.rateLabel}</Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>{labels.amountLabel}</Text>
            </View>

            {invoice.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.colDescription}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>{fmt(item.rate, cur)}</Text>
                <Text style={styles.colAmount}>{fmt(item.amount, cur)}</Text>
              </View>
            ))}
          </>
        )}

        {vis.totals && (
          <View style={styles.totalsSection}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>{labels.subtotalLabel}</Text>
              <Text style={styles.totalsValue}>{fmt(subtotal, cur)}</Text>
            </View>
            {invoice.taxes.map((tax) => (
              <View key={tax.id} style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  {tax.name} ({tax.type === 'percentage' ? `${tax.rate}%` : 'Flat'})
                </Text>
                <Text style={styles.totalsValue}>
                  {fmt(tax.type === 'percentage' ? (subtotal * tax.rate) / 100 : tax.rate, cur)}
                </Text>
              </View>
            ))}
            {itemTax > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>{labels.taxLabel}</Text>
                <Text style={styles.totalsValue}>{fmt(itemTax, cur)}</Text>
              </View>
            ) : null}
            {discountAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  {labels.discountLabel} ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Flat'})
                </Text>
                <Text style={styles.totalsValue}>-{fmt(discountAmount, cur)}</Text>
              </View>
            ) : null}
            {invoice.shipping > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>{labels.shippingLabel}</Text>
                <Text style={styles.totalsValue}>{fmt(invoice.shipping, cur)}</Text>
              </View>
            ) : null}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{labels.totalLabel}</Text>
              <Text style={styles.totalValue}>{fmt(total, cur)}</Text>
            </View>
          </View>
        )}

        {vis.noteTerms && invoice.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>{labels.notesLabel}</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        {vis.noteTerms && invoice.terms ? (
          <View style={styles.termsSection}>
            <Text style={styles.notesLabel}>{labels.termsLabel}</Text>
            <Text style={styles.notesText}>{invoice.terms}</Text>
          </View>
        ) : null}

        <PdfWatermark />
      </Page>
    </Document>
  );
}
