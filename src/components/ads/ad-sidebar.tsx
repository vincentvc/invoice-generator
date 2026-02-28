'use client';

import { cn } from '@/lib/utils';
import { AdWrapper } from '@/components/ads/ad-wrapper';

interface AdSidebarProps {
  className?: string;
}

export function AdSidebar({ className }: AdSidebarProps) {
  return (
    <AdWrapper className={cn('w-[300px]', className)}>
      <div className="flex h-[250px] w-[300px] flex-col items-center justify-center gap-3 p-4">
        <div className="rounded-md bg-muted-foreground/10 px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground/50">
            300 x 250
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground/40">
          Ad Space
        </span>
        <p className="max-w-[200px] text-center text-[10px] text-muted-foreground/30">
          Your brand could be here. Reach thousands of small business owners.
        </p>
      </div>
    </AdWrapper>
  );
}
