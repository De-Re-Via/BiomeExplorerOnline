// src/state/store.js
// Source de vérité (axes/cycle/tuile sélectionnée) + autosave locale.

import Rules from '../core/Rules.js';
import tiles from '../data/tiles.js';

export const axesList = ['energy','biodiv','food','social','resilience','tech'];
const LS_KEY = 'biome-explorer-save-v1';

class Store {
  constructor() {
    this.axes = Object.fromEntries(axesList.map(k => [k, 50]));
    this.cycle = 1;
    this.selectedTileId = null;
    this.seed = Math.floor(Math.random() * 1e9);

    this.listeners = new Set();
    this.rules = new Rules(this);

    this._autosaveTimer = null;
    this._collectBoardState = null; // sera fourni par GameScene
  }

  // --- sélection tuile ---
  setSelectedTile(id) { this.selectedTileId = id; this.emit(); }
  getSelectedTile() {
    if (!this.selectedTileId) return null;
    const t = tiles.find(x => x.id === this.selectedTileId);
    return t ? { ...t, textureKey: t.texture } : null;
    }

  // --- application d'effets ---
  applyTileEffects(tileId) {
    const t = tiles.find(x => x.id === tileId);
    if (!t) return;
    for (const k of axesList) {
      const d = t.effects?.[k] ?? 0;
      this.axes[k] = Math.max(0, Math.min(100, this.axes[k] + d));
    }
    this.emit();
  }
  applyDelta(delta = {}) {
    for (const k of axesList) {
      if (k in delta) this.axes[k] = Math.max(0, Math.min(100, this.axes[k] + delta[k]));
    }
    this.emit();
  }

  // --- cycle ---
  nextCycle() { this.cycle += 1; this.emit(); }

  // --- events ---
  on(fn){ this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(){ for (const fn of this.listeners) fn(this.snapshot()); }
  snapshot(){ return { axes:{...this.axes}, cycle:this.cycle, seed:this.seed, selectedTileId:this.selectedTileId }; }

  // --- autosave ---
  requestAutosave() {
    clearTimeout(this._autosaveTimer);
    this._autosaveTimer = setTimeout(()=>this.autosave(), 200);
  }
  autosave(extra = {}) {
    if (!this._collectBoardState) return;
    const save = { version:1, ...this.snapshot(), board:this._collectBoardState(), ...extra };
    localStorage.setItem(LS_KEY, JSON.stringify(save));
  }
  loadSave() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      const save = JSON.parse(raw);
      if (save.axes) this.axes = { ...this.axes, ...save.axes };
      if (save.cycle) this.cycle = save.cycle;
      if (save.seed) this.seed = save.seed;
      if (save.selectedTileId) this.selectedTileId = save.selectedTileId;
      this.emit();
      return save;
    } catch { return null; }
  }
  clearSave(){ localStorage.removeItem(LS_KEY); }
}

export const store = new Store();
