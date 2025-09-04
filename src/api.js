// src/api.js — client API pour Biome Explorer
// En prod (Netlify), toutes les requêtes passent par le proxy /api/biome
// Le proxy appelle ensuite ton biome.php sur InfinityFree (donc pas de CORS côté navigateur)

function qp(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || '';
}

// URL du proxy
function buildApiUrl() {
  return '/api/biome'; // même origine que le jeu hébergé sur Netlify
}

// On continue à envoyer uid/exp/sig (issus de l’iframe) dans les headers
function authHeaders() {
  return {
    'X-U': qp('uid') || '',
    'X-X': qp('exp') || '',
    'X-G': qp('sig') || ''
  };
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    const t = await res.text();
    throw new Error(`non-JSON (${res.status}): ${t.slice(0,160)}…`);
  }
}

export async function loadState() {
  const res = await fetch(buildApiUrl(), {
    method: 'GET',
    headers: authHeaders(),
    cache: 'no-store',
    credentials: 'omit'
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`load HTTP ${res.status}: ${t.slice(0,160)}…`);
  }

  const j = await safeJson(res);
  if (!j.ok) throw new Error(j.error || 'load-failed');
  return j.state ?? null;
}

export async function saveState(state) {
  const res = await fetch(buildApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(state ?? {}),
    keepalive: true,
    credentials: 'omit'
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`save HTTP ${res.status}: ${t.slice(0,160)}…`);
  }

  const j = await safeJson(res);
  if (!j.ok) throw new Error(j.error || 'save-failed');
  return true;
}
