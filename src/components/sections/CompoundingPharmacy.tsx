import { useDataLoader } from '../../hooks/useDataLoader';
import type { CompoundingData, CompoundingPharmacy as CompoundingPharmacyType } from '../../types/compounding';
import type { Market } from '../../types/common';
import ComparisonTable from '../common/ComparisonTable';
import EntryCard from '../common/EntryCard';
import MetricCard from '../common/MetricCard';
import SourceLink from '../common/SourceLink';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

const FDA_COLORS: Record<string, string> = {
  compliant: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  shutdown: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  unknown: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function CompoundingPharmacy({ matchesFilter: _matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<CompoundingData>('compounding-pharmacy.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  // CompoundingPharmacy type has no market field; show all pharmacies
  const filtered = data.pharmacies;
  const compliantCount = filtered.filter((p) => p.fda_status === 'compliant').length;
  const compliantPct = filtered.length > 0 ? Math.round((compliantCount / filtered.length) * 100) : 0;

  const costsWithValues = filtered.filter((p) => p.avg_monthly_cost != null);
  const avgMonthlyCost =
    costsWithValues.length > 0
      ? Math.round(costsWithValues.reduce((sum, p) => sum + (p.avg_monthly_cost || 0), 0) / costsWithValues.length)
      : null;

  const columns = [
    {
      key: 'name',
      header: 'Pharmacy',
      render: (p: CompoundingPharmacyType) => (
        <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (p: CompoundingPharmacyType) => (
        <span className="text-xs">{p.type}</span>
      ),
    },
    {
      key: 'molecules',
      header: 'Molecules',
      render: (p: CompoundingPharmacyType) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">{p.molecules.join(', ')}</span>
      ),
    },
    {
      key: 'avg_monthly_cost',
      header: 'Avg Monthly Cost',
      render: (p: CompoundingPharmacyType) => (
        <span className="text-xs font-mono">
          {p.avg_monthly_cost != null ? `$${p.avg_monthly_cost.toLocaleString()}` : '—'}
        </span>
      ),
    },
    {
      key: 'fda_status',
      header: 'FDA Status',
      render: (p: CompoundingPharmacyType) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${FDA_COLORS[p.fda_status] || ''}`}>
          {p.fda_status}
        </span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (p: CompoundingPharmacyType) => <SourceLink url={p.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Tracked Pharmacies', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'Avg Monthly Cost', value: avgMonthlyCost != null ? `$${avgMonthlyCost}` : '—' }} />
        <MetricCard metric={{ label: 'FDA Compliant', value: `${compliantPct}%` }} />
      </div>

      {/* Pharmacies Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Compounding Pharmacies ({filtered.length})
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
