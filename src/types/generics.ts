import type { BaseEntry, Market, SectionMeta } from './common';

export interface GenericLaunch {
  id: string;
  molecule: string;
  brand_name: string;
  manufacturer: string;
  market: Market;
  status: 'launched' | 'approved_not_launched' | 'filed' | 'expected' | 'rumored';
  launch_date?: string;
  approval_date?: string;
  format: 'pen' | 'vial' | 'oral';
  planned_volume?: string;
  price_per_unit?: number;
  currency?: 'USD' | 'INR';
  source_url: string;
}

export interface GenericsTrackerData {
  meta: SectionMeta;
  launches: GenericLaunch[];
  entries: BaseEntry[];
}
