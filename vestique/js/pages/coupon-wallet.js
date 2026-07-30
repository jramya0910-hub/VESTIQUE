/* ============================================================
   VESTIQUE – Coupon Wallet
   Store, browse and apply coupons from profile
   ============================================================ */

const COUPON_WALLET = {

  // Master coupon catalogue
  _catalogue: [
    { code: 'BRIDE10',     discount: 10, type: 'percent', desc: '10% off on all orders',           minOrder: 10000, expiry: '31 Mar 2026', category: 'General',  icon: '💍' },
    { code: 'VESTIQUE20',  discount: 20, type: 'percent', desc: '20% off sitewide',                minOrder: 20000, expiry: '28 Feb 2026', category: 'Premium',  icon: '✨' },
    { code: 'FIRST15',     discount: 15, type: 'percent', desc: '15% off on your first order',     minOrder: 5000,  expiry: '31 Dec 2025', category: 'New User', icon: '🎉' },
    { code: 'LEHENGA500',  discount: 500, type: 'flat',   desc: '₹500 off on Lehengas',           minOrder: 30000, expiry: '30 Jun 2026', category: 'Lehenga',  icon: '👗' },
    { code: 'SAREE200',    discount: 200, type: 'flat',   desc: '₹200 off on Sarees',             minOrder: 12000, expiry: '30 Jun 2026', category: 'Saree',    icon: '🥻' },
    { code: 'WEDDING30',   discount: 30, type: 'percent', desc: '30% off — Wedding Season Special',minOrder: 40000, expiry: '31 May 2026', category: 'Season',   icon: '💒' },
    { code: 'GROOM15',     discount: 15, type: 'percent', desc: '15% off on Groom Wear',          minOrder: 20000, expiry: '31 Dec 2025', category: 'Groom',    icon: '🤵' },
    { code: 'FESTIVE25',   discount: 25, type: 'percent', desc: '25% off Festival Collection',    minOrder: 15000, expiry: '31 Oct 2025', category: 'Festival', icon: '🎊' },
  ],

  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'coupon-wallet';
    const saved = STATE.savedCoupons || [];
    const cartTotal = getCartTotal();

    container.innerHTML = `
      <div class="page" id="coupon-wallet-page">
        ${UI.subPageHeader('Coupon Wallet 🎁')}

        <div style="padding:var(--space-md)">

          <!-- Add custom coupon -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-lg);background:linear-gradient(135deg,var(--gold-light),var(--blush));border:none">
            <div style="font-weight:700;margin-bottom:var(--space-sm)">Have a Coupon Code?</div>
            <div style="display:flex;gap:var(--space-sm)">
              <input class="form-input" id="custom-coupon-input" placeholder="Enter coupon code..."
                     style="flex:1;text-transform:uppercase" oninput="this.value=this.value.toUpperCase()" />
              <button class="btn btn-primary btn-sm" onclick="COUPON_WALLET.addCoupon()">Add</button>
            </div>
          </div>

          <!-- Cart total reference -->
          ${cartTotal > 0 ? `
          <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:12px 16px;margin-bottom:var(--space-lg);display:flex;align-items:center;justify-content:space-between;font-size:0.85rem">
            <span style="color:var(--text-muted)">Your current cart total</span>
            <span style="font-weight:700;color:var(--gold)">${UTILS.formatPrice(cartTotal)}</span>
          </div>
          ` : ''}

          <!-- Saved coupons -->
          ${saved.length ? `
          <div class="section-title" style="margin-bottom:var(--space-md)">My Saved Coupons (${saved.length})</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-sm);margin-bottom:var(--space-xl)">
            ${saved.map(code => {
              const c = this._catalogue.find(x => x.code === code) || { code, discount: 0, type: 'percent', desc: 'Custom coupon', minOrder: 0, expiry: '—', category: 'Custom', icon: '🏷️' };
              const eligible = cartTotal >= c.minOrder;
              return this._couponCard(c, eligible, true);
            }).join('')}
          </div>
          ` : ''}

          <!-- All available coupons -->
          <div class="section-title" style="margin-bottom:var(--space-md)">All Available Coupons (${this._catalogue.length})</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
            ${this._catalogue.map(c => {
              const eligible = cartTotal >= c.minOrder;
              const alreadySaved = saved.includes(c.code);
              return this._couponCard(c, eligible, alreadySaved);
            }).join('')}
          </div>
        </div>
        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _couponCard(c, eligible, saved) {
    const cartTotal = getCartTotal();
    const savings = c.type === 'percent'
      ? UTILS.formatPrice(Math.round(cartTotal * c.discount / 100))
      : UTILS.formatPrice(c.discount);

    return `
      <div class="card" style="overflow:hidden;opacity:${eligible?1:0.75}">
        <div style="display:flex;align-items:stretch">
          <!-- Left color strip -->
          <div style="width:6px;background:${eligible?'var(--gold)':'var(--border)'};flex-shrink:0"></div>
          <!-- Coupon icon -->
          <div style="padding:var(--space-md) var(--space-sm);display:flex;align-items:center;justify-content:center;background:var(--gold-light);min-width:56px">
            <div style="font-size:1.8rem">${c.icon}</div>
          </div>
          <!-- Content -->
          <div style="flex:1;padding:var(--space-md)">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
              <div>
                <div style="font-family:monospace;font-weight:900;font-size:1rem;letter-spacing:1px;color:var(--gold-dark)">${c.code}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">${c.desc}</div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-family:var(--font-display);font-size:1.1rem;color:${eligible?'var(--success)':'var(--text-light)'};font-weight:700">
                  ${c.type==='percent'?c.discount+'%':'₹'+c.discount} OFF
                </div>
                ${eligible && cartTotal > 0 ? `<div style="font-size:0.7rem;color:var(--success)">Save ${savings}</div>` : ''}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-sm);margin-top:var(--space-sm);flex-wrap:wrap">
              <span class="chip chip-muted" style="font-size:0.68rem">Min ₹${c.minOrder.toLocaleString('en-IN')}</span>
              <span class="chip chip-muted" style="font-size:0.68rem">Expires ${c.expiry}</span>
              ${!eligible && c.minOrder > 0 ? `<span class="chip" style="font-size:0.68rem;background:var(--blush);color:var(--rose-gold);border-color:var(--rose-gold-light)">Add ₹${UTILS.formatPrice(c.minOrder - cartTotal).slice(1)} more</span>` : ''}
            </div>
            <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-sm)">
              ${eligible ? `
                <button class="btn btn-primary btn-sm" onclick="COUPON_WALLET.applyAndGoToCart('${c.code}')">
                  Apply Now
                </button>
              ` : ''}
              ${!saved ? `
                <button class="btn btn-secondary btn-sm" onclick="COUPON_WALLET.saveCoupon('${c.code}')">Save</button>
              ` : `
                <button class="btn btn-ghost btn-sm" style="color:var(--error)" onclick="COUPON_WALLET.removeSaved('${c.code}')">Remove</button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  addCoupon() {
    const code = document.getElementById('custom-coupon-input')?.value.trim().toUpperCase();
    if (!code) { UI.toast('Enter a coupon code', 'error'); return; }
    const known = this._catalogue.find(c => c.code === code);
    if (!known) { UI.toast('Invalid coupon code', 'error'); return; }
    this.saveCoupon(code);
  },

  saveCoupon(code) {
    if (!STATE.savedCoupons) STATE.savedCoupons = [];
    if (STATE.savedCoupons.includes(code)) { UI.toast('Already saved!'); return; }
    STATE.savedCoupons.push(code);
    STORE.save();
    UI.toast(`Coupon ${code} saved to wallet! 🎁`, 'success');
    this.render();
  },

  removeSaved(code) {
    if (!STATE.savedCoupons) return;
    STATE.savedCoupons = STATE.savedCoupons.filter(c => c !== code);
    STORE.save();
    this.render();
    UI.toast('Coupon removed');
  },

  applyAndGoToCart(code) {
    CART._coupon = code;
    const coupons = { BRIDE10: 0.10, VESTIQUE20: 0.20, FIRST15: 0.15, WEDDING30: 0.30, GROOM15: 0.15, FESTIVE25: 0.25, LEHENGA500: 500, SAREE200: 200 };
    const val = coupons[code];
    if (val) {
      const total = getCartTotal();
      CART._discount = val < 1 ? Math.round(total * val) : val;
      UI.toast(`Coupon "${code}" applied! 🎉`, 'success');
    }
    ROUTER.navigate('cart');
  },
};
