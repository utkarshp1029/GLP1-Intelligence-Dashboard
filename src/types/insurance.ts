import type { BaseEntry, Market, SectionMeta } from './common';

export interface InsuranceCoverage {
  id: string;
  payer: string;
  market: Market;
  drug: string;
  molecule: string;
  coverage_status: 'covered' | 'prior_auth' | 'step_therapy' | 'not_covered';
  typical_copay_range?: [number, number];
  currency: 'USD' | 'INR';
  conditions?: string[];
  source_url: string;
}

export interface InsuranceData {
  meta: SectionMeta;
  coverages: InsuranceCoverage[];
  entries: BaseEntry[];
}
