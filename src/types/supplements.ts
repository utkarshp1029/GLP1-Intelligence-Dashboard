import type { BaseEntry, Market, SectionMeta } from './common';

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  manufacturer: string;
  market: Market;
  type: 'glp1_mimic' | 'glp1_support' | 'weight_loss';
  key_ingredients: string[];
  platforms: string[];
  price_range?: string;
  avg_rating?: number;
  review_count?: number;
  launch_date?: string;
  source_url: string;
}

export interface SupplementData {
  meta: SectionMeta;
  supplements: Supplement[];
  entries: BaseEntry[];
}
