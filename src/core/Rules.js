// src/core/Rules.js
// Règles de calcul génériques (clamp + label d'état HUD).

import { axesList } from '../state/store.js';

export default class Rules {
  constructor(store){ this.store = store; }

  clampAxes(nextAxes){
    const out = { ...this.store.axes, ...nextAxes };
    for (const k of axesList) out[k] = Math.max(0, Math.min(100, out[k] ?? 0));
    return out;
  }

  getStateLabel(axes = this.store.axes){
    const avg = axesList.reduce((s,k)=>s+(axes[k]??0),0)/axesList.length;
    if (avg >= 75) return 'Stable';
    if (avg >= 45) return 'À risque';
    return 'Critique';
  }
}
