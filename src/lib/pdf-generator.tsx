import type { Invoice } from '@/types/invoice';
import { formatCurrency } from '@/lib/currencies';
import { getTemplate } from '@/lib/templates';

export async function generateAndDownloadPDF(invoice: Invoice): Promise<void> {
  // Dynamic import to reduce initial bundle size
  const { pdf, Document, Page, View, Text, Image, StyleSheet, Font } = await import('@react-pdf/renderer');

  const template = getTemplate(invoice.templateId);
  const color = template.primaryColor;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#333',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    logo: {
      maxHeight: 50,
      maxWidth: 150,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    invoiceNumber: {
      fontSize: 10,
      color: '#666',
      marginTop: 4,
    },
    companyName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: color,
      marginBottom: 4,
    },
    smallText: {
      fontSize: 8,
      color: '#666',
      marginTop: 1,
    },
    section: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 6,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: color,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
    },
    tableHeaderText: {
      color: '#fff',
      fontSize: 8,
      fontWeight: 'bold',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: '#eee',
    },
    tableRowEven: {
      backgroundColor: '#f9f9f9',
    },
    descCol: { flex: 1 },
    qtyCol: { width: 50, textAlign: 'right' },
    rateCol: { width: 70, textAlign: 'right' },
    amountCol: { width: 80, textAlign: 'right' },
    totalsContainer: {
      alignItems: 'flex-end',
      marginTop: 15,
      marginBottom: 25,
    },
    totalsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      paddingVertical: 3,
    },
    totalLabel: {
      fontSize: 9,
      color: '#666',
    },
    totalValue: {
      fontSize: 9,
      fontWeight: 'bold',
    },
    grandTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      paddingVertical: 6,
      borderTopWidth: 2,
      borderTopColor: color,
      marginTop: 4,
    },
    grandTotalLabel: {
      fontSize: 11,
      fontWeight: 'bold',
    },
    grandTotalValue: {
      fontSize: 13,
      fontWeight: 'bold',
      color: color,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: '#eee',
      paddingTop: 15,
    },
    notesTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    notesText: {
      fontSize: 8,
      color: '#666',
      lineHeight: 1.4,
    },
  });

  const InvoiceDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {invoice.logo ? (
              <Image src={invoice.logo} style={styles.logo} />
            ) : null}
            {invoice.from.name ? (
              <Text style={invoice.logo ? { fontSize: 12, fontWeight: 'bold', marginTop: 4 } : styles.companyName}>
                {invoice.from.name}
              </Text>
            ) : null}
            {invoice.from.address ? <Text style={styles.smallText}>{invoice.from.address}</Text> : null}
            {invoice.from.email ? <Text style={styles.smallText}>{invoice.from.email}</Text> : null}
            {invoice.from.phone ? <Text style={styles.smallText}>{invoice.from.phone}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>Invoice</Text>
            {invoice.invoiceNumber ? (
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            ) : null}
          </View>
        </View>

        {/* Bill To & Dates */}
        <View style={styles.section}>
          <View>
            <Text style={styles.sectionTitle}>Bill To</Text>
            {invoice.to.name ? <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{invoice.to.name}</Text> : null}
            {invoice.to.address ? <Text style={styles.smallText}>{invoice.to.address}</Text> : null}
            {invoice.to.email ? <Text style={styles.smallText}>{invoice.to.email}</Text> : null}
            {invoice.to.phone ? <Text style={styles.smallText}>{invoice.to.phone}</Text> : null}
            {invoice.to.taxId ? <Text style={styles.smallText}>Tax ID: {invoice.to.taxId}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {invoice.date ? (
              <Text style={styles.smallText}>
                Date: {new Date(invoice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            ) : null}
            {invoice.dueDate ? (
              <Text style={styles.smallText}>
                Due: {new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            ) : null}
            {invoice.poNumber ? <Text style={styles.smallText}>PO #: {invoice.poNumber}</Text> : null}
            {invoice.from.taxId ? <Text style={styles.smallText}>Tax ID: {invoice.from.taxId}</Text> : null}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.descCol]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.qtyCol]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.rateCol]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.amountCol]}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={item.id} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
            <Text style={styles.descCol}>{item.description || 'Item description'}</Text>
            <Text style={styles.qtyCol}>{item.quantity}</Text>
            <Text style={styles.rateCol}>{formatCurrency(item.rate, invoice.currency)}</Text>
            <Text style={styles.amountCol}>{formatCurrency(item.amount, invoice.currency)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
          </View>
          {invoice.totalDiscount > 0 ? (
            <View style={styles.totalsRow}>
              <Text style={[styles.totalLabel, { color: '#16a34a' }]}>Discount</Text>
              <Text style={[styles.totalValue, { color: '#16a34a' }]}>
                -{formatCurrency(invoice.totalDiscount, invoice.currency)}
              </Text>
            </View>
          ) : null}
          {invoice.totalTax > 0 ? (
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.totalTax, invoice.currency)}</Text>
            </View>
          ) : null}
          {invoice.shipping.enabled && invoice.shipping.amount > 0 ? (
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.shipping.amount, invoice.currency)}</Text>
            </View>
          ) : null}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total, invoice.currency)}</Text>
          </View>
        </View>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) ? (
          <View style={styles.footer}>
            {invoice.notes ? (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.notesTitle}>Notes</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            ) : null}
            {invoice.terms ? (
              <View>
                <Text style={styles.notesTitle}>Terms & Conditions</Text>
                <Text style={styles.notesText}>{invoice.terms}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </Page>
    </Document>
  );

  const blob = await pdf(<InvoiceDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
