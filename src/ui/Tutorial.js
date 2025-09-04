// src/ui/Tutorial.js
// Onboarding "première partie" en 5 étapes, collé à TON HTML existant.
// - Pas de dépendance Phaser : tout est en DOM pur.
// - Sauvé en localStorage (clé: biome-explorer-tuto-v1) pour ne l’afficher qu’une seule fois.

import { store } from '../state/store.js';

export default class Tutorial {
  constructor() {
    this.root = null;
    this.cleanupFns = [];
    this.LS_KEY = 'biome-explorer-tuto-v1';
    this.#injectStyles();
  }

  startIfNeeded() {
    try {
      if (localStorage.getItem(this.LS_KEY) === 'done') return;
    } catch {}
    this.start();
  }

  async start() {
    this.#makeRoot();

    // Etape 1 — Bienvenue
    await this.#panel({
      text: `<h3>Bienvenue dans Biome Explorer</h3>
             <p>Place des tuiles sur la grille hexagonale. Chaque tuile influence les 6 indicateurs en haut.</p>
             <p>À la fin de chaque cycle, des mini-évènements te sont proposés. Tes réponses font évoluer le biome.</p>`,
      nextLabel: 'OK, continuons',
    });

    // Etape 2 — Choisir une tuile (palette à gauche)
    const palette = document.getElementById('palette');
    await this.#coach({
      target: palette,
      text: `<strong>Étape 1</strong> — Choisis une tuile dans la palette.`,
      wait: () => new Promise((res) => {
        const off = store.on((snap) => {
          if (snap.selectedTileId) { off(); res(); }
        });
        this.cleanupFns.push(off);
      }),
    });

    // Etape 3 — Poser une tuile sur la grille
    const board = document.getElementById('boardMount');
    await this.#coach({
      target: board,
      text: `<strong>Étape 2</strong> — Clique sur une cellule de la grille pour <em>poser</em> ta tuile.`,
      wait: () => new Promise((res) => {
        const handler = () => { document.removeEventListener('tile-placed', handler); res(); };
        document.addEventListener('tile-placed', handler);
        this.cleanupFns.push(() => document.removeEventListener('tile-placed', handler));
      }),
    });

    // Etape 4 — Lire les indicateurs
    const hudBars = document.getElementById('hudBars');
    await this.#coach({
      target: hudBars,
      text: `<strong>Étape 3</strong> — Observe les barres: elles reflètent l'impact de tes placements.`,
      nextLabel: 'Compris',
    });

    // Etape 5 — Fin du cycle
    const btn = document.getElementById('btnCycle');
    await this.#coach({
      target: btn,
      text: `<strong>Étape 4</strong> — Clique <em>Fin du cycle</em> pour passer aux mini-quêtes.`,
      wait: () => new Promise((res) => {
        const handler = () => { document.removeEventListener('request-end-cycle', handler); res(); };
        document.addEventListener('request-end-cycle', handler);
        this.cleanupFns.push(() => document.removeEventListener('request-end-cycle', handler));
      }),
    });

    // Fin — tip rapide
    await this.#panel({
      text: `<h3>Astuce</h3>
             <p>Vise l’équilibre global : l’excès sur un axe fragilise le système. Bonne exploration !</p>`,
      nextLabel: 'Jouer',
    });

    this.destroy();
    try { localStorage.setItem(this.LS_KEY, 'done'); } catch {}
  }

  destroy() {
    this.cleanupFns.forEach(fn => { try { fn(); } catch {} });
    this.cleanupFns = [];
    if (this.root) this.root.remove();
    this.root = null;
  }

  /* ---------- UI helpers ---------- */
  #makeRoot() {
    if (this.root) return;
    this.root = document.createElement('div');
    this.root.id = 'tuto-root';
    this.root.innerHTML = ''; // vide, les panneaux/coachmarks y seront ajoutés
    document.body.appendChild(this.root);
  }

  async #panel({ text, nextLabel = 'Continuer' }) {
    return new Promise((resolve) => {
      this.root.innerHTML = `
        <div class="tuto-overlay"></div>
        <div class="tuto-card">
          <div class="tuto-content">${text}</div>
          <div class="tuto-actions">
            <button class="tuto-next">${nextLabel}</button>
            <button class="tuto-skip">Passer</button>
          </div>
        </div>`;
      const next = this.root.querySelector('.tuto-next');
      const skip = this.root.querySelector('.tuto-skip');
      const onClose = () => { this.root.innerHTML = ''; resolve(); };
      next.addEventListener('click', onClose);
      skip.addEventListener('click', () => { try { localStorage.setItem(this.LS_KEY,'done'); } catch{} onClose(); });
    });
  }

  async #coach({ target, text, wait, nextLabel = 'OK' }) {
    return new Promise((resolve) => {
      if (!target) { resolve(); return; }

      // outline cible
      target.classList.add('tuto-ring');

      const rect = target.getBoundingClientRect();
      const box = document.createElement('div');
      box.className = 'tuto-coach';
      box.innerHTML = `
        <div class="tuto-coach-arrow"></div>
        <div class="tuto-coach-body">
          <div class="tuto-content">${text}</div>
          ${wait ? '' : `<div class="tuto-actions"><button class="tuto-next">${nextLabel}</button></div>`}
          <button class="tuto-skip">Passer</button>
        </div>`;
      this.root.appendChild(box);

      // position dynamique près de la cible
      const place = () => {
        const r = target.getBoundingClientRect();
        const bx = Math.min(window.innerWidth - 320 - 12, Math.max(12, r.left + r.width + 12));
        const by = Math.max(12, r.top + r.height / 2 - 80);
        box.style.left = bx + 'px';
        box.style.top = by + 'px';
      };
      place();
      const onResize = () => place();
      window.addEventListener('resize', onResize);
      this.cleanupFns.push(() => window.removeEventListener('resize', onResize));

      const close = () => {
        target.classList.remove('tuto-ring');
        box.remove();
        resolve();
      };

      const skip = box.querySelector('.tuto-skip');
      skip.addEventListener('click', () => { try { localStorage.setItem(this.LS_KEY,'done'); } catch{} close(); });

      if (wait) {
        wait().then(close);
      } else {
        box.querySelector('.tuto-next')?.addEventListener('click', close);
      }
    });
  }

  #injectStyles() {
    if (document.getElementById('tuto-styles')) return;
    const css = document.createElement('style');
    css.id = 'tuto-styles';
    css.textContent = `
      .tuto-overlay{ position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:9997; }
      .tuto-card{ position:fixed; z-index:9998; left:50%; top:50%; transform:translate(-50%,-50%);
        width:min(640px,92vw); background:#0f1219; color:#e6eefc; border:1px solid #2a3247; border-radius:12px;
        box-shadow:0 12px 40px rgba(0,0,0,.45); padding:18px; }
      .tuto-content p{ margin:.5em 0; color:#cfe; }
      .tuto-actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:12px; }
      .tuto-actions .tuto-next{ padding:8px 12px; border-radius:8px; border:1px solid #2a6; background:#1b854a; color:#fff; cursor:pointer; }
      .tuto-actions .tuto-skip{ padding:8px 12px; border-radius:8px; border:1px solid #334; background:#141a22; color:#cfe; cursor:pointer; }

      .tuto-coach{ position:fixed; z-index:9999; max-width:320px; }
      .tuto-coach-body{ background:#0f1219; color:#e6eefc; border:1px solid #2a3247; border-radius:10px; padding:12px; box-shadow:0 10px 30px rgba(0,0,0,.4); }
      .tuto-coach-arrow{ position:absolute; left:-8px; top:26px; width:0; height:0; border-top:8px solid transparent; border-bottom:8px solid transparent; border-right:8px solid #2a3247; filter:drop-shadow(0 0 0 rgba(0,0,0,0.3)); }
      .tuto-ring{ outline:2px solid #58a6ff; box-shadow:0 0 0 6px rgba(88,166,255,.25); border-radius:8px; transition:outline .15s; }
      #tuto-root{ pointer-events:none; } .tuto-card, .tuto-coach, .tuto-actions button{ pointer-events:auto; }
    `;
    document.head.appendChild(css);
  }
}
