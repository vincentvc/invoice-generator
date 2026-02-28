'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useHistoryStore } from '@/stores/history-store';
import { useClientStore } from '@/stores/client-store';
import {
  computeKPIs,
  computeMonthlyRevenue,
  computeStatusBreakdown,
  computeTopClientsByRevenue,
  computeMonthlyComparison,
} from '@/lib/analytics';
import { KPICards } from './kpi-cards';
import { MonthlyComparison } from './monthly-comparison';

const RevenueChart = dynamic(
  () => import('./revenue-chart').then((mod) => mod.RevenueChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const StatusChart = dynamic(
  () => import('./status-chart').then((mod) => mod.StatusChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const TopClientsChart = dynamic(
  () => import('./top-clients-chart').then((mod) => mod.TopClientsChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="h-4 w-32 rounded bg-muted mb-4" />
      <div className="h-64 rounded bg-muted/50 animate-pulse" />
    </div>
  );
}

export function AnalyticsPage() {
  const invoices = useHistoryStore((s) => s.invoices);
  const loadInvoices = useHistoryStore((s) => s.loadInvoices);
  const clients = useClientStore((s) => s.clients);
  const loadClients = useClientStore((s) => s.loadClients);

  useEffect(() => {
    loadInvoices();
    loadClients();
  }, [loadInvoices, loadClients]);

  const kpis = useMemo(() => computeKPIs(invoices), [invoices]);
  const monthlyRevenue = useMemo(() => computeMonthlyRevenue(invoices), [invoices]);
  const statusBreakdown = useMemo(() => computeStatusBreakdown(invoices), [invoices]);
  const topClients = useMemo(() => computeTopClientsByRevenue(invoices, clients), [invoices, clients]);
  const comparison = useMemo(() => computeMonthlyComparison(invoices), [invoices]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your invoicing performance
        </p>
      </div>

      <div className="space-y-6">
        <KPICards data={kpis} />
        <MonthlyComparison data={comparison} />
        <RevenueChart data={monthlyRevenue} />
        <div className="grid gap-6 lg:grid-cols-2">
          <StatusChart data={statusBreakdown} />
          <TopClientsChart data={topClients} />
        </div>
      </div>
    </div>
  );
}
