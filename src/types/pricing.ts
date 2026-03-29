import type { BaseEntry, Market, SectionMeta } from './common';

export interface Molecule {
  id: string;
  name: string;
  class: string;
  mechanism: string;
  approved_indications: string[];
}

export interface PricePoint {
  currency: 'USD' | 'INR';
  list_price: number;
  discounted_price?: number;
  discount_source?: string;
  insurance_copay_range?: [number, number];
  as_of_date: string;
  source_url: string;
}

export interface IntendedDose {
  dose_mg: number;
  doses_per_pen: number;
  label: string;
  is_microdose: boolean;
}

export interface PenSpec {
  id: string;
  pen_label: string;
  format: 'pen' | 'vial' | 'oral';
  total_mg: number;
  concentration_mg_per_ml?: number;
  total_volume_ml?: number;
  clicks_per_pen?: number;
  intended_doses: IntendedDose[];
  microdosable: boolean;
  doses_verified?: boolean;
  dosing_source?: string;
  dosing_note?: string;
  price: PricePoint[];
}

export interface SubBrand {
  id: string;
  name: string;
  pens: PenSpec[];
}

export interface Brand {
  id: string;
  name: string;
  manufacturer: string;
  molecule_id: string;
  market: Market;
  type: 'originator' | 'generic' | 'biosimilar' | 'compounded';
  approval_status: 'approved' | 'pending' | 'not_filed';
  sub_brands: SubBrand[];
}

export interface PricingData {
  meta: SectionMeta;
  molecules: Molecule[];
  brands: Brand[];
  entries: BaseEntry[];
}

export interface CostCalculation {
  brand_id: string;
  brand_name: string;
  manufacturer: string;
  pen_id: string;
  pen_label: string;
  format: string;
  dose_mg: number;
  is_microdose: boolean;
  microdosable: boolean;
  cost_per_mg: number;
  cost_per_dose: number;
  cost_per_week: number;
  cost_per_month: number;
  cost_per_year: number;
  doses_per_pen: number;
  pens_per_month: number;
  currency: 'USD' | 'INR';
  total_mg_in_pen: number;
  list_price: number;
}
