import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('routes', () => {
  it('renders home route with brand and nav', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /FriendLines/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Today/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Archive/i })).toBeTruthy();
  });

  it('navigates to archive when Archive link clicked', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: /Archive/i }));
    expect(screen.getByRole('link', { name: /Archive/i }).className).toContain('nav-link-active');
  });

  it('navigates home when Today link clicked', () => {
    render(
      <BrowserRouter initialEntries={['/archive']}>
        <App />
      </BrowserRouter>
    );
    const todayLink = screen.getByRole('link', { name: /Today/i });
    fireEvent.click(todayLink);
    expect(screen.getByRole('link', { name: /Today/i }).className).toContain('nav-link-active');
  });
});
