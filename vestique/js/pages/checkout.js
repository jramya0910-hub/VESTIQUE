/* ============================================================
   VESTIQUE – Checkout Page
   ============================================================ */

const CHECKOUT = {
  _step: 1,
  _address: {},
  _payment: 'cod',

  render() {
    const container = document.getElementById('page-container');
    const user = STATE.currentUser;
    const total = getCartTotal();

    container.innerHTML = `
      <div class="page" id="checkout-page">
        ${UI.subPageHeader('Checkout')}

        <!-- Steps -->
        <div class="steps" style="padding:var(--space-md)">
          <div class="step ${this._step >= 1 ? 'active' : ''} ${this._step > 1 ? 'done' : ''}">
            <div class="step-dot">${this._step > 1 ? '✓' : '1'}</div>
            <div class="step-label">Address</div>
          </div>
          <div class="step ${this._step >= 2 ? 'active' : ''} ${this._step > 2 ? 'done' : ''}">
            <div class="step-dot">${this._step > 2 ? '✓' : '2'}</div>
            <div class="step-label">Payment</div>
          </div>
          <div class="step ${this._step >= 3 ? 'active' : ''}">
            <div class="step-dot">3</div>
            <div class="step-label">Review</div>
          </div>
        </div>

        <!-- Step Content -->
        <div id="checkout-step-content">
          ${this._renderStep()}
        </div>
      </div>
    `;
  },

  _renderStep() {
    if (this._step === 1) return this._renderAddressStep();
    if (this._step === 2) return this._renderPaymentStep();
    if (this._step === 3) return this._renderReviewStep();
    return '';
  },

  _renderAddressStep() {
    const a = this._address;
    return `
      <div style="padding:var(--space-md)" class="stagger">
        <div class="section-title" style="margin-bottom:var(--space-md)">Delivery Address</div>

        ${STATE.addresses && STATE.addresses.length ? `
          <div style="margin-bottom:var(--space-md)">
            <div class="section-title" style="font-size:0.8rem;margin-bottom:var(--space-sm)">Saved Addresses</div>
            ${STATE.addresses.map((addr, i) => `
              <div class="payment-option ${i===0?'selected':''}" onclick="CHECKOUT.useSavedAddress(${i}, this)">
                <div class="payment-radio"><div></div></div>
                <div>
                  <div style="font-weight:600">${addr.name}</div>
                  <div style="font-size:0.8rem;color:var(--text-muted)">${addr.line1}, ${addr.city}, ${addr.state} ${addr.pin}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="form-group"><label class="form-label">Full Name</label>
          <input class="form-input" id="addr-name" value="${a.name || (STATE.currentUser?.name || '')}" /></div>
        <div class="form-group" style="margin-top:var(--space-md)"><label class="form-label">Address Line 1</label>
          <input class="form-input" id="addr-line1" value="${a.line1 || ''}" placeholder="House/Flat no, Building name" /></div>
        <div class="form-group" style="margin-top:var(--space-md)"><label class="form-label">Address Line 2</label>
          <input class="form-input" id="addr-line2" value="${a.line2 || ''}" placeholder="Street, Area, Landmark" /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-top:var(--space-md)">
          <div class="form-group"><label class="form-label">City</label>
            <input class="form-input" id="addr-city" value="${a.city || ''}" placeholder="City" /></div>
          <div class="form-group"><label class="form-label">State</label>
            <input class="form-input" id="addr-state" value="${a.state || ''}" placeholder="State" /></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-top:var(--space-md)">
          <div class="form-group"><label class="form-label">PIN Code</label>
            <input class="form-input" id="addr-pin" value="${a.pin || ''}" placeholder="6-digit PIN" /></div>
          <div class="form-group"><label class="form-label">Phone</label>
            <input class="form-input" id="addr-phone" type="tel" value="${a.phone || (STATE.currentUser?.phone || '')}" placeholder="Mobile" /></div>
        </div>
        <div class="form-group" style="margin-top:var(--space-md)"><label class="form-label">Delivery Instructions (Optional)</label>
          <input class="form-input" id="addr-note" value="${a.note || ''}" placeholder="E.g., Leave at door, Call before delivery" /></div>

        <button class="btn btn-primary btn-full btn-lg" style="margin-top:var(--space-xl)" onclick="CHECKOUT.nextStep()">
          Continue to Payment →
        </button>
      </div>
    `;
  },

  _renderPaymentStep() {
    const payments = [
      { id: 'upi',    icon: '📱', label: 'UPI Payment',     desc: 'Pay via any UPI app' },
      { id: 'card',   icon: '💳', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, Rupay' },
      { id: 'netbanking', icon: '🏦', label: 'Net Banking', desc: 'All major banks supported' },
      { id: 'cod',    icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
    ];
    return `
      <div style="padding:var(--space-md)" class="stagger">
        <div class="section-title" style="margin-bottom:var(--space-md)">Choose Payment Method</div>

        ${payments.map(p => `
          <div class="payment-option ${this._payment === p.id ? 'selected' : ''}"
               onclick="CHECKOUT.selectPayment('${p.id}', this)">
            <div class="payment-radio"></div>
            <div class="payment-icon">${p.icon}</div>
            <div>
              <div class="payment-label">${p.label}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${p.desc}</div>
            </div>
          </div>
        `).join('')}

        ${this._payment === 'upi' ? `
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">UPI ID</label>
          <input class="form-input" id="upi-id" placeholder="yourupi@bank" />
        </div>` : ''}
        ${this._payment === 'card' ? `
        <div style="margin-top:var(--space-md)">
          <div class="form-group"><label class="form-label">Card Number</label>
            <input class="form-input" placeholder="1234 5678 9012 3456" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-top:var(--space-sm)">
            <div class="form-group"><label class="form-label">Expiry</label>
              <input class="form-input" placeholder="MM/YY" /></div>
            <div class="form-group"><label class="form-label">CVV</label>
              <input class="form-input" placeholder="***" type="password" /></div>
          </div>
        </div>` : ''}

        <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-xl)">
          <button class="btn btn-secondary" style="flex:1" onclick="CHECKOUT._step=1;CHECKOUT.render()">← Back</button>
          <button class="btn btn-primary" style="flex:2" onclick="CHECKOUT.nextStep()">Review Order →</button>
        </div>
      </div>
    `;
  },

  _renderReviewStep() {
    const cartItems = STATE.cart;
    const total = getCartTotal();
    const a = this._address;
    const paymentLabels = { upi: 'UPI', card: 'Credit/Debit Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };
    return `
      <div style="padding:var(--space-md)" class="stagger">
        <div class="section-title" style="margin-bottom:var(--space-md)">Review Your Order</div>

        <!-- Items -->
        <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
          <div style="font-weight:700;margin-bottom:var(--space-sm)">${cartItems.length} Item${cartItems.length!==1?'s':''}</div>
          ${cartItems.map(item => {
            const prod = DATA.dresses.find(d => d.id === item.productId) || DATA.accessories.find(a => a.id === item.productId);
            if (!prod) return '';
            return `
              <div style="display:flex;gap:var(--space-md);align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
                <div style="font-size:1.8rem">${prod.images ? prod.images[0] : prod.icon}</div>
                <div style="flex:1">
                  <div style="font-weight:600;font-size:0.85rem">${prod.name}</div>
                  <div style="font-size:0.78rem;color:var(--text-muted)">Qty: ${item.qty}</div>
                </div>
                <div style="font-weight:700">${UTILS.formatPrice(prod.price * item.qty)}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Address -->
        <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
          <div style="font-weight:700;margin-bottom:var(--space-sm)">Delivery Address</div>
          <div style="font-size:0.875rem;color:var(--text-muted)">${a.name}</div>
          <div style="font-size:0.875rem;color:var(--text-muted)">${a.line1}${a.line2 ? ', ' + a.line2 : ''}</div>
          <div style="font-size:0.875rem;color:var(--text-muted)">${a.city}, ${a.state} – ${a.pin}</div>
          <div style="font-size:0.875rem;color:var(--text-muted)">📞 ${a.phone}</div>
        </div>

        <!-- Payment -->
        <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
          <div style="font-weight:700;margin-bottom:var(--space-sm)">Payment</div>
          <div style="font-size:0.875rem;color:var(--text-muted)">${paymentLabels[this._payment] || 'Not selected'}</div>
        </div>

        <!-- Total -->
        <div class="cart-summary">
          <div class="summary-row"><span>Subtotal</span><span>${UTILS.formatPrice(total)}</span></div>
          <div class="summary-row"><span>Shipping</span><span style="color:var(--success)">FREE</span></div>
          <div class="summary-row total"><span>Total Amount</span><span>${UTILS.formatPrice(total)}</span></div>
        </div>

        <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-lg)">
          <button class="btn btn-secondary" style="flex:1" onclick="CHECKOUT._step=2;CHECKOUT.render()">← Back</button>
          <button class="btn btn-accent btn-lg gold-pulse" style="flex:2" onclick="CHECKOUT.placeOrder()">
            Place Order 🎉
          </button>
        </div>
      </div>
    `;
  },

  nextStep() {
    if (this._step === 1) {
      const name  = document.getElementById('addr-name')?.value.trim();
      const line1 = document.getElementById('addr-line1')?.value.trim();
      const city  = document.getElementById('addr-city')?.value.trim();
      const state = document.getElementById('addr-state')?.value.trim();
      const pin   = document.getElementById('addr-pin')?.value.trim();
      const phone = document.getElementById('addr-phone')?.value.trim();
      if (!name || !line1 || !city || !state || !pin || !phone) {
        UI.toast('Please fill in all required address fields', 'error'); return;
      }
      this._address = {
        name, line1,
        line2: document.getElementById('addr-line2')?.value.trim() || '',
        city, state, pin, phone,
        note: document.getElementById('addr-note')?.value.trim() || '',
      };
      // Save address for future
      if (!STATE.addresses.some(a => a.line1 === line1)) {
        STATE.addresses.push(this._address);
        STORE.save();
      }
    }
    this._step++;
    this.render();
  },

  selectPayment(id, el) {
    this._payment = id;
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this._renderPaymentStep();
    this.render();
  },

  useSavedAddress(idx, el) {
    this._address = STATE.addresses[idx];
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  },

  placeOrder() {
    const orderId = UTILS.orderId();
    const order = {
      id: orderId,
      items: [...STATE.cart],
      address: this._address,
      payment: this._payment,
      total: getCartTotal(),
      status: 'confirmed',
      statuses: [{ status: 'Order Confirmed', time: new Date().toLocaleString() }],
      date: new Date().toISOString(),
    };
    STATE.orders.push(order);
    STATE.cart = [];
    STORE.save();
    UI.updateNavBadges();
    this._step = 1;
    this._address = {};
    ROUTER.navigate('checkout-success', { orderId });
  },

  renderSuccess(params = {}) {
    const container = document.getElementById('page-container');
    const orderId = params.orderId || 'VTQ-XXXXXX';
    container.innerHTML = `
      <div class="page order-success">
        <div class="order-success-icon">🎉</div>
        <h1 class="order-success-title">Order Placed!</h1>
        <p style="color:var(--text-muted);margin-bottom:var(--space-lg)">
          Your bridal look is on its way. We'll keep you updated at every step.
        </p>
        <div class="order-id">${orderId}</div>
        <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;justify-content:center">
          <button class="btn btn-primary" onclick="ROUTER.navigate('orders')">Track Order</button>
          <button class="btn btn-secondary" onclick="ROUTER.navigate('home')">Continue Shopping</button>
        </div>
      </div>
    `;
  },
};
