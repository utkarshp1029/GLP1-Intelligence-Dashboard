import type { Market } from '../../types/common';

interface MarketTagProps {
  market: Market;
  className?: string;
}

const MARKET_LABELS: Record<Market, string> = {
  india: 'India',
  us: 'US',
  both: 'Global',
};

export default function MarketTag({ market, className = '' }: MarketTagProps) {
  return (
    <span
      className={`text-xs text-[#86868b] uppercase tracking-wider ${className}`}
    >
      {MARKET_LABELS[market]}
    </span>
  );
}
