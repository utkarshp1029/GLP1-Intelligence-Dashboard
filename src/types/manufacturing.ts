import type { BaseEntry, Market, SectionMeta } from './common';

export interface ManufacturingFacility {
  id: string;
  company: string;
  location: string;
  market: Market;
  molecules: string[];
  process_type: 'synthetic' | 'biosynthetic' | 'fermentation';
  capacity?: string;
  status: 'operational' | 'under_construction' | 'planned';
  source_url: string;
}

export interface ManufacturingData {
  meta: SectionMeta;
  facilities: ManufacturingFacility[];
  entries: BaseEntry[];
}
