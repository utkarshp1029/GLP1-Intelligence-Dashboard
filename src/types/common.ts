export type Market = 'india' | 'us' | 'both';

export interface BaseEntry {
  id: string;
  timestamp: string;
  source_url: string;
  source_name: string;
  market: Market;
  summary?: string;
  title?: string;
  content: string;
  tags: string[];
}

export interface KeyMetric {
  label: string;
  value: string;
  delta?: string;
  delta_direction?: 'up' | 'down' | 'neutral';
}

export interface SectionMeta {
  section_id: string;
  last_updated: string;
  entry_count: number;
  key_metrics: KeyMetric[];
}

export interface GlobalMeta {
  last_full_update: string;
  sections: Record<string, SectionMeta>;
}
