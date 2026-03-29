import type { BaseEntry, Market, SectionMeta } from './common';

export interface ClinicalTrial {
  id: string;
  nct_id?: string;
  molecule: string;
  sponsor: string;
  phase: 'preclinical' | 'phase1' | 'phase2' | 'phase3' | 'approved';
  indication: string;
  mechanism: string;
  expected_completion?: string;
  status: 'recruiting' | 'active' | 'completed' | 'suspended' | 'terminated';
  market_relevance: Market;
  key_findings?: string;
  efficacy_vs_semaglutide?: string;
  source_url: string;
}

export interface PipelineData {
  meta: SectionMeta;
  trials: ClinicalTrial[];
  entries: BaseEntry[];
}
