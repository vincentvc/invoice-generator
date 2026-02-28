'use client';

import { cn } from '@/lib/utils';
import { AdWrapper } from '@/components/ads/ad-wrapper';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  return (
    <div className={cn('hidden lg:block', className)}>
      <AdWrapper>
        <div className="flex h-[90px] w-full max-w-[728px] items-center justify-center gap-4 px-6">
          <div className="rounded-md bg-muted-foreground/10 px-4 py-1.5">
            <span className="text-sm font-medium text-muted-foreground/50">
              728 x 90
            </span>
          </div>
          <div className="h-px flex-1 bg-muted-foreground/10" />
          <span className="text-xs font-medium text-muted-foreground/40">
            Leaderboard Ad Space
          </span>
          <div className="h-px flex-1 bg-muted-foreground/10" />
          <p className="text-[10px] text-muted-foreground/30">
            Advertise with us
          </p>
        </div>
      </AdWrapper>
    </div>
  );
}
