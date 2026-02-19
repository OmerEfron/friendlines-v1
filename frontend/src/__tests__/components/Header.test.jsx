import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders brand and nav links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /FriendLines/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Today/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Archive/i })).toBeTruthy();
  });

  it('shows Today as active when path is /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );
    const todayLink = screen.getByRole('link', { name: /Today/i });
    expect(todayLink.className).toContain('nav-link-active');
  });

  it('shows Archive as active when path is /archive', () => {
    render(
      <MemoryRouter initialEntries={['/archive']}>
        <Header />
      </MemoryRouter>
    );
    const archiveLink = screen.getByRole('link', { name: /Archive/i });
    expect(archiveLink.className).toContain('nav-link-active');
  });

  it('renders subtitle when provided', () => {
    render(
      <MemoryRouter>
        <Header subtitle="Monday, February 19, 2025" />
      </MemoryRouter>
    );
    expect(screen.getByText('Monday, February 19, 2025')).toBeTruthy();
  });
});
