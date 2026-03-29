import { useDataLoader } from '../../hooks/useDataLoader';
import type { SentimentData, SentimentTrend } from '../../types/sentiment';
import type { Market } from '../../types/common';
import EntryCard from '../common/EntryCard';
import MetricCard from '../common/MetricCard';
import MarketTag from '../common/MarketTag';
import SourceLink from '../common/SourceLink';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

const DIRECTION_ICONS: Record<string, { symbol: string; color: string }> = {
  up: { symbol: '\u2191', color: 'text-green-500' },
  down: { symbol: '\u2193', color: 'text-red-500' },
  stable: { symbol: '\u2192', color: 'text-gray-400' },
};

function sentimentColor(score: number | undefined): string {
  if (score == null) return 'text-gray-400';
  if (score >= 0.6) return 'text-green-600 dark:text-green-400';
  if (score >= 0.3) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export default function SocialSentiment({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<SentimentData>('social-sentiment.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.trends.filter((t) => matchesFilter(t.market));
  const trendingUp = filtered.filter((t) => t.trending_direction === 'up').length;
  const withScores = filtered.filter((t) => t.sentiment_score != null);
  const avgSentiment =
    withScores.length > 0
      ? withScores.reduce((sum, t) => sum + (t.sentiment_score || 0), 0) / withScores.length
      : null;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Topics Tracked', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'Trending Up', value: String(trendingUp), delta_direction: trendingUp > 0 ? 'up' : 'neutral' }} />
        <MetricCard metric={{ label: 'Avg Sentiment', value: avgSentiment != null ? avgSentiment.toFixed(2) : '—' }} />
      </div>

      {/* Trend Cards */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Sentiment Trends ({filtered.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t: SentimentTrend) => {
            const dir = DIRECTION_ICONS[t.trending_direction] || DIRECTION_ICONS.stable;
            return (
              <div
                key={t.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t.topic}</p>
                    <p className="text-xs text-gray-500">{t.platform}</p>
                  </div>
                  <MarketTag market={t.market} />
                </div>

                <div className="flex items-center gap-4 text-sm">
                  {t.sentiment_score != null && (
                    <span className={`font-semibold ${sentimentColor(t.sentiment_score)}`}>
                      {t.sentiment_score.toFixed(2)}
                    </span>
                  )}
                  <span className={`font-medium ${dir.color}`}>
                    {dir.symbol} {t.trending_direction}
                  </span>
                  {t.volume != null && (
                    <span className="text-xs text-gray-500">{t.volume.toLocaleString()} mentions</span>
                  )}
                </div>

                {t.sample_discussions.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-2">
                    {t.sample_discussions.slice(0, 2).map((d, i) => (
                      <p key={i} className="truncate italic">"{d}"</p>
                    ))}
                  </div>
                )}

                <div className="pt-1">
                  <SourceLink url={t.source_url} name="Source" />
                </div>
              </div>
            );
          })}
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
