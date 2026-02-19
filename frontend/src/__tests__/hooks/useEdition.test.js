import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEdition } from '../../hooks/useEdition';
import * as api from '../../api/client';

vi.mock('../../api/client');

describe('useEdition', () => {
  const fixture = {
    date: '2025-02-19',
    topStory: { id: 1, headline: 'Lead', tier: 1, body: 'Body.' },
    briefs: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchEditionToday).mockResolvedValue(fixture);
    vi.mocked(api.fetchEdition).mockResolvedValue(fixture);
  });

  it('fetches today edition when no date param', async () => {
    const { result } = renderHook(() => useEdition(null));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(fixture);
    expect(api.fetchEditionToday).toHaveBeenCalled();
    expect(api.fetchEdition).not.toHaveBeenCalled();
  });

  it('fetches edition by date when date param provided', async () => {
    const { result } = renderHook(() => useEdition('2025-02-18'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(fixture);
    expect(api.fetchEdition).toHaveBeenCalledWith('2025-02-18');
    expect(api.fetchEditionToday).not.toHaveBeenCalled();
  });

  it('sets error on fetch failure', async () => {
    vi.mocked(api.fetchEditionToday).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useEdition(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
    expect(result.current.error.message).toBe('Network error');
  });
});
