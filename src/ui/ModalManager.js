// src/ui/ModalManager.js
export default class ModalManager {
  constructor() {
    this.root = document.getElementById('modal-root') || this.#createRoot();
  }

  #createRoot() {
    const r = document.createElement('div');
    r.id = 'modal-root';
    r.style.position = 'fixed';
    r.style.inset = 0;
    r.style.display = 'none';
    r.style.alignItems = 'center';
    r.style.justifyContent = 'center';
    r.style.background = 'rgba(0,0,0,0.45)';
    r.style.zIndex = 9999;
    document.body.appendChild(r);
    return r;
  }

  async show({ title = '', html = '', confirmLabel = 'Continuer' } = {}) {
    return new Promise((resolve) => {
      this.root.innerHTML = `
        <div style="
          width:min(720px,92vw);
          max-height:86vh;
          overflow:auto;
          background:#101317;
          color:#e8eef7;
          border:1px solid #2a3240;
          border-radius:12px;
          box-shadow:0 10px 30px rgba(0,0,0,.35);
          transform:scale(.98);
          opacity:.0;
          transition:transform .18s ease, opacity .18s ease;">
          <header style="padding:16px 18px;border-bottom:1px solid #233;">
            <strong style="letter-spacing:.3px">${title}</strong>
          </header>
          <section style="padding:18px" id="modal-content">${html}</section>
          <footer style="display:flex;gap:10px;justify-content:flex-end;padding:14px 18px;border-top:1px solid #233">
            <button id="modal-confirm" style="
              padding:10px 14px;border-radius:8px;border:1px solid #2a6;cursor:pointer;background:#1b854a;color:white;">
              ${confirmLabel}
            </button>
          </footer>
        </div>`;
      this.root.style.display = 'flex';
      requestAnimationFrame(() => {
        const card = this.root.firstElementChild;
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
      });
      const onClose = () => {
        const card = this.root.firstElementChild;
        card.style.transform = 'scale(.98)';
        card.style.opacity = '0';
        setTimeout(() => {
          this.root.style.display = 'none';
          this.root.innerHTML = '';
        }, 160);
        resolve();
      };
      this.root.querySelector('#modal-confirm').onclick = onClose;
    });
  }

  async sequence(panels) {
    for (const p of panels) {
      await this.show(p);
    }
  }
}
