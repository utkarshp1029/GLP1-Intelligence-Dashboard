import { useState, useMemo } from 'react';
import { useDataLoader } from '../../hooks/useDataLoader';
import type { PricingData } from '../../types/pricing';
import type { Market } from '../../types/common';
import { compareBrands, formatCurrency } from '../../lib/pricing-engine';
import EntryCard from '../common/EntryCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

const CHART_COLORS = ['#1d1d1f', '#6e6e73', '#86868b', '#aeaeb2', '#c7c7cc', '#d1d1d6', '#e5e5ea', '#0071e3', '#34c759', '#5856d6'];

export default function PricingCalculator({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<PricingData>('pricing.json');
  const [selectedMolecule, setSelectedMolecule] = useState<string>('all');
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [doseMg, setDoseMg] = useState(0.5);
  const [microdoseMode, setMicrodoseMode] = useState(false);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const filteredBrands = useMemo(() => {
    if (!data) return [];
    return data.brands.filter((b) => {
      if (!matchesFilter(b.market)) return false;
      if (selectedMolecule !== 'all' && b.molecule_id !== selectedMolecule) return false;
      return true;
    });
  }, [data, selectedMolecule, matchesFilter]);

  const brandsToCompare = useMemo(() => {
    if (selectedBrandIds.length === 0) return filteredBrands;
    return filteredBrands.filter((b) => selectedBrandIds.includes(b.id));
  }, [filteredBrands, selectedBrandIds]);

  const comparisons = useMemo(() => {
    return compareBrands(brandsToCompare, doseMg, currency);
  }, [brandsToCompare, doseMg, currency]);

  const toggleBrand = (id: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="text-[#86868b] py-20 text-center">Loading...</div>;
  if (!data) return <div className="text-[#86868b] py-20 text-center">No pricing data available.</div>;

  const chartData = comparisons.slice(0, 10).map((c) => ({
    name: c.brand_name,
    cost: Math.round(c.cost_per_month),
  }));

  return (
    <div className="space-y-16">
      {/* Controls */}
      <div>
        <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-8">
          Configure Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Molecule */}
          <div>
            <label className="block text-sm text-[#86868b] mb-2">Molecule</label>
            <select
              value={selectedMolecule}
              onChange={(e) => setSelectedMolecule(e.target.value)}
              className="w-full rounded-xl border border-[#d2d2d7] bg-white dark:bg-[#1d1d1f] dark:border-[#424245] px-4 py-3 text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              <option value="all">All Molecules</option>
              {data.molecules.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Dose */}
          <div>
            <label className="block text-sm text-[#86868b] mb-2">
              Dose (mg/week) {microdoseMode && '— Custom'}
            </label>
            {microdoseMode ? (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0.05}
                  max={5}
                  step={0.05}
                  value={doseMg}
                  onChange={(e) => setDoseMg(parseFloat(e.target.value))}
                  className="flex-1 accent-[#0071e3]"
                />
                <span className="text-[15px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7] w-16 text-right">
                  {doseMg.toFixed(2)}mg
                </span>
              </div>
            ) : (
              <select
                value={doseMg}
                onChange={(e) => setDoseMg(parseFloat(e.target.value))}
                className="w-full rounded-xl border border-[#d2d2d7] bg-white dark:bg-[#1d1d1f] dark:border-[#424245] px-4 py-3 text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7]"
              >
                {[0.25, 0.5, 1.0, 1.7, 2.4, 2.5, 5.0, 7.5, 10.0, 15.0].map((d) => (
                  <option key={d} value={d}>{d} mg</option>
                ))}
              </select>
            )}
          </div>

          {/* Microdose toggle */}
          <div>
            <label className="block text-sm text-[#86868b] mb-2">Microdose Mode</label>
            <button
              onClick={() => setMicrodoseMode(!microdoseMode)}
              className={`w-full rounded-xl border px-4 py-3 text-[15px] transition-colors ${
                microdoseMode
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-white dark:bg-[#1d1d1f] text-[#6e6e73] border-[#d2d2d7] dark:border-[#424245]'
              }`}
              style={{ fontFamily: 'inherit' }}
            >
              {microdoseMode ? 'Microdosing ON' : 'Microdosing OFF'}
            </button>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm text-[#86868b] mb-2">Currency</label>
            <div className="flex gap-2">
              {(['INR', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-[15px] transition-colors ${
                    currency === c
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                      : 'bg-white dark:bg-[#1d1d1f] text-[#6e6e73] border-[#d2d2d7] dark:border-[#424245]'
                  }`}
                  style={{ fontFamily: 'inherit' }}
                >
                  {c === 'INR' ? '₹ INR' : '$ USD'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brand selector */}
        <div className="mt-6">
          <label className="block text-sm text-[#86868b] mb-3">
            Brands ({selectedBrandIds.length === 0 ? 'all selected' : `${selectedBrandIds.length} selected`})
          </label>
          <div className="flex flex-wrap gap-2">
            {filteredBrands.map((b) => (
              <button
                key={b.id}
                onClick={() => toggleBrand(b.id)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  selectedBrandIds.length === 0 || selectedBrandIds.includes(b.id)
                    ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                    : 'bg-transparent text-[#86868b] border-[#d2d2d7] hover:border-[#86868b]'
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                {b.name} ({b.manufacturer})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {comparisons.length > 0 ? (
        <>
          {/* Chart */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
              Monthly Cost at {doseMg}mg/week
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fill: '#86868b', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#1d1d1f', fontSize: 13 }} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value), currency), 'Monthly Cost']} />
                <Bar dataKey="cost" radius={[0, 6, 6, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Table */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
              Detailed Cost Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[15px]">
                <thead>
                  <tr className="border-b border-[#d2d2d7]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Brand</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Manufacturer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Pen/Format</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Total mg</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Doses/Pen</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Cost/Dose</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Cost/Month</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Microdose</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((c, i) => {
                    // Find the pen spec to get dosing metadata
                    const brand = brandsToCompare.find((b) => b.id === c.brand_id);
                    let penSpec: import('../../types/pricing').PenSpec | undefined;
                    if (brand) {
                      for (const sub of brand.sub_brands) {
                        const found = sub.pens.find((p) => p.id === c.pen_id);
                        if (found) { penSpec = found; break; }
                      }
                    }
                    return (
                      <tr
                        key={`${c.brand_id}-${c.pen_id}`}
                        className={`border-b border-[#d2d2d7]/50 ${
                          i === 0 ? 'bg-[#f5f5f7] dark:bg-[#2d2d2f]' : ''
                        }`}
                      >
                        <td className="py-4 px-4 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {c.brand_name}
                          {i === 0 && (
                            <span className="ml-2 text-[10px] font-semibold text-[#0071e3]">
                              BEST VALUE
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-[#6e6e73]">{c.manufacturer}</td>
                        <td className="py-4 px-4 text-[#6e6e73]">
                          {c.pen_label}
                          <span className="ml-1 text-xs text-[#86868b]">({c.format})</span>
                          {penSpec?.dosing_note && (
                            <p className="text-[11px] text-[#86868b] mt-1 leading-tight">{penSpec.dosing_note}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right font-mono">{c.total_mg_in_pen}mg</td>
                        <td className="py-4 px-4 text-right font-mono">{c.doses_per_pen}</td>
                        <td className="py-4 px-4 text-right font-mono font-semibold">
                          {formatCurrency(c.cost_per_dose, c.currency)}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-semibold">
                          {formatCurrency(c.cost_per_month, c.currency)}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {c.microdosable ? (
                            <span className="text-[#34c759]">Yes{penSpec?.clicks_per_pen ? ` (${penSpec.clicks_per_pen} clicks)` : ''}</span>
                          ) : (
                            <span className="text-[#86868b]">Fixed</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {penSpec?.doses_verified ? (
                            <span className="text-[10px] font-semibold text-[#34c759]">VERIFIED</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#ff9500]">UNVERIFIED</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-[#86868b]">
          No pricing data for the selected configuration.
        </div>
      )}

      {/* News */}
      {data.entries.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
            Pricing News
          </h3>
          {data.entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} isNew={isNewEntry(entry.timestamp)} />
          ))}
        </div>
      )}
    </div>
  );
}
