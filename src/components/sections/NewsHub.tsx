import { useState, useMemo } from 'react';
import { useDataLoader } from '../../hooks/useDataLoader';
import type { Market } from '../../types/common';
import ReactMarkdown from 'react-markdown';

interface Source {
  publication: string;
  title: string;
  url: string;
  date: string;
}

interface Story {
  id: string;
  headline: string;
  summary: string;
  market: Market;
  category: string;
  timestamp: string;
  importance: 'high' | 'medium' | 'low';
  sources: Source[];
  tags: string[];
}

interface NewsHubData {
  meta: { section_id: string; last_updated: string; entry_count: number; key_metrics: { label: string; value: string }[] };
  stories: Story[];
  entries: unknown[];
}

const MARKET_LABELS: Record<string, string> = { india: 'India', us: 'US', both: 'Global' };
const CATEGORY_LABELS: Record<string, string> = {
  launch: 'Launch', regulatory: 'Regulatory', pricing: 'Pricing',
  clinical: 'Clinical', business: 'Business', safety: 'Safety', market: 'Market',
};
const IMPORTANCE_STYLES: Record<string, string> = {
  high: 'bg-[#ff3b30]/10 text-[#ff3b30]',
  medium: 'bg-[#ff9500]/10 text-[#ff9500]',
  low: 'bg-[#86868b]/10 text-[#86868b]',
};

function formatDate(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

export default function NewsHub({ matchesFilter }: Props) {
  const { data, loading } = useDataLoader<NewsHubData>('news-hub.json');
  const [marketFilter, setMarketFilter] = useState<'all' | 'india' | 'us'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    if (!data) return [];
    return data.stories
      .filter((s) => {
        if (marketFilter !== 'all') {
          if (marketFilter === 'india' && s.market !== 'india' && s.market !== 'both') return false;
          if (marketFilter === 'us' && s.market !== 'us' && s.market !== 'both') return false;
        }
        if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
        return matchesFilter(s.market);
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, marketFilter, categoryFilter, matchesFilter]);

  const categories = useMemo(() => {
    if (!data) return [];
    const cats = [...new Set(data.stories.map((s) => s.category))];
    return cats.sort();
  }, [data]);

  if (loading) return <div className="text-[#86868b] py-20 text-center">Loading...</div>;
  if (!data) return <div className="text-[#86868b] py-20 text-center">No news data available.</div>;

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-6 items-end">
        {/* Market Toggle */}
        <div>
          <label className="block text-sm text-[#86868b] mb-2">Market</label>
          <div className="flex gap-1 bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-xl p-1">
            {(['all', 'india', 'us'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMarketFilter(m)}
                className={`px-5 py-2 text-sm rounded-lg transition-all ${
                  marketFilter === m
                    ? 'bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm font-medium'
                    : 'text-[#86868b] hover:text-[#6e6e73]'
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                {m === 'all' ? 'All Markets' : m === 'india' ? 'India' : 'US & Global'}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <label className="block text-sm text-[#86868b] mb-2">Category</label>
          <div className="flex gap-1 flex-wrap bg-[#f5f5f7] dark:bg-[#2d2d2f] rounded-xl p-1">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                categoryFilter === 'all'
                  ? 'bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm font-medium'
                  : 'text-[#86868b] hover:text-[#6e6e73]'
              }`}
              style={{ fontFamily: 'inherit' }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm font-medium'
                    : 'text-[#86868b] hover:text-[#6e6e73]'
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto text-sm text-[#86868b]">
          {filteredStories.length} stories
        </div>
      </div>

      {/* Stories */}
      <div className="space-y-0 divide-y divide-[#d2d2d7]/50 dark:divide-[#424245]/50">
        {filteredStories.map((story) => {
          const isExpanded = expandedStory === story.id;
          return (
            <div key={story.id} className="py-8 first:pt-0">
              {/* Meta row */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-[#86868b] font-mono">{formatDate(story.timestamp)}</span>
                <span className="text-xs uppercase tracking-wider text-[#86868b]">
                  {MARKET_LABELS[story.market] || story.market}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${IMPORTANCE_STYLES[story.importance]}`}>
                  {story.importance}
                </span>
                <span className="text-[11px] text-[#86868b] px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#2d2d2f]">
                  {CATEGORY_LABELS[story.category] || story.category}
                </span>
              </div>

              {/* Headline */}
              <button
                onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                className="text-left bg-transparent border-none cursor-pointer p-0 w-full"
                style={{ fontFamily: 'inherit' }}
              >
                <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug hover:text-[#0071e3] transition-colors">
                  {story.headline}
                </h3>
              </button>

              {/* Summary — always visible */}
              <div className="text-[15px] text-[#6e6e73] mt-2 leading-relaxed max-w-3xl">
                <ReactMarkdown>{story.summary}</ReactMarkdown>
              </div>

              {/* Source count hint */}
              {!isExpanded && (
                <button
                  onClick={() => setExpandedStory(story.id)}
                  className="mt-3 text-sm text-[#0071e3] hover:underline bg-transparent border-none cursor-pointer p-0"
                  style={{ fontFamily: 'inherit' }}
                >
                  {story.sources.length} sources — click to see all articles
                </button>
              )}

              {/* Expanded: all sources */}
              {isExpanded && (
                <div className="mt-5">
                  <h4 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-3">
                    Sources ({story.sources.length})
                  </h4>
                  <div className="space-y-3">
                    {story.sources.map((src, i) => (
                      <div key={i} className="flex items-start gap-3 pl-4 border-l-2 border-[#d2d2d7] dark:border-[#424245]">
                        <div className="flex-1 min-w-0">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[15px] text-[#0071e3] hover:underline font-medium leading-snug block"
                          >
                            {src.title}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                              {src.publication}
                            </span>
                            <span className="text-xs text-[#86868b]">{formatDate(src.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  {story.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {story.tags.map((tag) => (
                        <span key={tag} className="text-[11px] text-[#86868b]">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-20 text-[#86868b]">
          No stories match the selected filters.
        </div>
      )}
    </div>
  );
}
