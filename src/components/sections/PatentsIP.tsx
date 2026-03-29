import { useDataLoader } from '../../hooks/useDataLoader';
import type { PatentData, Patent } from '../../types/patents';
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
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  expired: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  challenged: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  invalidated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function PatentsIP({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<PatentData>('patents-ip.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.patents.filter((p) => matchesFilter(p.market));
  const active = filtered.filter((p) => p.status === 'active').length;
  const challenged = filtered.filter((p) => p.status === 'challenged' || (p.challengers && p.challengers.length > 0)).length;

  // Find the next upcoming expiry among active patents
  const now = new Date().toISOString().slice(0, 10);
  const nextExpiry = filtered
    .filter((p) => p.status === 'active' && p.expiry_date && p.expiry_date > now)
    .sort((a, b) => (a.expiry_date || '').localeCompare(b.expiry_date || ''))[0]?.expiry_date;

  const columns = [
    {
      key: 'molecule',
      header: 'Molecule',
      render: (p: Patent) => (
        <span className="font-medium text-gray-900 dark:text-white">{p.molecule}</span>
      ),
    },
    {
      key: 'holder',
      header: 'Holder',
      render: (p: Patent) => <span>{p.holder}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (p: Patent) => (
        <span className="text-xs capitalize">{p.type.replace(/_/g, ' ')}</span>
      ),
    },
    {
      key: 'market',
      header: 'Market',
      render: (p: Patent) => <MarketTag market={p.market} />,
    },
    {
      key: 'expiry_date',
      header: 'Expiry',
      render: (p: Patent) => (
        <span className="text-xs font-mono">{p.expiry_date ? formatDate(p.expiry_date) : '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Patent) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] || ''}`}>
          {p.status}
        </span>
      ),
    },
    {
      key: 'challengers',
      header: 'Challengers',
      render: (p: Patent) => (
        <span className="text-xs text-gray-500">
          {p.challengers && p.challengers.length > 0 ? p.challengers.join(', ') : '—'}
        </span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (p: Patent) => <SourceLink url={p.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Active Patents', value: String(active) }} />
        <MetricCard metric={{ label: 'Next Expiry', value: nextExpiry ? formatDate(nextExpiry) : '—' }} />
        <MetricCard metric={{ label: 'Challenges Filed', value: String(challenged) }} />
      </div>

      {/* Patents Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Patents &amp; IP ({filtered.length})
          </h3>
        </div>
        <ComparisonTable data={filtered} columns={columns} keyExtractor={(p) => p.id} />
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
