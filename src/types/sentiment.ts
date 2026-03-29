import type { BaseEntry, Market, SectionMeta } from './common';

export interface SentimentTrend {
  id: string;
  platform: string;
  topic: string;
  market: Market;
  sentiment_score?: number;
  volume?: number;
  trending_direction: 'up' | 'down' | 'stable';
  sample_discussions: string[];
  date: string;
  source_url: string;
}

export interface SentimentData {
  meta: SectionMeta;
  trends: SentimentTrend[];
  entries: BaseEntry[];
}
