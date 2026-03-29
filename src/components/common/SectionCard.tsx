import { useNavigate } from 'react-router';
import type { SectionConfig } from '../../config/sections';
import type { KeyMetric } from '../../types/common';
import { ChevronRight } from 'lucide-react';

interface SectionCardProps {
  section: SectionConfig;
  metrics: KeyMetric[];
  newCount: number;
  lastUpdated?: string;
}

export default function SectionCard({
  section,
  metrics,
  newCount,
  lastUpdated,
}: SectionCardProps) {
  const navigate = useNavigate();
  const Icon = section.icon;

  return (
    <button
      onClick={() => navigate(`/section/${section.id}`)}
      className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-left transition-all hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 hover:-translate-y-0.5 w-full"
    >
      {/* New badge */}
      {newCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded-full shadow-sm">
          {newCount} new
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${section.color}15` }}
          >
            <Icon size={20} style={{ color: section.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {section.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {section.description}
            </p>
          </div>
        </div>
        <ChevronRight
          size={16}
          className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors mt-1"
        />
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {metrics.slice(0, 4).map((m, i) => (
            <div key={i} className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {m.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                {m.value}
                {m.delta && (
                  <span
                    className={`ml-1 text-xs font-normal ${
                      m.delta_direction === 'up'
                        ? 'text-green-500'
                        : m.delta_direction === 'down'
                          ? 'text-red-500'
                          : 'text-gray-400'
                    }`}
                  >
                    {m.delta}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastUpdated && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          Last updated:{' '}
          {new Date(lastUpdated).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </button>
  );
}
