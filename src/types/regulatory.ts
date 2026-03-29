import type { BaseEntry, Market, SectionMeta } from './common';

export interface RegulatoryEvent {
  id: string;
  date: string;
  market: Market;
  agency: string;
  type: 'approval' | 'rejection' | 'guidance' | 'investigation' | 'label_change' | 'patent_decision' | 'marketing_rule' | 'prescribing_rule';
  molecule?: string;
  brand?: string;
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  source_url: string;
}

export interface RegulatoryData {
  meta: SectionMeta;
  events: RegulatoryEvent[];
  entries: BaseEntry[];
}
