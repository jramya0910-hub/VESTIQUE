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
