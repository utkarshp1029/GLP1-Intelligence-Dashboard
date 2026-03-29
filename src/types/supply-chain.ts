import type { BaseEntry, Market, SectionMeta } from './common';

export interface ShortageEvent {
  id: string;
  drug: string;
  manufacturer: string;
  market: Market;
  status: 'active' | 'resolved' | 'improving';
  start_date: string;
  resolved_date?: string;
  reason?: string;
  estimated_resolution?: string;
  source_url: string;
}

export interface SupplyChainData {
  meta: SectionMeta;
  shortages: ShortageEvent[];
  entries: BaseEntry[];
}
