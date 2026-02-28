'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MonthlyComparison as MonthlyComparisonType } from '@/types/analytics';
import { formatCurrency } from '@/lib/currencies';

interface MonthlyComparisonProps {
  data: MonthlyComparisonType;
  currency?: string;
}

export function MonthlyComparison({ data, currency = 'USD' }: MonthlyComparisonProps) {
  const isPositive = data.revenueChange > 0;
  const isNeutral = data.revenueChange === 0;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral
    ? 'text-muted-foreground'
    : isPositive
    ? 'text-emerald-600'
    : 'text-red-600';

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Month-over-Month</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="font-heading text-xl font-bold">{formatCurrency(data.currentMonth, currency)}</p>
          </div>
          <div className="text-center">
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="h-5 w-5" />
              <span className="font-heading text-lg font-bold">
                {isNeutral ? '0%' : `${isPositive ? '+' : ''}${data.revenueChangePercent}%`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(Math.abs(data.revenueChange), currency)} {isPositive ? 'increase' : isNeutral ? 'no change' : 'decrease'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Month</p>
            <p className="font-heading text-xl font-bold">{formatCurrency(data.previousMonth, currency)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
