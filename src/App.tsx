import { BrowserRouter, Routes, Route } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import SectionDetail from './pages/SectionDetail';
import { useMarketFilter } from './hooks/useMarketFilter';
import { useWhatsNew } from './hooks/useWhatsNew';
import { SECTIONS } from './config/sections';

export default function App() {
  const { filter, setFilter, matchesFilter } = useMarketFilter();
  const { meta, newCounts, setNewCounts, countNewForSection, markAsRead, isNewEntry } =
    useWhatsNew();
  const [totalNew, setTotalNew] = useState(0);

  const loadNewCounts = useCallback(async () => {
    const counts: Record<string, number> = {};
    let total = 0;
    for (const section of SECTIONS) {
      const count = await countNewForSection(section.id, section.dataFile);
      counts[section.id] = count;
      total += count;
    }
    setNewCounts(counts);
    setTotalNew(total);
  }, [countNewForSection, setNewCounts]);

  useEffect(() => {
    loadNewCounts();
  }, [loadNewCounts]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          element={
            <AppShell
              filter={filter}
              setFilter={setFilter}
              totalNew={totalNew}
              lastUpdate={meta?.last_full_update || null}
              onMarkAsRead={markAsRead}
            />
          }
        >
          <Route
            index
            element={
              <Dashboard
                meta={meta}
                newCounts={newCounts}
                matchesFilter={matchesFilter}
              />
            }
          />
          <Route
            path="/section/:sectionId"
            element={
              <SectionDetail
                matchesFilter={matchesFilter}
                isNewEntry={isNewEntry}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
