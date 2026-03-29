import { useDataLoader } from '../../hooks/useDataLoader';
import type { SupplementData, Supplement } from '../../types/supplements';
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
  glp1_mimic: 'GLP-1 Mimic',
  glp1_support: 'GLP-1 Support',
  weight_loss: 'Weight Loss',
};

export default function SupplementIndustry({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<SupplementData>('supplements.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.supplements.filter((s) => matchesFilter(s.market));
  const avgRating =
    filtered.filter((s) => s.avg_rating).reduce((sum, s) => sum + (s.avg_rating || 0), 0) /
      (filtered.filter((s) => s.avg_rating).length || 1);
  const allPlatforms = filtered.flatMap((s) => s.platforms);
  const platformCounts = allPlatforms.reduce<Record<string, number>>((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});
  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Total Products', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'Average Rating', value: avgRating ? avgRating.toFixed(1) : '—' }} />
        <MetricCard metric={{ label: 'Top Platform', value: topPlatform }} />
      </div>

      {/* Supplement Cards */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Tracked Supplements ({filtered.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s: Supplement) => (
            <div
              key={s.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.brand} &middot; {s.manufacturer}</p>
                </div>
                <MarketTag market={s.market} />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {TYPE_LABELS[s.type] || s.type}
                </span>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Ingredients:</span>{' '}
                  {s.key_ingredients.join(', ')}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Platforms:</span>{' '}
                  {s.platforms.join(', ')}
                </p>
                {s.price_range && (
                  <p>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Price:</span> {s.price_range}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 text-xs">
                  {s.avg_rating != null && (
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                      {s.avg_rating.toFixed(1)} &#9733;
                    </span>
                  )}
                  {s.review_count != null && (
                    <span className="text-gray-500">{s.review_count.toLocaleString()} reviews</span>
                  )}
                </div>
                <SourceLink url={s.source_url} name="Source" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Entries */}
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
