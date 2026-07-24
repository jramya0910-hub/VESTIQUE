/* ============================================================
   VESTIQUE – Shared UI Components
   ============================================================ */

const UI = {

  // ── Toast Notifications ───────────────────────────────────
  toast(msg, type = '') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },

  // ── Update nav badges ─────────────────────────────────────
  updateNavBadges() {
    const cartBadge = document.getElementById('cart-badge');
    const wishBadge = document.getElementById('wish-badge');
    const notifBadge = document.getElementById('notif-badge');
    const cartCount = getCartCount();
    const wishCount = getWishlistCount();
    const notifCount = getUnreadNotifCount();
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount ? '' : 'none';
      if (cartCount) cartBadge.classList.add('badge-new');
    }
    if (wishBadge) { wishBadge.textContent = wishCount; wishBadge.style.display = wishCount ? '' : 'none'; }
    if (notifBadge) {
      notifBadge.textContent = notifCount;
      notifBadge.style.display = notifCount ? '' : 'none';
      if (notifCount) notifBadge.classList.add('badge-new');
    }
    // Bottom nav wishlist badge
    const navWishBadge = document.getElementById('nav-wish-badge');
    if (navWishBadge) { navWishBadge.textContent = wishCount; navWishBadge.style.display = wishCount ? '' : 'none'; }
  },

  // ── Render Top Header ─────────────────────────────────────
  renderHeader() {
    const el = document.getElementById('top-header');
    if (!el) return;
    const user = STATE.currentUser;
    const initials = user ? UTILS.generateAvatar(user.name) : 'U';
    el.innerHTML = `
      <div class="header-logo" onclick="ROUTER.navigate('home')">
        <span>V</span>estique
      </div>
      <div class="header-search" onclick="ROUTER.navigate('search')">
        ${UTILS.svgIcon('search', 16)}
        <input id="header-search-input" type="text" placeholder="Search dresses, fabrics, designers..."
          readonly onclick="ROUTER.navigate('search')" />
      </div>
      <button class="header-icon-btn" onclick="ROUTER.navigate('notifications')" title="Notifications">
        ${UTILS.svgIcon('bell', 18)}
        <span class="badge" id="notif-badge" style="display:none">0</span>
      </button>
      <button class="header-icon-btn" onclick="ROUTER.navigate('cart')" title="Cart">
        ${UTILS.svgIcon('cart', 18)}
        <span class="badge" id="cart-badge" style="display:none">0</span>
      </button>
      <div class="avatar" style="width:36px;height:36px;font-size:0.9rem;cursor:pointer"
           onclick="ROUTER.navigate('profile')">${initials}</div>
    `;
    this.updateNavBadges();
  },

  // ── Render Bottom Nav ─────────────────────────────────────
  renderBottomNav() {
    const el = document.getElementById('bottom-nav');
    if (!el) return;
    const items = [
      { id: 'home',     icon: 'home',   label: 'Home' },
      { id: 'search',   icon: 'search', label: 'Search' },
      { id: 'ar-studio',icon: 'camera', label: 'AR Studio' },
      { id: 'wishlist', icon: 'heart',  label: 'Wishlist', badge: true },
      { id: 'profile',  icon: 'user',   label: 'Profile' },
    ];
    el.innerHTML = items.map(item => `
      <div class="nav-item ${STATE.currentPage === item.id ? 'active' : ''}" onclick="ROUTER.navigate('${item.id}')" id="nav-${item.id}">
        <div class="nav-icon-wrap" style="position:relative">
          ${UTILS.svgIcon(item.icon, 22)}
          ${item.badge ? `<span class="badge" id="nav-wish-badge" style="display:none">0</span>` : ''}
        </div>
        <span>${item.label}</span>
      </div>
    `).join('');
    this.updateNavBadges();
  },

  // ── Update active nav item ────────────────────────────────
  setActiveNav(pageId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById('nav-' + pageId);
    if (navEl) navEl.classList.add('active');
  },

  // ── Modal (bottom sheet) ──────────────────────────────────
  showModal(html, onClose) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    container.innerHTML = `<div class="modal-handle"></div>${html}`;
    overlay.classList.remove('hidden');
    container.classList.remove('hidden');
    overlay.onclick = () => { this.hideModal(); if (onClose) onClose(); };
  },
  hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-container').classList.add('hidden');
  },

  // ── Dress Card ─────────────────────────────────────────────
  dressCard(dress, showWishBtn = true) {
    const wished = isWishlisted(dress.id);
    const inCompare = STATE.compareList.includes(dress.id);
    const discount = dress.originalPrice ? Math.round((1 - dress.price / dress.originalPrice) * 100) : 0;
    return `
      <div class="dress-card" onclick="ROUTER.navigate('dress-detail', {id:'${dress.id}'})">
        <div class="dress-card-img">
          <div style="font-size:4rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:var(--surface-2)">
            ${dress.images[0]}
          </div>
        </div>
        ${dress.badge ? `<div class="dress-card-badge"><span class="chip chip-gold">${dress.badge}</span></div>` : ''}
        ${discount ? `<div style="position:absolute;top:${dress.badge ? '28px' : '8px'};left:8px"><span class="chip chip-pink">${discount}% off</span></div>` : ''}
        ${showWishBtn ? `
        <div class="dress-card-actions">
          <div class="dress-card-wishlist ${wished ? 'active' : ''}" id="wish-${dress.id}"
               onclick="event.stopPropagation(); toggleWishlist('${dress.id}'); document.querySelectorAll('#wish-${dress.id}').forEach(el => el.classList.toggle('active'))">
            ${UTILS.svgIcon('heart', 16)}
          </div>
          <div class="dress-card-compare ${inCompare ? 'active' : ''}" id="cmp-${dress.id}"
               title="Compare"
               onclick="event.stopPropagation(); addToCompare('${dress.id}'); UI.updateCompareBar()">
            ⚖️
          </div>
        </div>` : ''}
        <div class="dress-card-body">
          <div class="dress-card-name">${dress.name}</div>
          <div class="dress-card-designer">${dress.designer}</div>
          <div class="dress-card-rating">
            <span style="color:var(--gold);font-size:11px">★</span>
            <span style="font-size:11px;color:var(--text-muted)">${dress.rating} (${dress.reviews})</span>
          </div>
          <div class="dress-card-price">
            <span class="price-new price-tag">${UTILS.formatPrice(dress.price)}</span>
            ${dress.originalPrice ? `<span class="price-old">${UTILS.formatPrice(dress.originalPrice)}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // ── Filter Bar ────────────────────────────────────────────
  filterBar(options, activeId, onChange) {
    return `<div class="filter-bar">
      ${options.map(o => `
        <button class="filter-btn ${activeId === o.id ? 'active' : ''}"
          onclick="${onChange}('${o.id}')">${o.label}</button>
      `).join('')}
    </div>`;
  },

  // ── Compare Bar ──────────────────────────────────────────
  updateCompareBar() {
    let bar = document.getElementById('compare-bar');
    const count = STATE.compareList.length;
    if (count === 0) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'compare-bar';
      bar.style.cssText = 'position:fixed;bottom:calc(var(--nav-h) + 8px);left:50%;transform:translateX(-50%);z-index:150;background:var(--text);color:var(--bg);border-radius:var(--radius-full);padding:10px 20px;display:flex;align-items:center;gap:var(--space-md);box-shadow:var(--shadow-lg);font-size:0.85rem;font-weight:600;animation:fadeUp 0.3s ease;white-space:nowrap';
      document.body.appendChild(bar);
    }
    const dresses = STATE.compareList.map(id => DATA.dresses.find(d => d.id === id)).filter(Boolean);
    bar.innerHTML = `
      ${dresses.map(d => d.images[0]).join(' vs ')} &nbsp;
      <span style="opacity:0.7">${count}/2 selected</span>
      ${count === 2 ? `<button onclick="showCompareModal()" style="background:var(--gold);color:white;border:none;border-radius:var(--radius-full);padding:6px 14px;font-size:0.8rem;font-weight:700;cursor:pointer">Compare →</button>` : ''}
      <button onclick="STATE.compareList=[];UI.updateCompareBar()" style="background:transparent;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1rem;padding:0 4px">✕</button>
    `;
  },

  // ── Back Button Header ────────────────────────────────────
  subPageHeader(title, actions = '') {
    return `<div class="detail-header">
      <div class="detail-back" onclick="ROUTER.back()">
        ${UTILS.svgIcon('back', 18)} Back
      </div>
      <div class="detail-title">${title}</div>
      ${actions}
    </div>`;
  },
};
