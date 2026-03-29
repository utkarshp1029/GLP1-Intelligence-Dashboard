import type { BaseEntry, Market, SectionMeta } from './common';

export interface TelehealthPlatform {
  id: string;
  name: string;
  market: Market;
  type: 'telehealth' | 'dtc' | 'clinic_chain' | 'hospital_partnership';
  molecules_offered: string[];
  pricing_model?: string;
  partnerships?: string[];
  launch_date?: string;
  source_url: string;
}

export interface TelehealthData {
  meta: SectionMeta;
  platforms: TelehealthPlatform[];
  entries: BaseEntry[];
}
