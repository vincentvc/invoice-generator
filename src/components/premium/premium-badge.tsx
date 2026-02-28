'use client';

import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400',
        className
      )}
    >
      <Lock className="h-2.5 w-2.5" />
      Pro
    </span>
  );
}
