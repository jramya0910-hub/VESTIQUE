/* ============================================================
   VESTIQUE – Order Tracking Page
   ============================================================ */

const ORDERS = {
  render() {
    const container = document.getElementById('page-container');
    const orders = STATE.orders;

    container.innerHTML = `
      <div class="page" id="orders-page">
        ${UI.subPageHeader('My Orders 📦')}

        ${orders.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <div class="empty-title">No Orders Yet</div>
            <div class="empty-desc">When you place an order, it will appear here</div>
            <button class="btn btn-primary btn-sm" onclick="ROUTER.navigate('search')">Start Shopping</button>
          </div>
        ` : `
          <div style="padding:var(--space-md);display:flex;flex-direction:column;gap:var(--space-md)">
            ${orders.slice().reverse().map(order => this._orderCard(order)).join('')}
          </div>
        `}

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _orderCard(order) {
    const statusColors = {
      confirmed: 'var(--info)',
      customization_started: 'var(--warning)',
      ready: 'var(--success)',
      packed: 'var(--gold)',
      shipped: 'var(--rose-gold)',
      delivered: 'var(--success)',
      cancelled: 'var(--error)',
    };
    const statusLabels = {
      confirmed: 'Order Confirmed',
      customization_started: 'Customization Started',
      ready: 'Ready to Ship',
      packed: 'Packed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    const color = statusColors[order.status] || 'var(--text-muted)';
    const label = statusLabels[order.status] || order.status;
    const firstItem = order.items[0];
    const firstProd = firstItem ? (DATA.dresses.find(d => d.id === firstItem.productId) || DATA.accessories.find(a => a.id === firstItem.productId)) : null;

    return `
      <div class="card" style="overflow:hidden;cursor:pointer" onclick="ORDERS.renderDetail({orderId:'${order.id}'})">
        <div style="background:${color};opacity:0.1;height:4px"></div>
        <div style="padding:var(--space-md)">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--space-sm)">
            <div>
              <div style="font-weight:700;font-size:0.9rem">${order.id}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${UTILS.formatDate(order.date)}</div>
            </div>
            <span class="chip" style="background:${color}22;color:${color};border-color:${color}">${label}</span>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <div style="font-size:2.5rem">${firstProd ? (firstProd.images ? firstProd.images[0] : firstProd.icon) : '📦'}</div>
            <div>
              <div style="font-weight:600;font-size:0.875rem">${firstProd ? firstProd.name : 'Order'}</div>
              ${order.items.length > 1 ? `<div style="font-size:0.75rem;color:var(--text-muted)">+${order.items.length - 1} more item${order.items.length > 2 ? 's' : ''}</div>` : ''}
              <div style="font-weight:700;margin-top:4px;color:var(--gold)">${UTILS.formatPrice(order.total)}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderDetail(params = {}) {
    const container = document.getElementById('page-container');
    const order = STATE.orders.find(o => o.id === params.orderId);
    if (!order) {
      ORDERS.render();
      return;
    }

    const allStatuses = [
      { key: 'confirmed',             label: 'Order Confirmed',         icon: '✓' },
      { key: 'customization_started', label: 'Customization Started',   icon: '✂️' },
      { key: 'ready',                 label: 'Ready to Dispatch',       icon: '📦' },
      { key: 'packed',                label: 'Packed',                  icon: '🎁' },
      { key: 'shipped',               label: 'Shipped',                 icon: '🚚' },
      { key: 'delivered',             label: 'Delivered',               icon: '✅' },
    ];

    const currentIdx = allStatuses.findIndex(s => s.key === order.status);

    container.innerHTML = `
      <div class="page" id="order-detail-page">
        ${UI.subPageHeader('Order Details')}

        <div style="padding:var(--space-md)">
          <!-- Order ID & Date -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:700">${order.id}</div>
                <div style="font-size:0.78rem;color:var(--text-muted)">Placed on ${UTILS.formatDate(order.date)}</div>
              </div>
              <span class="chip chip-gold">${UTILS.formatPrice(order.total)}</span>
            </div>
          </div>

          <!-- Order Tracker -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
            <div style="font-weight:700;margin-bottom:var(--space-md)">Order Status</div>
            <div class="tracker-steps">
              ${allStatuses.map((s, i) => {
                const isDone   = i < currentIdx;
                const isActive = i === currentIdx;
                const time     = isDone || isActive ? (order.statuses?.find(st => st.status.toLowerCase().includes(s.label.split(' ')[0].toLowerCase()))?.time || 'In progress') : 'Pending';
                return `
                  <div class="tracker-step">
                    <div class="tracker-step-indicator">
                      <div class="tracker-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}">
                        ${isDone ? '✓' : isActive ? s.icon : ''}
                      </div>
                      <div class="tracker-line ${isDone ? 'done' : ''}"></div>
                    </div>
                    <div class="tracker-content">
                      <div class="tracker-status" style="color:${isActive ? 'var(--gold)' : isDone ? 'var(--success)' : 'var(--text-muted)'}">${s.label}</div>
                      <div class="tracker-time">${isDone || isActive ? time : ''}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Ordered Items -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
            <div style="font-weight:700;margin-bottom:var(--space-md)">Order Items</div>
            ${order.items.map(item => {
              const prod = DATA.dresses.find(d => d.id === item.productId) || DATA.accessories.find(a => a.id === item.productId);
              if (!prod) return '';
              return `
                <div style="display:flex;gap:var(--space-md);align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--border)">
                  <div style="font-size:2.5rem">${prod.images ? prod.images[0] : prod.icon}</div>
                  <div style="flex:1">
                    <div style="font-weight:600;font-size:0.875rem">${prod.name}</div>
                    ${prod.designer ? `<div style="font-size:0.75rem;color:var(--text-muted)">${prod.designer}</div>` : ''}
                    <div style="font-size:0.75rem;color:var(--text-muted)">Qty: ${item.qty}</div>
                    ${item.customizations && Object.keys(item.customizations).length ? `
                      <div style="font-size:0.72rem;color:var(--rose-gold);margin-top:2px">✂️ Customized Design</div>
                    ` : ''}
                  </div>
                  <div style="font-weight:700">${UTILS.formatPrice(prod.price * item.qty)}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Delivery Address -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
            <div style="font-weight:700;margin-bottom:var(--space-sm)">Delivery Address</div>
            <div style="font-size:0.875rem;color:var(--text-muted);line-height:1.8">
              ${order.address.name}<br/>
              ${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}<br/>
              ${order.address.city}, ${order.address.state} – ${order.address.pin}<br/>
              📞 ${order.address.phone}
            </div>
          </div>

          <!-- Actions -->
          ${order.status !== 'cancelled' && order.status !== 'delivered' ? `
          <button class="btn btn-secondary btn-full" style="color:var(--error);border-color:var(--error)"
                  onclick="ORDERS.cancelOrder('${order.id}')">
            Cancel Order
          </button>` : ''}
          <button class="btn btn-ghost btn-full" style="margin-top:var(--space-sm)" onclick="ORDERS.render()">
            ← Back to Orders
          </button>
        </div>

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  cancelOrder(orderId) {
    const order = STATE.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      STORE.save();
      UI.toast('Order cancelled successfully', 'success');
      this.render();
    }
  },
};
