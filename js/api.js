// API wrapper for backend communication

const API_BASE = 'http://localhost:3001';

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function checkBackend() {
  try {
    await fetch(API_BASE + '/api/health', { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}
