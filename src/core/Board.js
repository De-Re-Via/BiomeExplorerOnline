// src/core/Board.js
// Grille hex pointy-top centrée (disque hex). Affiche la grille sous les tuiles.
// ➜ NOUVEAU : auto-fit du plateau à l'intérieur du canvas (plus de coupe haut/bas).
//     - On calcule la bounding box géométrique du plateau (en unités "non scalées")
//     - Au resize, on applique un scale au container pour que tout tienne dans la
//       zone visible avec une marge (sans toucher aux sprites ni à la logique).
//
// Reste inchangé : pose de tuiles -> effets + autosave, (dé)sérialisation.

import { store } from '../state/store.js';

const SQRT3 = Math.sqrt(3);

export default class Board {
  /**
   * @param {Phaser.Scene} scene
   * @param {Object} opts
   * @param {'hex'|'rect'} opts.shape
   * @param {number} opts.radius
   * @param {number} opts.cols
   * @param {number} opts.rows
   * @param {number} opts.size             // rayon d’un hex (centre -> pointe)
   * @param {boolean} opts.showGrid
   * @param {number} opts.gridStroke
   * @param {number} opts.gridFill
   * @param {number} opts.gridFillAlt
   * @param {number} opts.gridAlpha
   * @param {number} opts.fillAlpha
   */
  constructor(
    scene,
    {
      shape = 'hex',
      radius = 5,
      cols = 10,
      rows = 10,
      size = 44,
      showGrid = true,
      gridStroke = 0x3a455f,
      gridFill = 0x0f1626,
      gridFillAlt = 0x101a2b,
      gridAlpha = 0.9,
      fillAlpha = 0.35,
    } = {}
  ) {
    this.scene = scene;

    // Paramètres plateau
    this.shape = shape;
    this.radius = radius;
    this.cols = cols;
    this.rows = rows;
    this.size = size;

    // Style grille
    this.showGrid = showGrid;
    this.gridStroke = gridStroke;
    this.gridFill = gridFill;
    this.gridFillAlt = gridFillAlt;
    this.gridAlpha = gridAlpha;
    this.fillAlpha = fillAlpha;

    // Cellules ("q,r" -> { q,r, sprite, tileId, gfx })
    this.cells = new Map();

    // Calques : grille (z-bas) + tuiles/hit (z-haut) dans un container centré
    this.container = scene.add.container(scene.scale.width / 2, scene.scale.height / 2);
    this.gridLayer = scene.add.container(0, 0);
    this.tileLayer = scene.add.container(0, 0);
    this.container.add([this.gridLayer, this.tileLayer]);
    this.container.setDepth(1);

    // Bounding box NON scalée (mise à jour pendant le build)
    this._bounds = { minX: +Infinity, maxX: -Infinity, minY: +Infinity, maxY: -Infinity };

    this.#build();
    this.resize(); // position + auto-fit initial
  }

  /* ==================== Conversion Axial <-> Pixel ==================== */
  axialToPixel(q, r) {
    // pointy-top
    const x = this.size * (SQRT3 * q + (SQRT3 / 2) * r);
    const y = this.size * (3 / 2) * r;
    return { x, y };
  }
  key(q, r) { return `${q},${r}`; }

  /* ==================== Construction du plateau ==================== */
  #build() {
    if (this.shape === 'hex') this.#buildHexDisc();
    else this.#buildRect();
  }

  // Disque hexagonal centré (symétrique autour de 0,0)
  #buildHexDisc() {
    const R = this.radius;
    for (let r = -R; r <= R; r++) {
      const qMin = Math.max(-R, -r - R);
      const qMax = Math.min(R,  -r + R);
      for (let q = qMin; q <= qMax; q++) {
        this.#addCell(q, r);
      }
    }
  }

  // Rectangulaire centré (optionnel)
  #buildRect() {
    const q0 = -Math.floor((this.cols - 1) / 2);
    const r0 = -Math.floor((this.rows - 1) / 2);
    for (let r = 0; r < this.rows; r++) {
      for (let q = 0; q < this.cols; q++) {
        this.#addCell(q0 + q, r0 + r);
      }
    }
  }

  // Ajoute une cellule : 1) hex graphique 2) hit area 3) maj bounds
  #addCell(q, r) {
    const { x, y } = this.axialToPixel(q, r);

    // 1) Grille visible
    const gfx = this.showGrid ? this.#drawHexAt(x, y, q, r) : null;
    if (gfx) this.gridLayer.add(gfx);

    // 2) Zone cliquable
    const hit = this.scene.add.circle(x, y, this.size * 0.95, 0x00ff00, 0);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => this.handlePlace(q, r));
    this.tileLayer.add(hit);

    // 3) Enregistrement
    this.cells.set(this.key(q, r), { q, r, sprite: null, tileId: null, gfx });

    // 4) Bounding box non scalée :
    //    largeur hex = sqrt(3) * size -> demi-largeur = sqrt(3)/2 * size
    const halfW = (SQRT3 / 2) * this.size;
    const left   = x - halfW;
    const right  = x + halfW;
    const top    = y - this.size;   // pointe haute
    const bottom = y + this.size;   // pointe basse

    if (left   < this._bounds.minX) this._bounds.minX = left;
    if (right  > this._bounds.maxX) this._bounds.maxX = right;
    if (top    < this._bounds.minY) this._bounds.minY = top;
    if (bottom > this._bounds.maxY) this._bounds.maxY = bottom;
  }

  // Dessin d'un hex (fond + contour) centré en (x,y)
  #drawHexAt(x, y, q, r) {
    const g = this.scene.add.graphics();
    g.setPosition(x, y);

    // Damier subtil pour lisibilité
    const fill = ((q + r) & 1) === 0 ? this.gridFill : this.gridFillAlt;

    g.lineStyle(1.5, this.gridStroke, this.gridAlpha);
    g.fillStyle(fill, this.fillAlpha);

    const pts = this.#hexPoints(this.size);
    g.beginPath();
    g.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < 6; i++) g.lineTo(pts[i].x, pts[i].y);
    g.closePath();
    g.fillPath();
    g.strokePath();

    return g;
  }

  // Sommets d'un hex pointy-top centré (0,0)
  #hexPoints(size) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30); // -30° => pointy-top
      pts.push({ x: size * Math.cos(angle), y: size * Math.sin(angle) });
    }
    return pts;
  }

  /* ==================== Layout & auto-fit ==================== */
  resize() {
    // Centre le container dans le canvas
    this.container.setPosition(this.scene.scale.width / 2, this.scene.scale.height / 2);

    // Ajuste l’échelle pour que tout le plateau tienne dans la zone visible
    this.#fitToScene();
  }

  #fitToScene() {
    const bounds = this._bounds;
    if (!isFinite(bounds.minX)) return; // pas encore construit

    const boardW = bounds.maxX - bounds.minX;
    const boardH = bounds.maxY - bounds.minY;

    const availW = this.scene.scale.width;
    const availH = this.scene.scale.height;

    // Petite marge pour éviter de coller aux bords (en pixels "écran")
    const margin = 16;

    // Facteur de scale à appliquer au container (même sur X et Y)
    const s = Math.min(
      (availW - margin * 2) / boardW,
      (availH - margin * 2) / boardH
    );

    // Clamp de sécurité (ne pas upscaler au-delà de 1.5x pour éviter de flouter)
    const scale = Math.max(0.1, Math.min(1.5, s));

    this.container.setScale(scale);
  }

  /* ==================== Interaction ==================== */
  handlePlace(q, r) {
    const t = store.getSelectedTile();
    if (!t) return;
    this.place(q, r, t.id, t.textureKey);
  }

  place(q, r, tileId, textureKey) {
    const k = this.key(q, r);
    const cell = this.cells.get(k);
    if (!cell) return;

    if (cell.sprite) { cell.sprite.destroy(); cell.sprite = null; }

    const { x, y } = this.axiallyScaledPixel(q, r);
    const s = this.scene.add.image(x, y, textureKey).setOrigin(0.5);

    // Fit du sprite dans l'hex (géométrie de l'hex non scalée ; le container scalera l'ensemble)
    s.setScale((this.size * 1.75) / Math.max(s.width, s.height));
    this.tileLayer.add(s);

    // Micro feedback
    this.scene.tweens.add({ targets: s, scale: s.scale * 1.06, duration: 90, yoyo: true });

    cell.sprite = s;
    cell.tileId = tileId;

    // Effets + autosave
    store.applyTileEffects(tileId);
    store.requestAutosave();
    // avertit la didactique "pose effectuée"
    document.dispatchEvent(new Event('tile-placed'));
  }

  // Renvoie la position (x,y) NON scalée (le container appliquera la scale)
  axiallyScaledPixel(q, r) {
    return this.axialToPixel(q, r);
  }

  /* ==================== (Dé)Sérialisation ==================== */
  toJSON() {
    const items = [];
    for (const c of this.cells.values()) if (c.tileId) items.push({ q: c.q, r: c.r, tileId: c.tileId });
    return {
      shape: this.shape, radius: this.radius, cols: this.cols, rows: this.rows, size: this.size,
      items
    };
  }

  fromJSON(data, atlas) {
    const items = data?.items || [];
    for (const it of items) {
      const t = atlas[it.tileId];
      if (!t) continue;
      this.place(it.q, it.r, it.tileId, t.textureKey);
    }
  }
}
