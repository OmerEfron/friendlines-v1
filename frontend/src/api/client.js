const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const err = new Error(res.statusText || `HTTP ${res.status}`);
    err.status = res.status;
    try {
      err.body = await res.json();
    } catch {
      err.body = await res.text();
    }
    throw err;
  }
  return res.json();
}

export async function fetchEditionToday() {
  return request('/api/editions/today');
}

export async function fetchEdition(date) {
  return request(`/api/editions/${date}`);
}

export async function fetchEditionsList(limit = 30) {
  return request(`/api/editions?limit=${limit}`);
}

export async function fetchArticle(id) {
  return request(`/api/articles/${id}`);
}
