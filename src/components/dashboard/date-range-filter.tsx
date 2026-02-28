'use client';

import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHistoryStore } from '@/stores/history-store';

function getPresetRange(preset: string): { from: string; to: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (preset) {
    case 'this-month': {
      const from = new Date(year, month, 1).toISOString().split('T')[0];
      const to = new Date(year, month + 1, 0).toISOString().split('T')[0];
      return { from, to };
    }
    case 'last-month': {
      const from = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const to = new Date(year, month, 0).toISOString().split('T')[0];
      return { from, to };
    }
    case 'last-3-months': {
      const from = new Date(year, month - 3, 1).toISOString().split('T')[0];
      const to = now.toISOString().split('T')[0];
      return { from, to };
    }
    case 'this-year': {
      const from = new Date(year, 0, 1).toISOString().split('T')[0];
      const to = new Date(year, 11, 31).toISOString().split('T')[0];
      return { from, to };
    }
    default:
      return { from: '', to: '' };
  }
}

export function DateRangeFilter() {
  const dateRangeFilter = useHistoryStore((s) => s.dateRangeFilter);
  const setDateRangeFilter = useHistoryStore((s) => s.setDateRangeFilter);

  const hasFilter = dateRangeFilter.from || dateRangeFilter.to;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">
            {hasFilter ? 'Filtered' : 'Date Range'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setDateRangeFilter(getPresetRange('this-month'))}>
          This Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDateRangeFilter(getPresetRange('last-month'))}>
          Last Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDateRangeFilter(getPresetRange('last-3-months'))}>
          Last 3 Months
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDateRangeFilter(getPresetRange('this-year'))}>
          This Year
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDateRangeFilter({ from: '', to: '' })}>
          All Time
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-2 space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="date"
              value={dateRangeFilter.from}
              onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, from: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="date"
              value={dateRangeFilter.to}
              onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, to: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
