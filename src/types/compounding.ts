import type { BaseEntry, SectionMeta } from './common';

export interface CompoundingPharmacy {
  id: string;
  name: string;
  type: '503A' | '503B' | 'unknown';
  molecules: string[];
  avg_monthly_cost?: number;
  currency: 'USD';
  fda_status: 'compliant' | 'warning' | 'shutdown' | 'unknown';
  source_url: string;
}

export interface CompoundingData {
  meta: SectionMeta;
  pharmacies: CompoundingPharmacy[];
  entries: BaseEntry[];
}
