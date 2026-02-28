export interface KPIData {
  totalRevenue: number;
  invoiceCount: number;
  averageInvoiceValue: number;
  outstandingAmount: number;
  paidCount: number;
  overdueCount: number;
}

export interface MonthlyRevenue {
  month: string;
  monthLabel: string;
  revenue: number;
  invoiceCount: number;
}

export interface StatusBreakdown {
  status: string;
  label: string;
  count: number;
  color: string;
}

export interface ClientRevenue {
  clientId: string;
  clientName: string;
  totalRevenue: number;
  invoiceCount: number;
}

export interface MonthlyComparison {
  currentMonth: number;
  previousMonth: number;
  revenueChange: number;
  revenueChangePercent: number;
  countChange: number;
}
