/* ============================================================
   VESTIQUE – Gift Registry Page
   Shareable wishlist registry link generator
   ============================================================ */

const REGISTRY = {

  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'registry';
    const user = STATE.currentUser;
    const registry = STATE.registry || { name: '', date: '', message: '', dressIds: [] };

    const regDresses = (registry.dressIds || [])
      .map(id => DATA.dresses.find(d => d.id === id))
      .filter(Boolean);

    const total = regDresses.reduce((s, d) => s + d.price, 0);
    const registryUrl = `https://vestique.app/registry/${(user?.name || 'bride').replace(/\s+/g,'-').toLowerCase()}-${Date.now().toString(36)}`;

    container.innerHTML = `
      <div class="page" id="registry-page">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border)">
          <h2 style="font-family:var(--font-display);font-size:1.4rem">🎁 Gift Registry</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Share your wish list with loved ones</p>
        </div>

        <!-- Registry Setup -->
        <div style="padding:var(--space-md)">
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-lg);background:linear-gradient(135deg,var(--gold-light),var(--blush))">
            <div style="font-weight:700;margin-bottom:var(--space-md)">Registry Details</div>
            <div class="form-group">
              <label class="form-label">Registry Name</label>
              <input class="form-input" id="reg-title" placeholder="e.g., Ananya & Rohan's Wedding Registry"
                     value="${registry.name || (user?.name ? user.name + "'s Bridal Registry" : '')}" />
            </div>
            <div class="form-group" style="margin-top:var(--space-md)">
              <label class="form-label">Wedding Date</label>
              <input class="form-input" id="reg-date" type="date" value="${registry.date || ''}" />
            </div>
            <div class="form-group" style="margin-top:var(--space-md)">
              <label class="form-label">Personal Message to Guests</label>
              <textarea class="form-input" id="reg-message" rows="2"
                        placeholder="e.g., Thank you for celebrating with us! We'd love your help...">${registry.message || ''}</textarea>
            </div>
            <button class="btn btn-primary btn-sm" style="margin-top:var(--space-md)" onclick="REGISTRY.saveDetails()">
              Save Details
            </button>
          </div>

          <!-- Share Link -->
          ${registry.name ? `
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-lg)">
            <div style="font-weight:700;margin-bottom:var(--space-sm)">🔗 Your Registry Link</div>
            <div style="display:flex;gap:var(--space-sm);align-items:center">
              <div style="flex:1;background:var(--surface-2);border-radius:var(--radius-md);padding:10px 14px;font-size:0.78rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                ${registryUrl}
              </div>
              <button class="btn btn-secondary btn-sm" onclick="REGISTRY.copyLink('${registryUrl}')">Copy</button>
            </div>
            <div style="margin-top:var(--space-md);display:flex;gap:var(--space-sm)">
              <button class="btn btn-primary btn-sm" style="flex:1" onclick="REGISTRY.share('${registryUrl}')">
                📤 Share Registry
              </button>
              <button class="btn btn-secondary btn-sm" style="flex:1" onclick="REGISTRY.shareWhatsApp('${registryUrl}')">
                💬 WhatsApp
              </button>
            </div>
          </div>
          ` : ''}

          <!-- Registry Items -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
            <div class="section-title">Registry Items (${regDresses.length})</div>
            ${total ? `<span class="chip chip-gold">Total: ${UTILS.formatPrice(total)}</span>` : ''}
          </div>

          ${regDresses.length === 0 ? `
            <div class="empty-state" style="padding:var(--space-xl) 0">
              <div class="empty-icon">🎁</div>
              <div class="empty-title">No items yet</div>
              <div class="empty-desc">Add dresses from your wishlist or browse to add items</div>
              <button class="btn btn-primary btn-sm" onclick="ROUTER.navigate('wishlist')">Browse Wishlist</button>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:var(--space-sm)" id="registry-items">
              ${regDresses.map(d => `
                <div class="card" style="padding:var(--space-md);display:flex;gap:var(--space-md);align-items:center">
                  <div style="font-size:2.5rem">${d.images[0]}</div>
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:0.875rem">${d.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${d.designer}</div>
                    <div style="font-weight:700;color:var(--gold);margin-top:2px">${UTILS.formatPrice(d.price)}</div>
                  </div>
                  <button class="btn btn-ghost btn-sm" style="color:var(--error)"
                          onclick="REGISTRY.removeItem('${d.id}')">✕</button>
                </div>
              `).join('')}
            </div>
          `}

          <!-- Add from wishlist button -->
          ${STATE.wishlist.length ? `
          <button class="btn btn-secondary btn-full" style="margin-top:var(--space-lg)" onclick="REGISTRY.showAddModal()">
            + Add from Wishlist
          </button>
          ` : ''}
        </div>
        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  saveDetails() {
    const name = document.getElementById('reg-title')?.value.trim();
    const date = document.getElementById('reg-date')?.value;
    const message = document.getElementById('reg-message')?.value.trim();
    if (!name) { UI.toast('Please enter a registry name', 'error'); return; }
    if (!STATE.registry) STATE.registry = { dressIds: [] };
    STATE.registry.name = name;
    STATE.registry.date = date;
    STATE.registry.message = message;
    STORE.save();
    UI.toast('Registry details saved! 🎁', 'success');
    this.render();
  },

  addItem(dressId) {
    if (!STATE.registry) STATE.registry = { name: '', date: '', message: '', dressIds: [] };
    if (!STATE.registry.dressIds) STATE.registry.dressIds = [];
    if (STATE.registry.dressIds.includes(dressId)) { UI.toast('Already in registry', 'warning'); return; }
    STATE.registry.dressIds.push(dressId);
    STORE.save();
    UI.toast('Added to Gift Registry! 🎁', 'success');
  },

  removeItem(dressId) {
    if (!STATE.registry?.dressIds) return;
    STATE.registry.dressIds = STATE.registry.dressIds.filter(id => id !== dressId);
    STORE.save();
    this.render();
    UI.toast('Removed from registry');
  },

  showAddModal() {
    const wishDresses = STATE.wishlist
      .map(id => DATA.dresses.find(d => d.id === id))
      .filter(Boolean);
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Add to Registry</div>
        <div style="max-height:60vh;overflow-y:auto;display:flex;flex-direction:column;gap:var(--space-sm)">
          ${wishDresses.map(d => {
            const already = STATE.registry?.dressIds?.includes(d.id);
            return `
              <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-sm);border:1px solid var(--border);border-radius:var(--radius-md)">
                <div style="font-size:2rem">${d.images[0]}</div>
                <div style="flex:1">
                  <div style="font-weight:600;font-size:0.85rem">${d.name}</div>
                  <div style="font-size:0.78rem;color:var(--gold)">${UTILS.formatPrice(d.price)}</div>
                </div>
                <button class="btn btn-${already ? 'ghost' : 'secondary'} btn-sm" ${already ? 'disabled' : ''}
                        onclick="REGISTRY.addItem('${d.id}');UI.hideModal();REGISTRY.render()">
                  ${already ? '✓ Added' : '+ Add'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `);
  },

  copyLink(url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => UI.toast('Registry link copied! 🔗', 'success'));
    } else {
      UI.toast('Link: ' + url);
    }
  },

  share(url) {
    const reg = STATE.registry;
    if (navigator.share) {
      navigator.share({
        title: reg?.name || 'My Bridal Registry',
        text: reg?.message || 'Check out my bridal registry on Vestique!',
        url,
      }).catch(() => {});
    } else {
      this.copyLink(url);
    }
  },

  shareWhatsApp(url) {
    const reg = STATE.registry;
    const text = encodeURIComponent(`${reg?.name || 'My Bridal Registry'}\n${reg?.message || ''}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  },
};
