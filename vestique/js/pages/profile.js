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
            <div class="profile-avatar-edit" onclick="PROFILE.showAvatarPicker()" title="Change Avatar Color">✎</div>
          </div>
          <div class="profile-name">${user?.name || 'Guest User'}</div>
          <div class="profile-meta">${user?.email || ''} ${user?.phone ? '• ' + user.phone : ''}</div>
          ${user?.tradition ? `<div style="margin-top:6px"><span class="chip chip-gold" style="font-size:0.75rem">${DATA.traditions.find(t => t.id === user.tradition)?.label || user.tradition}</span></div>` : ''}
          ${user?.recommendedSize ? `<div style="margin-top:4px"><span class="chip chip-pink" style="font-size:0.75rem">📏 Size ${user.recommendedSize}</span></div>` : ''}
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
          ].map((a, i) => `
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

        <!-- Profile Completion Meter -->
        ${this._renderCompletionMeter(user)}

        <!-- My Tools quick links -->
        <div style="padding:var(--space-md);border-top:1px solid var(--border)">
          <div class="section-title" style="margin-bottom:var(--space-md)">My Tools</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
            ${[
              { icon: '✨', label: 'Style Quiz',     action: "ROUTER.navigate('quiz')" },
              { icon: '📖', label: 'Lookbooks',      action: "ROUTER.navigate('lookbook')" },
              { icon: '📅', label: 'Appointments',   action: "ROUTER.navigate('appointments')" },
              { icon: '🎁', label: 'Gift Registry',  action: "ROUTER.navigate('registry')" },
              { icon: '🎟️', label: 'Coupons',        action: "ROUTER.navigate('coupon-wallet')" },
              { icon: '📏', label: 'Size Finder',    action: "ROUTER.navigate('size-recommender')" },
            ].map(t => `
              <div class="settings-item" onclick="${t.action}" style="border:1px solid var(--border);border-radius:var(--radius-md);margin:0;padding:12px">
                <div class="settings-icon">${t.icon}</div>
                <div class="settings-label">${t.label}</div>
                <div class="settings-arrow">${UTILS.svgIcon('forward', 14)}</div>
              </div>
            `).join('')}
          </div>
        </div>

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

  _renderCompletionMeter(user) {
    const checks = [
      { label: 'Name added',        done: !!(user?.name) },
      { label: 'Email verified',    done: !!(user?.email) },
      { label: 'Phone added',       done: !!(user?.phone) },
      { label: 'Tradition selected',done: !!(user?.tradition) },
      { label: 'Size measured',     done: !!(user?.recommendedSize) },
      { label: 'Style quiz done',   done: !!(user?.style) },
    ];
    const done  = checks.filter(c => c.done).length;
    const total = checks.length;
    const pct   = Math.round((done / total) * 100);
    if (pct === 100) return '';  // don't show if complete
    return `
      <div style="padding:var(--space-md);border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">
          <div style="font-weight:700;font-size:0.875rem">Profile Completion</div>
          <span style="font-family:var(--font-display);color:var(--gold);font-size:1.1rem">${pct}%</span>
        </div>
        <div style="height:6px;background:var(--surface-2);border-radius:var(--radius-full);overflow:hidden;margin-bottom:var(--space-sm)">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--gold),var(--rose-gold));border-radius:var(--radius-full);transition:width 0.5s ease"></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs)">
          ${checks.map(c => `
            <span class="chip" style="font-size:0.7rem;background:${c.done?'var(--success)22':'var(--surface-2)'};color:${c.done?'var(--success)':'var(--text-light)'};border-color:${c.done?'var(--success)':'var(--border)'}">
              ${c.done?'✓':'+'}  ${c.label}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  },

  showAvatarPicker() {
    const colors = [
      { label: 'Gold',      from: '#c9a84c', to: '#b76e79' },
      { label: 'Royal',     from: '#722f37', to: '#1B4F72' },
      { label: 'Emerald',   from: '#2D6A4F', to: '#40916C' },
      { label: 'Lavender',  from: '#7B68EE', to: '#B76E79' },
      { label: 'Saffron',   from: '#FF8C00', to: '#DC143C' },
      { label: 'Midnight',  from: '#1a1208', to: '#722f37' },
    ];
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Choose Avatar Style</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm)">
          ${colors.map(c => `
            <div style="cursor:pointer;text-align:center;padding:var(--space-sm)" onclick="PROFILE.setAvatarColor('${c.from}','${c.to}')">
              <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,${c.from},${c.to});display:flex;align-items:center;justify-content:center;color:white;font-size:1.3rem;font-weight:700;margin:0 auto var(--space-xs)">
                ${UTILS.generateAvatar(STATE.currentUser?.name || 'U')}
              </div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${c.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `);
  },

  setAvatarColor(from, to) {
    if (STATE.currentUser) {
      STATE.currentUser.avatarFrom = from;
      STATE.currentUser.avatarTo   = to;
      STORE.save();
    }
    UI.hideModal();
    UI.renderHeader();
    this.render();
    UI.toast('Avatar updated! ✨', 'success');
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
