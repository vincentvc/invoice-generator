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

const DARK = '#0F172A';
const RED = '#EF4444';
const RED_DARK = '#DC2626';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 0,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },
  header: {
    backgroundColor: DARK,
    paddingVertical: 28,
    paddingHorizontal: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  invoiceTitle: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  redBar: {
    height: 4,
    backgroundColor: RED,
  },
  body: {
    paddingHorizontal: 50,
    paddingVertical: 24,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  metaBlock: {
    width: 220,
    borderLeftWidth: 3,
    borderLeftColor: RED,
    paddingLeft: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
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
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  addressName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    color: DARK,
  },
  addressText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DARK,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    width: 260,
    paddingVertical: 4,
  },
  totalsLabel: {
    width: 140,
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 9,
    color: '#64748B',
  },
  totalsValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 260,
    paddingVertical: 10,
    backgroundColor: RED,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  totalLabel: {
    width: 128,
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  totalValue: {
    width: 120,
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  notesSection: {
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: DARK,
  },
  notesLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: RED_DARK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  termsSection: {
    marginTop: 16,
  },
});

export function BoldPdf({ invoice }: { invoice: InvoiceData }) {
  const subtotal = calcSubtotal(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const itemTax = calcItemTax(invoice.items);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  const total = calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);
  const cur = invoice.currency;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            {invoice.logo && <Image src={invoice.logo} style={styles.logo} />}
            <Text style={styles.companyName}>{invoice.sender.name}</Text>
          </View>
          <Text style={styles.invoiceTitle}>Invoice</Text>
        </View>
        <View style={styles.redBar} />

        <View style={styles.body}>
          <View style={styles.metaSection}>
            <View style={styles.metaBlock}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Invoice #</Text>
                <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Issue Date</Text>
                <Text style={styles.metaValue}>{invoice.issueDate}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{invoice.dueDate}</Text>
              </View>
              {invoice.poNumber ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>PO #</Text>
                  <Text style={styles.metaValue}>{invoice.poNumber}</Text>
                </View>
              ) : null}
              {invoice.paymentTerms ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Terms</Text>
                  <Text style={styles.metaValue}>{invoice.paymentTerms}</Text>
                </View>
              ) : null}
            </View>
          </View>

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
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{fmt(total, cur)}</Text>
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
        </View>

        <PdfWatermark />
      </Page>
    </Document>
  );
}
