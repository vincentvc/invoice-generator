'use client';

import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecurrenceConfig } from '@/types/recurring';
import { RECURRENCE_FREQUENCIES } from '@/lib/constants';

interface RecurringBadgeProps {
  recurrence: RecurrenceConfig | null;
}

export function RecurringBadge({ recurrence }: RecurringBadgeProps) {
  if (!recurrence?.enabled) return null;

  const freq = RECURRENCE_FREQUENCIES.find((f) => f.value === recurrence.frequency);

  return (
    <Badge variant="outline" className="gap-1 text-xs">
      <RefreshCw className="h-3 w-3" />
      {freq?.label || recurrence.frequency}
    </Badge>
  );
}
