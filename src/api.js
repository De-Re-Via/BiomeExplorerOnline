// src/api.js — client API pour Biome Explorer (via Netlify Functions proxy)

/** Lit un paramètre de l'URL (uid / exp / sig) injecté par l'iframe du site */
function qp(n) {
  const u = new URL(window.location.href);
  return u.searchParams.get(n) || '';
}

/** URL du proxy same-origin (pas de CORS côté navigateur) */
function buildApiUrl() {
  return '/api/biome';
}

/** On envoie uid/exp/sig en headers au proxy */
function authHeaders() {
  return {
    'X-U': qp('uid') || '',
    'X-X': qp('exp') || '',
    'X-G': qp('sig') || ''
  };
}

/** Ne lit le corps QU'UNE FOIS, puis parse JSON ou lève une erreur parlante */
async function readAsJsonOrThrow(res, context) {
  const text = await res.text(); // lecture unique
  if (!res.ok) {
    throw new Error(`${context} HTTP ${res.status}: ${text.slice(0, 200)}…`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${context} non-JSON (${res.status}): ${text.slice(0, 200)}…`);
  }
}

export async function loadState() {
  const r = await fetch(buildApiUrl(), {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
    credentials: 'omit'
  });
  const j = await readAsJsonOrThrow(r, 'load');
  if (!j.ok) throw new Error(j.error || 'load-failed');
  return j.state ?? null;
}

export async function saveState(state) {
  const r = await fetch(buildApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(state ?? {}),
    keepalive: true,
    credentials: 'omit'
  });
  const j = await readAsJsonOrThrow(r, 'save');
  if (!j.ok) throw new Error(j.error || 'save-failed');
  return true;
}
