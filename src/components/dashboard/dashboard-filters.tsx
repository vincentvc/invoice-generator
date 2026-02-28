'use client';

import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useHistoryStore } from '@/stores/history-store';
import { INVOICE_STATUSES } from '@/lib/constants';
import { InvoiceStatus } from '@/types/invoice';
import { ClientFilter } from './client-filter';
import { DateRangeFilter } from './date-range-filter';
import { ViewToggle } from './view-toggle';
import { ExportButtons } from './export-buttons';

const STATUS_OPTIONS: readonly { value: InvoiceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  ...INVOICE_STATUSES,
] as const;

const SORT_OPTIONS = [
  { value: 'date' as const, label: 'Date' },
  { value: 'amount' as const, label: 'Amount' },
  { value: 'client' as const, label: 'Client' },
] as const;

export function DashboardFilters() {
  const searchQuery = useHistoryStore((s) => s.searchQuery);
  const statusFilter = useHistoryStore((s) => s.statusFilter);
  const sortBy = useHistoryStore((s) => s.sortBy);
  const sortOrder = useHistoryStore((s) => s.sortOrder);
  const setSearchQuery = useHistoryStore((s) => s.setSearchQuery);
  const setStatusFilter = useHistoryStore((s) => s.setStatusFilter);
  const setSortBy = useHistoryStore((s) => s.setSortBy);
  const toggleSortOrder = useHistoryStore((s) => s.toggleSortOrder);

  const activeStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ?? 'All Statuses';

  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? 'Date';

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number, client, or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{activeStatusLabel}</span>
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    1
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={statusFilter === option.value ? 'bg-accent' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ClientFilter />
          <DateRangeFilter />

          {/* Sort By */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <span className="hidden sm:inline">Sort: {activeSortLabel}</span>
                <span className="sm:hidden">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value ? 'bg-accent' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            className="h-9 w-9"
          >
            <ArrowUpDown
              className={`h-4 w-4 transition-transform ${
                sortOrder === 'asc' ? 'rotate-180' : ''
              }`}
            />
          </Button>

          <ViewToggle />
          <ExportButtons />
        </div>
      </div>
    </div>
  );
}
