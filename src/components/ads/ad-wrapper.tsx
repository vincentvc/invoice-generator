'use client';

import { Suspense } from 'react';
import { cn } from '@/lib/utils';

interface AdWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export function AdWrapper({ className, children }: AdWrapperProps) {
  return (
    <div className={cn('relative', className)}>
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
        Advertisement
      </span>
      <div className="rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground/60" />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}
