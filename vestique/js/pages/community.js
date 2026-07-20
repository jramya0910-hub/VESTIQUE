/* ============================================================
   VESTIQUE – Community Inspiration Page
   ============================================================ */

const COMMUNITY = {
  _activeFilter: 'all',

  render() {
    const container = document.getElementById('page-container');
    const inspirations = this._getFiltered();

    container.innerHTML = `
      <div class="page" id="community-page">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border)">
          <h2 style="font-family:var(--font-display);font-size:1.4rem">💫 Inspiration Gallery</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">
            Curated bridal inspiration from designers and real brides
          </p>
        </div>

        <!-- Filter Row -->
        <div class="filter-bar">
          <button class="filter-btn ${this._activeFilter === 'all' ? 'active' : ''}"
                  onclick="COMMUNITY.setFilter('all')">All</button>
          ${DATA.traditions.map(t => `
            <button class="filter-btn ${this._activeFilter === t.id ? 'active' : ''}"
                    onclick="COMMUNITY.setFilter('${t.id}')">${t.emoji} ${t.label.split(' ')[0]}</button>
          `).join('')}
        </div>

        <!-- Masonry Grid -->
        <div id="inspo-grid" style="
          columns: 2;
          column-gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
        ">
          ${inspirations.map(ins => this._inspoCard(ins)).join('')}
        </div>

        ${inspirations.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">💫</div>
            <div class="empty-title">No Inspirations Found</div>
            <div class="empty-desc">Try another filter to see more looks</div>
          </div>
        ` : ''}

        <!-- Designer Collections -->
        <div style="padding:var(--space-md);border-top:1px solid var(--border)">
          <div class="section-title" style="margin-bottom:var(--space-md)">👑 Designer Collections</div>
          <div class="scroll-row" style="padding:0">
            ${DATA.designers.map(d => `
              <div class="card" style="min-width:150px;padding:var(--space-md);text-align:center;cursor:pointer"
                   onclick="ROUTER.navigate('search',{designerId:'${d.id}'})">
                <div class="avatar" style="width:52px;height:52px;margin:0 auto var(--space-sm);font-size:1.3rem;background:linear-gradient(135deg,var(--gold-light),var(--rose-gold-light))">${UTILS.generateAvatar(d.name)}</div>
                <div style="font-weight:700;font-size:0.8rem">${d.name}</div>
                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${d.products} designs</div>
                <div style="font-size:0.72rem;color:var(--gold)">★ ${d.rating}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _inspoCard(ins) {
    const saved = ins.saved;
    // Vary heights for masonry effect
    const heights = ['110px', '140px', '120px', '160px', '130px'];
    const h = heights[parseInt(ins.id.slice(-3)) % heights.length];
    return `
      <div class="inspo-card" id="inspo-${ins.id}" style="margin-bottom:var(--space-sm)">
        <div class="inspo-card-img" style="aspect-ratio:unset;height:${h};font-size:3.5rem;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,${this._getTraditionColor(ins.tradition)},var(--surface-2))">
          ${ins.emoji}
        </div>
        <div class="inspo-card-footer">
          <div>
            <div style="font-size:0.72rem;font-weight:700;margin-bottom:1px">${ins.title}</div>
            <span class="inspo-likes">♥ ${ins.likes + (ins.extraLikes || 0)}</span>
          </div>
          <span class="inspo-save ${saved ? 'saved' : ''}" id="save-btn-${ins.id}"
                onclick="COMMUNITY.toggleSave('${ins.id}')">
            ${saved ? '❤️ Saved' : '🤍 Save'}
          </span>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:100%;margin:0;font-size:0.75rem;padding:6px;border-top:1px solid var(--border)"
                onclick="COMMUNITY.likeInspo('${ins.id}')">
          👍 Like
        </button>
      </div>
    `;
  },

  _getTraditionColor(tradId) {
    const trad = DATA.traditions.find(t => t.id === tradId);
    return trad ? trad.color + '22' : 'var(--surface-2)';
  },

  _getFiltered() {
    if (this._activeFilter === 'all') return STATE.inspirations;
    return STATE.inspirations.filter(i => i.tradition === this._activeFilter);
  },

  setFilter(filter) {
    this._activeFilter = filter;
    this.render();
  },

  toggleSave(id) {
    const ins = STATE.inspirations.find(i => i.id === id);
    if (!ins) return;
    ins.saved = !ins.saved;
    STORE.save();
    const btn = document.getElementById('save-btn-' + id);
    if (btn) btn.textContent = ins.saved ? '❤️ Saved' : '🤍 Save';
    UI.toast(ins.saved ? 'Inspiration saved! ❤️' : 'Removed from saved');
  },

  likeInspo(id) {
    const ins = STATE.inspirations.find(i => i.id === id);
    if (!ins) return;
    ins.extraLikes = (ins.extraLikes || 0) + 1;
    STORE.save();
    UI.toast('Liked! 👍');
    // Re-render the card likes count
    const card = document.getElementById('inspo-' + id);
    if (card) {
      const likesEl = card.querySelector('.inspo-likes');
      if (likesEl) likesEl.textContent = `♥ ${ins.likes + ins.extraLikes}`;
    }
  },
};
