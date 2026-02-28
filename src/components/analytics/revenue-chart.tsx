'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MonthlyRevenue } from '@/types/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Monthly Revenue</h3>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.revenue === 0) ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No revenue data yet. Mark invoices as paid to see charts.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                tickFormatter={(v) => `$${(v / 1000).toFixed(v >= 1000 ? 1 : 0)}${v >= 1000 ? 'k' : ''}`}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))',
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
