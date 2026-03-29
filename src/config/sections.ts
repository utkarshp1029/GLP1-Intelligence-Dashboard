import {
  Pill,
  Calculator,
  Scale,
  BarChart3,
  Leaf,
  Factory,
  FlaskConical,
  Truck,
  ShieldCheck,
  Beaker,
  Smartphone,
  MessageCircle,
  AlertTriangle,
  Heart,
  Newspaper,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';

export interface SectionConfig {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: ComponentType<{ className?: string; size?: number; style?: CSSProperties }>;
  dataFile: string;
  color: string;
}

export const SECTIONS: SectionConfig[] = [
  {
    id: 'news-hub',
    title: 'GLP-1 News Hub',
    shortTitle: 'News',
    description: 'Consolidated GLP-1 news from major publications with multi-source coverage',
    icon: Newspaper,
    dataFile: 'news-hub.json',
    color: '#1d1d1f',
  },
  {
    id: 'generics-tracker',
    title: 'GLP-1 Generics Launch Tracker',
    shortTitle: 'Generics',
    description: 'Timelines of GLP-1 launches in India vs US with analysis',
    icon: Pill,
    dataFile: 'generics-tracker.json',
    color: '#6366f1',
  },
  {
    id: 'pricing',
    title: 'Price Per mg Calculator',
    shortTitle: 'Pricing',
    description: 'Interactive cost comparison across brands and dosages',
    icon: Calculator,
    dataFile: 'pricing.json',
    color: '#10b981',
  },
  {
    id: 'regulatory-timeline',
    title: 'Regulatory & Compliance',
    shortTitle: 'Regulatory',
    description: 'India (since 2022) and US (since 2020) regulatory timeline',
    icon: Scale,
    dataFile: 'regulatory-timeline.json',
    color: '#f59e0b',
  },
  {
    id: 'revenue-financials',
    title: 'Revenue & Financials',
    shortTitle: 'Revenue',
    description: 'GLP-1 revenue by company with confidence scores',
    icon: BarChart3,
    dataFile: 'revenue-financials.json',
    color: '#3b82f6',
  },
  {
    id: 'supplements',
    title: 'Supplement Industry',
    shortTitle: 'Supplements',
    description: 'GLP-1 mimics and support supplements market',
    icon: Leaf,
    dataFile: 'supplements.json',
    color: '#84cc16',
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing & Outlook',
    shortTitle: 'Manufacturing',
    description: 'Where and how GLP-1 drugs are manufactured',
    icon: Factory,
    dataFile: 'manufacturing.json',
    color: '#8b5cf6',
  },
  {
    id: 'pipeline-trials',
    title: 'Pipeline & Clinical Trials',
    shortTitle: 'Pipeline',
    description: 'New molecules and trial results vs existing drugs',
    icon: FlaskConical,
    dataFile: 'pipeline-trials.json',
    color: '#ec4899',
  },
  {
    id: 'supply-chain',
    title: 'Supply Chain & Shortages',
    shortTitle: 'Supply Chain',
    description: 'Drug shortage tracking and resolution timelines',
    icon: Truck,
    dataFile: 'supply-chain.json',
    color: '#f97316',
  },
  {
    id: 'patents-ip',
    title: 'Patent & IP Landscape',
    shortTitle: 'Patents',
    description: 'Patent expiries, ANDA filings, and IP challenges',
    icon: ShieldCheck,
    dataFile: 'patents-ip.json',
    color: '#14b8a6',
  },
  {
    id: 'compounding-pharmacy',
    title: 'Compounding Pharmacy',
    shortTitle: 'Compounding',
    description: 'US compounded semaglutide market and FDA actions',
    icon: Beaker,
    dataFile: 'compounding-pharmacy.json',
    color: '#a855f7',
  },
  {
    id: 'telehealth-d2c',
    title: 'Telehealth & D2C',
    shortTitle: 'Telehealth',
    description: 'Digital prescribing platforms and partnerships',
    icon: Smartphone,
    dataFile: 'telehealth-d2c.json',
    color: '#06b6d4',
  },
  {
    id: 'social-sentiment',
    title: 'Social Sentiment',
    shortTitle: 'Sentiment',
    description: 'Social media trends and demand signals',
    icon: MessageCircle,
    dataFile: 'social-sentiment.json',
    color: '#f43f5e',
  },
  {
    id: 'safety-signals',
    title: 'Safety Signals',
    shortTitle: 'Safety',
    description: 'Adverse events and regulatory safety alerts',
    icon: AlertTriangle,
    dataFile: 'safety-signals.json',
    color: '#ef4444',
  },
  {
    id: 'insurance-reimbursement',
    title: 'Insurance & Reimbursement',
    shortTitle: 'Insurance',
    description: 'Coverage landscape in US and India',
    icon: Heart,
    dataFile: 'insurance-reimbursement.json',
    color: '#e11d48',
  },
];

export const SECTION_MAP = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s])
) as Record<string, SectionConfig>;
