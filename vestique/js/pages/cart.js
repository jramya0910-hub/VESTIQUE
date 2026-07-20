/* ============================================================
   VESTIQUE – Shopping Cart Page
   ============================================================ */

const CART = {
  _coupon: '',
  _discount: 0,

  render() {
    const container = document.getElementById('page-container');
    const cartItems = STATE.cart;

    container.innerHTML = `
      <div class="page" id="cart-page">
        ${UI.subPageHeader('Shopping Cart 🛍️')}

        ${cartItems.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🛍️</div>
            <div class="empty-title">Your Cart is Empty</div>
            <div class="empty-desc">Add your favourite dresses and accessories to get started</div>
            <button class="btn btn-primary btn-sm" onclick="ROUTER.navigate('search')">Continue Shopping</button>
          </div>
        ` : `
          <!-- Cart Items -->
          <div id="cart-items">
            ${cartItems.map(item => this._renderItem(item)).join('')}
          </div>

          <!-- Coupon -->
          <div class="coupon-input-row" style="padding:0 var(--space-md)">
            <input class="form-input" id="coupon-input" type="text" placeholder="Enter coupon code" value="${this._coupon}" />
            <button class="btn btn-secondary btn-sm" onclick="CART.applyCoupon()">Apply</button>
          </div>

          <!-- Order Summary -->
          <div class="cart-summary">
            <div class="section-title" style="margin-bottom:var(--space-md)">Order Summary</div>
            <div class="summary-row">
              <span>Subtotal (${getCartCount()} items)</span>
              <span id="cart-subtotal">${UTILS.formatPrice(getCartTotal())}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span style="color:var(--success)">FREE</span>
            </div>
            ${this._discount > 0 ? `
            <div class="summary-row" style="color:var(--success)">
              <span>Coupon Discount</span>
              <span>−${UTILS.formatPrice(this._discount)}</span>
            </div>` : ''}
            <div class="summary-row" id="customization-row" style="display:${cartItems.some(i => i.type === 'customized') ? '' : 'none'}">
              <span>Customization Charges</span>
              <span>To be confirmed</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span id="cart-total">${UTILS.formatPrice(Math.max(0, getCartTotal() - this._discount))}</span>
            </div>
          </div>

          <!-- Delivery Info -->
          <div style="margin:var(--space-md);background:var(--blush);border-radius:var(--radius-md);padding:var(--space-md);display:flex;gap:var(--space-md);align-items:center">
            <span style="font-size:1.5rem">🚚</span>
            <div>
              <div style="font-weight:700;font-size:0.875rem">Free Delivery Available</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">Estimated delivery: 7–14 business days for custom orders</div>
            </div>
          </div>

          <!-- Checkout Button -->
          <div style="padding:var(--space-md)">
            <button class="btn btn-primary btn-full btn-lg" onclick="ROUTER.navigate('checkout')">
              Proceed to Checkout →
            </button>
            <button class="btn btn-ghost btn-full" style="margin-top:var(--space-sm)" onclick="ROUTER.navigate('search')">
              Continue Shopping
            </button>
          </div>
        `}

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _renderItem(item) {
    const prod = DATA.dresses.find(d => d.id === item.productId) ||
                 DATA.accessories.find(a => a.id === item.productId);
    if (!prod) return '';
    const isAccessory = DATA.accessories.some(a => a.id === item.productId);
    return `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-img">${isAccessory ? prod.icon : prod.images[0]}</div>
        <div class="cart-item-content">
          <div class="cart-item-name">${prod.name}</div>
          <div class="cart-item-meta">${prod.designer || ''}</div>
          ${item.customizations ? `
            <div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:2px">
              ${Object.entries(item.customizations).slice(0, 3).map(([k, v]) =>
                typeof v === 'string' ? `<span class="chip chip-pink" style="font-size:0.7rem">${v}</span>` : ''
              ).join('')}
            </div>
          ` : ''}
          <div class="cart-item-price price-tag">${UTILS.formatPrice(prod.price)}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="CART.updateQty('${item.id}', -1)">−</button>
            <span class="qty-value" id="qty-${item.id}">${item.qty}</span>
            <button class="qty-btn" onclick="CART.updateQty('${item.id}', 1)">+</button>
            <button class="btn btn-ghost btn-sm" style="margin-left:auto;color:var(--error)"
                    onclick="CART.removeItem('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `;
  },

  updateQty(itemId, delta) {
    const item = STATE.cart.find(i => i.id === itemId);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    STORE.save();
    UI.updateNavBadges();
    // Update qty display
    const qtyEl = document.getElementById('qty-' + itemId);
    if (qtyEl) qtyEl.textContent = item.qty;
    // Update totals
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl    = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = UTILS.formatPrice(getCartTotal());
    if (totalEl)    totalEl.textContent    = UTILS.formatPrice(Math.max(0, getCartTotal() - this._discount));
  },

  removeItem(itemId) {
    removeFromCart(itemId);
    const el = document.getElementById('cart-item-' + itemId);
    if (el) { el.style.opacity = '0'; el.style.height = '0'; el.style.overflow = 'hidden'; }
    setTimeout(() => this.render(), 300);
  },

  applyCoupon() {
    const code = document.getElementById('coupon-input').value.trim().toUpperCase();
    const coupons = { 'BRIDE10': 0.10, 'VESTIQUE20': 0.20, 'FIRST15': 0.15 };
    if (coupons[code]) {
      this._coupon = code;
      this._discount = Math.round(getCartTotal() * coupons[code]);
      UI.toast(`Coupon "${code}" applied! ${(coupons[code]*100)}% off 🎉`, 'success');
      this.render();
    } else {
      UI.toast('Invalid coupon code', 'error');
    }
  },
};
