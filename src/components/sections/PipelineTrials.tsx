import { useDataLoader } from '../../hooks/useDataLoader';
import type { PipelineData, ClinicalTrial } from '../../types/pipeline';
import type { Market } from '../../types/common';
import ComparisonTable from '../common/ComparisonTable';
import EntryCard from '../common/EntryCard';
import MetricCard from '../common/MetricCard';
import MarketTag from '../common/MarketTag';
import SourceLink from '../common/SourceLink';

interface Props { matchesFilter: (m: Market) => boolean; isNewEntry: (ts: string) => boolean; }

const PHASE_COLORS: Record<string, string> = {
  preclinical: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  phase1: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  phase2: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  phase3: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  approved: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
};

export default function PipelineTrials({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<PipelineData>('pipeline-trials.json');
  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;
  if (!data) return <div className="text-gray-500">No data available.</div>;

  const filtered = data.trials.filter((t) => matchesFilter(t.market_relevance));
  const phase3 = filtered.filter((t) => t.phase === 'phase3');

  const columns = [
    { key: 'molecule', header: 'Molecule', render: (t: ClinicalTrial) => <span className="font-medium text-gray-900 dark:text-white">{t.molecule}</span> },
    { key: 'sponsor', header: 'Sponsor', render: (t: ClinicalTrial) => <span>{t.sponsor}</span> },
    { key: 'mechanism', header: 'Mechanism', render: (t: ClinicalTrial) => <span className="text-xs text-gray-500">{t.mechanism}</span> },
    { key: 'phase', header: 'Phase', render: (t: ClinicalTrial) => <span className={`text-xs px-2 py-0.5 rounded-full ${PHASE_COLORS[t.phase] || ''}`}>{t.phase.replace('phase', 'Phase ')}</span> },
    { key: 'status', header: 'Status', render: (t: ClinicalTrial) => <span className="text-xs capitalize">{t.status}</span> },
    { key: 'market', header: 'Market', render: (t: ClinicalTrial) => <MarketTag market={t.market_relevance} /> },
    { key: 'vs_sema', header: 'vs Semaglutide', render: (t: ClinicalTrial) => <span className="text-xs text-gray-500">{t.efficacy_vs_semaglutide || '—'}</span> },
    { key: 'source', header: '', render: (t: ClinicalTrial) => <SourceLink url={t.source_url} name="Source" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard metric={{ label: 'Active Trials', value: String(filtered.length) }} />
        <MetricCard metric={{ label: 'Phase 3', value: String(phase3.length) }} />
        <MetricCard metric={{ label: 'Unique Sponsors', value: String(new Set(filtered.map((t) => t.sponsor)).size) }} />
        <MetricCard metric={{ label: 'Nearest Completion', value: filtered.find((t) => t.expected_completion)?.expected_completion?.slice(0, 7) || '—' }} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Clinical Trials Pipeline</h3>
        </div>
        <ComparisonTable data={filtered} columns={columns} keyExtractor={(t) => t.id} />
      </div>

      {data.entries.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Pipeline News</h3>
          <div className="space-y-3">
            {data.entries.map((e) => <EntryCard key={e.id} entry={e} isNew={isNewEntry(e.timestamp)} />)}
          </div>
        </div>
      )}
    </div>
  );
}
