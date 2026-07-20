/* ============================================================
   VESTIQUE – Client-Side Router
   ============================================================ */

const ROUTER = {
  routes: {
    // Auth
    'login':             () => AUTH.renderLogin(),
    'register':          () => AUTH.renderRegister(),
    'otp-verify':        () => AUTH.renderOTP(),
    'setup-profile':     () => AUTH.renderProfileSetup(),
    // Main
    'home':              () => HOME.render(),
    'search':            () => SEARCH.render(),
    'ar-studio':         () => AR_STUDIO.render(),
    'wishlist':          () => WISHLIST.render(),
    'profile':           () => PROFILE.render(),
    // Sub-pages
    'dress-detail':      (p) => DRESS_DETAIL.render(p),
    'customize':         (p) => CUSTOMIZE.render(p),
    'cart':              () => CART.render(),
    'checkout':          () => CHECKOUT.render(),
    'checkout-success':  (p) => CHECKOUT.renderSuccess(p),
    'orders':            () => ORDERS.render(),
    'order-detail':      (p) => ORDERS.renderDetail(p),
    'designer-dashboard':(p) => DESIGNER.render(p),
    'community':         () => COMMUNITY.render(),
    'notifications':     () => NOTIFICATIONS.render(),
    'settings':          () => SETTINGS.render(),
    'category':          (p) => SEARCH.renderCategory(p),
    'tradition':         (p) => SEARCH.renderTradition(p),
  },

  navigate(page, params = {}, addHistory = true) {
    if (!STATE.isAuthenticated && !['login','register','otp-verify'].includes(page)) {
      page = 'login';
      params = {};
    }
    if (addHistory && STATE.currentPage !== page) {
      STATE.pageHistory.push({ page: STATE.currentPage, params: STATE.pageParams });
    }
    STATE.currentPage = page;
    STATE.pageParams  = params;

    // Update active nav
    UI.setActiveNav(page);

    // Determine if auth or main page
    const authPages = ['login','register','otp-verify','setup-profile'];
    const isAuthPage = authPages.includes(page);

    const authContainer = document.getElementById('auth-container');
    const mainApp = document.getElementById('main-app');

    if (isAuthPage) {
      authContainer.classList.remove('hidden');
      mainApp.classList.add('hidden');
    } else {
      authContainer.classList.add('hidden');
      mainApp.classList.remove('hidden');
      UI.renderHeader();
      UI.renderBottomNav();
    }

    // Render page
    const container = isAuthPage
      ? document.getElementById('auth-container')
      : document.getElementById('page-container');

    if (this.routes[page]) {
      container.innerHTML = '';
      this.routes[page](params);
    }

    // Scroll to top
    if (!isAuthPage) {
      document.getElementById('page-container').scrollTop = 0;
    }
    window.scrollTo(0, 0);
  },

  back() {
    if (STATE.pageHistory.length) {
      const prev = STATE.pageHistory.pop();
      this.navigate(prev.page, prev.params, false);
    } else {
      this.navigate('home', {}, false);
    }
  },
};
