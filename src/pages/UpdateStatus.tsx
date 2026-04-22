import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { SECTIONS } from '../config/sections';
import { getStalenessLevel } from '../components/common/StalenessBadge';
import { ChevronRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SectionStatus {
  id: string;
  title: string;
  dataFile: string;
  color: string;
  lastUpdated: string | null;
  entryCount: number | null;
  loading: boolean;
  error: string | null;
}

export default function UpdateStatus() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Update Status — GLP-1 Intel';
    loadAllStatuses();
  }, []);

  const loadAllStatuses = async () => {
    setLoading(true);
    const statuses: SectionStatus[] = [];

    for (const section of SECTIONS) {
      try {
        const res = await fetch(
          `${import.meta.env.BASE_URL}data/${section.dataFile}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        statuses.push({
          id: section.id,
          title: section.title,
          dataFile: section.dataFile,
          color: section.color,
          lastUpdated: data.meta?.last_updated || null,
          entryCount: data.meta?.entry_count || null,
          loading: false,
          error: null,
        });
      } catch (e) {
        statuses.push({
          id: section.id,
          title: section.title,
          dataFile: section.dataFile,
          color: section.color,
          lastUpdated: null,
          entryCount: null,
          loading: false,
          error: e instanceof Error ? e.message : 'Failed to load',
        });
      }
    }

    setSections(statuses);
    setLoading(false);
  };

  // Compute summary stats
  const levels = sections.map((s) => getStalenessLevel(s.lastUpdated || undefined));
  const fresh = levels.filter((l) => l.level === 'fresh').length;
  const recent = levels.filter((l) => l.level === 'recent').length;
  const stale = levels.filter((l) => l.level === 'stale').length;
  const veryStale = levels.filter((l) => l.level === 'very-stale').length;
  const unknown = levels.filter((l) => l.level === 'unknown').length;

  // Sort by staleness (most stale first)
  const sortedSections = [...sections].sort((a, b) => {
    const aLevel = getStalenessLevel(a.lastUpdated || undefined);
    const bLevel = getStalenessLevel(b.lastUpdated || undefined);
    return bLevel.days - aLevel.days;
  });

  const mostRecentUpdate = sections
    .map((s) => s.lastUpdated)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      {/* Hero */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[980px] mx-auto px-6 py-12">
          <p className="apple-eyebrow text-[#86868b] mb-4">Meta</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Update Status
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Freshness tracking across all {SECTIONS.length} sections. Green = fresh (≤2 days), blue = recent (≤7), amber = stale (≤14), red = very stale (&gt;14).
          </p>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="max-w-[980px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <StatCard
            label="Fresh"
            sublabel="≤ 2 days"
            value={fresh}
            colorClass="text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-900"
          />
          <StatCard
            label="Recent"
            sublabel="3-7 days"
            value={recent}
            colorClass="text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 border-blue-200 dark:border-blue-900"
          />
          <StatCard
            label="Stale"
            sublabel="8-14 days"
            value={stale}
            colorClass="text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900"
          />
          <StatCard
            label="Very Stale"
            sublabel="> 14 days"
            value={veryStale}
            colorClass="text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/30 border-red-200 dark:border-red-900"
          />
          <StatCard
            label="Unknown"
            sublabel="No data"
            value={unknown}
            colorClass="text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>

        {mostRecentUpdate && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <RefreshCw size={14} />
            <span>
              Most recent update:{' '}
              <strong className="text-gray-900 dark:text-white">
                {new Date(mostRecentUpdate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </span>
          </div>
        )}

        {(veryStale > 0 || stale > 0) && !loading && (
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mb-8">
            <AlertCircle
              size={18}
              className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
            />
            <div className="text-sm text-amber-900 dark:text-amber-200">
              <strong>{veryStale + stale} section{veryStale + stale > 1 ? 's need' : ' needs'} refresh.</strong>{' '}
              Sections are shown in staleness order below — oldest first.
            </div>
          </div>
        )}

        {veryStale === 0 && stale === 0 && !loading && sections.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 rounded-lg p-4 mb-8">
            <CheckCircle2
              size={18}
              className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"
            />
            <div className="text-sm text-emerald-900 dark:text-emerald-200">
              <strong>All sections are fresh.</strong> Every section has been updated within the last 7 days.
            </div>
          </div>
        )}

        {/* Section Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading section statuses...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">
                    Section
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    Last Updated
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                    Entries
                  </th>
                  <th className="px-4 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {sortedSections.map((s) => {
                  const level = getStalenessLevel(s.lastUpdated || undefined);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/section/${s.id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {s.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full font-medium text-xs px-2 py-1 ${level.colorClass}`}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${level.dotClass}`} />
                          {level.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {s.lastUpdated
                          ? new Date(s.lastUpdated).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell tabular-nums">
                        {s.entryCount ?? '—'}
                      </td>
                      <td className="px-4 py-4">
                        <ChevronRight
                          size={16}
                          className="text-gray-300 dark:text-gray-600"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  sublabel,
  value,
  colorClass,
}: {
  label: string;
  sublabel: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <div className="text-3xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs font-medium mt-1">{label}</div>
      <div className="text-[10px] opacity-75">{sublabel}</div>
    </div>
  );
}
