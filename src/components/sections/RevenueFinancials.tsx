import { useDataLoader } from '../../hooks/useDataLoader';
import type { RevenueData, CompanyFinancial } from '../../types/financials';
import type { Market } from '../../types/common';
import ComparisonTable from '../common/ComparisonTable';
import EntryCard from '../common/EntryCard';
import SourceLink from '../common/SourceLink';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props { matchesFilter: (m: Market) => boolean; isNewEntry: (ts: string) => boolean; }

const CHART_COLORS = ['#1d1d1f', '#6e6e73', '#86868b', '#aeaeb2', '#0071e3', '#5856d6'];
const INR_TO_USD = 84; // Fixed exchange rate for normalization

function toUSD(value: number, currency: string): number {
  if (currency === 'INR') return value / INR_TO_USD;
  return value;
}

function formatRevenue(value: number, currency: string): string {
  if (currency === 'INR') {
    const crores = value / 1e7;
    return `₹${crores.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
  }
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

function formatUSD(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function formatUnits(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toLocaleString();
}

const CONFIDENCE_COLORS = { high: '#34c759', medium: '#ff9500', low: '#ff3b30' };

export default function RevenueFinancials({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<RevenueData>('revenue-financials.json');
  if (loading) return <div className="text-[#86868b] py-20 text-center">Loading...</div>;
  if (!data) return <div className="text-[#86868b] py-20 text-center">No data available.</div>;

  const filtered = data.companies.filter((c) => matchesFilter(c.market));

  // Normalize all revenues to USD for chart comparison
  const chartData = filtered
    .filter((c) => c.glp1_revenue && c.glp1_revenue > 0)
    .map((c) => ({
      name: c.company,
      revenueUSD: toUSD(c.glp1_revenue!, c.currency),
      originalRevenue: formatRevenue(c.glp1_revenue!, c.currency),
    }))
    .sort((a, b) => b.revenueUSD - a.revenueUSD);

  // Volume data
  const volumeData = filtered.filter((c) => c.estimated_annual_units);

  return (
    <div className="space-y-16">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {data.market_size_india && (
          <div>
            <p className="text-sm text-[#86868b]">India GLP-1 Market ({data.market_size_india.period})</p>
            <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              ₹{(data.market_size_india.value / 1e7).toLocaleString('en-IN')} Cr
            </p>
          </div>
        )}
        {data.market_size_us && (
          <div>
            <p className="text-sm text-[#86868b]">US GLP-1 Market ({data.market_size_us.period})</p>
            <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              ${(data.market_size_us.value / 1e9).toFixed(1)}B
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-[#86868b]">Companies Tracked</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{filtered.length}</p>
        </div>
      </div>

      {/* Revenue Chart — normalized to USD */}
      {chartData.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">GLP-1 Revenue by Company (USD)</h3>
          <p className="text-sm text-[#86868b] mb-6">All values normalized to USD at ₹{INR_TO_USD}/$1 for comparison</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <XAxis
                type="number"
                tickFormatter={formatUSD}
                tick={{ fill: '#86868b', fontSize: 12 }}
              />
              <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#1d1d1f', fontSize: 13 }} />
              <Tooltip formatter={(value: number) => [formatUSD(value), 'Revenue (USD)']} />
              <Bar dataKey="revenueUSD" radius={[0, 6, 6, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Company Details Table */}
      <div>
        <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Company Details</h3>
        <ComparisonTable
          data={filtered}
          columns={[
            { key: 'company', header: 'Company', render: (c: CompanyFinancial) => <span className="font-semibold">{c.company}</span> },
            { key: 'market', header: 'Market', render: (c: CompanyFinancial) => <span className="text-xs uppercase tracking-wider text-[#86868b]">{c.market === 'india' ? 'India' : c.market === 'us' ? 'US' : 'Global'}</span> },
            { key: 'listed', header: 'Listed', render: (c: CompanyFinancial) => <span className="text-[#6e6e73]">{c.is_listed ? c.ticker || 'Yes' : 'Private'}</span> },
            { key: 'glp1_rev', header: 'GLP-1 Revenue', render: (c: CompanyFinancial) => (
              <div>
                <span className="font-mono font-semibold">{c.glp1_revenue ? formatRevenue(c.glp1_revenue, c.currency) : '—'}</span>
                {c.glp1_revenue && c.currency === 'INR' && (
                  <span className="block text-[11px] text-[#86868b]">≈ {formatUSD(toUSD(c.glp1_revenue, 'INR'))}</span>
                )}
              </div>
            ), align: 'right' },
            { key: 'share', header: 'Revenue %', render: (c: CompanyFinancial) => <span className="font-mono text-[#6e6e73]">{c.glp1_revenue_share ? `${c.glp1_revenue_share}%` : '—'}</span>, align: 'right' },
            { key: 'confidence', header: 'Confidence', render: (c: CompanyFinancial) => {
              const pct = c.confidence <= 1 ? Math.round(c.confidence * 100) : c.confidence;
              return (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#d2d2d7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1d1d1f] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-[#86868b]">{pct}%</span>
                </div>
              );
            }, align: 'center' },
            { key: 'source', header: '', render: (c: CompanyFinancial) => <SourceLink url={c.source_url} name="Source" /> },
          ]}
          keyExtractor={(c) => c.id}
        />
      </div>

      {/* Volume Guesstimates */}
      {volumeData.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Estimated Annual Pen Volume</h3>
          <p className="text-sm text-[#86868b] mb-6">Guesstimates based on revenue / avg price per pen. Not official figures.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b border-[#d2d2d7]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Company</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Est. Annual Units</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Avg Price/Unit</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Confidence</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Methodology</th>
                </tr>
              </thead>
              <tbody>
                {volumeData.map((c) => (
                  <tr key={c.id} className="border-b border-[#d2d2d7]/50">
                    <td className="py-4 px-4 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{c.company}</td>
                    <td className="py-4 px-4 text-right font-mono font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {formatUnits(c.estimated_annual_units!)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-[#6e6e73]">
                      {c.unit_currency === 'INR' ? '₹' : '$'}{c.avg_price_per_unit?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className="text-[11px] font-semibold uppercase"
                        style={{ color: CONFIDENCE_COLORS[c.volume_confidence || 'low'] }}
                      >
                        {c.volume_confidence || 'low'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[13px] text-[#86868b] max-w-xs">
                      {c.volume_note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* News */}
      {data.entries.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Financial News</h3>
          {data.entries.map((e) => <EntryCard key={e.id} entry={e} isNew={isNewEntry(e.timestamp)} />)}
        </div>
      )}
    </div>
  );
}
