/* ============================================================
   VESTIQUE – Application State Manager
   ============================================================ */

const STATE = {
  // ── Auth ──────────────────────────────────────────────────
  currentUser: null,
  isAuthenticated: false,

  // ── Navigation ────────────────────────────────────────────
  currentPage: 'home',
  pageParams: {},
  pageHistory: [],

  // ── UI State ──────────────────────────────────────────────
  darkMode: false,
  language: 'en',
  headerTitle: null,

  // ── Data ──────────────────────────────────────────────────
  wishlist: [],          // [ dressId, ... ]
  cart: [],              // [ { productId, type, qty, customizations } ]
  orders: [],            // [ orderObj ]
  addresses: [],

  // ── Search & Filter ───────────────────────────────────────
  searchQuery: '',
  activeCategory: null,
  activeTradition: null,
  activeFilters: {},

  // ── Customization ─────────────────────────────────────────
  currentCustomization: {},
  customizingDressId: null,

  // ── AR Studio ─────────────────────────────────────────────
  arSelectedDress: null,
  arUserPhoto: null,

  // ── Inspirations ─────────────────────────────────────────
  inspirations: JSON.parse(JSON.stringify(DATA.inspirations)),

  // ── Notifications ─────────────────────────────────────────
  notifications: [...DATA.notifications],

  // ── Recently Viewed ────────────────────────────────────────
  recentlyViewed: [],   // [ dressId, ... ] max 10, most-recent first

  // ── Comparison ────────────────────────────────────────────
  compareList: [],      // [ dressId, ... ] max 2
};

// ── Persistence ───────────────────────────────────────────────
const STORE = {
  save() {
    try {
      const s = {
        currentUser: STATE.currentUser,
        isAuthenticated: STATE.isAuthenticated,
        wishlist: STATE.wishlist,
        cart: STATE.cart,
        orders: STATE.orders,
        addresses: STATE.addresses,
        darkMode: STATE.darkMode,
        language: STATE.language,
        inspirations: STATE.inspirations,
        notifications: STATE.notifications,
        recentlyViewed: STATE.recentlyViewed,
      };
      localStorage.setItem('vestique_state', JSON.stringify(s));
    } catch(e) {}
  },
  load() {
    try {
      const raw = localStorage.getItem('vestique_state');
      if (!raw) return;
      const s = JSON.parse(raw);
      Object.assign(STATE, s);
      if (STATE.darkMode) document.body.classList.add('theme-dark');
      else document.body.classList.remove('theme-dark');
    } catch(e) {}
  },
};

// ── Derived Helpers ───────────────────────────────────────────
const getCartTotal = () => STATE.cart.reduce((sum, item) => {
  const prod = DATA.dresses.find(d => d.id === item.productId) ||
               DATA.accessories.find(a => a.id === item.productId);
  return sum + (prod ? prod.price * item.qty : 0);
}, 0);

const getCartCount = () => STATE.cart.reduce((n, i) => n + i.qty, 0);

const getWishlistCount = () => STATE.wishlist.length;

const isWishlisted = (id) => STATE.wishlist.includes(id);

const toggleWishlist = (id) => {
  const idx = STATE.wishlist.indexOf(id);
  if (idx === -1) {
    STATE.wishlist.push(id);
    UI.toast('Added to Wishlist ❤️', 'success');
  } else {
    STATE.wishlist.splice(idx, 1);
    UI.toast('Removed from Wishlist');
  }
  STORE.save();
  UI.updateNavBadges();
};

const addToCart = (productId, qty = 1, customizations = null, type = 'dress') => {
  const existing = STATE.cart.find(i => i.productId === productId && !customizations);
  if (existing && !customizations) {
    existing.qty += qty;
  } else {
    STATE.cart.push({ productId, qty, customizations, type, id: Date.now().toString() });
  }
  STORE.save();
  UI.toast('Added to Cart 🛍️', 'success');
  UI.updateNavBadges();
};

const removeFromCart = (itemId) => {
  const idx = STATE.cart.findIndex(i => i.id === itemId);
  if (idx > -1) STATE.cart.splice(idx, 1);
  STORE.save();
  UI.updateNavBadges();
};

const getUnreadNotifCount = () => STATE.notifications.filter(n => n.unread).length;

const addToCompare = (dressId) => {
  if (STATE.compareList.includes(dressId)) {
    STATE.compareList = STATE.compareList.filter(id => id !== dressId);
    UI.toast('Removed from comparison');
  } else if (STATE.compareList.length >= 2) {
    UI.toast('You can compare up to 2 dresses at a time', 'warning');
  } else {
    STATE.compareList.push(dressId);
    const count = STATE.compareList.length;
    if (count === 2) {
      UI.toast('2 dresses selected — tap Compare! 👗', 'success');
    } else {
      UI.toast('Added to compare. Select 1 more to compare!');
    }
  }
};

const showCompareModal = () => {
  if (STATE.compareList.length < 2) {
    UI.toast('Please select 2 dresses to compare', 'warning');
    return;
  }
  const [d1, d2] = STATE.compareList.map(id => DATA.dresses.find(d => d.id === id));
  if (!d1 || !d2) return;
  const rows = [
    ['Price', UTILS.formatPrice(d1.price), UTILS.formatPrice(d2.price)],
    ['Original Price', UTILS.formatPrice(d1.originalPrice), UTILS.formatPrice(d2.originalPrice)],
    ['Fabric', d1.fabric, d2.fabric],
    ['Embroidery', d1.embroidery, d2.embroidery],
    ['Rating', `★ ${d1.rating} (${d1.reviews})`, `★ ${d2.rating} (${d2.reviews})`],
    ['Tradition', DATA.traditions.find(t=>t.id===d1.tradition)?.label || d1.tradition, DATA.traditions.find(t=>t.id===d2.tradition)?.label || d2.tradition],
    ['Designer', d1.designer, d2.designer],
    ['Sizes', d1.sizes.join(', '), d2.sizes.join(', ')],
  ];
  UI.showModal(`
    <div>
      <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Dress Comparison</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <div></div>
        <div style="text-align:center">
          <div style="font-size:3rem">${d1.images[0]}</div>
          <div style="font-size:0.75rem;font-weight:700;margin-top:4px">${d1.name}</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:3rem">${d2.images[0]}</div>
          <div style="font-size:0.75rem;font-weight:700;margin-top:4px">${d2.name}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:0">
        ${rows.map((row, i) => `
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-sm);padding:8px 0;border-bottom:1px solid var(--border);background:${i%2?'var(--surface-2)':'transparent'}">
            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);display:flex;align-items:center">${row[0]}</div>
            <div style="font-size:0.78rem;text-align:center;display:flex;align-items:center;justify-content:center">${row[1]}</div>
            <div style="font-size:0.78rem;text-align:center;display:flex;align-items:center;justify-content:center">${row[2]}</div>
          </div>
        `).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-top:var(--space-lg)">
        <button class="btn btn-primary btn-sm" onclick="UI.hideModal();ROUTER.navigate('dress-detail',{id:'${d1.id}'})">View ${d1.name.split(' ').slice(0,2).join(' ')}</button>
        <button class="btn btn-primary btn-sm" onclick="UI.hideModal();ROUTER.navigate('dress-detail',{id:'${d2.id}'})">View ${d2.name.split(' ').slice(0,2).join(' ')}</button>
      </div>
      <button class="btn btn-ghost btn-full btn-sm" style="margin-top:var(--space-sm)" onclick="STATE.compareList=[];UI.hideModal();UI.toast('Comparison cleared')">Clear Comparison</button>
    </div>
  `);
};

const trackView = (dressId) => {
  STATE.recentlyViewed = STATE.recentlyViewed.filter(id => id !== dressId);
  STATE.recentlyViewed.unshift(dressId);
  if (STATE.recentlyViewed.length > 10) STATE.recentlyViewed.length = 10;
  STORE.save();
};
