/* ============================================================
   VESTIQUE – Profile Page
   ============================================================ */

const PROFILE = {
  _editMode: false,

  render() {
    const container = document.getElementById('page-container');
    const user = STATE.currentUser;
    STATE.currentPage = 'profile';
    UI.setActiveNav('profile');

    container.innerHTML = `
      <div class="page" id="profile-page">

        <!-- Profile Hero -->
        <div class="profile-hero">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar" style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:linear-gradient(135deg,var(--gold),var(--rose-gold))">
              ${UTILS.generateAvatar(user?.name || 'U')}
            </div>
            <div class="profile-avatar-edit" onclick="UI.toast('Photo upload coming soon!')" title="Change Photo">✎</div>
          </div>
          <div class="profile-name">${user?.name || 'Guest User'}</div>
          <div class="profile-meta">${user?.email || ''} ${user?.phone ? '• ' + user.phone : ''}</div>
          ${user?.tradition ? `<div style="margin-top:6px"><span class="chip chip-gold" style="font-size:0.75rem">${DATA.traditions.find(t => t.id === user.tradition)?.label || user.tradition}</span></div>` : ''}
          <div class="profile-stats">
            <div class="profile-stat">
              <div class="profile-stat-value">${STATE.wishlist.length}</div>
              <div class="profile-stat-label">Wishlisted</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat-value">${STATE.orders.length}</div>
              <div class="profile-stat-label">Orders</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat-value">${getCartCount()}</div>
              <div class="profile-stat-label">In Cart</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid var(--border)">
          ${[
            { icon: '📦', label: 'Orders',     action: "ROUTER.navigate('orders')" },
            { icon: '❤️', label: 'Wishlist',   action: "ROUTER.navigate('wishlist')" },
            { icon: '🛍️', label: 'Cart',       action: "ROUTER.navigate('cart')" },
            { icon: '📍', label: 'Addresses',  action: "PROFILE.showAddresses()" },
          ].map(a => `
            <div style="padding:var(--space-md);text-align:center;cursor:pointer;border-right:1px solid var(--border);transition:background 0.2s"
                 onclick="${a.action}">
              <div style="font-size:1.5rem;margin-bottom:4px">${a.icon}</div>
              <div style="font-size:0.72rem;font-weight:600;color:var(--text-muted)">${a.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Edit Profile Section -->
        <div style="padding:var(--space-md)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
            <div class="section-title">Profile Details</div>
            <button class="btn btn-secondary btn-sm" onclick="PROFILE.toggleEdit()">${this._editMode ? 'Cancel' : 'Edit Profile'}</button>
          </div>

          ${this._editMode ? this._renderEditForm(user) : this._renderProfileInfo(user)}
        </div>

        <!-- My Style Preferences -->
        <div style="padding:var(--space-md);border-top:1px solid var(--border)">
          <div class="section-title" style="margin-bottom:var(--space-md)">Style Preferences</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
            ${[
              { label: 'Tradition', value: DATA.traditions.find(t => t.id === user?.tradition)?.label || 'Not set' },
              { label: 'Religion',  value: user?.religion  || 'Not set' },
              { label: 'Style',     value: user?.style     || 'Not set' },
              { label: 'Language',  value: STATE.language  || 'English' },
            ].map(p => `
              <div style="background:var(--surface-2);border-radius:var(--radius-sm);padding:10px">
                <div style="font-size:0.72rem;color:var(--text-light);margin-bottom:2px">${p.label}</div>
                <div style="font-size:0.875rem;font-weight:600">${p.value}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Orders Preview -->
        ${STATE.orders.length ? `
        <div style="padding:var(--space-md);border-top:1px solid var(--border)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
            <div class="section-title">Recent Orders</div>
            <span class="section-link" onclick="ROUTER.navigate('orders')">View All →</span>
          </div>
          ${STATE.orders.slice(-2).reverse().map(o => `
            <div style="display:flex;gap:var(--space-md);align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--border);cursor:pointer"
                 onclick="ORDERS.renderDetail({orderId:'${o.id}'})">
              <div style="font-size:1.8rem">📦</div>
              <div style="flex:1">
                <div style="font-weight:600;font-size:0.875rem">${o.id}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${UTILS.formatDate(o.date)} • ${o.status}</div>
              </div>
              <div style="font-weight:700;color:var(--gold)">${UTILS.formatPrice(o.total)}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Settings Link -->
        <div style="padding:var(--space-md);border-top:1px solid var(--border)">
          <div class="settings-item" onclick="ROUTER.navigate('settings')">
            <div class="settings-icon">⚙️</div>
            <div class="settings-label">Settings & Preferences</div>
            <div class="settings-arrow">${UTILS.svgIcon('forward', 16)}</div>
          </div>
          <div class="settings-item" onclick="AUTH.doLogout()" style="color:var(--error)">
            <div class="settings-icon" style="background:rgba(229,57,53,0.1)">🚪</div>
            <div class="settings-label" style="color:var(--error)">Logout</div>
          </div>
        </div>

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _renderProfileInfo(user) {
    return `
      <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
        ${[
          { label: 'Full Name',  value: user?.name  || '—' },
          { label: 'Email',      value: user?.email || '—' },
          { label: 'Phone',      value: user?.phone || '—' },
        ].map(f => `
          <div style="display:flex;justify-content:space-between;padding:var(--space-sm) 0;border-bottom:1px solid var(--border)">
            <span style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">${f.label}</span>
            <span style="font-weight:600;font-size:0.875rem">${f.value}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderEditForm(user) {
    return `
      <div style="display:flex;flex-direction:column;gap:var(--space-md)">
        <div class="form-group"><label class="form-label">Full Name</label>
          <input class="form-input" id="edit-name" value="${user?.name || ''}" /></div>
        <div class="form-group"><label class="form-label">Email</label>
          <input class="form-input" id="edit-email" type="email" value="${user?.email || ''}" /></div>
        <div class="form-group"><label class="form-label">Phone</label>
          <input class="form-input" id="edit-phone" type="tel" value="${user?.phone || ''}" /></div>
        <div class="form-group"><label class="form-label">Religion</label>
          <select class="form-select" id="edit-religion">
            <option>Select...</option>
            ${['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other'].map(r =>
              `<option ${user?.religion===r?'selected':''}>${r}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Wedding Tradition</label>
          <select class="form-select" id="edit-tradition">
            <option value="">Select...</option>
            ${DATA.traditions.map(t => `<option value="${t.id}" ${user?.tradition===t.id?'selected':''}>${t.label}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary btn-full" onclick="PROFILE.saveProfile()">Save Changes</button>
      </div>
    `;
  },

  toggleEdit() {
    this._editMode = !this._editMode;
    this.render();
  },

  saveProfile() {
    if (!STATE.currentUser) return;
    STATE.currentUser.name      = document.getElementById('edit-name')?.value.trim()     || STATE.currentUser.name;
    STATE.currentUser.email     = document.getElementById('edit-email')?.value.trim()    || STATE.currentUser.email;
    STATE.currentUser.phone     = document.getElementById('edit-phone')?.value.trim()    || STATE.currentUser.phone;
    STATE.currentUser.religion  = document.getElementById('edit-religion')?.value         || STATE.currentUser.religion;
    STATE.currentUser.tradition = document.getElementById('edit-tradition')?.value        || STATE.currentUser.tradition;
    STORE.save();
    this._editMode = false;
    UI.toast('Profile updated! ✓', 'success');
    this.render();
    UI.renderHeader();
  },

  showAddresses() {
    const addrs = STATE.addresses;
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">My Addresses</div>
        ${addrs.length === 0 ? `
          <div class="empty-state" style="padding:var(--space-lg) 0">
            <div class="empty-icon">📍</div>
            <div class="empty-title">No Saved Addresses</div>
            <div class="empty-desc">Your delivery addresses will appear here after checkout</div>
          </div>
        ` : addrs.map((a, i) => `
          <div style="padding:var(--space-md);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:var(--space-sm)">
            <div style="font-weight:700">${a.name}</div>
            <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">${a.line1}${a.line2?', '+a.line2:''}</div>
            <div style="font-size:0.85rem;color:var(--text-muted)">${a.city}, ${a.state} – ${a.pin}</div>
            <div style="font-size:0.85rem;color:var(--text-muted)">📞 ${a.phone}</div>
            <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-sm);color:var(--error)"
                    onclick="STATE.addresses.splice(${i},1);STORE.save();UI.hideModal();UI.toast('Address removed')">
              Remove
            </button>
          </div>
        `).join('')}
        <button class="btn btn-secondary btn-full" onclick="UI.hideModal();ROUTER.navigate('checkout')">+ Add New Address</button>
      </div>
    `);
  },
};

// Extend AUTH with logout
AUTH.doLogout = function() {
  STATE.currentUser = null;
  STATE.isAuthenticated = false;
  STATE.wishlist = [];
  STATE.cart = [];
  STATE.orders = [];
  STATE.pageHistory = [];
  STORE.save();
  ROUTER.navigate('login');
  UI.toast('Logged out successfully');
};
