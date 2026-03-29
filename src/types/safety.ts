import type { BaseEntry, Market, SectionMeta } from './common';

export interface SafetySignal {
  id: string;
  drug: string;
  molecule: string;
  event_type: string;
  severity: 'serious' | 'moderate' | 'mild';
  market: Market;
  agency: string;
  date: string;
  summary: string;
  action_taken?: string;
  source_url: string;
}

export interface SafetyData {
  meta: SectionMeta;
  signals: SafetySignal[];
  entries: BaseEntry[];
}
