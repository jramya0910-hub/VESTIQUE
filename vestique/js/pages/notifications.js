/* ============================================================
   VESTIQUE – Notifications Page
   ============================================================ */

const NOTIFICATIONS = {
  render() {
    const container = document.getElementById('page-container');
    const notifs = STATE.notifications;
    const unreadCount = getUnreadNotifCount();

    container.innerHTML = `
      <div class="page" id="notifications-page">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div>
            <h2 style="font-family:var(--font-display);font-size:1.4rem">🔔 Notifications</h2>
            ${unreadCount > 0 ? `<p style="font-size:0.8rem;color:var(--text-muted)">${unreadCount} unread</p>` : ''}
          </div>
          ${unreadCount > 0 ? `
            <button class="btn btn-ghost btn-sm" onclick="NOTIFICATIONS.markAllRead()">Mark All Read</button>
          ` : ''}
        </div>

        ${notifs.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🔔</div>
            <div class="empty-title">No Notifications</div>
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
    return `
      <div class="notif-item ${n.unread ? 'unread' : ''}" id="notif-${n.id}" onclick="NOTIFICATIONS.readNotif('${n.id}')">
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-content">
          <div class="notif-title">${n.title}</div>
          <div class="notif-desc">${n.desc}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="notif-dot"></div>' : ''}
      </div>
    `;
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
      // Navigate based on type
      if (notif.type === 'order') {
        ROUTER.navigate('orders');
      } else if (notif.type === 'new' || notif.type === 'festival') {
        ROUTER.navigate('search');
      } else if (notif.type === 'designer') {
        ROUTER.navigate('community');
      }
    }
  },

  markAllRead() {
    STATE.notifications.forEach(n => n.unread = false);
    STORE.save();
    UI.updateNavBadges();
    this.render();
    UI.toast('All notifications marked as read ✓', 'success');
  },
};
