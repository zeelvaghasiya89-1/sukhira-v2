const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchStore(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    cache: 'no-store',
    ...options
  });
  if (!res.ok) {
    throw new Error(`API error fetching ${path}: ${res.statusText}`);
  }
  return res.json();
}
