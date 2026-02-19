import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useArticle } from '../../hooks/useArticle';
import * as api from '../../api/client';

vi.mock('../../api/client');

describe('useArticle', () => {
  const fixture = {
    id: 7,
    headline: 'Article Title',
    body: 'Content.',
    tier: 2,
    date: '2025-02-19',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchArticle).mockResolvedValue(fixture);
  });

  it('fetches article when id provided', async () => {
    const { result } = renderHook(() => useArticle('7'));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(fixture);
    expect(api.fetchArticle).toHaveBeenCalledWith('7');
  });

  it('sets error when id missing', async () => {
    const { result } = renderHook(() => useArticle(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
    expect(api.fetchArticle).not.toHaveBeenCalled();
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(api.fetchArticle).mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useArticle('99'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});
