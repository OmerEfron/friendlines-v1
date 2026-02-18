import { useState, useEffect } from 'react';
import { fetchArticle } from '../api/client';

export function useArticle(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(new Error('Missing article id'));
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchArticle(id)
      .then((article) => {
        if (!cancelled) setData(article);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
}
