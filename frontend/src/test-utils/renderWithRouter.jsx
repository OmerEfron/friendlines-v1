import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * Renders a component with React Router context for testing.
 * @param {React.ReactElement} ui - Component to render
 * @param {{ route?: string }} options - Options; route is initial location
 */
export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}
