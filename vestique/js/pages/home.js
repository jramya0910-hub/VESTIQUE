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
