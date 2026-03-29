import { useState, useEffect, useCallback } from 'react';
import type { GlobalMeta } from '../types/common';
import { isNewSince } from '../lib/date-utils';

const STORAGE_KEY = 'glp1-dashboard-last-visit';

export function useWhatsNew() {
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});
  const [meta, setMeta] = useState<GlobalMeta | null>(null);

  // Load last visit from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setLastVisit(stored);
  }, []);

  // Load meta.json
  useEffect(() => {
    fetch('/data/meta.json')
      .then((res) => res.json())
      .then((m: GlobalMeta) => setMeta(m))
      .catch(() => {});
  }, []);

  // Count new items per section by checking entry timestamps
  const countNewForSection = useCallback(
    async (sectionId: string, dataFile: string): Promise<number> => {
      if (!lastVisit) return 0;
      try {
        const res = await fetch(`/data/${dataFile}`);
        const data = await res.json();
        // Most section files have an 'entries' array with timestamps
        const entries = data.entries || [];
        return entries.filter((e: { timestamp: string }) =>
          isNewSince(e.timestamp, lastVisit)
        ).length;
      } catch {
        return 0;
      }
    },
    [lastVisit]
  );

  // Mark as read
  const markAsRead = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, now);
    setLastVisit(now);
    setNewCounts({});
  }, []);

  return {
    lastVisit,
    newCounts,
    setNewCounts,
    meta,
    countNewForSection,
    markAsRead,
    isNewEntry: (timestamp: string) => isNewSince(timestamp, lastVisit),
  };
}
