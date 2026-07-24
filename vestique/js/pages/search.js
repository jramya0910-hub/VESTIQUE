/* ============================================================
   VESTIQUE – Search & Filter Page
   ============================================================ */

const SEARCH = {
  _query: '',
  _activeFilters: { category: null, tradition: null, priceOrder: null, color: null, type: null, designer: null, priceMin: null, priceMax: null },
  _showFilters: false,

  render(params = {}) {
    const container = document.getElementById('page-container');
    if (params.query !== undefined) this._query = params.query;
    if (params.designerId) this._activeFilters.designer = params.designerId;
    STATE.currentPage = 'search';
    UI.setActiveNav('search');

    const activeCount = Object.values(this._activeFilters).filter(Boolean).length;

    container.innerHTML = `
      <div class="page" id="search-page">
        <div class="search-header">
          <div class="search-bar-full">
            ${UTILS.svgIcon('search', 18)}
            <input type="text" id="main-search-input" placeholder="Search dresses, fabrics, designers, traditions..."
              value="${this._query}" oninput="SEARCH.onInput(this.value)" />
            ${this._query ? `<span style="cursor:pointer;color:var(--text-light)" onclick="SEARCH.clearSearch()">${UTILS.svgIcon('close', 16)}</span>` : ''}
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="filter-bar" style="padding:var(--space-sm) var(--space-md)">
          <button class="filter-btn ${this._showFilters ? 'active' : ''}" onclick="SEARCH.toggleFilters()">
            ${UTILS.svgIcon('filter', 14)} Filters${activeCount ? ` (${activeCount})` : ''}
          </button>
          ${DATA.categories.map(c => `
            <button class="filter-btn ${this._activeFilters.category === c.id ? 'active' : ''}"
              onclick="SEARCH.quickCatFilter('${c.id}')">${c.icon} ${c.label}</button>
          `).join('')}
        </div>

        <!-- Active filter chips row -->
        ${activeCount ? `
        <div class="scroll-row" style="padding:2px var(--space-md) var(--space-sm);gap:6px">
          ${this._activeFilters.category ? `<span class="chip chip-gold" style="cursor:pointer" onclick="SEARCH.clearFilter('category')">${DATA.categories.find(c=>c.id===this._activeFilters.category)?.label} ✕</span>` : ''}
          ${this._activeFilters.tradition ? `<span class="chip chip-gold" style="cursor:pointer" onclick="SEARCH.clearFilter('tradition')">${DATA.traditions.find(t=>t.id===this._activeFilters.tradition)?.label} ✕</span>` : ''}
          ${this._activeFilters.designer ? `<span class="chip chip-gold" style="cursor:pointer" onclick="SEARCH.clearFilter('designer')">${DATA.designers.find(d=>d.id===this._activeFilters.designer)?.name || 'Designer'} ✕</span>` : ''}
          ${this._activeFilters.priceOrder ? `<span class="chip chip-gold" style="cursor:pointer" onclick="SEARCH.clearFilter('priceOrder')">Price: ${this._activeFilters.priceOrder==='asc'?'Low→High':'High→Low'} ✕</span>` : ''}
          ${this._activeFilters.type ? `<span class="chip chip-gold" style="cursor:pointer" onclick="SEARCH.clearFilter('type')">${this._activeFilters.type} ✕</span>` : ''}
          ${(this._activeFilters.priceMin || this._activeFilters.priceMax) ? `<span class="chip chip-gold" style="cursor:pointer" onclick="SEARCH.clearFilter('priceMin');SEARCH.clearFilter('priceMax')">₹${this._activeFilters.priceMin||0}–₹${this._activeFilters.priceMax||'Any'} ✕</span>` : ''}
          <span class="chip chip-muted" style="cursor:pointer" onclick="SEARCH.clearFilters()">Clear All</span>
        </div>` : ''}

        <!-- Filter panel -->
        <div class="filter-panel" id="filter-panel" style="${this._showFilters ? '' : 'display:none'}">
          <div class="filter-section">
            <div class="filter-section-title">Price Order</div>
            <div class="filter-options">
              <div class="filter-option ${this._activeFilters.priceOrder==='asc'?'selected':''}" onclick="SEARCH.setFilter('priceOrder','asc')">Low to High</div>
              <div class="filter-option ${this._activeFilters.priceOrder==='desc'?'selected':''}" onclick="SEARCH.setFilter('priceOrder','desc')">High to Low</div>
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-section-title">Price Range</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
              <div>
                <label class="form-label" style="font-size:0.7rem">Min (₹)</label>
                <input class="form-input" id="price-min-input" type="number" placeholder="0"
                  value="${this._activeFilters.priceMin || ''}"
                  oninput="SEARCH._activeFilters.priceMin=this.value||null" style="padding:8px 10px;font-size:0.8rem" />
              </div>
              <div>
                <label class="form-label" style="font-size:0.7rem">Max (₹)</label>
                <input class="form-input" id="price-max-input" type="number" placeholder="Any"
                  value="${this._activeFilters.priceMax || ''}"
                  oninput="SEARCH._activeFilters.priceMax=this.value||null" style="padding:8px 10px;font-size:0.8rem" />
              </div>
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-section-title">Wedding Tradition</div>
            <div class="filter-options">
              ${DATA.traditions.map(t => `
                <div class="filter-option ${this._activeFilters.tradition===t.id?'selected':''}"
                  onclick="SEARCH.setFilter('tradition','${t.id}')">${t.emoji} ${t.label}</div>
              `).join('')}
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-section-title">Designer</div>
            <div class="filter-options">
              ${DATA.designers.map(d => `
                <div class="filter-option ${this._activeFilters.designer===d.id?'selected':''}"
                  onclick="SEARCH.setFilter('designer','${d.id}')">${d.name}</div>
              `).join('')}
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-section-title">Dress Type</div>
            <div class="filter-options">
              ${DATA.categories.map(c => `
                <div class="filter-option ${this._activeFilters.type===c.id?'selected':''}"
                  onclick="SEARCH.setFilter('type','${c.id}')">${c.icon} ${c.label}</div>
              `).join('')}
            </div>
          </div>
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-md)">
            <button class="btn btn-primary btn-sm" onclick="SEARCH.applyFilters()">Apply Filters</button>
            <button class="btn btn-secondary btn-sm" onclick="SEARCH.clearFilters()">Clear All</button>
          </div>
        </div>

        <!-- Results -->
        <div id="search-results" style="padding:var(--space-md)">
          ${this._renderResults()}
        </div>
      </div>
    `;

    // Focus the search input without causing a re-render
    setTimeout(() => {
      const inp = document.getElementById('main-search-input');
      if (inp && !this._query) inp.focus();
    }, 50);
  },

  renderCategory(params) {
    this._activeFilters = { category: params.id, tradition: null, priceOrder: null, color: null, type: null, designer: null, priceMin: null, priceMax: null };
    this._query = '';
    this.render();
    STATE.currentPage = 'category';
  },

  renderTradition(params) {
    this._activeFilters = { category: null, tradition: params.id, priceOrder: null, color: null, type: null, designer: null, priceMin: null, priceMax: null };
    this._query = '';
    this.render();
    STATE.currentPage = 'tradition';
  },

  onInput: UTILS.debounce(function(val) {
    SEARCH._query = val;
    const resultsEl = document.getElementById('search-results');
    if (resultsEl) resultsEl.innerHTML = SEARCH._renderResults();
  }, 300),

  quickCatFilter(catId) {
    if (this._activeFilters.category === catId) {
      this._activeFilters.category = null;
    } else {
      this._activeFilters.category = catId;
    }
    const resultsEl = document.getElementById('search-results');
    if (resultsEl) {
      resultsEl.innerHTML = this._renderResults();
    }
    // Update button active states without full re-render
    document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => {
      // update done via re-render of results only
    });
    this.render();
  },

  setFilter(key, val) {
    if (this._activeFilters[key] === val) {
      this._activeFilters[key] = null;
    } else {
      this._activeFilters[key] = val;
    }
  },

  clearFilter(key) {
    this._activeFilters[key] = null;
    this.render();
  },

  setTypeFilter(t) {
    this._activeFilters.type = t;
    this.applyFilters();
  },

  toggleFilters() {
    this._showFilters = !this._showFilters;
    this.render();
  },

  applyFilters() {
    // read price range inputs if panel was open
    const minEl = document.getElementById('price-min-input');
    const maxEl = document.getElementById('price-max-input');
    if (minEl) this._activeFilters.priceMin = minEl.value ? Number(minEl.value) : null;
    if (maxEl) this._activeFilters.priceMax = maxEl.value ? Number(maxEl.value) : null;
    this._showFilters = false;
    this.render();
  },

  clearFilters() {
    this._activeFilters = { category: null, tradition: null, priceOrder: null, color: null, type: null, designer: null, priceMin: null, priceMax: null };
    this._showFilters = false;
    this.render();
  },

  clearSearch() {
    this._query = '';
    this.render();
  },

  _getResults() {
    let results = [...DATA.dresses];
    const q = this._query.toLowerCase().trim();

    if (q) {
      results = results.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.designer.toLowerCase().includes(q) ||
        d.fabric.toLowerCase().includes(q) ||
        d.tradition.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }

    if (this._activeFilters.category) {
      results = results.filter(d => d.category === this._activeFilters.category);
    }
    if (this._activeFilters.type) {
      results = results.filter(d => d.category === this._activeFilters.type);
    }
    if (this._activeFilters.tradition) {
      results = results.filter(d => d.tradition === this._activeFilters.tradition);
    }
    if (this._activeFilters.designer) {
      results = results.filter(d => d.designerId === this._activeFilters.designer);
    }
    if (this._activeFilters.priceMin) {
      results = results.filter(d => d.price >= Number(this._activeFilters.priceMin));
    }
    if (this._activeFilters.priceMax) {
      results = results.filter(d => d.price <= Number(this._activeFilters.priceMax));
    }
    if (this._activeFilters.priceOrder === 'asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (this._activeFilters.priceOrder === 'desc') {
      results.sort((a, b) => b.price - a.price);
    }

    return results;
  },

  _renderResults() {
    const results = this._getResults();
    const hasFilters = this._query || Object.values(this._activeFilters).some(Boolean);

    if (!hasFilters) {
      // Show search suggestions and trending
      return `
        <div>
          <div class="section-title" style="margin-bottom:var(--space-md)">Trending Searches</div>
          ${['Bridal Lehenga','Kasavu Saree','Wedding Gown','Silk Sarees','Kanjivaram Saree','Telugu Brahmin Wedding','Sikh Anand Karaj','Hanbok'].map(s => `
            <div class="search-suggestion" onclick="SEARCH._query='${s}';document.getElementById('main-search-input').value='${s}';document.getElementById('search-results').innerHTML=SEARCH._renderResults()">
              ${UTILS.svgIcon('search', 14)}
              <span>${s}</span>
            </div>
          `).join('')}
          <div class="section-title" style="margin:var(--space-lg) 0 var(--space-md)">All Dresses (${DATA.dresses.length})</div>
          <div class="grid-2">
            ${DATA.dresses.map(d => UI.dressCard(d)).join('')}
          </div>
        </div>
      `;
    }

    if (!results.length) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">No results found</div>
          <div class="empty-desc">Try different keywords or clear filters</div>
          <button class="btn btn-secondary btn-sm" onclick="SEARCH.clearSearch();SEARCH.clearFilters()">Clear Search</button>
        </div>
      `;
    }

    return `
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
          <span style="font-size:0.85rem;color:var(--text-muted)">${results.length} result${results.length !== 1 ? 's' : ''}</span>
          <select class="form-select" style="width:auto;padding:6px 28px 6px 10px;font-size:0.8rem"
            onchange="SEARCH.setFilter('priceOrder',this.value||null);document.getElementById('search-results').innerHTML=SEARCH._renderResults()">
            <option value="">Sort by</option>
            <option value="asc" ${this._activeFilters.priceOrder==='asc'?'selected':''}>Price: Low to High</option>
            <option value="desc" ${this._activeFilters.priceOrder==='desc'?'selected':''}>Price: High to Low</option>
          </select>
        </div>
        <div class="grid-2">
          ${results.map(d => UI.dressCard(d)).join('')}
        </div>
      </div>
    `;
  },
};
