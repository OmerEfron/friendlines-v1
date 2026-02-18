import { useState, useEffect } from 'react';
import { fetchEditionToday, fetchEdition } from '../api/client';

export function useEdition(dateParam) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const fetchFn = dateParam ? () => fetchEdition(dateParam) : fetchEditionToday;
    fetchFn()
      .then((edition) => {
        if (!cancelled) setData(edition);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [dateParam]);

  return { data, loading, error };
}
