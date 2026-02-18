# Add Frontend Route or Page

Add a new route or page to the React SPA.

1. Ensure the route aligns with V1 scope: `/`, `/archive`, `/article/:id` only. If adding a new route, confirm it fits the minimalist news edition (Homepage, Article Page, Archive Page).
2. Use functional components; hooks at top level only.
3. Fetch data from the backend API; avoid global state unless necessary.
4. No SSR for V1.
5. Keep components modular; split when exceeding ~300 lines.
