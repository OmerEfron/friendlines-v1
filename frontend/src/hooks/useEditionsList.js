import { useState, useEffect } from 'react';
import { fetchEditionsList } from '../api/client';

export function useEditionsList(limit = 30) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchEditionsList(limit)
      .then((res) => {
        if (!cancelled) setData(res.editions || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [limit]);

  return { data, loading, error };
}
