import { useDataLoader } from '../../hooks/useDataLoader';
import type { ManufacturingData, ManufacturingFacility } from '../../types/manufacturing';
import type { Market } from '../../types/common';
import ComparisonTable from '../common/ComparisonTable';
import EntryCard from '../common/EntryCard';
import MetricCard from '../common/MetricCard';
import MarketTag from '../common/MarketTag';
import SourceLink from '../common/SourceLink';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

const STATUS_COLORS: Record<string, string> = {
  operational: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  under_construction: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  planned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function Manufacturing({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<ManufacturingData>('manufacturing.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.facilities.filter((f) => matchesFilter(f.market));
  const operational = filtered.filter((f) => f.status === 'operational').length;
  const processTypes = new Set(filtered.map((f) => f.process_type));

  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (f: ManufacturingFacility) => (
        <span className="font-medium text-gray-900 dark:text-white">{f.company}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (f: ManufacturingFacility) => <span>{f.location}</span>,
    },
    {
      key: 'molecules',
      header: 'Molecules',
      render: (f: ManufacturingFacility) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">{f.molecules.join(', ')}</span>
      ),
    },
    {
      key: 'process_type',
      header: 'Process',
      render: (f: ManufacturingFacility) => (
        <span className="text-xs capitalize">{f.process_type}</span>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (f: ManufacturingFacility) => (
        <span className="text-xs text-gray-500">{f.capacity || '—'}</span>
      ),
    },
    {
      key: 'market',
      header: 'Market',
      render: (f: ManufacturingFacility) => <MarketTag market={f.market} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (f: ManufacturingFacility) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[f.status] || ''}`}>
          {f.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (f: ManufacturingFacility) => <SourceLink url={f.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Total Facilities', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'Operational', value: String(operational) }} />
        <MetricCard metric={{ label: 'Process Types', value: String(processTypes.size) }} />
      </div>

      {/* Facilities Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Manufacturing Facilities ({filtered.length})
          </h3>
        </div>
        <ComparisonTable data={filtered} columns={columns} keyExtractor={(f) => f.id} />
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
