import { useNavigate } from 'react-router';
import type { SectionConfig } from '../../config/sections';
import type { KeyMetric } from '../../types/common';

interface HeroSectionProps {
  section: SectionConfig;
  metrics: KeyMetric[];
  newCount: number;
  variant: 'light' | 'gray' | 'dark';
  index: number;
}

export default function HeroSection({
  section,
  metrics,
  newCount,
  variant,
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
            {metrics.map((m, i) => (
              <div key={i}>
                <p className={`text-sm ${textSecondary} mb-1`}>{m.label}</p>
                <p className={`text-3xl md:text-4xl font-semibold tracking-tight ${metricColor}`}>
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
            ))}
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
