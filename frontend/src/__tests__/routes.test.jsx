import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
