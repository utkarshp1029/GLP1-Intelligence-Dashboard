import type { BaseEntry, Market, SectionMeta } from './common';

export interface Patent {
  id: string;
  molecule: string;
  holder: string;
  patent_number?: string;
  type: 'compound' | 'formulation' | 'device' | 'method_of_use' | 'manufacturing';
  market: Market;
  expiry_date?: string;
  status: 'active' | 'expired' | 'challenged' | 'invalidated';
  challengers?: string[];
  source_url: string;
}

export interface PatentData {
  meta: SectionMeta;
  patents: Patent[];
  entries: BaseEntry[];
}
