import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArticleCard from '../../components/ArticleCard';

describe('ArticleCard', () => {
  const article = {
    id: 5,
    headline: 'Test Headline',
    body: 'First paragraph content. Second paragraph with more text.',
    tier: 1,
    date: '2025-02-19',
  };

  it('renders headline and tier label', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Headline')).toBeTruthy();
    expect(screen.getByText('Feature')).toBeTruthy();
  });

  it('truncates long body to 140 chars', () => {
    const longBody = 'a'.repeat(150);
    const { container } = render(
      <MemoryRouter>
        <ArticleCard article={{ ...article, body: longBody }} />
      </MemoryRouter>
    );
    const excerpt = container.querySelector('.article-excerpt');
    expect(excerpt.textContent).toHaveLength(141);
    expect(excerpt.textContent).toContain('…');
  });

  it('applies featured class when featured', () => {
    const { container } = render(
      <MemoryRouter>
        <ArticleCard article={article} featured />
      </MemoryRouter>
    );
    expect(container.querySelector('.article-card-featured')).toBeTruthy();
  });

  it('links to article page', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Test Headline/i });
    expect(link.getAttribute('href')).toBe('/article/5');
  });
});
