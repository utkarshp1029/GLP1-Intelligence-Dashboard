import { useDataLoader } from '../../hooks/useDataLoader';
import type { TelehealthData, TelehealthPlatform } from '../../types/telehealth';
import type { Market } from '../../types/common';
import EntryCard from '../common/EntryCard';
import MetricCard from '../common/MetricCard';
import MarketTag from '../common/MarketTag';
import SourceLink from '../common/SourceLink';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

const TYPE_LABELS: Record<string, string> = {
  telehealth: 'Telehealth',
  dtc: 'DTC',
  clinic_chain: 'Clinic Chain',
  hospital_partnership: 'Hospital Partnership',
};

const TYPE_COLORS: Record<string, string> = {
  telehealth: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  dtc: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  clinic_chain: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  hospital_partnership: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function TelehealthD2C({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<TelehealthData>('telehealth-d2c.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.platforms.filter((p) => matchesFilter(p.market));
  const indiaPlatforms = filtered.filter((p) => p.market === 'india' || p.market === 'both').length;
  const usPlatforms = filtered.filter((p) => p.market === 'us' || p.market === 'both').length;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Total Platforms', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'India Platforms', value: String(indiaPlatforms) }} />
        <MetricCard metric={{ label: 'US Platforms', value: String(usPlatforms) }} />
      </div>

      {/* Platform Cards */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Telehealth &amp; D2C Platforms ({filtered.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p: TelehealthPlatform) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                <MarketTag market={p.market} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[p.type] || 'bg-gray-100 text-gray-600'}`}>
                  {TYPE_LABELS[p.type] || p.type}
                </span>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Molecules:</span>{' '}
                  {p.molecules_offered.join(', ')}
                </p>
                {p.partnerships && p.partnerships.length > 0 && (
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Partners:</span>{' '}
                    {p.partnerships.join(', ')}
                  </p>
                )}
                {p.pricing_model && (
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Pricing:</span>{' '}
                    {p.pricing_model}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <SourceLink url={p.source_url} name="Source" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News */}
      {data.entries.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Latest News</h3>
          <div className="space-y-3">
            {data.entries.map((e) => (
              <EntryCard key={e.id} entry={e} isNew={isNewEntry(e.timestamp)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
