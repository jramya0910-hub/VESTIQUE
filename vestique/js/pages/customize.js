/* ============================================================
   VESTIQUE – Personalization / Customization Page
   ============================================================ */

const CUSTOMIZE = {
  _options: {},
  _dressId: null,

  render(params = {}) {
    const container = document.getElementById('page-container');
    const dress = DATA.dresses.find(d => d.id === params.id) || DATA.dresses[0];
    this._dressId = dress.id;
    this._options = JSON.parse(JSON.stringify(STATE.currentCustomization[dress.id] || {}));

    const opts = DATA.customizeOptions;
    const isBlouse = dress.category === 'blouses' || dress.category === 'sarees';

    container.innerHTML = `
      <div class="page" id="customize-page">

        ${UI.subPageHeader('Customize ' + dress.name)}

        <!-- Live Preview -->
        <div class="customize-preview-section">
          <div class="custom-preview" id="custom-preview">
            <div class="custom-preview-dress" id="preview-emoji">${dress.images[0]}</div>
            <div style="margin-top:var(--space-md);font-size:0.85rem;color:var(--text-muted)">
              Live Preview Updates as You Customize
            </div>
            <div id="preview-tags" style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:var(--space-sm)">
              <!-- chips updated dynamically -->
            </div>
          </div>
        </div>

        <!-- Customization Controls -->
        <div class="customize-controls">

          <!-- Dress Customization -->
          <div style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:var(--space-md);color:var(--text)">
            Dress Customization
          </div>

          ${this._optionGroup('Sleeve Style', 'sleeveStyle', opts.sleeveStyle)}
          ${this._optionGroup('Neck Design', 'neckDesign', opts.neckDesign)}
          ${this._optionGroup('Dress Length', 'dressLength', opts.dressLength)}
          ${this._optionGroup('Border Style', 'borderStyle', opts.borderStyle)}
          ${this._optionGroup('Embroidery Pattern', 'embroideryPattern', opts.embroideryPattern)}
          ${this._optionGroup('Stone Work', 'stoneWork', opts.stoneWork)}
          ${this._optionGroup('Lace Design', 'laceDesign', opts.laceDesign)}

          <!-- Blouse Customization (for sarees) -->
          ${isBlouse ? `
          <div class="divider"></div>
          <div style="font-family:var(--font-display);font-size:1.1rem;margin:var(--space-md) 0;color:var(--text)">
            Blouse Customization
          </div>
          ${this._optionGroup('Front Neck', 'blouseNeckFront', opts.blouseNeckFront)}
          ${this._optionGroup('Back Neck', 'blouseNeckBack', opts.blouseNeckBack)}
          ${this._optionGroup('Sleeve Type', 'blouseSleeve', opts.blouseSleeve)}
          ` : ''}

          <!-- Color Picker -->
          <div class="custom-option-group">
            <div class="custom-option-label">Custom Color</div>
            <div class="color-swatches" style="margin-top:var(--space-sm)">
              ${[
                {c:'#DC143C',n:'Crimson'},{c:'#FFD700',n:'Gold'},{c:'#FFFFF0',n:'Ivory'},
                {c:'#FAD5A5',n:'Champagne'},{c:'#7B68EE',n:'Lavender'},{c:'#228B22',n:'Emerald'},
                {c:'#1B4F72',n:'Navy'},{c:'#800020',n:'Burgundy'},{c:'#FFB6C1',n:'Blush'},
                {c:'#FF8C00',n:'Orange'},{c:'#2E8B57',n:'Sea Green'},{c:'#800080',n:'Purple'}
              ].map(({c, n}) => `
                <div class="color-swatch" style="background:${c}" title="${n}"
                     onclick="CUSTOMIZE.selectColor('${c}', '${n}', this)"></div>
              `).join('')}
            </div>
          </div>

          <!-- Special Instructions -->
          <div class="custom-option-group" style="margin-top:var(--space-md)">
            <div class="custom-option-label">Special Instructions</div>
            <textarea class="form-input" id="special-instructions" rows="3"
              placeholder="E.g., Add extra fall to saree, extra blouse fabric needed..."
              style="resize:vertical;margin-top:var(--space-sm)">${this._options.specialInstructions || ''}</textarea>
          </div>

          <!-- Price Estimate -->
          <div style="background:var(--gold-light);border-radius:var(--radius-md);padding:var(--space-md);margin-top:var(--space-lg)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:700">Customization Estimate</span>
              <span style="color:var(--gold-dark);font-weight:700" id="custom-price">₹2,000 – ₹5,000</span>
            </div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">
              Final price confirmed after designer review (3–5 days)
            </div>
          </div>

          <!-- Action buttons -->
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-lg)">
            <button class="btn btn-secondary" style="flex:1" onclick="CUSTOMIZE.saveToWishlist('${dress.id}')">
              ❤️ Save Design
            </button>
            <button class="btn btn-primary" style="flex:2" onclick="CUSTOMIZE.addToCart('${dress.id}')">
              🛍️ Add Customized to Cart
            </button>
          </div>

          <div style="height:var(--space-xl)"></div>
        </div>
      </div>
    `;
  },

  _optionGroup(label, key, options) {
    const selected = this._options[key] || null;
    return `
      <div class="custom-option-group">
        <div class="custom-option-label">${label}</div>
        <div class="custom-options">
          ${options.map(o => `
            <span class="custom-option ${selected === o ? 'selected' : ''}"
              onclick="CUSTOMIZE.selectOption('${key}', '${o}', this)">${o}</span>
          `).join('')}
        </div>
      </div>
    `;
  },

  selectOption(key, value, el) {
    // Deselect all in the same group
    const group = el.closest('.custom-options');
    group.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this._options[key] = value;
    this._updatePreviewTags();
  },

  selectColor(hex, name, el) {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    this._options.color = { hex, name };
    // Update preview emoji color tint indicator
    const preview = document.getElementById('custom-preview');
    if (preview) preview.style.borderColor = hex;
    this._updatePreviewTags();
  },

  _updatePreviewTags() {
    const tagsEl = document.getElementById('preview-tags');
    if (!tagsEl) return;
    const tags = Object.entries(this._options)
      .filter(([k, v]) => v && k !== 'specialInstructions' && k !== 'color')
      .map(([k, v]) => `<span class="chip chip-pink" style="font-size:0.7rem">${v}</span>`);
    if (this._options.color) {
      tags.push(`<span class="chip chip-gold" style="font-size:0.7rem">🎨 ${this._options.color.name}</span>`);
    }
    tagsEl.innerHTML = tags.join('');
  },

  saveToWishlist(dressId) {
    const instructions = document.getElementById('special-instructions')?.value || '';
    this._options.specialInstructions = instructions;
    if (!STATE.currentCustomization) STATE.currentCustomization = {};
    STATE.currentCustomization[dressId] = { ...this._options };
    toggleWishlist(dressId);
    STORE.save();
  },

  addToCart(dressId) {
    const instructions = document.getElementById('special-instructions')?.value || '';
    this._options.specialInstructions = instructions;
    if (!STATE.currentCustomization) STATE.currentCustomization = {};
    STATE.currentCustomization[dressId] = { ...this._options };
    addToCart(dressId, 1, { ...this._options }, 'customized');
    STORE.save();
    UI.toast('Customized design added to cart! 🎨', 'success');
  },
};
