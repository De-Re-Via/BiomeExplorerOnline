// src/main.js
// ✅ Monte Phaser dans #boardMount (ton HTML)
// ✅ Ajuste UNIQUEMENT la hauteur du fond noir (pas de resize du canvas)
// ✅ Laisse Phaser (Scale.FIT) recalculer via game.scale.refresh()
// 🚫 Ne déclenche AUCUN window.resize (plus de boucle infinie)

import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import { initHudDom, buildPaletteUI } from './ui/HudDOM.js'; // ou './ui/HudDom.js' selon ton nom
import tiles from './data/tiles.js';
import { store } from './state/store.js';

// --- Phaser ---
const config = {
  type: Phaser.AUTO,
  parent: 'boardMount',                  // ⭐ ton parent HTML
  width: 1280,
  height: 720,
  backgroundColor: '#0b0f14',
  scene: [BootScene, GameScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
};
const game = new Phaser.Game(config);

// --- HUD HTML existant ---
initHudDom();
buildPaletteUI(tiles);

// --- fiche tuile (inchangée) ---
store.on((snap) => {
  const t = tiles.find(x => x.id === snap.selectedTileId);
  const preview = document.getElementById('cardPreview');
  const name = document.getElementById('cardName');
  const axes = document.getElementById('cardAxes');
  const desc = document.getElementById('cardDesc');

  if (!t) {
    if (preview) preview.style.display = 'none';
    if (name) name.textContent = 'Sélectionne une tuile';
    if (axes) axes.innerHTML = '';
    if (desc) desc.textContent = '';
    return;
  }

  if (preview) { preview.src = `assets/tiles/${t.texture}.png`; preview.style.display = 'block'; }
  if (name) name.textContent = t.label || t.id;
  if (axes) {
    axes.innerHTML = Object.entries(t.effects || {}).map(([k, v]) => `
      <div class="axis"><label>${k}</label>
        <div class="bar"><div class="fill" style="width:${Math.min(100, Math.max(0, (v+5)*10))}%"></div></div>
      </div>`).join('');
  }
  if (desc) desc.textContent = t.description || '';
});

/* =========================================================================
   ➜ Ajuste UNIQUEMENT la hauteur de #boardMount (fond noir).
   - Pas de game.scale.resize() (on ne touche pas à la taille logique du jeu).
   - Pas de window.dispatchEvent('resize') (évite la boucle).
   - On appelle game.scale.refresh() pour que Scale.FIT recalcule sur le prochain frame.
   ========================================================================= */
let lastAppliedH = -1;
let rafId = null;

function fitBoardMount() {
  const mount = document.getElementById('boardMount');
  if (!mount) return;

  // S'assurer que la colonne centrale peut grandir
  const col = mount.parentElement;
  if (col) {
    const cs = getComputedStyle(col);
    if (cs.display !== 'flex') {
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.minHeight = '0';
    }
  }

  // Hauteur dispo = du top de mount jusqu’en bas de la fenêtre
  const rect = mount.getBoundingClientRect();
  const marginBottom = 24; // petite marge
  const availableH = Math.max(300, Math.floor(window.innerHeight - rect.top - marginBottom));

  // Evite les reflows inutiles
  if (availableH === lastAppliedH) return;
  lastAppliedH = availableH;

  // Met à jour uniquement le fond noir (parent du canvas)
  mount.style.height = availableH + 'px';
  mount.style.background = '#0b0f14';

  // Demande à Phaser de rafraîchir son Scale.FIT (pas de resize logique)
  if (game && game.scale && typeof game.scale.refresh === 'function') {
    // on attend le prochain frame pour laisser le style s'appliquer
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => game.scale.refresh());
  }
}

// 1) au chargement
window.addEventListener('load', fitBoardMount);
// 2) quand la fenêtre change (fenêtré/plein écran)
window.addEventListener('resize', () => {
  // on debounce via rAF pour éviter le spam
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(fitBoardMount);
});
// 3) après layout/polices
setTimeout(fitBoardMount, 0);
setTimeout(fitBoardMount, 150);

// 4) si la colonne centrale change de taille (ex: collapse/expand)
const col = document.getElementById('boardMount')?.parentElement;
if (col && 'ResizeObserver' in window) {
  const ro = new ResizeObserver(() => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(fitBoardMount);
  });
  ro.observe(col);
}
