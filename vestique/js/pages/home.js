/* ============================================================
   VESTIQUE – Home Page
   ============================================================ */

const HOME = {
  _bannerIndex: 0,
  _bannerTimer: null,

  render() {
    const container = document.getElementById('page-container');
    const user = STATE.currentUser;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const trendingDresses = DATA.dresses.filter((_, i) => i < 6);
    const newArrivals = [...DATA.dresses].reverse().slice(0, 4);
    const recommendedDresses = this._getRecommendations();

    container.innerHTML = `
      <div class="page" id="home-page">

        <!-- Greeting -->
        <div class="home-greeting" style="padding:var(--space-md) var(--space-md) 0">
          <div class="greeting-title">${greeting}, ${user ? user.name.split(' ')[0] : 'Beautiful'} 💐</div>
          <div class="greeting-sub">Discover your perfect bridal look</div>
        </div>

        <!-- Hero Carousel -->
        <div class="section" style="padding:var(--space-md) 0 0">
          <div class="hero-carousel" id="hero-carousel">
            <div class="hero-track" id="hero-track">
              ${DATA.banners.map(b => `
                <div class="hero-slide" style="background:${b.gradient}">
                  <div class="hero-slide-content">
                    <div class="hero-slide-label">${b.label}</div>
                    <div class="hero-slide-title">${b.emoji} ${b.title}</div>
                    <div class="hero-slide-cta">${b.cta} →</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="hero-dots" id="hero-dots">
              ${DATA.banners.map((_, i) => `<div class="hero-dot ${i === 0 ? 'active' : ''}" onclick="HOME.goToBanner(${i})"></div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Shop by Category</h2>
            <span class="section-link" onclick="ROUTER.navigate('search')">See All →</span>
          </div>
          <div class="scroll-row">
            ${DATA.categories.map(cat => `
              <div class="cat-chip ${STATE.activeCategory === cat.id ? 'active' : ''}"
                   onclick="HOME.selectCategory('${cat.id}')">
                <div class="cat-chip-icon">${cat.icon}</div>
                <div class="cat-chip-label">${cat.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- AI Recommendations -->
        ${recommendedDresses.length ? `
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">✨ Recommended for You</h2>
            <span class="section-link" onclick="ROUTER.navigate('search')">View All →</span>
          </div>
          <div class="scroll-row">
            ${recommendedDresses.map(d => `
              <div style="min-width:160px">${UI.dressCard(d)}</div>
            `).join('')}
          </div>
        </div>` : ''}

        <!-- Trending -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">🔥 Trending Now</h2>
            <span class="section-link" onclick="ROUTER.navigate('search', {filter:'trending'})">View All →</span>
          </div>
          <div class="grid-2">
            ${trendingDresses.map(d => UI.dressCard(d)).join('')}
          </div>
        </div>

        <!-- Cultural Collections -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">🏮 Cultural Collections</h2>
            <span class="section-link" onclick="ROUTER.navigate('search', {filter:'all-traditions'})">See All →</span>
          </div>
          <div class="scroll-row">
            ${DATA.traditions.map(t => `
              <div class="culture-card" style="background:linear-gradient(135deg,${t.color},${t.color}88)"
                   onclick="ROUTER.navigate('tradition', {id:'${t.id}'})">
                <div class="culture-card-bg">${t.emoji}</div>
                <div class="culture-card-overlay">
                  <div class="culture-card-name">${t.label}</div>
                  <div class="culture-card-count">${t.count} designs</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- New Arrivals -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">🆕 New Arrivals</h2>
            <span class="section-link" onclick="ROUTER.navigate('search', {filter:'new'})">View All →</span>
          </div>
          <div class="scroll-row">
            ${newArrivals.map(d => `
              <div style="min-width:160px">${UI.dressCard(d)}</div>
            `).join('')}
          </div>
        </div>

        <!-- Featured Designers -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">👑 Featured Designers</h2>
          </div>
          <div class="scroll-row">
            ${DATA.designers.map(d => `
              <div class="card" style="min-width:160px;padding:var(--space-md);text-align:center;cursor:pointer"
                   onclick="ROUTER.navigate('search', {designerId:'${d.id}'})">
                <div class="avatar" style="width:56px;height:56px;margin:0 auto var(--space-sm);font-size:1.4rem">${UTILS.generateAvatar(d.name)}</div>
                <div style="font-weight:700;font-size:0.85rem">${d.name}</div>
                <div style="font-size:0.72rem;color:var(--text-muted)">${d.speciality}</div>
                <div style="font-size:0.72rem;color:var(--gold);margin-top:4px">★ ${d.rating}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Community Inspiration -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">💫 Inspiration Gallery</h2>
            <span class="section-link" onclick="ROUTER.navigate('community')">View All →</span>
          </div>
          <div class="scroll-row">
            ${STATE.inspirations.slice(0, 5).map(ins => `
              <div class="inspo-card" style="min-width:130px;cursor:pointer" onclick="ROUTER.navigate('community')">
                <div class="inspo-card-img">${ins.emoji}</div>
                <div class="inspo-card-footer">
                  <span class="inspo-likes">♥ ${ins.likes}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recently Viewed -->
        ${STATE.recentlyViewed && STATE.recentlyViewed.length > 0 ? `
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">👁️ Recently Viewed</h2>
            <span class="section-link" onclick="STATE.recentlyViewed=[];STORE.save();HOME.render()">Clear</span>
          </div>
          <div class="scroll-row">
            ${STATE.recentlyViewed.map(id => {
              const d = DATA.dresses.find(dr => dr.id === id);
              return d ? `<div style="min-width:150px">${UI.dressCard(d)}</div>` : '';
            }).join('')}
          </div>
        </div>` : ''}

        <!-- Wedding Budget Tracker -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">💰 Wedding Budget Tracker</h2>
          </div>
          <div style="margin:0 var(--space-md)">
            ${HOME._renderBudgetTracker()}
          </div>
        </div>

        <!-- Wedding Countdown -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">💍 Wedding Countdown</h2>
            <span class="section-link" onclick="HOME.showCountdownSetup()">Set Date →</span>
          </div>
          <div style="margin:0 var(--space-md)">
            ${HOME._renderCountdown()}
          </div>
        </div>

        <!-- Quick Feature Access -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">⚡ Quick Tools</h2>
            <span class="section-link" onclick="UI.showMoreMenu()">See All →</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);padding:0 var(--space-md)">
            ${[
              { icon: '✨', label: 'Style Quiz',    action: "ROUTER.navigate('quiz')",             color: 'var(--gold-light)' },
              { icon: '📖', label: 'Lookbooks',     action: "ROUTER.navigate('lookbook')",         color: 'var(--blush)' },
              { icon: '📅', label: 'Appointments',  action: "ROUTER.navigate('appointments')",     color: 'var(--rose-gold-light)' },
              { icon: '🎁', label: 'Gift Registry', action: "ROUTER.navigate('registry')",         color: 'var(--gold-light)' },
              { icon: '📏', label: 'Size Finder',   action: "ROUTER.navigate('size-recommender')", color: 'var(--blush)' },
              { icon: '💬', label: 'Ask Vee',       action: "CHATBOT.toggle()",                    color: 'var(--rose-gold-light)' },
            ].map(f => `
              <div class="card" style="padding:var(--space-md) var(--space-sm);cursor:pointer;background:${f.color};border:none;text-align:center"
                   onclick="${f.action}">
                <div style="font-size:1.6rem;margin-bottom:4px">${f.icon}</div>
                <div style="font-weight:700;font-size:0.78rem;line-height:1.3">${f.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="height:var(--space-xl)"></div>
      </div>
    `;

    this._startCarousel();
  },

  _renderBudgetTracker() {
    const cartTotal = getCartTotal();
    const budget = STATE.currentUser?.weddingBudget || 0;
    const categories = [
      { label: 'Bridal Outfit', emoji: '👗', spent: cartTotal, suggested: 50000 },
      { label: 'Jewelry',       emoji: '💍', spent: 0,          suggested: 20000 },
      { label: 'Footwear',      emoji: '👡', spent: 0,          suggested: 5000  },
      { label: 'Accessories',   emoji: '✨', spent: 0,          suggested: 8000  },
      { label: 'Groom Wear',    emoji: '🤵', spent: 0,          suggested: 35000 },
    ];
    const totalSuggested = categories.reduce((s, c) => s + c.suggested, 0);
    const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
    const pct = Math.min(100, Math.round((totalSpent / totalSuggested) * 100));
    return `
      <div class="card" style="padding:var(--space-md)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
          <div>
            <div style="font-weight:700">Total Budget Used</div>
            <div style="font-size:0.8rem;color:var(--text-muted)">${UTILS.formatPrice(totalSpent)} of ${UTILS.formatPrice(totalSuggested)} suggested</div>
          </div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--gold)">${pct}%</div>
        </div>
        <div style="height:8px;background:var(--surface-2);border-radius:var(--radius-full);overflow:hidden;margin-bottom:var(--space-md)">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--gold),var(--rose-gold));border-radius:var(--radius-full);transition:width 0.5s ease"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
          ${categories.map(c => {
            const p = Math.min(100, Math.round((c.spent / c.suggested) * 100));
            return `
              <div style="display:flex;align-items:center;gap:var(--space-sm)">
                <span style="font-size:1.2rem;width:24px">${c.emoji}</span>
                <div style="flex:1">
                  <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:3px">
                    <span style="font-weight:600">${c.label}</span>
                    <span style="color:var(--text-muted)">${UTILS.formatPrice(c.spent)} / ${UTILS.formatPrice(c.suggested)}</span>
                  </div>
                  <div style="height:5px;background:var(--surface-2);border-radius:var(--radius-full);overflow:hidden">
                    <div style="height:100%;width:${p}%;background:${p>80?'var(--error)':p>50?'var(--warning)':'var(--success)'};border-radius:var(--radius-full)"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <button class="btn btn-secondary btn-full btn-sm" style="margin-top:var(--space-md)"
                onclick="ROUTER.navigate('cart')">
          View Cart & Add Items →
        </button>
      </div>
    `;
  },

  _renderCountdown() {
    const cd = getWeddingCountdown();
    if (!cd) {
      return `
        <div class="card" style="padding:var(--space-md);text-align:center;border:2px dashed var(--border)">
          <div style="font-size:2rem;margin-bottom:var(--space-sm)">💍</div>
          <div style="font-weight:600;margin-bottom:4px">Set Your Wedding Date</div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:var(--space-md)">Track how many days until your big day!</div>
          <button class="btn btn-primary btn-sm" onclick="HOME.showCountdownSetup()">Set Wedding Date</button>
        </div>
      `;
    }
    if (cd.past) {
      return `
        <div class="card" style="padding:var(--space-md);text-align:center;background:linear-gradient(135deg,var(--gold-light),var(--blush))">
          <div style="font-size:2.5rem;margin-bottom:var(--space-sm)">🎊</div>
          <div style="font-family:var(--font-display);font-size:1.3rem">Congratulations!</div>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Your wedding day has arrived! Wishing you endless joy 💕</div>
        </div>
      `;
    }
    const dateStr = new Date(STATE.weddingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    return `
      <div class="card" style="padding:var(--space-md);background:linear-gradient(135deg,#1a1208,#2d200d);color:white;text-align:center">
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-bottom:var(--space-md)">YOUR BIG DAY</div>
        <div style="display:flex;justify-content:center;gap:var(--space-lg);margin-bottom:var(--space-md)">
          ${[
            { val: cd.days,    label: 'Days' },
            { val: cd.hours,   label: 'Hours' },
            { val: cd.minutes, label: 'Mins' },
          ].map(u => `
            <div style="text-align:center">
              <div style="font-family:var(--font-display);font-size:2.5rem;color:var(--gold);line-height:1">${u.val}</div>
              <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:1px">${u.label}</div>
            </div>
          `).join('')}
        </div>
        <div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">📅 ${dateStr}</div>
        <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-sm);color:rgba(255,255,255,0.4);font-size:0.72rem"
                onclick="HOME.showCountdownSetup()">Change Date</button>
      </div>
    `;
  },

  showCountdownSetup() {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">💍 Set Wedding Date</div>
        <div class="form-group">
          <label class="form-label">Wedding Date</label>
          <input class="form-input" id="wedding-date-input" type="date"
                 min="${minDate.toISOString().split('T')[0]}"
                 value="${STATE.weddingDate || ''}" />
        </div>
        <div style="margin-top:var(--space-lg);display:flex;gap:var(--space-sm)">
          <button class="btn btn-primary" style="flex:2" onclick="
            const d = document.getElementById('wedding-date-input').value;
            if (!d) { UI.toast('Please pick a date','error'); return; }
            STATE.weddingDate = d;
            STORE.save();
            UI.hideModal();
            UI.toast('Wedding date set! 💍', 'success');
            HOME.render();
          ">Save Date</button>
          ${STATE.weddingDate ? `<button class="btn btn-ghost" style="flex:1;color:var(--error)" onclick="STATE.weddingDate=null;STORE.save();UI.hideModal();HOME.render()">Clear</button>` : ''}
        </div>
      </div>
    `);
  },

  _getRecommendations() {
    const user = STATE.currentUser;
    if (!user || !user.tradition) return DATA.dresses.slice(0, 4);
    const byTradition = DATA.dresses.filter(d => d.tradition === user.tradition);
    return (byTradition.length >= 4 ? byTradition : DATA.dresses).slice(0, 6);
  },

  selectCategory(id) {
    STATE.activeCategory = id;
    ROUTER.navigate('category', { id });
  },

  goToBanner(idx) {
    this._bannerIndex = idx;
    this._updateCarousel();
  },

  _updateCarousel() {
    const track = document.getElementById('hero-track');
    const dots  = document.querySelectorAll('.hero-dot');
    if (!track) return;
    track.style.transform = `translateX(-${this._bannerIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === this._bannerIndex));
  },

  _startCarousel() {
    clearInterval(this._bannerTimer);
    this._bannerTimer = setInterval(() => {
      this._bannerIndex = (this._bannerIndex + 1) % DATA.banners.length;
      this._updateCarousel();
    }, 4000);
  },
};
