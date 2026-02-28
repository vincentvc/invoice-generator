'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AdWrapper } from '@/components/ads/ad-wrapper';
import { useUIStore } from '@/stores/ui-store';

interface AdNativeProps {
  className?: string;
}

export function AdNative({ className }: AdNativeProps) {
  const setPremiumModalOpen = useUIStore((state) => state.setPremiumModalOpen);

  return (
    <AdWrapper className={cn('w-full', className)}>
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10">
          <Sparkles className="h-4 w-4 text-indigo-500/70" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground/80">
            Upgrade to Pro
          </p>
          <p className="truncate text-xs text-muted-foreground/60">
            Remove ads, unlock all templates, and more.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-xs text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
          onClick={() => setPremiumModalOpen(true)}
        >
          Learn More
        </Button>
      </div>
    </AdWrapper>
  );
}
