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

const GREEN = '#10B981';
const DARK_BG = '#1E293B';
const DARK_CARD = '#0F172A';
const GREEN_DIM = '#065F46';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Courier',
    fontSize: 9,
    padding: 0,
    backgroundColor: DARK_BG,
    color: '#CBD5E1',
  },
  header: {
    backgroundColor: DARK_CARD,
    paddingVertical: 24,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: GREEN,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 44,
    height: 44,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Courier-Bold',
    color: GREEN,
  },
  invoiceTitle: {
    fontSize: 22,
    fontFamily: 'Courier-Bold',
    color: GREEN,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  body: {
    padding: 40,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  metaBlock: {
    backgroundColor: DARK_CARD,
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: GREEN,
    width: 230,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  metaLabel: {
    fontSize: 8,
    color: GREEN,
    fontFamily: 'Courier-Bold',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 8,
    color: '#E2E8F0',
    fontFamily: 'Courier-Bold',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  addressBlock: {
    width: '30%',
    backgroundColor: DARK_CARD,
    padding: 12,
    borderRadius: 4,
  },
  addressLabel: {
    fontSize: 8,
    fontFamily: 'Courier-Bold',
    color: GREEN,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: GREEN_DIM,
    paddingBottom: 4,
  },
  addressName: {
    fontSize: 10,
    fontFamily: 'Courier-Bold',
    marginBottom: 3,
    color: '#F1F5F9',
  },
  addressText: {
    fontSize: 8,
    color: '#94A3B8',
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GREEN_DIM,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: GREEN,
  },
  tableHeaderText: {
    color: GREEN,
    fontSize: 8,
    fontFamily: 'Courier-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  colDescription: { width: '40%' },
  colQty: { width: '15%', textAlign: 'center' },
  colRate: { width: '20%', textAlign: 'right' },
  colAmount: { width: '25%', textAlign: 'right' },
  totalsSection: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalsBlock: {
    width: 260,
    backgroundColor: DARK_CARD,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalsLabel: {
    fontSize: 8,
    color: '#94A3B8',
  },
  totalsValue: {
    fontSize: 9,
    color: '#CBD5E1',
    fontFamily: 'Courier-Bold',
  },
  totalDivider: {
    height: 1,
    backgroundColor: GREEN,
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: GREEN,
  },
  totalValue: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: GREEN,
  },
  notesSection: {
    marginTop: 28,
    backgroundColor: DARK_CARD,
    padding: 14,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: GREEN,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Courier-Bold',
    color: GREEN,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 8,
    color: '#94A3B8',
    lineHeight: 1.6,
  },
  termsSection: {
    marginTop: 12,
    padding: 14,
  },
});

export function TechPdf({ invoice }: { invoice: InvoiceData }) {
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
            <View style={styles.totalsBlock}>
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
        </View>

        <PdfWatermark />
      </Page>
    </Document>
  );
}
