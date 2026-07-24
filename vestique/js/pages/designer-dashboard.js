/* ============================================================
   VESTIQUE – Designer Dashboard
   ============================================================ */

const DESIGNER = {
  _activeTab: 'overview',

  render() {
    const container = document.getElementById('page-container');
    const user = STATE.currentUser;
    const designer = DATA.designers.find(d => d.id === user?.designerId) || DATA.designers[0];
    const myProducts = DATA.dresses.filter(d => d.designerId === designer.id);

    container.innerHTML = `
      <div class="page" id="designer-dash-page">
        <!-- Designer Header -->
        <div style="background:linear-gradient(135deg,var(--burgundy),#1a0a10);padding:var(--space-xl) var(--space-md)">
          <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md)">
            <div class="avatar" style="width:60px;height:60px;font-size:1.5rem;border:2px solid var(--gold)">${UTILS.generateAvatar(designer.name)}</div>
            <div>
              <div style="font-family:var(--font-display);font-size:1.3rem;color:white">${designer.name}</div>
              <div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">${designer.speciality} • ${designer.location}</div>
              <div style="font-size:0.8rem;color:var(--gold);margin-top:2px">★ ${designer.rating} Rating</div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="dash-stats">
          <div class="dash-stat">
            <div class="dash-stat-value">${myProducts.length}</div>
            <div class="dash-stat-label">Products</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-value">${STATE.orders.length + 12}</div>
            <div class="dash-stat-label">Orders</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-value">${UTILS.formatPrice((STATE.orders.length + 12) * 28500)}</div>
            <div class="dash-stat-label">Revenue</div>
          </div>
          <div class="dash-stat">
            <div class="dash-stat-value">4.8</div>
            <div class="dash-stat-label">Avg. Rating</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="ar-mode-tabs" style="margin:0 var(--space-md) var(--space-sm)">
          <div class="ar-mode-tab ${this._activeTab==='overview'?'active':''}" onclick="DESIGNER.switchTab('overview')">Overview</div>
          <div class="ar-mode-tab ${this._activeTab==='products'?'active':''}" onclick="DESIGNER.switchTab('products')">Products</div>
          <div class="ar-mode-tab ${this._activeTab==='orders'?'active':''}" onclick="DESIGNER.switchTab('orders')">Orders</div>
          <div class="ar-mode-tab ${this._activeTab==='requests'?'active':''}" onclick="DESIGNER.switchTab('requests')">Requests</div>
        </div>

        <div id="designer-tab-content">
          ${this._renderTab(designer, myProducts)}
        </div>

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  switchTab(tab) {
    this._activeTab = tab;
    const designer = DATA.designers.find(d => d.id === (STATE.currentUser?.designerId)) || DATA.designers[0];
    const myProducts = DATA.dresses.filter(d => d.designerId === designer.id);
    // Update tab active states
    document.querySelectorAll('.ar-mode-tab').forEach((t, i) => {
      const tabs = ['overview', 'products', 'orders', 'requests'];
      t.classList.toggle('active', tabs[i] === tab);
    });
    const content = document.getElementById('designer-tab-content');
    if (content) content.innerHTML = this._renderTab(designer, myProducts);
  },

  _renderTab(designer, products) {
    if (this._activeTab === 'overview')  return this._renderOverview(designer, products);
    if (this._activeTab === 'products')  return this._renderProducts(products);
    if (this._activeTab === 'orders')    return this._renderOrders();
    if (this._activeTab === 'requests')  return this._renderRequests();
    return '';
  },

  _renderOverview(designer, products) {
    return `
      <div class="dash-section stagger">
        <div style="font-weight:700;margin-bottom:var(--space-md)">Recent Activity</div>
        ${[
          { icon: '🛍️', text: 'New order received for Crimson Saree', time: '2 hours ago' },
          { icon: '✂️', text: 'Customization request: Blouse sleeve change', time: '5 hours ago' },
          { icon: '⭐', text: 'New 5-star review on Banarasi Lehenga', time: '1 day ago' },
          { icon: '📦', text: 'Order #VTQ-A1B2C3 shipped', time: '2 days ago' },
        ].map(a => `
          <div style="display:flex;gap:var(--space-md);align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--border)">
            <div style="font-size:1.5rem">${a.icon}</div>
            <div style="flex:1">
              <div style="font-size:0.875rem;font-weight:600">${a.text}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${a.time}</div>
            </div>
          </div>
        `).join('')}

        <!-- Quick Actions -->
        <div style="margin-top:var(--space-lg)">
          <div style="font-weight:700;margin-bottom:var(--space-md)">Quick Actions</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
            ${[
              { icon: '➕', label: 'Upload New Product', action: "DESIGNER.showUploadModal()" },
              { icon: '📋', label: 'View All Orders',    action: "DESIGNER.switchTab('orders')" },
              { icon: '📩', label: 'Custom Requests',    action: "DESIGNER.switchTab('requests')" },
              { icon: '📊', label: 'Analytics',          action: "UI.toast('Analytics coming soon!')" },
            ].map(a => `
              <button class="card" style="padding:var(--space-md);text-align:center;cursor:pointer;border:none"
                      onclick="${a.action}">
                <div style="font-size:1.8rem;margin-bottom:var(--space-sm)">${a.icon}</div>
                <div style="font-size:0.8rem;font-weight:600">${a.label}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  _renderProducts(products) {
    return `
      <div class="dash-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
          <div style="font-weight:700">My Products (${products.length})</div>
          <button class="btn btn-primary btn-sm" onclick="DESIGNER.showUploadModal()">+ Upload</button>
        </div>
        ${products.map(p => `
          <div class="dash-product-row">
            <div class="dash-product-img">${p.images[0]}</div>
            <div class="dash-product-info">
              <div class="dash-product-name">${p.name}</div>
              <div class="dash-product-meta">${UTILS.formatPrice(p.price)} • ${p.category}</div>
              <div class="dash-product-meta">★ ${p.rating} (${p.reviews} reviews)</div>
            </div>
            <div class="dash-actions">
              <button class="btn btn-ghost btn-icon btn-sm" onclick="UI.toast('Edit: ${p.name}')">${UTILS.svgIcon('edit', 16)}</button>
              <button class="btn btn-ghost btn-icon btn-sm" style="color:var(--error)" onclick="UI.toast('Delete: ${p.name}')">${UTILS.svgIcon('trash', 16)}</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderOrders() {
    const allOrders = [...STATE.orders, ...this._sampleOrders()];
    return `
      <div class="dash-section">
        <div style="font-weight:700;margin-bottom:var(--space-md)">All Orders (${allOrders.length})</div>
        ${allOrders.length === 0 ? `<div class="empty-state"><div class="empty-icon">📦</div><div class="empty-title">No orders yet</div></div>` : ''}
        ${allOrders.map(o => `
          <div style="padding:var(--space-md);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:var(--space-sm)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700;font-size:0.875rem">${o.id}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">${UTILS.formatDate(o.date)}</div>
              </div>
              <span class="chip chip-gold">${UTILS.formatPrice(o.total)}</span>
            </div>
            <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-sm)">
              <button class="btn btn-secondary btn-sm" onclick="UI.toast('Viewing order ${o.id}')">View</button>
              <button class="btn btn-ghost btn-sm" onclick="UI.toast('Updating order status...')">Update Status</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderRequests() {
    const requests = [
      { id: 'REQ001', customer: 'Ananya S.', dress: 'Crimson Kanjivaram', request: 'Please make the blouse with boat neck and shorter sleeve length. Also add more gold border.', date: '20 Jan 2025', status: 'pending' },
      { id: 'REQ002', customer: 'Priya M.', dress: 'Royal Banarasi Lehenga', request: 'Need size XL with customized embroidery on the dupatta', date: '18 Jan 2025', status: 'in_progress' },
      { id: 'REQ003', customer: 'Meera K.', dress: 'Gold Tissue Saree', request: 'Can you do this in champagne color instead of gold?', date: '15 Jan 2025', status: 'completed' },
    ];
    return `
      <div class="dash-section">
        <div style="font-weight:700;margin-bottom:var(--space-md)">Customization Requests</div>
        ${requests.map(r => `
          <div style="padding:var(--space-md);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:var(--space-sm)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm)">
              <div style="font-weight:700;font-size:0.875rem">${r.customer} – ${r.dress}</div>
              <span class="chip ${r.status==='completed'?'chip-gold':r.status==='in_progress'?'chip-pink':'chip-muted'}" style="font-size:0.72rem">
                ${r.status==='completed'?'✓ Done':r.status==='in_progress'?'In Progress':'Pending'}
              </span>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:var(--space-sm)">"${r.request}"</div>
            <div style="font-size:0.72rem;color:var(--text-light)">${r.date}</div>
            ${r.status !== 'completed' ? `
              <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
                <button class="btn btn-primary btn-sm" onclick="UI.toast('Responding to request...')">Respond</button>
                <button class="btn btn-secondary btn-sm" onclick="UI.toast('Request accepted!')">Accept</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  _sampleOrders() {
    return [
      { id: 'VTQ-A1B2C3', total: 24500, date: '2025-01-15T10:00:00Z', status: 'shipped' },
      { id: 'VTQ-D4E5F6', total: 45000, date: '2025-01-10T14:30:00Z', status: 'delivered' },
    ];
  },

  showUploadModal() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Upload New Product</div>
        <div class="form-group"><label class="form-label">Product Name</label><input class="form-input" placeholder="e.g., Royal Silk Saree" /></div>
        <div class="form-group" style="margin-top:var(--space-md)"><label class="form-label">Category</label>
          <select class="form-select"><option>Sarees</option><option>Lehengas</option><option>Gowns</option><option>Blouses</option></select>
        </div>
        <div class="form-group" style="margin-top:var(--space-md)"><label class="form-label">Price (₹)</label><input class="form-input" type="number" placeholder="25000" /></div>
        <div class="form-group" style="margin-top:var(--space-md)"><label class="form-label">Description</label>
          <textarea class="form-input" rows="3" placeholder="Describe your design..."></textarea>
        </div>
        <label class="btn btn-secondary btn-full" style="cursor:pointer;margin-top:var(--space-md)">
          📸 Upload Images
          <input type="file" accept="image/*" multiple style="display:none" />
        </label>
        <button class="btn btn-primary btn-full" style="margin-top:var(--space-sm)"
                onclick="UI.hideModal();UI.toast('Product uploaded successfully! ✓','success')">
          Upload Product
        </button>
      </div>
    `);
  },
};
