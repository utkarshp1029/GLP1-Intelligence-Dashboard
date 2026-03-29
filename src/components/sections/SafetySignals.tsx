import { useDataLoader } from '../../hooks/useDataLoader';
import type { SafetyData, SafetySignal } from '../../types/safety';
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

const SEVERITY_COLORS: Record<string, string> = {
  serious: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  mild: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function SafetySignals({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<SafetyData>('safety-signals.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.signals.filter((s) => matchesFilter(s.market));
  const serious = filtered.filter((s) => s.severity === 'serious').length;
  const latestDate = filtered
    .map((s) => s.date)
    .sort()
    .reverse()[0];

  const columns = [
    {
      key: 'drug',
      header: 'Drug',
      render: (s: SafetySignal) => (
        <span className="font-medium text-gray-900 dark:text-white">{s.drug}</span>
      ),
    },
    {
      key: 'molecule',
      header: 'Molecule',
      render: (s: SafetySignal) => (
        <span className="text-gray-600 dark:text-gray-400">{s.molecule}</span>
      ),
    },
    {
      key: 'event_type',
      header: 'Event',
      render: (s: SafetySignal) => <span className="text-xs">{s.event_type}</span>,
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (s: SafetySignal) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[s.severity] || ''}`}>
          {s.severity}
        </span>
      ),
    },
    {
      key: 'agency',
      header: 'Agency',
      render: (s: SafetySignal) => <span className="text-xs">{s.agency}</span>,
    },
    {
      key: 'market',
      header: 'Market',
      render: (s: SafetySignal) => <MarketTag market={s.market} />,
    },
    {
      key: 'date',
      header: 'Date',
      render: (s: SafetySignal) => (
        <span className="text-xs font-mono">{formatDate(s.date)}</span>
      ),
    },
    {
      key: 'action_taken',
      header: 'Action',
      render: (s: SafetySignal) => (
        <span className="text-xs text-gray-500">{s.action_taken || '—'}</span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (s: SafetySignal) => <SourceLink url={s.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Total Signals', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'Serious', value: String(serious), delta_direction: serious > 0 ? 'up' : 'neutral' }} />
        <MetricCard metric={{ label: 'Latest Alert', value: latestDate ? formatDate(latestDate) : '—' }} />
      </div>

      {/* Signals Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Safety Signals ({filtered.length})
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
