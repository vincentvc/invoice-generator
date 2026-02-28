import { InvoiceData } from '@/types/invoice';
import { Client } from '@/types/client';
import { KPIData, MonthlyRevenue, StatusBreakdown, ClientRevenue, MonthlyComparison } from '@/types/analytics';
import { INVOICE_STATUSES } from '@/lib/constants';
import { calcSubtotal, calcTaxAmount, calcItemTax, calcDiscountAmount, calcTotal } from '@/lib/calculations';

export function computeInvoiceTotal(invoice: InvoiceData): number {
  const subtotal = calcSubtotal(invoice.items);
  const taxAmount = calcTaxAmount(subtotal, invoice.taxes);
  const itemTax = calcItemTax(invoice.items);
  const discountAmount = calcDiscountAmount(subtotal, invoice.discountType, invoice.discountValue);
  return calcTotal(subtotal, taxAmount, itemTax, discountAmount, invoice.shipping);
}

export function computeKPIs(invoices: InvoiceData[]): KPIData {
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');
  const outstandingInvoices = invoices.filter((inv) =>
    ['sent', 'overdue', 'partial'].includes(inv.status)
  );

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + computeInvoiceTotal(inv), 0);
  const outstandingAmount = outstandingInvoices.reduce((sum, inv) => {
    const total = computeInvoiceTotal(inv);
    return sum + (total - (inv.paidAmount || 0));
  }, 0);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    invoiceCount: invoices.length,
    averageInvoiceValue: invoices.length > 0
      ? Math.round((totalRevenue / paidInvoices.length || 0) * 100) / 100
      : 0,
    outstandingAmount: Math.round(outstandingAmount * 100) / 100,
    paidCount: paidInvoices.length,
    overdueCount: overdueInvoices.length,
  };
}

export function computeMonthlyRevenue(invoices: InvoiceData[], monthCount = 12): MonthlyRevenue[] {
  const now = new Date();
  const months: MonthlyRevenue[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    months.push({ month: monthKey, monthLabel, revenue: 0, invoiceCount: 0 });
  }

  const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
  for (const inv of paidInvoices) {
    const invDate = new Date(inv.updatedAt || inv.createdAt);
    const key = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
    const month = months.find((m) => m.month === key);
    if (month) {
      month.revenue += computeInvoiceTotal(inv);
      month.invoiceCount += 1;
    }
  }

  return months.map((m) => ({ ...m, revenue: Math.round(m.revenue * 100) / 100 }));
}

export function computeStatusBreakdown(invoices: InvoiceData[]): StatusBreakdown[] {
  const statusColors: Record<string, string> = {};
  for (const s of INVOICE_STATUSES) {
    statusColors[s.value] = s.color;
  }

  const counts: Record<string, number> = {};
  for (const inv of invoices) {
    counts[inv.status] = (counts[inv.status] || 0) + 1;
  }

  return INVOICE_STATUSES.map((s) => ({
    status: s.value,
    label: s.label,
    count: counts[s.value] || 0,
    color: s.color,
  })).filter((s) => s.count > 0);
}

export function computeTopClientsByRevenue(
  invoices: InvoiceData[],
  clients: Client[],
  limit = 5
): ClientRevenue[] {
  const clientMap = new Map<string, { name: string; revenue: number; count: number }>();

  for (const inv of invoices) {
    if (inv.status !== 'paid') continue;
    const clientName = inv.recipient.name || 'Unknown';
    const key = inv.clientId || clientName.toLowerCase();
    const existing = clientMap.get(key);
    const total = computeInvoiceTotal(inv);

    if (existing) {
      clientMap.set(key, {
        name: existing.name,
        revenue: existing.revenue + total,
        count: existing.count + 1,
      });
    } else {
      const client = clients.find((c) => c.id === inv.clientId);
      clientMap.set(key, {
        name: client?.name || clientName,
        revenue: total,
        count: 1,
      });
    }
  }

  return Array.from(clientMap.entries())
    .map(([id, data]) => ({
      clientId: id,
      clientName: data.name,
      totalRevenue: Math.round(data.revenue * 100) / 100,
      invoiceCount: data.count,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
}

export function computeMonthlyComparison(invoices: InvoiceData[]): MonthlyComparison {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  let currentMonth = 0;
  let previousMonth = 0;
  let currentCount = 0;
  let prevCount = 0;

  for (const inv of invoices) {
    if (inv.status !== 'paid') continue;
    const invDate = new Date(inv.updatedAt || inv.createdAt);
    const key = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
    const total = computeInvoiceTotal(inv);

    if (key === currentMonthKey) {
      currentMonth += total;
      currentCount++;
    } else if (key === prevMonthKey) {
      previousMonth += total;
      prevCount++;
    }
  }

  const revenueChange = currentMonth - previousMonth;
  const revenueChangePercent = previousMonth > 0
    ? Math.round((revenueChange / previousMonth) * 10000) / 100
    : currentMonth > 0 ? 100 : 0;

  return {
    currentMonth: Math.round(currentMonth * 100) / 100,
    previousMonth: Math.round(previousMonth * 100) / 100,
    revenueChange: Math.round(revenueChange * 100) / 100,
    revenueChangePercent,
    countChange: currentCount - prevCount,
  };
}
