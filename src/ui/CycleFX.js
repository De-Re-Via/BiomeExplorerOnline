// src/ui/CycleFX.js
// Entre-cycle -> quêtes -> résumé -> bannière "Cycle N"
// - Auto-advance 10 s avec barre + compteur centré sous le texte
// - Bouton de fermeture (petite croix rouge) en haut-droite pour passer sans attendre
// - ESC ferme aussi

import { axesList } from '../state/store.js';

export default class CycleFX {
  constructor(scene) {
    this.scene = scene;
    this.delta = this.#zero();
    this.#injectStyles(true);

    // Agrège les effets envoyés par le HUD (popAxes) pendant les quêtes
    this._onPop = (e) => {
      const eff = e.detail || {};
      for (const k of axesList) this.delta[k] += eff[k] || 0;
    };
  }

  resetCycleDelta(){ this.delta = this.#zero(); }
  getCycleDelta(){ return { ...this.delta }; }

  // PANNEAU "Entre-cycle" -> auto 10 s
  async showIntercycleInfo(){
    return this.#panel({
      title: 'Entre-cycle',
      html: `<p>Entre chaque cycle, tu vas répondre à <strong>2 mini-évènements</strong> (quiz, dilemme, pari, urgence).</p>
             <p>Chaque réponse impacte les 6 indicateurs du système. Vise l’équilibre !</p>`,
      autoMs: 10000,   // 10 s
      closable: true,  // petite croix rouge
    });
  }

  // PANNEAU "Résumé du cycle" -> auto 10 s
  async showSummary(delta = this.delta){
    const rows = axesList.map(k => {
      const v = delta[k] || 0;
      const sign = v > 0 ? '+' : '';
      const cls = v > 0 ? 'pos' : v < 0 ? 'neg' : '';
      return `<div class="fx-row"><span>${k}</span><b class="${cls}">${sign}${v}</b></div>`;
    }).join('');
    return this.#panel({
      title: 'Résumé du cycle',
      html: `<p>Effets nets des évènements :</p>${rows}`,
      autoMs: 10000,   // 10 s
      closable: true,
    });
  }

  // Bannière "Cycle N"
  async showBanner(n = 1){
    return new Promise((res) => {
      const mount = document.getElementById('boardMount') || document.body;
      const el = document.createElement('div');
      el.className = 'cycle-banner';
      el.textContent = `Cycle ${n}`;
      mount.appendChild(el);
      requestAnimationFrame(() => el.classList.add('show'));
      setTimeout(() => { el.classList.remove('show'); setTimeout(() => { el.remove(); res(); }, 280); }, 1100);
      this.scene.cameras.main.flash(160, 20, 160, 90);
    });
  }

  /* ---------------- infra ---------------- */
  #zero(){ return Object.fromEntries(axesList.map(k => [k, 0])); }

  // Panneau générique avec timer auto + croix de fermeture
  async #panel({ title = '', html = '', autoMs = 10000, closable = true }){
    return new Promise((resolve) => {
      const root = document.createElement('div');
      root.className = 'fx-root';
      root.innerHTML = `
        <div class="fx-overlay" aria-hidden="true"></div>
        <div class="fx-card" role="dialog" aria-modal="true" aria-label="${title}">
          <button class="fx-close" type="button" aria-label="Fermer">✕</button>
          <header>${title}</header>
          <section>${html}</section>
          <footer>
            <div class="fx-timer">
              <div class="fx-bar"><div class="fx-fill" style="width:0%"></div></div>
              <div class="fx-count">${Math.ceil(autoMs/1000)}</div>
            </div>
          </footer>
        </div>`;
      document.body.appendChild(root);

      const btnClose = root.querySelector('.fx-close');
      if (!closable) btnClose.style.display = 'none';

      const fill  = root.querySelector('.fx-fill');
      const count = root.querySelector('.fx-count');

      let closed = false;
      let raf = null, t0 = null;

      const cleanup = () => {
        window.removeEventListener('keydown', onKey);
        if (raf) cancelAnimationFrame(raf);
      };

      const close = () => {
        if (closed) return;
        closed = true;
        root.classList.add('hide');
        cleanup();
        setTimeout(() => { root.remove(); resolve(); }, 160);
      };

      // ESC ferme
      const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
      window.addEventListener('keydown', onKey);

      // Clic croix
      btnClose.addEventListener('click', close);

      // Compte à rebours + barre de progression
      const total = Math.max(1000, autoMs|0);
      const step = (t) => {
        if (!t0) t0 = t;
        const elapsed = Math.min(total, t - t0);
        const pct = (elapsed / total) * 100;
        fill.style.width = pct.toFixed(1) + '%';
        const remain = Math.ceil((total - elapsed) / 1000);
        count.textContent = String(remain);
        if (elapsed >= total) {
          cancelAnimationFrame(raf);
          close();
        } else {
          raf = requestAnimationFrame(step);
        }
      };
      raf = requestAnimationFrame(step);

      // Nettoyage quand le panneau disparaît
      root.addEventListener('transitionend', cleanup, { once: true });
    });
  }

  // Styles : z-index élevé, timer centré SOUS le texte, croix rouge top-right
  #injectStyles(replace = false){
    const id = 'cyclefx-styles';
    const old = document.getElementById(id);
    if (old && replace) old.remove();
    if (document.getElementById(id)) return;

    const css = document.createElement('style'); css.id = id;
    css.textContent = `
      .fx-root{ position:fixed; inset:0; z-index:2147483000; pointer-events:none; }
      .fx-overlay{ position:fixed; inset:0; background:rgba(0,0,0,.45); pointer-events:none; }
      .fx-card{ position:fixed; left:50%; top:50%; transform:translate(-50%,-50%) scale(.98);
        width:min(560px,92vw); background:#0f1219; color:#e6eefc; border:1px solid #2a3247;
        border-radius:12px; padding:16px 18px; opacity:0; transition:transform .18s, opacity .18s;
        box-shadow:0 12px 36px rgba(0,0,0,.45); pointer-events:auto; }
      .fx-root .fx-card{ opacity:1; transform:translate(-50%,-50%) scale(1); }
      .fx-root.hide .fx-card{ opacity:0; transform:translate(-50%,-50%) scale(.98); }
      .fx-card header{ font-weight:700; margin:0 28px 8px 0; } /* espace pour la croix */

      .fx-close{ position:absolute; top:8px; right:8px; width:24px; height:24px; border-radius:50%;
        border:1px solid #7a2222; background:#e44545; color:#fff; font-size:14px; line-height:22px;
        display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.35); }
      .fx-close:hover{ filter:brightness(1.05); }
      .fx-close:active{ transform:scale(.96); }

      .fx-card section p{ margin:.5em 0; color:#cfe; }

      .fx-card footer{ display:flex; justify-content:center; margin-top:14px; }
      .fx-timer{ display:flex; align-items:center; gap:10px; }
      .fx-bar{ width:min(280px, 60vw); height:10px; border-radius:999px; background:#1c2436;
               overflow:hidden; border:1px solid #2a3247; }
      .fx-fill{ height:100%; width:0%; background:#35c37a; }
      .fx-count{ min-width:28px; text-align:center; color:#d8e6ff; font-weight:700;
                 font-variant-numeric:tabular-nums; }

      .fx-row{ display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed #27324a; }
      .fx-row:last-child{ border-bottom:none; }
      .fx-row b.pos{ color:#35c37a; } .fx-row b.neg{ color:#ff6b6b; }

      .cycle-banner{ position:absolute; left:50%; top:18%; transform:translate(-50%,-50%) scale(.9);
        padding:10px 16px; border-radius:999px; background:#0f1219; color:#d8e6ff; border:1px solid #2a3247;
        box-shadow:0 10px 30px rgba(0,0,0,.45); opacity:0; transition:opacity .25s, transform .25s;
        pointer-events:none; z-index:20; }
      .cycle-banner.show{ opacity:1; transform:translate(-50%,-50%) scale(1); }
    `;
    document.head.appendChild(css);
  }

  attachDeltaListener(){ document.addEventListener('axes-pop', this._onPop); }
  detachDeltaListener(){ document.removeEventListener('axes-pop', this._onPop); }
}
