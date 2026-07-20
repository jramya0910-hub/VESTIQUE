/* ============================================================
   VESTIQUE – Main App Entry Point
   ============================================================ */

const APP = {
  init() {
    // Load persisted state
    STORE.load();

    // Apply dark mode
    if (STATE.darkMode) document.body.classList.add('theme-dark');

    // Run loading animation
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          APP.start();
        }, 500);
      } else {
        APP.start();
      }
    }, 2000);
  },

  start() {
    // Determine initial page
    if (STATE.isAuthenticated && STATE.currentUser) {
      const role = STATE.currentUser.role;
      if (role === 'designer') {
        ROUTER.navigate('designer-dashboard');
      } else {
        ROUTER.navigate('home');
      }
    } else {
      ROUTER.navigate('login');
    }
  },
};

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => APP.init());
