import { useState, useCallback } from 'react';
import type { Market } from '../types/common';

type MarketFilter = Market | 'all';

export function useMarketFilter() {
  const [filter, setFilter] = useState<MarketFilter>('all');

  const matchesFilter = useCallback(
    (market: Market): boolean => {
      if (filter === 'all') return true;
      if (market === 'both') return true;
      return market === filter;
    },
    [filter]
  );

  return { filter, setFilter, matchesFilter };
}
