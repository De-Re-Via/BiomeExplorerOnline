// Netlify Function (Node 18) — proxy vers InfinityFree avec en-têtes "browser-like"
export async function handler(event) {
  const API_BASE = 'https://biomeunivers.infinityfree.me/public/biome.php';
  const qs  = event.rawQuery ? `?${event.rawQuery}` : '';
  const url = API_BASE + qs;

  // Préflight CORS
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

  // En-têtes "browser-like" pour éviter la page anti-bot d'InfinityFree
  const browserish = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Origin':  'https://biomeunivers.infinityfree.me',
    'Referer': 'https://biomeunivers.infinityfree.me/public/',
    'Connection': 'keep-alive'
  };

  // On transfère certains en-têtes utiles depuis le jeu → proxy → PHP
  const pass = {};
  for (const k of ['content-type', 'x-u', 'x-x', 'x-g']) {
    const v = event.headers[k];
    if (v) pass[k] = v;
  }

  const init = {
    method: event.httpMethod,
    headers: { ...browserish, ...pass },
    body: event.httpMethod === 'GET' ? undefined : event.body
  };

  const resp = await fetch(url, init);
  const text = await resp.text();

  return {
    statusCode: resp.status,
    headers: {
      'content-type': resp.headers.get('content-type') || 'application/json; charset=utf-8'
    },
    body: text
  };
}
