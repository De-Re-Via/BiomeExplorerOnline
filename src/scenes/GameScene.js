// src/scenes/GameScene.js
import Board from '../core/Board.js';
import tiles from '../data/tiles.js';
import QuestManager from '../quests/QuestManager.js';
import Tutorial from '../ui/Tutorial.js';
import CycleFX from '../ui/CycleFX.js';
import { store } from '../state/store.js';

// Client API (utilise uid/exp/sig/api passés au jeu via l’URL)
import { loadState, saveState } from '../api.js';

// Helpers mapping
function axesFromState(s) {
  if (!s) return null;
  // Préfère s.axes, sinon compose depuis les champs plats renvoyés par l’API PHP
  if (s.axes && typeof s.axes === 'object') return s.axes;
  const keys = ['energy','biodiv','food','social','resilience','tech'];
  const hasFlat = keys.every(k => typeof s[k] !== 'undefined');
  return hasFlat ? {
    energy: +s.energy || 0,
    biodiv: +s.biodiv || 0,
    food: +s.food || 0,
    social: +s.social || 0,
    resilience: +s.resilience || 0,
    tech: +s.tech || 0,
  } : null;
}

function ensureDefaultAxes(a) {
  const d = { energy:50, biodiv:50, food:50, social:50, resilience:50, tech:50 };
  if (!a) return d;
  return {
    energy: Number.isFinite(+a.energy) ? +a.energy : d.energy,
    biodiv: Number.isFinite(+a.biodiv) ? +a.biodiv : d.biodiv,
    food: Number.isFinite(+a.food) ? +a.food : d.food,
    social: Number.isFinite(+a.social) ? +a.social : d.social,
    resilience: Number.isFinite(+a.resilience) ? +a.resilience : d.resilience,
    tech: Number.isFinite(+a.tech) ? +a.tech : d.tech,
  };
}

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    // Plateau
    this.board = new Board(this, {
      shape: 'hex',
      radius: 5,
      size: 44,
      showGrid: true,
      gridStroke: 0x3a455f,
      gridFill: 0x0f1626,
      gridFillAlt: 0x101a2b,
      gridAlpha: 0.9,
      fillAlpha: 0.35,
    });

    // Permettre au store de récupérer l’état du plateau
    store._collectBoardState = () => this.board.toJSON?.() ?? null;

    // --- Tentative de reprise distante (serveur) ---
    (async () => {
      try {
        const remoteState = await loadState(); // GET biome.php?uid=...&exp=...&sig=...

        // Cycle
        if (remoteState?.cycle && typeof store?.setCycle === 'function') {
          store.setCycle(remoteState.cycle);
        } else if (!store?.cycle && typeof store?.setCycle === 'function') {
          store.setCycle(1);
        }

        // Axes
        const axes = ensureDefaultAxes(axesFromState(remoteState));
        if (typeof store?.setAxes === 'function') {
          store.setAxes(axes);
        } else {
          // fallback si pas de setter : place les valeurs sur store.axes
          store.axes = axes;
        }

        // Plateau depuis JSON
        if (remoteState?.board && typeof this.board?.fromJSON === 'function') {
          const atlas = Object.fromEntries(tiles.map(t => [t.id, { textureKey: t.texture }]));
          this.board.fromJSON(remoteState.board, atlas);
        }

      } catch (err) {
        console.warn('Remote load failed:', err);

        // Filet local si dispo
        const local = typeof store?.loadSave === 'function' ? store.loadSave() : null;
        if (local?.board && typeof this.board?.fromJSON === 'function') {
          const atlas = Object.fromEntries(tiles.map(t => [t.id, { textureKey: t.texture }]));
          this.board.fromJSON(local.board, atlas);
        }

        const axes = ensureDefaultAxes(local?.axes);
        if (typeof store?.setAxes === 'function') store.setAxes(axes);
        else store.axes = axes;

        if (!store?.cycle && typeof store?.setCycle === 'function') store.setCycle(local?.cycle || 1);
      }
    })();

    // Quêtes + effets d’entre-cycle
    this.qm = new QuestManager(this);
    this.fx = new CycleFX(this);

    // Sauvegarde distante (snapshot) — compatible serveur (axes + champs plats)
    const snapshotNow = () => {
      const axes = store?.axes || {};
      const payload = {
        cycle: store?.cycle || 1,
        axes: axes,                     // pour un serveur qui lit `axes`
        energy: axes.energy,            // pour notre PHP qui lit les champs à plat
        biodiv: axes.biodiv,
        food: axes.food,
        social: axes.social,
        resilience: axes.resilience,
        tech: axes.tech,
        board: typeof this.board?.toJSON === 'function' ? this.board.toJSON() : null,
        version: 1
      };
      return saveState(payload).catch(e => console.warn('Remote save failed:', e));
    };

    // Fin de cycle (déclenchée par l’UI via un CustomEvent "request-end-cycle")
    this._endCycleHandler = async () => {
      await this.fx.showIntercycleInfo();

      this.fx.resetCycleDelta();
      this.fx.attachDeltaListener();
      await this.qm.runCycle();
      this.fx.detachDeltaListener();

      await this.fx.showSummary(this.fx.getCycleDelta());

      if (typeof store?.nextCycle === 'function') store.nextCycle();

      // Autosave locale
      if (typeof store?.autosave === 'function') store.autosave({ reason: 'cycle-end' });

      // Snapshot serveur
      await snapshotNow();
    };
    document.addEventListener('request-end-cycle', this._endCycleHandler);

    // Filet de sécurité : quand on cache/ferme la page → snapshot
    this._visHandler = () => {
      if (document.visibilityState === 'hidden') snapshotNow();
    };
    this._pagehideHandler = () => { snapshotNow(); };
    addEventListener('visibilitychange', this._visHandler);
    addEventListener('pagehide', this._pagehideHandler);

    // Resize → auto-fit du board
    this.scale.on('resize', () => this.board.resize?.());

    // Tutoriel "première partie"
    new Tutorial().startIfNeeded();
  }

  shutdown() {
    document.removeEventListener('request-end-cycle', this._endCycleHandler);
    removeEventListener('visibilitychange', this._visHandler);
    removeEventListener('pagehide', this._pagehideHandler);
  }
}
