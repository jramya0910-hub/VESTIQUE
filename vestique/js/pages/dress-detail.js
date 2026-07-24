/* ============================================================
   VESTIQUE – Dress Detail Page
   ============================================================ */

const DRESS_DETAIL = {
  _selectedSize: null,
  _selectedColor: null,
  _galleryIdx: 0,

  render(params = {}) {
    const container = document.getElementById('page-container');
    const dress = DATA.dresses.find(d => d.id === params.id);
    if (!dress) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">Dress not found</div></div>`;
      return;
    }

    // Track this view
    trackView(dress.id);

    this._selectedSize  = dress.sizes[0];
    this._selectedColor = dress.colors[0];
    this._galleryIdx    = 0;

    const reviews  = DATA.reviews[dress.id] || [];
    const related  = DATA.dresses.filter(d => d.tradition === dress.tradition && d.id !== dress.id).slice(0, 4);
    const accessories = DATA.accessories.slice(0, 4);
    const wished   = isWishlisted(dress.id);
    const discount = dress.originalPrice ? Math.round((1 - dress.price / dress.originalPrice) * 100) : 0;

    container.innerHTML = `
      <div class="page" id="detail-page">

        ${UI.subPageHeader(dress.name,
          `<div style="display:flex;gap:var(--space-sm)">
            <button class="header-icon-btn" id="detail-wish-btn"
              onclick="toggleWishlist('${dress.id}');this.classList.toggle('active');
              this.querySelector('svg').style.fill=isWishlisted('${dress.id}')?'var(--rose-gold)':'none';
              this.querySelector('svg').style.color=isWishlisted('${dress.id}')?'var(--rose-gold)':'var(--text-muted)'"
              style="${wished ? 'color:var(--rose-gold)' : ''}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="${wished ? 'var(--rose-gold)' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
            <button class="header-icon-btn" onclick="DRESS_DETAIL.shareDress('${dress.id}')" title="Share">
              ${UTILS.svgIcon('share', 18)}
            </button>
          </div>`
        )}

        <!-- Image Gallery -->
        <div class="gallery-main" id="gallery-main">
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:8rem;background:var(--surface-2)" id="gallery-display">
            ${dress.images[0]}
          </div>
          <div class="gallery-360-btn">↻ 360°</div>
        </div>
        <div class="gallery-thumbs">
          ${dress.images.map((img, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" id="thumb-${i}"
                 onclick="DRESS_DETAIL.selectImg(${i}, '${img}')"
                 style="display:flex;align-items:center;justify-content:center;font-size:1.8rem;background:var(--surface-2)">
              ${img}
            </div>
          `).join('')}
          <div class="gallery-thumb" style="display:flex;align-items:center;justify-content:center;background:var(--surface-2);font-size:0.7rem;text-align:center;color:var(--text-muted)">More Views</div>
        </div>

        <!-- Product Info -->
        <div class="detail-info">
          <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-sm);flex-wrap:wrap">
            ${dress.badge ? `<span class="chip chip-gold">${dress.badge}</span>` : ''}
            ${discount ? `<span class="chip chip-pink">${discount}% OFF</span>` : ''}
            <span class="chip chip-muted">${DATA.categories.find(c=>c.id===dress.category)?.label || dress.category}</span>
          </div>
          <div class="detail-name">${dress.name}</div>
          <div class="detail-designer">by ${dress.designer}</div>
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-top:var(--space-sm)">
            <span style="color:var(--gold);font-size:0.9rem">★★★★★</span>
            <span style="font-size:0.85rem;color:var(--text-muted)">${dress.rating} (${dress.reviews} reviews)</span>
          </div>
          <div class="detail-price-row">
            <span class="price-tag" style="font-size:1.5rem;font-weight:700">${UTILS.formatPrice(dress.price)}</span>
            ${dress.originalPrice ? `<span class="price-old">${UTILS.formatPrice(dress.originalPrice)}</span>` : ''}
          </div>
        </div>

        <!-- Color Selection -->
        <div class="detail-section">
          <div class="detail-section-title">Color</div>
          <div class="color-swatches">
            ${dress.colors.map((c, i) => `
              <div class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c}"
                   onclick="DRESS_DETAIL.selectColor('${c}', this)"></div>
            `).join('')}
          </div>
        </div>

        <!-- Size Selection -->
        <div class="detail-section">
          <div class="detail-section-title" style="display:flex;align-items:center;gap:var(--space-sm)">
            Size
            <a style="font-size:0.75rem;color:var(--gold);cursor:pointer" onclick="DRESS_DETAIL.showSizeGuide()">Size Guide →</a>
          </div>
          <div class="size-options" id="size-options">
            ${dress.sizes.map((s, i) => `
              <button class="size-btn ${i === 0 ? 'active' : ''}"
                onclick="DRESS_DETAIL.selectSize('${s}', this)">${s}</button>
            `).join('')}
          </div>
        </div>

        <!-- Description -->
        <div class="detail-section">
          <div class="detail-section-title">Description</div>
          <div class="detail-desc">${dress.description}</div>
        </div>

        <!-- Fabric & Details -->
        <div class="detail-section">
          <div class="detail-section-title">Fabric & Details</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-top:var(--space-sm)">
            ${[
              ['Fabric', dress.fabric],
              ['Embroidery', dress.embroidery],
              ['Tradition', DATA.traditions.find(t=>t.id===dress.tradition)?.label || dress.tradition],
              ['Designer', dress.designer],
            ].map(([k,v]) => `
              <div style="background:var(--surface-2);padding:10px;border-radius:var(--radius-sm)">
                <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:2px">${k}</div>
                <div style="font-size:0.85rem;font-weight:600">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recommended Accessories -->
        <div class="detail-section">
          <div class="detail-section-title">Recommended Accessories</div>
          <div class="scroll-row" style="padding:var(--space-sm) 0">
            ${accessories.map(a => `
              <div class="card" style="min-width:130px;padding:var(--space-sm);text-align:center;cursor:pointer"
                   onclick="addToCart('${a.id}', 1, null, 'accessory'); UI.toast('${a.name} added to cart')">
                <div style="font-size:2.5rem;margin-bottom:var(--space-sm)">${a.icon}</div>
                <div style="font-size:0.78rem;font-weight:600">${a.name}</div>
                <div style="font-size:0.8rem;color:var(--gold);margin-top:4px">${UTILS.formatPrice(a.price)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Customer Reviews -->
        <div class="detail-section">
          <div class="detail-section-title" style="display:flex;align-items:center;justify-content:space-between">
            <span>Customer Reviews (${reviews.length})</span>
            <button class="btn btn-secondary btn-sm" onclick="DRESS_DETAIL.showReviewModal('${dress.id}')">
              ✍️ Write Review
            </button>
          </div>
          ${reviews.length === 0 ? `
            <div style="padding:var(--space-md) 0;text-align:center">
              <div style="font-size:2rem;opacity:0.3;margin-bottom:var(--space-sm)">⭐</div>
              <div style="color:var(--text-muted);font-size:0.85rem">Be the first to review this dress!</div>
            </div>` : ''}
          <div style="display:flex;flex-direction:column;gap:var(--space-sm);margin-top:var(--space-sm)">
            ${reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="avatar" style="width:32px;height:32px;font-size:0.85rem">${r.avatar}</div>
                  <div class="review-name">${r.name}</div>
                  <span style="color:var(--gold);font-size:0.85rem">${'★'.repeat(r.rating)}${'★'.repeat(5-r.rating).replace(/★/g,'<span style="opacity:0.25">★</span>')}</span>
                  <div class="review-date">${r.date}</div>
                </div>
                <div class="review-text">${r.text}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Related Dresses -->
        ${related.length ? `
        <div class="detail-section">
          <div class="detail-section-title">Related Dresses</div>
          <div class="scroll-row" style="padding:var(--space-sm) 0">
            ${related.map(d => `<div style="min-width:160px">${UI.dressCard(d)}</div>`).join('')}
          </div>
        </div>` : ''}

        <!-- Spacer for sticky actions -->
        <div style="height:80px"></div>

        <!-- Sticky Action Buttons -->
        <div class="detail-actions">
          <button class="btn btn-secondary" style="flex:1" onclick="ROUTER.navigate('customize', {id:'${dress.id}'})">
            ✏️ Customize
          </button>
          <button class="btn btn-ghost btn-icon" onclick="ROUTER.navigate('ar-studio');AR_STUDIO.selectDress('${dress.id}')" title="Try in AR">
            📷
          </button>
          <button class="btn btn-primary" style="flex:2" onclick="DRESS_DETAIL.addToCart('${dress.id}')">
            🛍️ Add to Cart
          </button>
        </div>

      </div>
    `;
  },

  selectImg(idx, emoji) {
    this._galleryIdx = idx;
    const display = document.getElementById('gallery-display');
    if (display) display.innerHTML = `<div style="font-size:8rem">${emoji}</div>`;
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  },

  selectSize(size, el) {
    this._selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  },

  selectColor(color, el) {
    this._selectedColor = color;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  },

  addToCart(id) {
    addToCart(id, 1, { size: this._selectedSize, color: this._selectedColor });
  },

  shareDress(id) {
    const dress = DATA.dresses.find(d => d.id === id);
    if (!dress) return;
    if (navigator.share) {
      navigator.share({
        title: dress.name,
        text: `Check out this beautiful ${dress.name} by ${dress.designer} on Vestique!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      const text = `${dress.name} by ${dress.designer} – ${UTILS.formatPrice(dress.price)} on Vestique`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => UI.toast('Link copied to clipboard! 📋', 'success'));
      } else {
        UI.toast('Share: ' + text);
      }
    }
  },

  showSizeGuide() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Size Guide</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.82rem">
            <thead>
              <tr style="background:var(--gold-light)">
                ${['Size','Bust (in)','Waist (in)','Hip (in)','Height (ft)'].map(h => `<th style="padding:8px 10px;text-align:left;font-weight:700;border-bottom:2px solid var(--gold)">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${[
                ['XS', '30–32', '24–26', '33–35', '4\'10"–5\'2"'],
                ['S',  '32–34', '26–28', '35–37', '5\'1"–5\'4"'],
                ['M',  '34–36', '28–30', '37–39', '5\'3"–5\'6"'],
                ['L',  '36–38', '30–32', '39–41', '5\'5"–5\'8"'],
                ['XL', '38–40', '32–34', '41–43', '5\'7"–5\'10"'],
                ['XXL','40–42', '34–36', '43–45', '5\'9"–6\'0"'],
              ].map((row, i) => `
                <tr style="background:${i%2?'var(--surface-2)':'var(--surface)'}">
                  ${row.map(c => `<td style="padding:8px 10px;border-bottom:1px solid var(--border)">${c}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:var(--space-md);font-size:0.78rem;color:var(--text-muted)">
          💡 Tip: If between sizes, size up for sarees & lehengas. Custom sizing available via the Customize option.
        </div>
      </div>
    `);
  },

  showReviewModal(dressId) {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Write a Review</div>
        <div class="form-group">
          <label class="form-label">Your Rating</label>
          <div id="review-stars" style="display:flex;gap:6px;margin-top:6px">
            ${[1,2,3,4,5].map(n => `
              <span style="font-size:1.8rem;cursor:pointer;color:var(--border);transition:color 0.2s"
                    id="rstar-${n}"
                    onmouseover="DRESS_DETAIL._hoverStars(${n})"
                    onmouseout="DRESS_DETAIL._hoverStars(DRESS_DETAIL._reviewRating)"
                    onclick="DRESS_DETAIL._reviewRating=${n};DRESS_DETAIL._hoverStars(${n})">★</span>
            `).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">Your Name</label>
          <input class="form-input" id="review-name" placeholder="E.g., Ananya S." />
        </div>
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">Review</label>
          <textarea class="form-input" id="review-text" rows="3"
            placeholder="Share your experience with this dress..."></textarea>
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:var(--space-lg)"
                onclick="DRESS_DETAIL.submitReview('${dressId}')">
          Submit Review
        </button>
      </div>
    `);
    this._reviewRating = 5;
    this._hoverStars(5);
  },

  _reviewRating: 5,
  _hoverStars(n) {
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById('rstar-' + i);
      if (el) el.style.color = i <= n ? 'var(--gold)' : 'var(--border)';
    }
  },

  submitReview(dressId) {
    const name = document.getElementById('review-name')?.value.trim();
    const text = document.getElementById('review-text')?.value.trim();
    if (!name || !text) { UI.toast('Please fill in all fields', 'error'); return; }
    if (!this._reviewRating) { UI.toast('Please select a rating', 'error'); return; }
    if (!DATA.reviews[dressId]) DATA.reviews[dressId] = [];
    DATA.reviews[dressId].unshift({
      name,
      avatar: name.charAt(0).toUpperCase(),
      rating: this._reviewRating,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      text,
    });
    // Update review count on dress
    const dress = DATA.dresses.find(d => d.id === dressId);
    if (dress) dress.reviews++;
    UI.hideModal();
    UI.toast('Review submitted! Thank you 🌟', 'success');
    // Refresh the reviews section
    ROUTER.navigate('dress-detail', { id: dressId });
  },
};
