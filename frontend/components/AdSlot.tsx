import React from 'react';

interface AdSlotProps {
  placement: 'leaderboard' | 'mpu' | 'in-feed';
  className?: string;
}

/**
 * AdSlot Component
 * 
 * Strict requirement: Ads remain disabled by default.
 * When NEXT_PUBLIC_ADS_ENABLED !== 'true', this component does not render ad scripts,
 * does not make external ad tracking requests, and collapses to avoid reserving awkward empty whitespace.
 */
export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const isAdsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  if (!isAdsEnabled) {
    // Hidden zero-height container when ads are disabled
    return null;
  }

  // Future monetized slot when explicitly enabled
  const dimensions =
    placement === 'leaderboard'
      ? 'min-h-[90px] w-full max-w-[970px]'
      : placement === 'mpu'
      ? 'min-h-[250px] w-full max-w-[300px]'
      : 'min-h-[120px] w-full';

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto my-6 flex flex-col items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/60 p-4 text-center ${dimensions} ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Advertisement</span>
      <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Sponsored Content Slot ({placement})</div>
    </aside>
  );
};
