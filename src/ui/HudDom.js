// src/ui/HudDom.js
// Met à jour les éléments déjà présents dans TON index.html.
// Aucun GameObject DOM Phaser n'est utilisé ici.

import { store, axesList } from '../state/store.js';

// Helpers pour styler les jauges (couleur selon niveau)
function classFor(value) {
  if (value >= 66) return 'good';
  if (value >= 33) return 'ok';
  return 'bad';
}

export function initHudDom() {
  // Met à jour les jauges quand le store change
  store.on((snap) => {
    axesList.forEach((k) => {
      const bar = document.getElementById(`hud_${k}`);
      if (!bar) return;
      bar.style.width = `${snap.axes[k]}%`;
      bar.classList.remove('good', 'ok', 'bad');
      bar.classList.add(classFor(snap.axes[k]));
    });

    // État textuel
    const stateLabel = document.getElementById('stateLabel');
    if (stateLabel) stateLabel.textContent = `État: ${store.rules.getStateLabel(snap.axes)}`;

    // Ligne récap des axes
    const axesLine = document.getElementById('axesLine');
    if (axesLine) {
      axesLine.textContent = axesList.map(k => `${k}: ${snap.axes[k]}`).join('  ·  ');
    }

    // Bouton "Fin du cycle" affiche le numéro
    const btn = document.getElementById('btnCycle');
    if (btn) btn.textContent = `Fin du cycle ${snap.cycle} ▶`;
  });

  // Clic sur "Fin du cycle" → événement que GameScene écoutera pour lancer les quêtes
  const btn = document.getElementById('btnCycle');
  if (btn) {
    btn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('request-end-cycle'));
    });
  }
}

// Construit la palette de gauche (#palette) à partir des tiles (sélection = store.setSelectedTile)
export function buildPaletteUI(tiles) {
  const host = document.getElementById('palette');
  if (!host) return;

  host.innerHTML = tiles.map(t => `
    <div class="tileRow" data-id="${t.id}">
      <img src="assets/tiles/${t.texture}.png" alt="${t.label || t.id}" />
      <div class="tileName">${t.label || t.id}</div>
    </div>`).join('');

  host.addEventListener('click', (e) => {
    const row = e.target.closest('.tileRow');
    if (!row) return;
    const id = row.dataset.id;
    store.setSelectedTile(id);
    // feedback visuel léger
    row.style.transform = 'translateY(1px)';
    setTimeout(() => row.style.transform = '', 80);
  });
}

// Petit effet "+/-" sur les jauges (appelé par QuestManager)
export function popAxes(effect = {}) {
  // NEW: notifie le système pour agrégation du résumé de cycle
  document.dispatchEvent(new CustomEvent('axes-pop', { detail: effect }));

  Object.entries(effect).forEach(([k, v]) => {
    const el = document.getElementById(`hud_${k}`);
    if (!el) return;
    const pop = document.createElement('span');
    pop.textContent = `${v >= 0 ? '+' : ''}${v}`;
    pop.style.position = 'absolute';
    pop.style.right = '6px';
    pop.style.top = '-14px';
    pop.style.fontSize = '11px';
    pop.style.opacity = '0';
    pop.style.transition = 'opacity .18s ease, transform .18s ease';
    el.parentElement.appendChild(pop);
    requestAnimationFrame(() => {
      pop.style.opacity = '1';
      pop.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        pop.style.opacity = '0';
        pop.style.transform = 'translateY(0)';
        pop.remove();
      }, 420);
    });
  });
}

