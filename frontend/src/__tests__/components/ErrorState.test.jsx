import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorState from '../../components/ErrorState';

describe('ErrorState', () => {
  it('shows error message from error.message', () => {
    render(<ErrorState error={{ message: 'Network failed' }} />);
    expect(screen.getByText('Network failed')).toBeTruthy();
  });

  it('shows error from error.body.error', () => {
    render(<ErrorState error={{ body: { error: 'Not found' } }} />);
    expect(screen.getByText('Not found')).toBeTruthy();
  });

  it('shows fallback when no message', () => {
    render(<ErrorState error={{}} />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });
});
