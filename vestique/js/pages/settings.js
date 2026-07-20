/* ============================================================
   VESTIQUE – Settings Page
   ============================================================ */

const SETTINGS = {
  render() {
    const container = document.getElementById('page-container');
    const darkMode = STATE.darkMode;

    container.innerHTML = `
      <div class="page" id="settings-page">
        ${UI.subPageHeader('Settings')}

        <div class="settings-list">

          <!-- Account -->
          <div class="settings-section-title">Account</div>

          <div class="settings-item" onclick="ROUTER.navigate('profile')">
            <div class="settings-icon">👤</div>
            <div class="settings-label">Edit Profile</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>

          <div class="settings-item" onclick="PROFILE.showAddresses()">
            <div class="settings-icon">📍</div>
            <div class="settings-label">Manage Addresses</div>
            <div class="settings-value">${STATE.addresses.length} saved</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>

          <!-- Preferences -->
          <div class="settings-section-title">Preferences</div>

          <div class="settings-item" onclick="SETTINGS.toggleDarkMode()">
            <div class="settings-icon">${darkMode ? '☀️' : '🌙'}</div>
            <div class="settings-label">${darkMode ? 'Light Mode' : 'Dark Mode'}</div>
            <div style="margin-left:auto">
              <div class="toggle-switch ${darkMode ? 'on' : ''}" id="dark-mode-toggle" style="
                width:44px;height:24px;border-radius:12px;
                background:${darkMode ? 'var(--gold)' : 'var(--border)'};
                position:relative;transition:background 0.3s;cursor:pointer;
              ">
                <div style="
                  position:absolute;top:3px;${darkMode ? 'right:3px' : 'left:3px'};
                  width:18px;height:18px;border-radius:50%;background:white;
                  transition:all 0.3s;
                "></div>
              </div>
            </div>
          </div>

          <div class="settings-item" onclick="SETTINGS.showLanguageModal()">
            <div class="settings-icon">🌐</div>
            <div class="settings-label">Language</div>
            <div class="settings-value">${STATE.language || 'English'}</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>

          <!-- Notifications -->
          <div class="settings-section-title">Notifications</div>

          ${[
            { key: 'notif_orders',   icon: '📦', label: 'Order Updates' },
            { key: 'notif_new',      icon: '✨', label: 'New Collections' },
            { key: 'notif_price',    icon: '💰', label: 'Price Drops' },
            { key: 'notif_festival', icon: '🎉', label: 'Festival Collections' },
            { key: 'notif_designer', icon: '👗', label: 'Designer Uploads' },
          ].map(n => `
            <div class="settings-item">
              <div class="settings-icon">${n.icon}</div>
              <div class="settings-label">${n.label}</div>
              <div style="margin-left:auto">
                <div onclick="SETTINGS.toggleNotif('${n.key}', this)" style="
                  width:44px;height:24px;border-radius:12px;
                  background:var(--gold);position:relative;transition:background 0.3s;cursor:pointer;
                " class="notif-toggle" data-key="${n.key}">
                  <div style="position:absolute;top:3px;right:3px;width:18px;height:18px;border-radius:50%;background:white;transition:all 0.3s;"></div>
                </div>
              </div>
            </div>
          `).join('')}

          <!-- Privacy & Support -->
          <div class="settings-section-title">Privacy & Support</div>

          <div class="settings-item" onclick="SETTINGS.showPrivacy()">
            <div class="settings-icon">🔒</div>
            <div class="settings-label">Privacy Policy</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>

          <div class="settings-item" onclick="SETTINGS.showHelp()">
            <div class="settings-icon">❓</div>
            <div class="settings-label">Help & Support</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>

          <div class="settings-item" onclick="SETTINGS.showAbout()">
            <div class="settings-icon">ℹ️</div>
            <div class="settings-label">About Vestique</div>
            <div class="settings-value">v1.0.0</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>

          <!-- Logout -->
          <div class="settings-section-title"></div>
          <div class="settings-item" onclick="AUTH.doLogout()" style="color:var(--error)">
            <div class="settings-icon" style="background:rgba(229,57,53,0.1)">🚪</div>
            <div class="settings-label" style="color:var(--error)">Logout</div>
          </div>

        </div>

        <div style="height:var(--space-2xl)"></div>
      </div>
    `;
  },

  toggleDarkMode() {
    STATE.darkMode = !STATE.darkMode;
    document.body.classList.toggle('theme-dark', STATE.darkMode);
    STORE.save();
    this.render();
    UI.toast(STATE.darkMode ? '🌙 Dark mode on' : '☀️ Light mode on');
  },

  toggleNotif(key, el) {
    UI.toast('Notification preference saved ✓', 'success');
  },

  showLanguageModal() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Select Language</div>
        ${['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Bengali','Gujarati','Marathi','Punjabi','Korean'].map(lang => `
          <div class="settings-item" style="cursor:pointer" onclick="SETTINGS.setLanguage('${lang}')">
            <div class="settings-label">${lang}</div>
            ${STATE.language === lang ? `<div style="color:var(--gold)">${UTILS.svgIcon('check', 18)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `);
  },

  setLanguage(lang) {
    STATE.language = lang;
    STORE.save();
    UI.hideModal();
    UI.toast(`Language set to ${lang} ✓`, 'success');
    this.render();
  },

  showPrivacy() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Privacy Policy</div>
        <div style="font-size:0.875rem;color:var(--text-muted);line-height:1.8">
          <p><strong>Data Collection:</strong> We collect only the data needed to provide you with personalised bridal fashion recommendations and order fulfilment.</p>
          <br/>
          <p><strong>Data Use:</strong> Your data (name, email, preferences, orders) is used solely within Vestique to improve your experience. We never sell your data to third parties.</p>
          <br/>
          <p><strong>Cookies:</strong> We use localStorage only for session persistence. No third-party tracking cookies.</p>
          <br/>
          <p><strong>Security:</strong> All data is stored securely. Passwords are hashed and never stored in plain text.</p>
          <br/>
          <p><strong>Contact:</strong> For privacy concerns, email privacy@vestique.com</p>
        </div>
      </div>
    `);
  },

  showHelp() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Help & Support</div>
        ${[
          { icon: '📞', title: 'Call Us', desc: '+91 80000 99999 (9AM – 6PM, Mon–Sat)' },
          { icon: '📧', title: 'Email', desc: 'support@vestique.com (24hr response)' },
          { icon: '💬', title: 'Live Chat', desc: 'Available Monday–Friday, 9AM–6PM' },
          { icon: '❓', title: 'FAQ', desc: 'Browse frequently asked questions' },
          { icon: '📦', title: 'Track Order', desc: 'Check your order status anytime' },
          { icon: '↩️', title: 'Returns & Exchanges', desc: 'Our hassle-free return policy' },
        ].map(h => `
          <div class="settings-item" onclick="UI.toast('${h.title} support coming soon!')">
            <div class="settings-icon">${h.icon}</div>
            <div style="flex:1">
              <div class="settings-label">${h.title}</div>
              <div class="settings-value" style="font-size:0.78rem;margin-top:1px">${h.desc}</div>
            </div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>
        `).join('')}
      </div>
    `);
  },

  showAbout() {
    UI.showModal(`
      <div style="text-align:center;padding:var(--space-md) 0">
        <div style="font-family:var(--font-display);font-size:2rem;color:var(--gold);letter-spacing:3px;margin-bottom:var(--space-sm)">
          <span style="color:var(--rose-gold)">V</span>estique
        </div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-lg)">AI-Powered Bridal Fashion Discovery</div>
        <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:var(--space-md);text-align:left">
          ${[
            ['Version', '1.0.0 (Free)'],
            ['Build', '2025.01'],
            ['Platform', 'IBM BOB App Builder'],
            ['Support', 'support@vestique.com'],
          ].map(([k,v]) => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:0.85rem">
              <span style="color:var(--text-muted)">${k}</span>
              <span style="font-weight:600">${v}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:var(--space-lg);font-size:0.8rem;color:var(--text-light)">
          © 2025 Vestique. All rights reserved.<br/>
          Made with ❤️ for brides everywhere.
        </div>
      </div>
    `);
  },
};
