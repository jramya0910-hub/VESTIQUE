/* ============================================================
   VESTIQUE – Lookbook Page
   Save & name custom outfit collections
   ============================================================ */

const LOOKBOOK = {

  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'lookbook';
    const books = STATE.lookbooks || [];

    container.innerHTML = `
      <div class="page" id="lookbook-page">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <div>
            <h2 style="font-family:var(--font-display);font-size:1.4rem">📖 My Lookbooks</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px">Create named outfit collections</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="LOOKBOOK.showCreateModal()">+ New Lookbook</button>
        </div>

        ${books.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📖</div>
            <div class="empty-title">No Lookbooks Yet</div>
            <div class="empty-desc">Create a lookbook to save and organise your favourite outfit combinations</div>
            <button class="btn btn-primary btn-sm" onclick="LOOKBOOK.showCreateModal()">Create Your First Lookbook</button>
          </div>
        ` : `
          <div style="padding:var(--space-md);display:flex;flex-direction:column;gap:var(--space-md)">
            ${books.map((book, idx) => this._renderBook(book, idx)).join('')}
          </div>
        `}

        <!-- Quick add from wishlist -->
        ${STATE.wishlist.length > 0 ? `
        <div style="padding:var(--space-md);border-top:1px solid var(--border)">
          <div class="section-title" style="margin-bottom:var(--space-md)">Add from Wishlist</div>
          <div class="scroll-row" style="padding:0">
            ${STATE.wishlist.slice(0, 8).map(id => {
              const d = DATA.dresses.find(dr => dr.id === id);
              if (!d) return '';
              return `
                <div style="min-width:120px;cursor:pointer" onclick="LOOKBOOK.quickAdd('${d.id}')">
                  <div class="card" style="padding:var(--space-sm);text-align:center">
                    <div style="font-size:2.5rem">${d.images[0]}</div>
                    <div style="font-size:0.72rem;font-weight:600;margin-top:4px">${d.name.split(' ').slice(0,3).join(' ')}</div>
                    <div style="font-size:0.7rem;color:var(--gold)">+ Add</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}

        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _renderBook(book, idx) {
    const dresses = (book.dressIds || [])
      .map(id => DATA.dresses.find(d => d.id === id))
      .filter(Boolean);

    return `
      <div class="card" style="overflow:visible">
        <div style="padding:var(--space-md)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-sm)">
            <div>
              <div style="font-family:var(--font-display);font-size:1.1rem">${book.name}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${dresses.length} outfit${dresses.length !== 1 ? 's' : ''} • ${book.occasion || 'Wedding'}</div>
            </div>
            <div style="display:flex;gap:var(--space-sm)">
              <button class="btn btn-secondary btn-sm" onclick="LOOKBOOK.showAddToBooksModal('${idx}')">+ Add</button>
              <button class="btn btn-ghost btn-sm" style="color:var(--error)" onclick="LOOKBOOK.deleteBook(${idx})">🗑️</button>
            </div>
          </div>

          ${dresses.length === 0 ? `
            <div style="text-align:center;padding:var(--space-lg);color:var(--text-light);font-size:0.85rem;border:2px dashed var(--border);border-radius:var(--radius-md)">
              No outfits yet — tap "+ Add" to start
            </div>
          ` : `
            <div class="scroll-row" style="padding:0;gap:var(--space-sm)">
              ${dresses.map(d => `
                <div style="min-width:110px;position:relative">
                  <div class="card" style="padding:var(--space-sm);text-align:center;cursor:pointer" onclick="ROUTER.navigate('dress-detail',{id:'${d.id}'})">
                    <div style="font-size:2.5rem">${d.images[0]}</div>
                    <div style="font-size:0.7rem;font-weight:600;margin-top:4px">${d.name.split(' ').slice(0,3).join(' ')}</div>
                    <div style="font-size:0.7rem;color:var(--gold)">${UTILS.formatPrice(d.price)}</div>
                  </div>
                  <button style="position:absolute;top:-6px;right:-6px;background:var(--error);color:white;border:none;border-radius:50%;width:20px;height:20px;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1"
                          onclick="LOOKBOOK.removeDressFromBook(${idx},'${d.id}')">✕</button>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:var(--space-md);display:flex;gap:var(--space-sm)">
              <button class="btn btn-primary btn-sm" style="flex:1"
                      onclick="LOOKBOOK.addAllToCart(${idx})">🛍️ Add All to Cart</button>
              <button class="btn btn-secondary btn-sm" style="flex:1"
                      onclick="LOOKBOOK.shareBook(${idx})">🔗 Share</button>
            </div>
          `}
        </div>
      </div>
    `;
  },

  showCreateModal() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Create New Lookbook</div>
        <div class="form-group">
          <label class="form-label">Lookbook Name</label>
          <input class="form-input" id="book-name" placeholder="e.g., My Wedding Day Outfits" />
        </div>
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">Occasion</label>
          <select class="form-select" id="book-occasion">
            <option>Wedding Day</option>
            <option>Reception</option>
            <option>Mehendi</option>
            <option>Sangeet</option>
            <option>Engagement</option>
            <option>Post Wedding</option>
          </select>
        </div>
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">Notes (optional)</label>
          <textarea class="form-input" id="book-notes" rows="2" placeholder="Any notes about this collection..."></textarea>
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:var(--space-lg)" onclick="LOOKBOOK.createBook()">
          Create Lookbook
        </button>
      </div>
    `);
  },

  createBook() {
    const name = document.getElementById('book-name')?.value.trim();
    const occasion = document.getElementById('book-occasion')?.value;
    const notes = document.getElementById('book-notes')?.value.trim();
    if (!name) { UI.toast('Please enter a lookbook name', 'error'); return; }
    if (!STATE.lookbooks) STATE.lookbooks = [];
    STATE.lookbooks.push({ name, occasion, notes, dressIds: [], created: new Date().toISOString() });
    STORE.save();
    UI.hideModal();
    UI.toast(`Lookbook "${name}" created! 📖`, 'success');
    this.render();
  },

  deleteBook(idx) {
    if (!STATE.lookbooks) return;
    const name = STATE.lookbooks[idx]?.name;
    STATE.lookbooks.splice(idx, 1);
    STORE.save();
    UI.toast(`"${name}" deleted`);
    this.render();
  },

  showAddToBooksModal(bookIdx) {
    // Show all dresses to add
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Add Outfit to Lookbook</div>
        <div style="max-height:55vh;overflow-y:auto;display:flex;flex-direction:column;gap:var(--space-sm)">
          ${DATA.dresses.map(d => {
            const already = STATE.lookbooks?.[bookIdx]?.dressIds?.includes(d.id);
            return `
              <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-sm);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;opacity:${already?0.5:1}"
                   onclick="${already ? '' : `LOOKBOOK.addToBook(${bookIdx},'${d.id}')`}">
                <div style="font-size:2rem">${d.images[0]}</div>
                <div style="flex:1">
                  <div style="font-weight:600;font-size:0.85rem">${d.name}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted)">${d.designer}</div>
                </div>
                <span class="chip ${already ? 'chip-muted' : 'chip-gold'}" style="font-size:0.7rem">${already ? '✓ Added' : '+ Add'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `);
    this._currentBookIdx = bookIdx;
  },

  _currentBookIdx: null,

  addToBook(bookIdx, dressId) {
    if (!STATE.lookbooks?.[bookIdx]) return;
    if (!STATE.lookbooks[bookIdx].dressIds) STATE.lookbooks[bookIdx].dressIds = [];
    if (STATE.lookbooks[bookIdx].dressIds.includes(dressId)) { UI.toast('Already in this lookbook'); return; }
    STATE.lookbooks[bookIdx].dressIds.push(dressId);
    STORE.save();
    UI.hideModal();
    UI.toast('Outfit added to lookbook! 📖', 'success');
    this.render();
  },

  removeDressFromBook(bookIdx, dressId) {
    if (!STATE.lookbooks?.[bookIdx]) return;
    STATE.lookbooks[bookIdx].dressIds = STATE.lookbooks[bookIdx].dressIds.filter(id => id !== dressId);
    STORE.save();
    this.render();
  },

  quickAdd(dressId) {
    const books = STATE.lookbooks || [];
    if (books.length === 0) {
      UI.toast('Create a lookbook first!', 'warning');
      this.showCreateModal();
      return;
    }
    // Add to first lookbook
    if (!books[0].dressIds) books[0].dressIds = [];
    if (books[0].dressIds.includes(dressId)) { UI.toast('Already in your lookbook'); return; }
    books[0].dressIds.push(dressId);
    STORE.save();
    UI.toast(`Added to "${books[0].name}" 📖`, 'success');
    this.render();
  },

  addAllToCart(bookIdx) {
    const book = STATE.lookbooks?.[bookIdx];
    if (!book) return;
    let added = 0;
    (book.dressIds || []).forEach(id => {
      addToCart(id, 1, null, 'dress');
      added++;
    });
    UI.toast(`${added} outfit${added!==1?'s':''} added to cart! 🛍️`, 'success');
  },

  shareBook(bookIdx) {
    const book = STATE.lookbooks?.[bookIdx];
    if (!book) return;
    const text = `Check out my "${book.name}" lookbook on Vestique! ${book.dressIds?.length || 0} beautiful outfits curated for ${book.occasion || 'my wedding'}.`;
    if (navigator.share) {
      navigator.share({ title: book.name, text });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => UI.toast('Lookbook link copied! 🔗', 'success'));
    } else {
      UI.toast('Share: ' + text);
    }
  },
};
