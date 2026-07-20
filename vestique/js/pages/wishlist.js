/* ============================================================
   VESTIQUE – Wishlist Page
   ============================================================ */

const WISHLIST = {
  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'wishlist';
    UI.setActiveNav('wishlist');

    const wishlisted = DATA.dresses.filter(d => isWishlisted(d.id));

    container.innerHTML = `
      <div class="page" id="wishlist-page">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border)">
          <h2 style="font-family:var(--font-display);font-size:1.4rem">❤️ My Wishlist</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">${wishlisted.length} item${wishlisted.length !== 1 ? 's' : ''} saved</p>
        </div>

        ${wishlisted.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">❤️</div>
            <div class="empty-title">Your Wishlist is Empty</div>
            <div class="empty-desc">Save dresses you love by tapping the heart icon while browsing</div>
            <button class="btn btn-primary btn-sm" onclick="ROUTER.navigate('search')">Browse Dresses</button>
          </div>
        ` : `
          <div style="padding:var(--space-sm) var(--space-md);display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:0.8rem;color:var(--text-muted)">${wishlisted.length} saved items</span>
            <button class="btn btn-ghost btn-sm" onclick="WISHLIST.clearAll()">Clear All</button>
          </div>
          <div class="wishlist-grid" id="wishlist-grid">
            ${wishlisted.map(d => this._wishCard(d)).join('')}
          </div>
        `}

        <!-- Also saved accessories -->
        <div style="padding:var(--space-md)">
          <div class="section-title" style="margin-bottom:var(--space-md)">Saved Accessories</div>
          <div class="scroll-row" style="padding:0">
            ${DATA.accessories.map(a => `
              <div class="card" style="min-width:130px;padding:var(--space-sm);text-align:center;cursor:pointer">
                <div style="font-size:2rem;margin-bottom:var(--space-xs)">${a.icon}</div>
                <div style="font-size:0.78rem;font-weight:600">${a.name}</div>
                <div style="font-size:0.8rem;color:var(--gold);margin-top:2px">${UTILS.formatPrice(a.price)}</div>
                <button class="btn btn-primary btn-sm" style="margin-top:var(--space-sm);width:100%"
                        onclick="addToCart('${a.id}', 1, null, 'accessory')">Add to Cart</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _wishCard(dress) {
    const discount = dress.originalPrice ? Math.round((1 - dress.price / dress.originalPrice) * 100) : 0;
    return `
      <div class="dress-card" id="wish-card-${dress.id}">
        <div class="dress-card-img" onclick="ROUTER.navigate('dress-detail', {id:'${dress.id}'})">
          <div style="font-size:3.5rem;background:var(--surface-2);width:100%;height:100%;display:flex;align-items:center;justify-content:center">${dress.images[0]}</div>
        </div>
        ${discount ? `<div class="dress-card-badge"><span class="chip chip-pink">${discount}% off</span></div>` : ''}
        <div class="dress-card-actions">
          <div class="dress-card-wishlist active" onclick="WISHLIST.removeItem('${dress.id}')">
            ${UTILS.svgIcon('close', 14)}
          </div>
        </div>
        <div class="dress-card-body">
          <div class="dress-card-name">${dress.name}</div>
          <div class="dress-card-designer">${dress.designer}</div>
          <div class="dress-card-price">
            <span class="price-new price-tag">${UTILS.formatPrice(dress.price)}</span>
            ${dress.originalPrice ? `<span class="price-old">${UTILS.formatPrice(dress.originalPrice)}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-sm btn-full" style="margin-top:var(--space-sm)"
                  onclick="addToCart('${dress.id}')">Add to Cart</button>
        </div>
      </div>
    `;
  },

  removeItem(id) {
    toggleWishlist(id);
    const el = document.getElementById('wish-card-' + id);
    if (el) el.style.opacity = '0';
    setTimeout(() => this.render(), 400);
  },

  clearAll() {
    STATE.wishlist = [];
    STORE.save();
    UI.updateNavBadges();
    this.render();
    UI.toast('Wishlist cleared');
  },
};
