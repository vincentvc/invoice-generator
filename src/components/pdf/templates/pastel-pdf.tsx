import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';
import { PdfWatermark } from '../pdf-watermark';

function fmt(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function formatAddress(addr: { name: string; address: string; city: string; state: string; zip: string; country: string }): string {
  const parts = [addr.address, [addr.city, addr.state, addr.zip].filter(Boolean).join(', '), addr.country].filter(Boolean);
  return parts.join('\n');
}

const PINK = '#EC4899';
const PINK_LIGHT = '#FDF2F8';
const PINK_SOFT = '#FBCFE8';
const PINK_DARK = '#BE185D';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 50,
    backgroundColor: '#FEFEFE',
    color: '#374151',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logoSection: {
    flexDirection: 'column',
  },
  logo: {
    width: 65,
    height: 65,
    objectFit: 'contain',
    marginBottom: 8,
  },
  invoiceTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: PINK,
    textAlign: 'right',
  },
  invoiceMeta: {
    textAlign: 'right',
    marginTop: 8,
  },
  metaBadge: {
    backgroundColor: PINK_LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  metaLabel: {
    fontSize: 7,
    color: PINK_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: PINK_DARK,
  },
  divider: {
    height: 2,
    backgroundColor: PINK_SOFT,
    marginBottom: 24,
    borderRadius: 1,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  addressBlock: {
    width: '30%',
    backgroundColor: PINK_LIGHT,
    padding: 12,
    borderRadius: 8,
  },
  addressLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: PINK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  addressName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
    color: '#1F2937',
  },
  addressText: {
    fontSize: 8,
    color: '#6B7280',
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PINK,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
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
    borderBottomColor: PINK_SOFT,
  },
  colDescription: { width: '40%' },
  colQty: { width: '15%', textAlign: 'center' },
  colRate: { width: '20%', textAlign: 'right' },
  colAmount: { width: '25%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalsContainer: {
    width: 260,
    backgroundColor: PINK_LIGHT,
    borderRadius: 8,
    padding: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalsLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  totalsValue: {
    fontSize: 9,
    color: '#374151',
  },
  totalDivider: {
    height: 1,
    backgroundColor: PINK_SOFT,
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: PINK,
  },
  totalValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: PINK,
  },
  notesSection: {
    marginTop: 28,
    backgroundColor: PINK_LIGHT,
    padding: 14,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: PINK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#6B7280',
    lineHeight: 1.5,
  },
  termsSection: {
    marginTop: 12,
    padding: 14,
  },
});

export function PastelPdf({ invoice }: { invoice: InvoiceData }) {
  const subtotal = calcSubtotal(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const itemTax = calcItemTax(invoice.items);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);
  const cur = invoice.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoSection}>
            {invoice.logo && <Image src={invoice.logo} style={styles.logo} />}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <View style={styles.invoiceMeta}>
              <View style={styles.metaBadge}>
                <Text style={styles.metaLabel}>No.</Text>
                <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Text style={styles.metaLabel}>Issued</Text>
                <Text style={styles.metaValue}>{invoice.issueDate}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Text style={styles.metaLabel}>Due</Text>
                <Text style={styles.metaValue}>{invoice.dueDate}</Text>
              </View>
              {invoice.poNumber ? (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaLabel}>PO</Text>
                  <Text style={styles.metaValue}>{invoice.poNumber}</Text>
                </View>
              ) : null}
              {invoice.paymentTerms ? (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaLabel}>Terms</Text>
                  <Text style={styles.metaValue}>{invoice.paymentTerms}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>From</Text>
            <Text style={styles.addressName}>{invoice.sender.name}</Text>
            <Text style={styles.addressText}>{formatAddress(invoice.sender)}</Text>
            {invoice.sender.email ? <Text style={styles.addressText}>{invoice.sender.email}</Text> : null}
            {invoice.sender.phone ? <Text style={styles.addressText}>{invoice.sender.phone}</Text> : null}
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Bill To</Text>
            <Text style={styles.addressName}>{invoice.recipient.name}</Text>
            <Text style={styles.addressText}>{formatAddress(invoice.recipient)}</Text>
            {invoice.recipient.email ? <Text style={styles.addressText}>{invoice.recipient.email}</Text> : null}
            {invoice.recipient.phone ? <Text style={styles.addressText}>{invoice.recipient.phone}</Text> : null}
          </View>
          {invoice.hasShipTo && invoice.shipTo ? (
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>Ship To</Text>
              <Text style={styles.addressName}>{invoice.shipTo.name}</Text>
              <Text style={styles.addressText}>{formatAddress(invoice.shipTo)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
        </View>

        {invoice.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>{fmt(item.rate, cur)}</Text>
            <Text style={styles.colAmount}>{fmt(item.amount, cur)}</Text>
          </View>
        ))}

        <View style={styles.totalsSection}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
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
                <Text style={styles.totalsLabel}>Item Tax</Text>
                <Text style={styles.totalsValue}>{fmt(itemTax, cur)}</Text>
              </View>
            ) : null}
            {discountAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Flat'})
                </Text>
                <Text style={styles.totalsValue}>-{fmt(discountAmount, cur)}</Text>
              </View>
            ) : null}
            {invoice.shipping > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Shipping</Text>
                <Text style={styles.totalsValue}>{fmt(invoice.shipping, cur)}</Text>
              </View>
            ) : null}
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{fmt(total, cur)}</Text>
            </View>
          </View>
        </View>

        {invoice.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}

        {invoice.terms ? (
          <View style={styles.termsSection}>
            <Text style={styles.notesLabel}>Terms & Conditions</Text>
            <Text style={styles.notesText}>{invoice.terms}</Text>
          </View>
        ) : null}

        <PdfWatermark />
      </Page>
    </Document>
  );
}
