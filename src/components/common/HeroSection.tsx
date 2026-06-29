import { useNavigate } from 'react-router';
import type { SectionConfig } from '../../config/sections';
import type { KeyMetric } from '../../types/common';
import StalenessBadge from './StalenessBadge';

interface HeroSectionProps {
  section: SectionConfig;
  metrics: KeyMetric[];
  newCount: number;
  variant: 'light' | 'gray' | 'dark';
  index: number;
  lastUpdated?: string;
}

export default function HeroSection({
  section,
  metrics,
  newCount,
  variant,
  lastUpdated,
}: HeroSectionProps) {
  const navigate = useNavigate();
  const Icon = section.icon;

  const bg =
    variant === 'dark'
      ? 'bg-[#1d1d1f] text-white'
      : variant === 'gray'
        ? 'bg-[#f5f5f7] text-[#1d1d1f]'
        : 'bg-white text-[#1d1d1f]';

  const textSecondary =
    variant === 'dark' ? 'text-[#86868b]' : 'text-[#6e6e73]';

  const metricColor =
    variant === 'dark' ? 'text-white' : 'text-[#1d1d1f]';

  return (
    <section className={`${bg} overflow-hidden`}>
      <div className="max-w-[980px] mx-auto px-6 py-20 md:py-28 lg:py-36">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: section.color }}><Icon size={16} /></span>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: section.color }}
          >
            {section.shortTitle}
          </span>
          {newCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#0071e3] text-white rounded-full">
              {newCount} new
            </span>
          )}
          <StalenessBadge lastUpdated={lastUpdated} />
        </div>

        {/* Headline */}
        <h2 className="apple-section-heading mb-4 max-w-3xl">
          {section.title}
        </h2>

        {/* Subtitle */}
        <p className={`apple-subheadline ${textSecondary} max-w-2xl mb-10`}>
          {section.description}
        </p>

        {/* Key Metrics */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10">
            {metrics.map((m, i) => {
              const valueLen = String(m.value ?? '').length;
              // Scale typography by length so long sentence-style values don't overflow.
              // Short values (e.g. "$48.2B", "60.5%") keep the bold hero feel;
              // long values (full sentences with em-dashes) shrink and wrap cleanly.
              let valueClass: string;
              if (valueLen <= 14) {
                valueClass = 'text-3xl md:text-4xl font-semibold tracking-tight leading-tight';
              } else if (valueLen <= 30) {
                valueClass = 'text-2xl md:text-3xl font-semibold tracking-tight leading-tight';
              } else if (valueLen <= 60) {
                valueClass = 'text-lg md:text-xl font-semibold leading-snug';
              } else {
                valueClass = 'text-base font-semibold leading-snug';
              }
              return (
                <div key={i} className="min-w-0">
                  <p className={`text-xs uppercase tracking-wider ${textSecondary} mb-2`}>{m.label}</p>
                  <p className={`${valueClass} ${metricColor} break-words`}>
                    {m.value}
                  </p>
                  {m.delta && (
                    <p
                      className={`text-sm mt-1 ${
                        m.delta_direction === 'up'
                          ? 'text-[#30d158]'
                          : m.delta_direction === 'down'
                            ? 'text-[#ff3b30]'
                            : textSecondary
                      }`}
                    >
                      {m.delta}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate(`/section/${section.id}`)}
          className="apple-link bg-transparent border-none cursor-pointer text-[21px]"
          style={{ fontFamily: 'inherit' }}
        >
          Learn more
        </button>
      </div>
    </section>
  );
}
