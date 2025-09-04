// src/scenes/BootScene.js
import tiles from '../data/tiles.js';
import { store } from '../state/store.js';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    // Charge toutes les textures des tuiles
    tiles.forEach(t => this.load.image(t.texture, `assets/tiles/${t.texture}.png`));
  }

  create() {
    // Si une sauvegarde locale existe, on propose "reprendre / nouvelle partie"
    const hasLocalSave = !!localStorage.getItem('biome-explorer-save-v1');
    if (!hasLocalSave) { this.scene.start('GameScene'); return; }

    // Petit modal HTML si présent dans la page, sinon on enchaîne
    const modal = document.getElementById('custom-modal');
    const msg   = document.getElementById('custom-modal-message');

    if (!modal || !msg) { this.scene.start('GameScene'); return; }

    msg.innerHTML = `
      <h3>Reprendre la partie ?</h3>
      <p>Une sauvegarde locale a été trouvée.</p>
      <div class="choices">
        <button id="cont">Continuer</button>
        <button id="new">Nouvelle partie</button>
      </div>
    `;
    modal.style.display = 'flex';

    const close = () => { modal.style.display = 'none'; };
    const cont  = document.getElementById('cont');
    const news  = document.getElementById('new');

    cont?.addEventListener('click', () => { close(); this.scene.start('GameScene'); });
    news?.addEventListener('click', () => { store.clearSave?.(); close(); this.scene.start('GameScene'); });
  }
}
