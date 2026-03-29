import { useDataLoader } from '../../hooks/useDataLoader';
import type { GenericsTrackerData, GenericLaunch } from '../../types/generics';
import type { Market } from '../../types/common';
import TimelineView from '../common/TimelineView';
import EntryCard from '../common/EntryCard';
import ComparisonTable from '../common/ComparisonTable';
import SourceLink from '../common/SourceLink';
import { formatDate } from '../../lib/date-utils';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

export default function GenericsTracker({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<GenericsTrackerData>('generics-tracker.json');

  if (loading) return <div className="text-[#86868b] py-20 text-center">Loading...</div>;
  if (!data) return <div className="text-[#86868b] py-20 text-center">No data available.</div>;

  const filteredLaunches = data.launches.filter((l) => matchesFilter(l.market));
  const timelineItems = filteredLaunches
    .filter((l) => l.launch_date || l.approval_date)
    .map((l) => ({
      id: l.id,
      date: l.launch_date || l.approval_date || '',
      title: `${l.brand_name} by ${l.manufacturer}`,
      summary: `${l.molecule} — ${l.status.replace(/_/g, ' ')}. Format: ${l.format}${l.price_per_unit ? `. Price: ${l.currency === 'INR' ? '₹' : '$'}${l.price_per_unit.toLocaleString()}` : ''}`,
      market: l.market,
      source_url: l.source_url,
      source_name: 'Source',
    }));

  const columns = [
    {
      key: 'brand',
      header: 'Brand',
      render: (l: GenericLaunch) => (
        <span className="font-semibold">{l.brand_name}</span>
      ),
    },
    {
      key: 'manufacturer',
      header: 'Manufacturer',
      render: (l: GenericLaunch) => <span className="text-[#6e6e73]">{l.manufacturer}</span>,
    },
    {
      key: 'molecule',
      header: 'Molecule',
      render: (l: GenericLaunch) => <span className="text-[#6e6e73]">{l.molecule}</span>,
    },
    {
      key: 'market',
      header: 'Market',
      render: (l: GenericLaunch) => <span className="text-xs uppercase tracking-wider text-[#86868b]">{l.market === 'india' ? 'India' : 'US'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (l: GenericLaunch) => (
        <span className="text-sm capitalize text-[#1d1d1f] dark:text-[#f5f5f7]">
          {l.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'format',
      header: 'Format',
      render: (l: GenericLaunch) => <span className="capitalize text-[#6e6e73]">{l.format}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      render: (l: GenericLaunch) => (
        <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
          {l.price_per_unit ? `${l.currency === 'INR' ? '₹' : '$'}${l.price_per_unit.toLocaleString()}` : '—'}
        </span>
      ),
      align: 'right' as const,
    },
    {
      key: 'date',
      header: 'Date',
      render: (l: GenericLaunch) => (
        <span className="text-sm text-[#86868b] font-mono">
          {l.launch_date ? formatDate(l.launch_date) : l.approval_date ? formatDate(l.approval_date) : '—'}
        </span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (l: GenericLaunch) => <SourceLink url={l.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-sm text-[#86868b]">Total Launches</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{filteredLaunches.length}</p>
        </div>
        <div>
          <p className="text-sm text-[#86868b]">Launched</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{filteredLaunches.filter(l => l.status === 'launched').length}</p>
        </div>
        <div>
          <p className="text-sm text-[#86868b]">India</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{filteredLaunches.filter(l => l.market === 'india').length}</p>
        </div>
        <div>
          <p className="text-sm text-[#86868b]">US Filings</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{filteredLaunches.filter(l => l.market === 'us').length}</p>
        </div>
      </div>

      {/* Launch Table */}
      <div>
        <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
          All Launches
        </h3>
        <ComparisonTable
          data={filteredLaunches}
          columns={columns}
          keyExtractor={(l) => l.id}
        />
      </div>

      {/* Timeline */}
      {timelineItems.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            Launch Timeline
          </h3>
          <TimelineView items={timelineItems} />
        </div>
      )}

      {/* News */}
      {data.entries.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
            Latest News
          </h3>
          {data.entries.map((e) => (
            <EntryCard key={e.id} entry={e} isNew={isNewEntry(e.timestamp)} />
          ))}
        </div>
      )}
    </div>
  );
}
