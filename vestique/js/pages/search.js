/* ============================================================
   VESTIQUE – Search & Filter Page
   ============================================================ */

const SEARCH = {
  _query: '',
  _activeFilters: { category: null, tradition: null, priceOrder: null, color: null, type: null },
  _showFilters: false,

  render(params = {}) {
    const container = document.getElementById('page-container');
    this._query = params.query || '';
    STATE.currentPage = 'search';
    UI.setActiveNav('search');
    container.innerHTML = `
      <div class="page" id="search-page">
        <div class="search-header">
          <div class="search-bar-full">
            ${UTILS.svgIcon('search', 18)}
            <input type="text" id="main-search-input" placeholder="Search dresses, fabrics, designers, traditions..."
              value="${this._query}" oninput="SEARCH.onInput(this.value)" autofocus />
            ${this._query ? `<span style="cursor:pointer;color:var(--text-light)" onclick="SEARCH.clearSearch()">${UTILS.svgIcon('close', 16)}</span>` : ''}
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="filter-bar" style="padding:var(--space-sm) var(--space-md)">
          <button class="filter-btn ${this._showFilters ? 'active' : ''}" onclick="SEARCH.toggleFilters()">
            ${UTILS.svgIcon('filter', 14)} Filters
          </button>
          ${DATA.categories.map(c => `
            <button class="filter-btn ${this._activeFilters.category === c.id ? 'active' : ''}"
              onclick="SEARCH.setFilter('category','${c.id}')">${c.icon} ${c.label}</button>
          `).join('')}
        </div>

        <!-- Filter panel -->
        <div class="filter-panel" id="filter-panel" style="${this._showFilters ? '' : 'display:none'}">
          <div class="filter-section">
            <div class="filter-section-title">Price</div>
            <div class="filter-options">
              <div class="filter-option ${this._activeFilters.priceOrder==='asc'?'selected':''}" onclick="SEARCH.setFilter('priceOrder','asc')">Low to High</div>
              <div class="filter-option ${this._activeFilters.priceOrder==='desc'?'selected':''}" onclick="SEARCH.setFilter('priceOrder','desc')">High to Low</div>
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-section-title">Wedding Tradition</div>
            <div class="filter-options">
              ${DATA.traditions.map(t => `
                <div class="filter-option ${this._activeFilters.tradition===t.id?'selected':''}"
                  onclick="SEARCH.setFilter('tradition','${t.id}')">${t.label}</div>
              `).join('')}
            </div>
          </div>
          <div class="filter-section">
            <div class="filter-section-title">Dress Type</div>
            <div class="filter-options">
              ${['Saree','Lehenga','Gown','Anarkali','Sherwani'].map(t => `
                <div class="filter-option" onclick="SEARCH.setTypeFilter('${t}')">${t}</div>
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
  },

  renderCategory(params) {
    const cat = DATA.categories.find(c => c.id === params.id);
    this._activeFilters.category = params.id;
    this.render({ title: cat ? cat.label : 'Category' });
    STATE.currentPage = 'category';
  },

  renderTradition(params) {
    const trad = DATA.traditions.find(t => t.id === params.id);
    this._activeFilters.tradition = params.id;
    this._activeFilters.category = null;
    this.render({ title: trad ? trad.label : 'Tradition' });
    STATE.currentPage = 'tradition';
  },

  onInput: UTILS.debounce(function(val) {
    SEARCH._query = val;
    const resultsEl = document.getElementById('search-results');
    if (resultsEl) resultsEl.innerHTML = SEARCH._renderResults();
  }, 300),

  setFilter(key, val) {
    if (this._activeFilters[key] === val) {
      this._activeFilters[key] = null;
    } else {
      this._activeFilters[key] = val;
    }
    const resultsEl = document.getElementById('search-results');
    if (resultsEl) resultsEl.innerHTML = this._renderResults();
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const id = btn.textContent.trim().toLowerCase().replace(/\s/g,'');
      // crude re-render to update active states
    });
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
    this._showFilters = false;
    this.render();
  },

  clearFilters() {
    this._activeFilters = { category: null, tradition: null, priceOrder: null, color: null, type: null };
    this.render();
  },

  clearSearch() {
    this._query = '';
    this.render();
  },

  _getResults() {
    let results = [...DATA.dresses];
    const q = this._query.toLowerCase();

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
    if (this._activeFilters.tradition) {
      results = results.filter(d => d.tradition === this._activeFilters.tradition);
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

    if (!this._query && !Object.values(this._activeFilters).some(Boolean)) {
      // Show search suggestions and trending
      return `
        <div>
          <div class="section-title" style="margin-bottom:var(--space-md)">Trending Searches</div>
          ${['Bridal Lehenga','Kasavu Saree','Wedding Gown','Silk Sarees','Chandbali Earrings','Telugu Brahmin Wedding'].map(s => `
            <div class="search-suggestion" onclick="SEARCH._query='${s}';SEARCH.render()">
              ${UTILS.svgIcon('search', 14)}
              <span>${s}</span>
            </div>
          `).join('')}
          <div class="section-title" style="margin:var(--space-lg) 0 var(--space-md)">All Dresses</div>
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
          <span style="font-size:0.85rem;color:var(--text-muted)">${results.length} results</span>
        </div>
        <div class="grid-2">
          ${results.map(d => UI.dressCard(d)).join('')}
        </div>
      </div>
    `;
  },
};
