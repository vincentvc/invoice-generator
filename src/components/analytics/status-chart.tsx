'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBreakdown } from '@/types/analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusChartProps {
  data: StatusBreakdown[];
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#94a3b8',
  sent: '#3b82f6',
  partial: '#f59e0b',
  paid: '#10b981',
  overdue: '#ef4444',
  cancelled: '#6b7280',
};

export function StatusChart({ data }: StatusChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Status Breakdown</h3>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No invoice data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="count"
                nameKey="label"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [Number(value), String(name)]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
