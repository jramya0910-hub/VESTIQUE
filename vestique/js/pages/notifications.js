/* ============================================================
   VESTIQUE – Notifications Page (Enhanced)
   Type filters, action buttons, dismiss, deep-link
   ============================================================ */

const NOTIFICATIONS = {
  _filter: 'all',

  render() {
    const container = document.getElementById('page-container');
    const allNotifs  = STATE.notifications;
    const notifs     = this._filter === 'all'
      ? allNotifs
      : allNotifs.filter(n => n.type === this._filter);
    const unreadCount = getUnreadNotifCount();

    const typeFilters = [
      { id: 'all',      label: 'All',       icon: '🔔' },
      { id: 'order',    label: 'Orders',    icon: '📦' },
      { id: 'new',      label: 'New',       icon: '✨' },
      { id: 'price',    label: 'Prices',    icon: '💰' },
      { id: 'festival', label: 'Festival',  icon: '🎉' },
      { id: 'designer', label: 'Designers', icon: '👗' },
      { id: 'appointment', label: 'Appts',  icon: '📅' },
    ];

    container.innerHTML = `
      <div class="page" id="notifications-page">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div>
            <h2 style="font-family:var(--font-display);font-size:1.4rem">🔔 Notifications</h2>
            ${unreadCount > 0 ? `<p style="font-size:0.8rem;color:var(--text-muted)">${unreadCount} unread</p>` : '<p style="font-size:0.8rem;color:var(--success)">All caught up ✓</p>'}
          </div>
          <div style="display:flex;gap:var(--space-sm)">
            ${unreadCount > 0 ? `<button class="btn btn-ghost btn-sm" onclick="NOTIFICATIONS.markAllRead()">Mark All Read</button>` : ''}
            ${allNotifs.length > 0 ? `<button class="btn btn-ghost btn-sm" style="color:var(--error)" onclick="NOTIFICATIONS.clearAll()">Clear All</button>` : ''}
          </div>
        </div>

        <!-- Type filter tabs -->
        <div class="filter-bar" style="padding:var(--space-sm) var(--space-md)">
          ${typeFilters.map(f => `
            <button class="filter-btn ${this._filter === f.id ? 'active' : ''}"
                    onclick="NOTIFICATIONS._filter='${f.id}';NOTIFICATIONS.render()">
              ${f.icon} ${f.label}
            </button>
          `).join('')}
        </div>

        ${notifs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🔔</div>
            <div class="empty-title">${this._filter === 'all' ? 'No Notifications' : 'No ' + typeFilters.find(f=>f.id===this._filter)?.label + ' Notifications'}</div>
            <div class="empty-desc">You're all caught up! Check back later for updates.</div>
          </div>
        ` : `
          <div id="notif-list">
            ${notifs.map(n => this._notifItem(n)).join('')}
          </div>
        `}

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _notifItem(n) {
    const actionBtns = this._getActionButtons(n);
    return `
      <div class="notif-item ${n.unread ? 'unread' : ''}" id="notif-${n.id}">
        <div style="display:flex;gap:var(--space-md);align-items:flex-start;padding:var(--space-md);cursor:pointer"
             onclick="NOTIFICATIONS.readNotif('${n.id}')">
          <div class="notif-icon">${n.icon}</div>
          <div class="notif-content" style="flex:1">
            <div class="notif-title">${n.title}</div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-time">${n.time}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
            ${n.unread ? '<div class="notif-dot"></div>' : ''}
            <button style="background:none;border:none;cursor:pointer;color:var(--text-light);font-size:0.8rem;padding:2px 6px"
                    onclick="event.stopPropagation();NOTIFICATIONS.dismiss('${n.id}')" title="Dismiss">✕</button>
          </div>
        </div>
        ${actionBtns ? `
          <div style="padding:0 var(--space-md) var(--space-md);display:flex;gap:var(--space-sm)">
            ${actionBtns}
          </div>
        ` : ''}
      </div>
    `;
  },

  _getActionButtons(n) {
    if (n.type === 'order') {
      return `<button class="btn btn-secondary btn-sm" onclick="NOTIFICATIONS.readNotif('${n.id}');ROUTER.navigate('orders')">View Orders →</button>`;
    }
    if (n.type === 'new' || n.type === 'festival') {
      return `<button class="btn btn-secondary btn-sm" onclick="NOTIFICATIONS.readNotif('${n.id}');ROUTER.navigate('search')">Browse Now →</button>`;
    }
    if (n.type === 'price') {
      return `<button class="btn btn-secondary btn-sm" onclick="NOTIFICATIONS.readNotif('${n.id}');ROUTER.navigate('search',{filter:'trending'})">See Deals →</button>`;
    }
    if (n.type === 'designer') {
      return `<button class="btn btn-secondary btn-sm" onclick="NOTIFICATIONS.readNotif('${n.id}');ROUTER.navigate('community')">View Designs →</button>`;
    }
    if (n.type === 'wishlist') {
      return `<button class="btn btn-secondary btn-sm" onclick="NOTIFICATIONS.readNotif('${n.id}');ROUTER.navigate('wishlist')">My Wishlist →</button>`;
    }
    if (n.type === 'appointment') {
      return `<button class="btn btn-secondary btn-sm" onclick="NOTIFICATIONS.readNotif('${n.id}');ROUTER.navigate('appointments')">My Appointments →</button>`;
    }
    return null;
  },

  readNotif(id) {
    const notif = STATE.notifications.find(n => n.id === id);
    if (notif) {
      notif.unread = false;
      STORE.save();
      const el = document.getElementById('notif-' + id);
      if (el) {
        el.classList.remove('unread');
        const dot = el.querySelector('.notif-dot');
        if (dot) dot.remove();
      }
      UI.updateNavBadges();
    }
  },

  dismiss(id) {
    STATE.notifications = STATE.notifications.filter(n => n.id !== id);
    STORE.save();
    const el = document.getElementById('notif-' + id);
    if (el) {
      el.style.opacity = '0';
      el.style.maxHeight = el.offsetHeight + 'px';
      setTimeout(() => { el.style.maxHeight = '0'; el.style.overflow = 'hidden'; }, 10);
      setTimeout(() => el.remove(), 320);
    }
    UI.updateNavBadges();
  },

  markAllRead() {
    STATE.notifications.forEach(n => n.unread = false);
    STORE.save();
    UI.updateNavBadges();
    this.render();
    UI.toast('All notifications marked as read ✓', 'success');
  },

  clearAll() {
    STATE.notifications = [];
    STORE.save();
    UI.updateNavBadges();
    this.render();
    UI.toast('Notifications cleared');
  },
};
