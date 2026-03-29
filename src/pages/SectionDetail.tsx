import { useParams } from 'react-router';
import { SECTION_MAP } from '../config/sections';
import type { Market } from '../types/common';
import ErrorBoundary from '../components/common/ErrorBoundary';

import GenericsTracker from '../components/sections/GenericsTracker';
import PricingCalculator from '../components/sections/PricingCalculator';
import RegulatoryTimeline from '../components/sections/RegulatoryTimeline';
import RevenueFinancials from '../components/sections/RevenueFinancials';
import SupplementIndustry from '../components/sections/SupplementIndustry';
import Manufacturing from '../components/sections/Manufacturing';
import PipelineTrials from '../components/sections/PipelineTrials';
import SupplyChain from '../components/sections/SupplyChain';
import PatentsIP from '../components/sections/PatentsIP';
import CompoundingPharmacy from '../components/sections/CompoundingPharmacy';
import TelehealthD2C from '../components/sections/TelehealthD2C';
import SocialSentiment from '../components/sections/SocialSentiment';
import SafetySignals from '../components/sections/SafetySignals';
import InsuranceReimbursement from '../components/sections/InsuranceReimbursement';
import NewsHub from '../components/sections/NewsHub';

const SECTION_COMPONENTS: Record<
  string,
  React.ComponentType<{ matchesFilter: (m: Market) => boolean; isNewEntry: (ts: string) => boolean }>
> = {
  'news-hub': NewsHub,
  'generics-tracker': GenericsTracker,
  pricing: PricingCalculator,
  'regulatory-timeline': RegulatoryTimeline,
  'revenue-financials': RevenueFinancials,
  supplements: SupplementIndustry,
  manufacturing: Manufacturing,
  'pipeline-trials': PipelineTrials,
  'supply-chain': SupplyChain,
  'patents-ip': PatentsIP,
  'compounding-pharmacy': CompoundingPharmacy,
  'telehealth-d2c': TelehealthD2C,
  'social-sentiment': SocialSentiment,
  'safety-signals': SafetySignals,
  'insurance-reimbursement': InsuranceReimbursement,
};

interface SectionDetailProps {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

export default function SectionDetail({ matchesFilter, isNewEntry }: SectionDetailProps) {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? SECTION_MAP[sectionId] : undefined;
  const Component = sectionId ? SECTION_COMPONENTS[sectionId] : undefined;

  if (!section || !Component) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6e6e73] text-lg">Section not found</p>
      </div>
    );
  }

  const Icon = section.icon;

  return (
    <div>
      {/* Apple-style Section Hero */}
      <section className="bg-[#f5f5f7] dark:bg-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-4">
            <Icon size={16} style={{ color: section.color }} />
            <span
              className="apple-eyebrow"
              style={{ color: section.color }}
            >
              {section.shortTitle}
            </span>
          </div>
          <h1 className="apple-section-heading mb-3 dark:text-white">
            {section.title}
          </h1>
          <p className="apple-subheadline text-[#6e6e73] max-w-2xl">
            {section.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[980px] mx-auto px-6 py-10">
        <ErrorBoundary fallbackMessage={`Error loading ${section.title}`}>
          <Component matchesFilter={matchesFilter} isNewEntry={isNewEntry} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
