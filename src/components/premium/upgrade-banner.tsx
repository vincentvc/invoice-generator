'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';

interface UpgradeBannerProps {
  className?: string;
}

export function UpgradeBanner({ className }: UpgradeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const isPremiumUser = useUIStore((state) => state.isPremiumUser);
  const setPremiumModalOpen = useUIStore((state) => state.setPremiumModalOpen);

  if (isPremiumUser || isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950/30 dark:to-indigo-950/30',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="absolute right-2 top-2 rounded-sm p-1 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
        aria-label="Dismiss upgrade banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Unlock the full experience
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Unlock all 10 templates, remove watermarks, and more.
          </p>
          <Button
            size="sm"
            className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs text-white hover:from-blue-700 hover:to-indigo-700"
            onClick={() => setPremiumModalOpen(true)}
          >
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
