'use client';

interface AdBannerProps {
  slot: 'sidebar' | 'banner' | 'footer';
  className?: string;
}

export function AdBanner({ slot, className = '' }: AdBannerProps) {
  // Placeholder for Google AdSense integration
  // Replace with actual ad code when AdSense is approved
  const dimensions = {
    sidebar: { width: 300, height: 600 },
    banner: { width: 728, height: 90 },
    footer: { width: 728, height: 90 },
  };

  const { width, height } = dimensions[slot];

  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 text-muted-foreground/40 text-xs ${className}`}
      style={{ width, height, maxWidth: '100%' }}
    >
      {/* Ad placeholder - replace with AdSense code */}
      <span>Ad Space ({slot})</span>
    </div>
  );
}
