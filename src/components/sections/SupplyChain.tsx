import { useDataLoader } from '../../hooks/useDataLoader';
import type { SupplyChainData, ShortageEvent } from '../../types/supply-chain';
import type { Market } from '../../types/common';
import ComparisonTable from '../common/ComparisonTable';
import EntryCard from '../common/EntryCard';
import MetricCard from '../common/MetricCard';
import MarketTag from '../common/MarketTag';
import SourceLink from '../common/SourceLink';
import { formatDate } from '../../lib/date-utils';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  improving: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function SupplyChain({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<SupplyChainData>('supply-chain.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.shortages.filter((s) => matchesFilter(s.market));
  const active = filtered.filter((s) => s.status === 'active').length;
  const resolved = filtered.filter((s) => s.status === 'resolved').length;

  // Calculate average duration in days for resolved shortages
  const resolvedWithDates = filtered.filter((s) => s.status === 'resolved' && s.resolved_date);
  const avgDurationDays =
    resolvedWithDates.length > 0
      ? Math.round(
          resolvedWithDates.reduce((sum, s) => {
            const start = new Date(s.start_date).getTime();
            const end = new Date(s.resolved_date!).getTime();
            return sum + (end - start) / (1000 * 60 * 60 * 24);
          }, 0) / resolvedWithDates.length,
        )
      : null;

  const columns = [
    {
      key: 'drug',
      header: 'Drug',
      render: (s: ShortageEvent) => (
        <span className="font-medium text-gray-900 dark:text-white">{s.drug}</span>
      ),
    },
    {
      key: 'manufacturer',
      header: 'Manufacturer',
      render: (s: ShortageEvent) => <span>{s.manufacturer}</span>,
    },
    {
      key: 'market',
      header: 'Market',
      render: (s: ShortageEvent) => <MarketTag market={s.market} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: ShortageEvent) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] || ''}`}>
          {s.status}
        </span>
      ),
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (s: ShortageEvent) => (
        <span className="text-xs font-mono">{formatDate(s.start_date)}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (s: ShortageEvent) => (
        <span className="text-xs text-gray-500">{s.reason || '—'}</span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (s: ShortageEvent) => <SourceLink url={s.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Active Shortages', value: String(active), delta_direction: active > 0 ? 'up' : 'neutral' }} />
        <MetricCard metric={{ label: 'Resolved', value: String(resolved) }} />
        <MetricCard metric={{ label: 'Avg Duration', value: avgDurationDays != null ? `${avgDurationDays}d` : '—' }} />
      </div>

      {/* Shortages Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Drug Shortages ({filtered.length})
          </h3>
        </div>
        <ComparisonTable data={filtered} columns={columns} keyExtractor={(s) => s.id} />
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
