/* ============================================================
   VESTIQUE – AR Studio Page
   ============================================================ */

const AR_STUDIO = {
  _mode: 'upload',
  _selectedDress: null,
  _userPhoto: null,

  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'ar-studio';
    UI.setActiveNav('ar-studio');

    const dresses = DATA.dresses;

    container.innerHTML = `
      <div class="page ar-page" id="ar-page">
        <div style="padding:0 0 var(--space-md)">
          <h2 style="font-family:var(--font-display);font-size:1.4rem">📷 AR Studio</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Virtual try-on — See how you look in your dream dress</p>
        </div>

        <!-- Mode Tabs -->
        <div class="ar-mode-tabs">
          <div class="ar-mode-tab ${this._mode === 'upload' ? 'active' : ''}" onclick="AR_STUDIO.setMode('upload')">
            📷 Upload Photo
          </div>
          <div class="ar-mode-tab ${this._mode === 'camera' ? 'active' : ''}" onclick="AR_STUDIO.setMode('camera')">
            🤳 Live Camera
          </div>
        </div>

        <!-- Viewport -->
        <div class="ar-viewport" id="ar-viewport">
          ${this._renderViewport()}
        </div>

        <!-- Controls -->
        <div class="ar-controls">
          ${this._mode === 'upload' ? `
            <label class="btn btn-secondary btn-sm ripple" style="cursor:pointer">
              📸 Upload Photo
              <input type="file" accept="image/*" style="display:none" onchange="AR_STUDIO.handlePhoto(this)" />
            </label>
          ` : `
            <button class="btn btn-secondary btn-sm ripple" onclick="AR_STUDIO.startCamera()">
              🎥 Start Camera
            </button>
          `}
          <button class="btn btn-secondary btn-sm ripple" onclick="AR_STUDIO.rotateView()">
            ↻ Rotate
          </button>
          <button class="btn btn-secondary btn-sm ripple" onclick="AR_STUDIO.zoomIn()">
            🔍+ Zoom In
          </button>
          <button class="btn btn-secondary btn-sm ripple" onclick="AR_STUDIO.zoomOut()">
            🔍− Zoom Out
          </button>
          ${this._selectedDress ? `
            <button class="btn btn-accent btn-sm ripple" onclick="AR_STUDIO.savePreview()">
              💾 Save Preview
            </button>
          ` : ''}
        </div>

        <!-- Dress Selector -->
        <div style="margin-top:var(--space-lg)">
          <div class="section-header" style="padding:0;margin-bottom:var(--space-sm)">
            <h3 class="section-title" style="font-size:1rem">Select a Dress to Try On</h3>
          </div>
          <div class="scroll-row" style="padding:0">
            ${dresses.map(d => `
              <div style="min-width:110px;cursor:pointer" onclick="AR_STUDIO.selectDress('${d.id}')">
                <div class="dress-card" style="min-width:110px;${this._selectedDress === d.id ? 'border:2px solid var(--gold)' : ''}">
                  <div class="dress-card-img" style="height:100px">
                    <div style="font-size:2.8rem;background:var(--surface-2);width:100%;height:100%;display:flex;align-items:center;justify-content:center">${d.images[0]}</div>
                  </div>
                  <div class="dress-card-body">
                    <div class="dress-card-name" style="font-size:0.75rem">${d.name}</div>
                    <div style="font-size:0.72rem;color:var(--gold)">${UTILS.formatPrice(d.price)}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- How it works (if no photo yet) -->
        ${!this._userPhoto && !this._selectedDress ? `
        <div style="margin-top:var(--space-xl)">
          <div class="section-title" style="margin-bottom:var(--space-md)">How AR Studio Works</div>
          <div class="stagger">
            ${[
              { step: '1', icon: '📸', title: 'Upload Your Photo', desc: 'Take or upload a clear full-body photo' },
              { step: '2', icon: '👗', title: 'Choose Your Dress', desc: 'Select from our curated collections' },
              { step: '3', icon: '✨', title: 'See the Magic', desc: 'View the dress applied to your photo' },
              { step: '4', icon: '💾', title: 'Save & Share', desc: 'Save your looks and add favorites to cart' },
            ].map(s => `
              <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md) 0;border-bottom:1px solid var(--border)">
                <div style="width:48px;height:48px;border-radius:var(--radius-full);background:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">${s.icon}</div>
                <div>
                  <div style="font-weight:700;font-size:0.9rem">${s.title}</div>
                  <div style="font-size:0.8rem;color:var(--text-muted)">${s.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Compare Looks -->
        ${this._selectedDress ? `
        <div style="margin-top:var(--space-lg)">
          <div class="section-header" style="padding:0;margin-bottom:var(--space-sm)">
            <h3 class="section-title" style="font-size:1rem">Add Accessories</h3>
          </div>
          <div class="scroll-row" style="padding:0">
            ${DATA.accessories.map(a => `
              <div class="chip chip-muted" style="cursor:pointer;white-space:nowrap" onclick="UI.toast('${a.icon} ${a.name} accessory applied!')">
                ${a.icon} ${a.name}
              </div>
            `).join('')}
          </div>
        </div>
        <div style="margin-top:var(--space-md);display:flex;gap:var(--space-sm)">
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="addToCart('${this._selectedDress}'); UI.toast('Added to Cart! 🛍️', 'success')">
            🛍️ Add to Cart
          </button>
          <button class="btn btn-secondary btn-sm" style="flex:1" onclick="toggleWishlist('${this._selectedDress}')">
            ❤️ Wishlist
          </button>
        </div>
        ` : ''}

        <div style="height:var(--space-2xl)"></div>
      </div>
    `;
  },

  _renderViewport() {
    if (this._userPhoto && this._selectedDress) {
      const dress = DATA.dresses.find(d => d.id === this._selectedDress);
      return `
        <div style="position:relative;width:100%;height:100%">
          <img src="${this._userPhoto}" class="ar-user-photo" alt="Your photo" />
          <div class="ar-dress-overlay">${dress ? dress.images[0] : '👗'}</div>
          <div style="position:absolute;top:12px;left:12px">
            <span class="chip chip-gold" style="backdrop-filter:blur(8px);background:rgba(255,255,255,0.8)">${dress ? dress.name : ''}</span>
          </div>
        </div>
      `;
    }
    if (this._userPhoto) {
      return `
        <div style="position:relative;width:100%;height:100%">
          <img src="${this._userPhoto}" class="ar-user-photo" alt="Your photo" />
          <div class="ar-placeholder">
            <div style="font-size:1.2rem;font-weight:600;color:white">Select a dress below to try on →</div>
          </div>
        </div>
      `;
    }
    if (this._selectedDress) {
      const dress = DATA.dresses.find(d => d.id === this._selectedDress);
      return `
        <div class="ar-placeholder">
          <div style="font-size:5rem;margin-bottom:var(--space-md)">${dress ? dress.images[0] : '👗'}</div>
          <div style="font-size:0.9rem;font-weight:600;color:white">${dress ? dress.name : ''}</div>
          <div style="font-size:0.8rem;opacity:0.6;margin-top:4px">Upload your photo to try this on</div>
        </div>
      `;
    }
    return `
      <div class="ar-placeholder">
        <div class="ar-placeholder-icon">📷</div>
        <div style="font-size:0.95rem;font-weight:600;color:rgba(255,255,255,0.8)">Upload Your Photo</div>
        <div style="font-size:0.8rem;opacity:0.5;margin-top:6px">Then select a dress to see the magic</div>
      </div>
    `;
  },

  setMode(mode) {
    this._mode = mode;
    this.render();
  },

  handlePhoto(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this._userPhoto = e.target.result;
      const viewport = document.getElementById('ar-viewport');
      if (viewport) viewport.innerHTML = this._renderViewport();
      UI.toast('Photo uploaded! Now select a dress 👗', 'success');
    };
    reader.readAsDataURL(file);
  },

  startCamera() {
    UI.toast('Camera access requires a live server environment 📷', 'warning');
  },

  selectDress(id) {
    this._selectedDress = id;
    this.render();
  },

  rotateView() {
    const overlay = document.querySelector('.ar-dress-overlay');
    if (!overlay) { UI.toast('Select a dress and upload a photo first', 'warning'); return; }
    const current = parseInt(overlay.style.fontSize) || 160;
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.fontSize = current + 'px';
      overlay.style.opacity = '0.7';
    }, 200);
    UI.toast('View rotated ↻');
  },

  _zoom: 1,
  zoomIn() {
    this._zoom = Math.min(this._zoom + 0.1, 2);
    const viewport = document.getElementById('ar-viewport');
    if (viewport) viewport.style.transform = `scale(${this._zoom})`;
  },
  zoomOut() {
    this._zoom = Math.max(this._zoom - 0.1, 0.5);
    const viewport = document.getElementById('ar-viewport');
    if (viewport) viewport.style.transform = `scale(${this._zoom})`;
  },

  savePreview() {
    UI.toast('Preview saved to your gallery! 💾', 'success');
    // In a real app, we'd use Canvas to composite the image
  },
};
