import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArchivePage from '../../routes/ArchivePage';
import * as api from '../../api/client';

vi.mock('../../api/client');

const fixture = {
  editions: [
    {
      id: 1,
      date: '2025-02-19',
      articleCount: 2,
      topStoryHeadline: 'Lead Story Headline',
    },
  ],
};

describe('ArchivePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchEditionsList).mockResolvedValue(fixture);
  });

  it('shows loading initially', () => {
    vi.mocked(api.fetchEditionsList).mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders editions list when loaded', async () => {
    render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Past Editions')).toBeTruthy());
    expect(screen.getByText(/2 article/)).toBeTruthy();
    const links = screen.getAllByTestId('edition-link');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/?date=2025-02-19');
  });

  it('shows empty state when no editions', async () => {
    vi.mocked(api.fetchEditionsList).mockResolvedValue({ editions: [] });
    render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/No editions yet/)).toBeTruthy());
  });

  it('shows error on fetch failure', async () => {
    vi.mocked(api.fetchEditionsList).mockRejectedValue(new Error('Network error'));
    render(
      <MemoryRouter>
        <ArchivePage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Network error')).toBeTruthy());
  });
});
