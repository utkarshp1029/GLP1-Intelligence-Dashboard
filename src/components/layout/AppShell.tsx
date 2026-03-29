import { Outlet, Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import type { Market } from '../../types/common';

type MarketFilter = Market | 'all';

interface AppShellProps {
  filter: MarketFilter;
  setFilter: (f: MarketFilter) => void;
  totalNew: number;
  lastUpdate: string | null;
  onMarkAsRead: () => void;
}

export default function AppShell({
  filter,
  setFilter,
  totalNew,
  lastUpdate,
  onMarkAsRead,
}: AppShellProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filters: { label: string; value: MarketFilter }[] = [
    { label: 'All Markets', value: 'all' },
    { label: 'India', value: 'india' },
    { label: 'United States', value: 'us' },
  ];

  return (
    <div className={`min-h-screen ${dark ? 'bg-black text-[#f5f5f7]' : 'bg-white text-[#1d1d1f]'}`}>
      {/* Apple-style Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? dark
              ? 'bg-[#1d1d1f]/95 backdrop-blur-xl border-b border-white/10'
              : 'bg-white/80 backdrop-blur-xl border-b border-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[980px] mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link
              to="/"
              className={`text-sm font-semibold no-underline tracking-tight ${
                dark ? 'text-[#f5f5f7]' : 'text-[#1d1d1f]'
              }`}
            >
              GLP-1 Intel
            </Link>

            {/* Center nav links — only on home */}
            {isHome && (
              <div className="hidden md:flex items-center gap-6">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`text-xs transition-colors ${
                      filter === f.value
                        ? dark ? 'text-white font-medium' : 'text-[#1d1d1f] font-medium'
                        : dark ? 'text-[#86868b] hover:text-white' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Right */}
            <div className="flex items-center gap-4">
              {totalNew > 0 && (
                <button
                  onClick={onMarkAsRead}
                  className="text-xs text-[#0071e3] hover:underline"
                >
                  {totalNew} new
                </button>
              )}
              {!isHome && (
                <Link
                  to="/"
                  className="text-xs text-[#0071e3] no-underline hover:underline"
                >
                  ← Overview
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`border-t ${dark ? 'border-[#424245] bg-[#1d1d1f]' : 'border-[#d2d2d7] bg-[#f5f5f7]'}`}>
        <div className="max-w-[980px] mx-auto px-6 py-5">
          <p className={`text-xs ${dark ? 'text-[#86868b]' : 'text-[#6e6e73]'}`}>
            GLP-1 Market Intelligence Dashboard
            {lastUpdate && ` · Last updated ${new Date(lastUpdate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </p>
        </div>
      </footer>
    </div>
  );
}
