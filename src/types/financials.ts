import type { BaseEntry, Market, SectionMeta } from './common';

export interface CompanyFinancial {
  id: string;
  company: string;
  market: Market;
  is_listed: boolean;
  ticker?: string;
  total_revenue?: number;
  glp1_revenue?: number;
  glp1_revenue_share?: number;
  currency: 'USD' | 'INR';
  period: string;
  confidence: number;
  source_url: string;
  estimated_annual_units?: number;
  avg_price_per_unit?: number;
  unit_currency?: 'USD' | 'INR';
  volume_confidence?: 'high' | 'medium' | 'low';
  volume_note?: string;
}

export interface RevenueData {
  meta: SectionMeta;
  companies: CompanyFinancial[];
  market_size_india?: { value: number; currency: 'INR'; period: string; source_url: string };
  market_size_us?: { value: number; currency: 'USD'; period: string; source_url: string };
  entries: BaseEntry[];
}
