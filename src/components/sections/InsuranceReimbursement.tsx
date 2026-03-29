import { useDataLoader } from '../../hooks/useDataLoader';
import type { InsuranceData, InsuranceCoverage } from '../../types/insurance';
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

const COVERAGE_COLORS: Record<string, string> = {
  covered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  prior_auth: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  step_therapy: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  not_covered: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function InsuranceReimbursement({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<InsuranceData>('insurance-reimbursement.json');

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.coverages.filter((c) => matchesFilter(c.market));
  const covered = filtered.filter((c) => c.coverage_status === 'covered').length;
  const priorAuth = filtered.filter((c) => c.coverage_status === 'prior_auth').length;
  const notCovered = filtered.filter((c) => c.coverage_status === 'not_covered').length;

  const columns = [
    {
      key: 'payer',
      header: 'Payer',
      render: (c: InsuranceCoverage) => (
        <span className="font-medium text-gray-900 dark:text-white">{c.payer}</span>
      ),
    },
    {
      key: 'drug',
      header: 'Drug',
      render: (c: InsuranceCoverage) => <span>{c.drug}</span>,
    },
    {
      key: 'market',
      header: 'Market',
      render: (c: InsuranceCoverage) => <MarketTag market={c.market} />,
    },
    {
      key: 'coverage_status',
      header: 'Coverage',
      render: (c: InsuranceCoverage) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${COVERAGE_COLORS[c.coverage_status] || ''}`}>
          {c.coverage_status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'typical_copay_range',
      header: 'Copay Range',
      render: (c: InsuranceCoverage) => (
        <span className="text-xs font-mono">
          {c.typical_copay_range
            ? `${c.currency === 'INR' ? '\u20B9' : '$'}${c.typical_copay_range[0]}\u2013${c.typical_copay_range[1]}`
            : '\u2014'}
        </span>
      ),
    },
    {
      key: 'conditions',
      header: 'Conditions',
      render: (c: InsuranceCoverage) => (
        <span className="text-xs text-gray-500">
          {c.conditions && c.conditions.length > 0 ? c.conditions.join(', ') : '\u2014'}
        </span>
      ),
    },
    {
      key: 'source',
      header: '',
      render: (c: InsuranceCoverage) => <SourceLink url={c.source_url} name="Source" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard metric={{ label: 'Covered Drugs', value: String(covered) }} />
        <MetricCard metric={{ label: 'Prior Auth Required', value: String(priorAuth) }} />
        <MetricCard metric={{ label: 'Not Covered', value: String(notCovered), delta_direction: notCovered > 0 ? 'up' : 'neutral' }} />
      </div>

      {/* Coverage Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Insurance Coverage ({filtered.length})
          </h3>
        </div>
        <ComparisonTable data={filtered} columns={columns} keyExtractor={(c) => c.id} />
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
