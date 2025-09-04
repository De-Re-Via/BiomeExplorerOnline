// Netlify Function (Node 18 runtime) — proxy vers InfinityFree
export async function handler(event, context) {
  const API = 'https://biomeunivers.infinityfree.me/public/biome.php';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-U,X-X,X-G',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  const headers = {};
  for (const k of ['content-type', 'x-u', 'x-x', 'x-g']) {
    const v = event.headers[k];
    if (v) headers[k] = v;
  }

  const init = {
    method: event.httpMethod,
    headers,
    body: event.httpMethod === 'GET' ? undefined : event.body
  };

  const resp = await fetch(API, init);
  const text = await resp.text();

  return {
    statusCode: resp.status,
    headers: { 'content-type': resp.headers.get('content-type') || 'application/json; charset=utf-8' },
    body: text
  };
}
