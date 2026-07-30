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
          <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
            ${order.status === 'delivered' ? `
              <button class="btn btn-primary btn-full" onclick="ORDERS.reorder('${order.id}')">
                🔄 Re-order Same Items
              </button>
              <button class="btn btn-secondary btn-full" onclick="ORDERS.showReturnModal('${order.id}')">
                ↩️ Request Return / Exchange
              </button>
            ` : ''}
            ${order.status !== 'cancelled' && order.status !== 'delivered' ? `
              <button class="btn btn-secondary btn-full" style="color:var(--error);border-color:var(--error)"
                      onclick="ORDERS.cancelOrder('${order.id}')">
                ✕ Cancel Order
              </button>
            ` : ''}
            ${order.status === 'shipped' ? `
              <button class="btn btn-secondary btn-full" onclick="UI.toast('Live tracking link sent to your phone 📱', 'success')">
                🚚 Track Live
              </button>
            ` : ''}
            <button class="btn btn-ghost btn-full" onclick="ORDERS.render()">
              ← Back to Orders
            </button>
          </div>
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

  reorder(orderId) {
    const order = STATE.orders.find(o => o.id === orderId);
    if (!order) return;
    let added = 0;
    order.items.forEach(item => {
      addToCart(item.productId, item.qty, item.customizations, item.type || 'dress');
      added++;
    });
    UI.toast(`${added} item${added !== 1 ? 's' : ''} added to cart! 🛍️`, 'success');
    ROUTER.navigate('cart');
  },

  showReturnModal(orderId) {
    const order = STATE.orders.find(o => o.id === orderId);
    if (!order) return;
    const reasons = ['Wrong size received', 'Damaged/defective item', 'Not as described', 'Changed my mind', 'Better price elsewhere', 'Other'];
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">↩️ Request Return / Exchange</div>
        <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:var(--space-md)">Order: <strong>${order.id}</strong> • ${UTILS.formatDate(order.date)}</div>

        <div class="form-group" style="margin-bottom:var(--space-md)">
          <label class="form-label">Return Type</label>
          <div style="display:flex;gap:var(--space-sm)">
            ${['Refund','Exchange','Store Credit'].map(t=>`
              <label style="flex:1;text-align:center;cursor:pointer">
                <input type="radio" name="return-type" value="${t}" style="display:none" ${t==='Refund'?'checked':''} />
                <div class="return-type-btn" style="padding:10px;border:2px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem;font-weight:600;transition:all 0.2s"
                     onclick="this.closest('label').querySelector('input').checked=true;document.querySelectorAll('.return-type-btn').forEach(b=>b.style.borderColor='var(--border)');this.style.borderColor='var(--gold)'">
                  ${t}
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="margin-bottom:var(--space-md)">
          <label class="form-label">Reason for Return</label>
          <select class="form-select" id="return-reason">
            ${reasons.map(r=>`<option value="${r}">${r}</option>`).join('')}
          </select>
        </div>

        <div class="form-group" style="margin-bottom:var(--space-lg)">
          <label class="form-label">Additional Details (Optional)</label>
          <textarea class="form-input" id="return-details" rows="2" placeholder="Describe the issue..."></textarea>
        </div>

        <button class="btn btn-primary btn-full" onclick="ORDERS.submitReturn('${orderId}')">
          Submit Return Request
        </button>
        <div style="font-size:0.75rem;color:var(--text-muted);text-align:center;margin-top:var(--space-md)">
          Returns are processed within 3–5 business days. Refunds within 7–10 days.
        </div>
      </div>
    `);
  },

  submitReturn(orderId) {
    const reason = document.getElementById('return-reason')?.value;
    const details = document.getElementById('return-details')?.value;
    const typeInput = document.querySelector('input[name="return-type"]:checked');
    const returnType = typeInput?.value || 'Refund';
    if (!STATE.returnRequests) STATE.returnRequests = [];
    STATE.returnRequests.push({
      id: 'RET-' + Date.now().toString(36).toUpperCase(),
      orderId,
      reason,
      details,
      returnType,
      status: 'pending',
      date: new Date().toISOString(),
    });
    // Add notification
    STATE.notifications.unshift({
      id: 'n_ret_' + Date.now(),
      type: 'order',
      icon: '↩️',
      title: 'Return Request Submitted',
      desc: `Your ${returnType} request for order ${orderId} is being processed`,
      time: 'Just now',
      unread: true,
    });
    STORE.save();
    UI.hideModal();
    UI.toast('Return request submitted! We\'ll process it within 3–5 days 📦', 'success');
    UI.updateNavBadges();
  },
};
