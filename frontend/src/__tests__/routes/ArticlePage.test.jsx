import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ArticlePage from '../../routes/ArticlePage';
import * as api from '../../api/client';

vi.mock('../../api/client');

const fixture = {
  id: 11,
  headline: 'Article Headline',
  body: 'Lead paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
  tier: 1,
  date: '2025-02-19',
};

describe('ArticlePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchArticle).mockResolvedValue(fixture);
  });

  it('shows loading initially', () => {
    vi.mocked(api.fetchArticle).mockImplementation(() => new Promise(() => {}));
    render(
      <MemoryRouter initialEntries={['/article/11']}>
        <Routes>
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders article content when loaded', async () => {
    render(
      <MemoryRouter initialEntries={['/article/11']}>
        <Routes>
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Article Headline')).toBeTruthy());
    expect(screen.getByText('Lead paragraph.')).toBeTruthy();
    expect(screen.getByText('Second paragraph.')).toBeTruthy();
    expect(screen.getByText('Feature')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Back to edition/ })).toBeTruthy();
  });

  it('shows not found when article missing', async () => {
    vi.mocked(api.fetchArticle).mockRejectedValue(new Error('Not found'));
    render(
      <MemoryRouter initialEntries={['/article/999']}>
        <Routes>
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Not found')).toBeTruthy());
  });
});
