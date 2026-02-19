import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../../routes/HomePage';
import * as api from '../../api/client';

vi.mock('../../api/client');

const fixture = {
  date: '2025-02-19',
  topStory: { id: 1, headline: 'Top Story', body: 'Lead content.', tier: 1 },
  briefs: [{ id: 2, headline: 'Brief', body: 'Brief body.', tier: 3 }],
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchEditionToday).mockResolvedValue(fixture);
    vi.mocked(api.fetchEdition).mockResolvedValue(fixture);
  });

  it('shows loading initially', () => {
    vi.mocked(api.fetchEditionToday).mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders top story and briefs when loaded', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Top Story')).toBeTruthy());
    expect(screen.getByRole('link', { name: /Brief/ })).toBeTruthy();
    expect(screen.getByText(/2 article/)).toBeTruthy();
  });

  it('shows empty state when no top story', async () => {
    vi.mocked(api.fetchEditionToday).mockResolvedValue({
      date: '2025-02-19',
      topStory: null,
      briefs: [],
    });
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByText(/No top story yet/)).toBeTruthy()
    );
  });

  it('shows error state on fetch failure', async () => {
    vi.mocked(api.fetchEditionToday).mockRejectedValue(new Error('Failed'));
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Failed')).toBeTruthy());
  });
});
