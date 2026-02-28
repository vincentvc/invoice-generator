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

const PURPLE = '#7C3AED';
const PURPLE_LIGHT = '#EDE9FE';
const PURPLE_DARK = '#5B21B6';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 0,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  sideBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: PURPLE,
  },
  headerBlock: {
    backgroundColor: PURPLE_LIGHT,
    marginLeft: 8,
    paddingVertical: 30,
    paddingHorizontal: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    width: 65,
    height: 65,
    objectFit: 'contain',
    marginBottom: 8,
  },
  invoiceTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
    letterSpacing: 1,
  },
  invoiceNumberText: {
    fontSize: 11,
    color: PURPLE_DARK,
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 50,
    paddingVertical: 24,
  },
  metaStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 24,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 7,
    color: '#DDD6FE',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  addressBlock: {
    width: '30%',
  },
  addressLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
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
    backgroundColor: PURPLE_LIGHT,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: PURPLE,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: PURPLE_DARK,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    paddingVertical: 10,
    backgroundColor: PURPLE,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  totalLabel: {
    width: 120,
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  notesSection: {
    marginTop: 30,
    backgroundColor: PURPLE_LIGHT,
    padding: 16,
    borderRadius: 6,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: PURPLE_DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  termsSection: {
    marginTop: 12,
    padding: 16,
  },
});

export function CreativePdf({ invoice, config }: { invoice: InvoiceData; config?: TemplateConfig }) {
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
        <View style={styles.sideBar} />

        {vis.header && (
          <View style={styles.headerBlock}>
            <View>
              {invoice.logo && <Image src={invoice.logo} style={styles.logo} />}
              <Text style={styles.invoiceTitle}>{labels.invoiceTitle}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
              <Text style={styles.invoiceNumberText}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.metaStrip}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{labels.issueDateLabel}</Text>
              <Text style={styles.metaValue}>{invoice.issueDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{labels.dueDateLabel}</Text>
              <Text style={styles.metaValue}>{invoice.dueDate}</Text>
            </View>
            {invoice.paymentTerms ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{labels.paymentTermsLabel}</Text>
                <Text style={styles.metaValue}>{invoice.paymentTerms}</Text>
              </View>
            ) : null}
            {invoice.poNumber ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{labels.poNumberLabel}</Text>
                <Text style={styles.metaValue}>{invoice.poNumber}</Text>
              </View>
            ) : null}
          </View>

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
        </View>

        <PdfWatermark />
      </Page>
    </Document>
  );
}
