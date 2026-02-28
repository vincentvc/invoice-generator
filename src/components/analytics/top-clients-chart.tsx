'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClientRevenue } from '@/types/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TopClientsChartProps {
  data: ClientRevenue[];
}

export function TopClientsChart({ data }: TopClientsChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Top Clients by Revenue</h3>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No client revenue data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                tickFormatter={(v) => `$${v.toLocaleString()}`}
              />
              <YAxis
                type="category"
                dataKey="clientName"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                width={70}
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
              <Bar dataKey="totalRevenue" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
