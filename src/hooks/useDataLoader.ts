import { useState, useEffect } from 'react';

interface UseDataLoaderResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDataLoader<T>(dataFile: string): UseDataLoaderResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.BASE_URL}data/${dataFile}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${dataFile}`);
        return res.json();
      })
      .then((json: T) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dataFile, fetchKey]);

  const refetch = () => setFetchKey((k) => k + 1);

  return { data, loading, error, refetch };
}
