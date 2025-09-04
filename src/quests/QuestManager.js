// src/quests/QuestManager.js
// Utilise #custom-modal défini DANS TON index.html (aucun autre système de modal).
// Enchaîne 2 quêtes par cycle, applique effets, puis signale fin de cycle.

import { store } from '../state/store.js';
import { popAxes } from '../ui/HudDom.js';

import quiz from '../data/quiz.js';
import bet from '../data/bet.js';
import dilemme from '../data/dilemme.js';
import urgency from '../data/urgency.js';

const REGISTRY = { quiz, bet, dilemme, urgency };

export default class QuestManager {
  constructor(scene){
    this.scene = scene;
    this.onCycleEnd = () => {};
  }

  pickQuests(n = 2){
    const keys = Object.keys(REGISTRY);
    const out = [];
    while (out.length < n){
      const k = keys[Math.floor(Math.random()*keys.length)];
      out.push({ type:k, data:REGISTRY[k] });
    }
    return out;
  }

  async runCycle(){
    const quests = this.pickQuests(2);
    for (const q of quests) await this.#runQuest(q);
    this.onCycleEnd?.();
  }

  async #runQuest({ type, data }){
    const item = data[Math.floor(Math.random()*data.length)] || {};
    const effect = await this.#showModalAndGetEffect(type, item);
    if (effect){
      store.applyDelta(effect);
      popAxes(effect); // petit "+/-" au-dessus des jauges HTML
    }
  }

  // --- UI modale : s'appuie sur #custom-modal existant ---
  #showModalAndGetEffect(title, item){
    return new Promise((resolve) => {
      const overlay = document.getElementById('custom-modal');
      const msg = document.getElementById('custom-modal-message');
      if (!overlay || !msg) { resolve(item.effect || null); return; }

      const cleanup = () => {
        overlay.style.display = 'none';
        // Nettoie les boutons dynamiques si on en a créé
        const old = msg.querySelector('.choices');
        if (old) old.remove();
      };

      msg.innerHTML = `<h3 style="margin-top:0">${item.title || title.toUpperCase()}</h3>
        <p>${item.description || 'Fais un choix.'}</p>`;

      // Si choix multiples
      if (Array.isArray(item.choices) && item.choices.length){
        const box = document.createElement('div');
        box.className = 'choices';
        item.choices.forEach((c,i)=>{
          const b = document.createElement('button');
          b.textContent = c.label || `Choix ${i+1}`;
          b.addEventListener('click', ()=>{
            cleanup();
            resolve(c.effect || null);
          });
          box.appendChild(b);
        });
        msg.appendChild(box);
      } else {
        // Sinon : bouton OK par défaut déjà présent → on intercepte
        const ok = overlay.querySelector('button');
        const handler = () => {
          ok.removeEventListener('click', handler);
          cleanup();
          resolve(item.effect || null);
        };
        ok.addEventListener('click', handler);
      }

      overlay.style.display = 'flex';
    });
  }
}
