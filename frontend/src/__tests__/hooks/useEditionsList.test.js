import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEditionsList } from '../../hooks/useEditionsList';
import * as api from '../../api/client';

vi.mock('../../api/client');

describe('useEditionsList', () => {
  const fixture = {
    editions: [
      { id: 1, date: '2025-02-19', articleCount: 3, topStoryHeadline: 'Lead' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchEditionsList).mockResolvedValue(fixture);
  });

  it('fetches editions list', async () => {
    const { result } = renderHook(() => useEditionsList());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(fixture.editions);
    expect(api.fetchEditionsList).toHaveBeenCalledWith(30);
  });

  it('passes limit to fetch', async () => {
    const { result } = renderHook(() => useEditionsList(10));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api.fetchEditionsList).toHaveBeenCalledWith(10);
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(api.fetchEditionsList).mockRejectedValue(new Error('Failed'));
    const { result } = renderHook(() => useEditionsList());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});
