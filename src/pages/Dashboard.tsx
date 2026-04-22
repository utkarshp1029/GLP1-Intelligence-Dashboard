import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SECTIONS } from '../config/sections';
import HeroSection from '../components/common/HeroSection';
import type { GlobalMeta, Market } from '../types/common';

interface DashboardProps {
  meta: GlobalMeta | null;
  newCounts: Record<string, number>;
  matchesFilter: (market: Market) => boolean;
}

const SECTION_VARIANTS: ('light' | 'gray' | 'dark')[] = [
  'dark', 'light', 'gray', 'light', 'dark', 'gray',
  'light', 'dark', 'gray', 'light', 'gray', 'dark',
  'light', 'gray',
];

export default function Dashboard({ meta, newCounts }: DashboardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'GLP-1 Market Intelligence';
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-black text-white overflow-hidden">
        <div className="max-w-[980px] mx-auto px-6 py-24 md:py-36 lg:py-44 text-center">
          <p className="apple-eyebrow text-[#86868b] mb-4">Market Intelligence</p>
          <h1 className="apple-headline mb-6">
            GLP-1
          </h1>
          <p className="apple-subheadline text-[#86868b] max-w-xl mx-auto mb-10">
            The complete strategy dashboard for weight loss drug markets across India and the United States.
          </p>

          {/* Quick Stats Row */}
          {meta && (
            <div className="flex flex-wrap justify-center gap-12 md:gap-16 mb-10">
              <div>
                <p className="text-4xl md:text-5xl font-semibold tracking-tight text-white">14</p>
                <p className="text-sm text-[#86868b] mt-1">Market Sections</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
                  {meta.sections['pricing']?.key_metrics?.[0]?.value || '₹525'}
                </p>
                <p className="text-sm text-[#86868b] mt-1">Cheapest per mg (India)</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
                  {meta.sections['revenue-financials']?.key_metrics?.[2]?.value || '$48.2B'}
                </p>
                <p className="text-sm text-[#86868b] mt-1">Global GLP-1 Market</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-6 items-center">
            <button
              onClick={() => {
                const first = document.getElementById('section-0');
                first?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="apple-link bg-transparent border-none cursor-pointer text-[21px] text-[#0071e3]"
              style={{ fontFamily: 'inherit' }}
            >
              Explore sections
            </button>
            <span className="text-[#424245]">·</span>
            <button
              onClick={() => navigate('/update-status')}
              className="apple-link bg-transparent border-none cursor-pointer text-[21px] text-[#0071e3]"
              style={{ fontFamily: 'inherit' }}
            >
              Update status
            </button>
          </div>
        </div>
      </section>

      {/* Quick Jump Nav */}
      <div className="sticky top-12 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#d2d2d7] dark:border-[#424245]">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 no-scrollbar">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  const el = document.getElementById(`section-${i}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] dark:hover:text-white dark:hover:bg-[#333336] transition-colors"
              >
                {s.shortTitle}
              </button>
            ))}
            <span className="mx-1 w-px h-4 bg-[#d2d2d7] dark:bg-[#424245]" />
            <button
              onClick={() => navigate('/update-status')}
              className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full text-[#0071e3] hover:bg-[#f5f5f7] dark:hover:bg-[#333336] transition-colors font-medium"
            >
              📊 Status
            </button>
          </div>
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map((section, index) => {
        const sectionMeta = meta?.sections[section.id];
        return (
          <div key={section.id} id={`section-${index}`}>
            <HeroSection
              section={section}
              metrics={sectionMeta?.key_metrics || []}
              newCount={newCounts[section.id] || 0}
              variant={SECTION_VARIANTS[index % SECTION_VARIANTS.length]}
              index={index}
              lastUpdated={sectionMeta?.last_updated}
            />
          </div>
        );
      })}

      {/* Bottom CTA */}
      <section className="bg-black text-white">
        <div className="max-w-[980px] mx-auto px-6 py-24 text-center">
          <h2 className="apple-section-heading mb-4">
            Stay ahead of the market.
          </h2>
          <p className="apple-subheadline text-[#86868b] max-w-lg mx-auto mb-8">
            Updated daily with the latest GLP-1 research, pricing, and regulatory developments.
          </p>
          <button
            onClick={() => navigate('/section/pricing')}
            className="inline-flex items-center px-7 py-3 bg-[#0071e3] text-white rounded-full text-base font-medium hover:bg-[#0077ed] transition-colors border-none cursor-pointer"
            style={{ fontFamily: 'inherit' }}
          >
            Start with Pricing Calculator
          </button>
        </div>
      </section>
    </div>
  );
}
