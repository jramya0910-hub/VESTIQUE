/* ============================================================
   VESTIQUE – Community Upload
   Users post their own bridal photos and get likes/saves
   ============================================================ */

const COMMUNITY_UPLOAD = {
  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'community-upload';
    const posts = STATE.communityPosts || [];

    container.innerHTML = `
      <div class="page" id="community-upload-page">
        ${UI.subPageHeader('Share Your Look 📸')}

        <div style="padding:var(--space-md)">

          <!-- Upload card -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-lg)">
            <div style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:var(--space-md)">📸 Post Your Bridal Look</div>

            <!-- Photo upload -->
            <div id="upload-preview" style="width:100%;height:180px;border:2px dashed var(--border);border-radius:var(--radius-lg);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--surface-2);margin-bottom:var(--space-md);overflow:hidden;transition:border-color 0.2s"
                 onclick="document.getElementById('photo-file-input').click()"
                 onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border)'">
              <div style="font-size:2.5rem">📷</div>
              <div style="font-size:0.85rem;color:var(--text-muted);margin-top:8px">Tap to upload your bridal photo</div>
              <div style="font-size:0.72rem;color:var(--text-light);margin-top:4px">JPG, PNG – Max 5MB</div>
            </div>
            <input type="file" id="photo-file-input" accept="image/*" style="display:none" onchange="COMMUNITY_UPLOAD.handlePhoto(this)" />

            <!-- Caption -->
            <div class="form-group" style="margin-bottom:var(--space-md)">
              <label class="form-label">Caption</label>
              <textarea class="form-input" id="post-caption" rows="2" placeholder="Share your bridal story... e.g. My wedding day look 💍"></textarea>
            </div>

            <!-- Tags -->
            <div class="form-group" style="margin-bottom:var(--space-md)">
              <label class="form-label">Wedding Tradition</label>
              <select class="form-select" id="post-tradition">
                <option value="">Select tradition</option>
                ${DATA.traditions.map(t => `<option value="${t.id}">${t.emoji} ${t.label}</option>`).join('')}
              </select>
            </div>

            <!-- Dress tag -->
            <div class="form-group" style="margin-bottom:var(--space-lg)">
              <label class="form-label">Tag a Dress (Optional)</label>
              <select class="form-select" id="post-dress">
                <option value="">Select dress</option>
                ${DATA.dresses.map(d => `<option value="${d.id}">${d.images[0]} ${d.name}</option>`).join('')}
              </select>
            </div>

            <button class="btn btn-primary btn-full" onclick="COMMUNITY_UPLOAD.submit()">
              📸 Share My Look
            </button>
          </div>

          <!-- Community feed -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md)">
            <div class="section-title">Community Looks (${posts.length + DATA.inspirations.length})</div>
          </div>

          <!-- Built-in inspirations + user posts combined -->
          <div style="columns:2;column-gap:var(--space-sm)">
            ${[...posts.slice().reverse(), ...DATA.inspirations].map(item => this._postCard(item)).join('')}
          </div>

        </div>
        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _postCard(item) {
    const isUser = !!item.photoData;
    const tradition = DATA.traditions.find(t => t.id === item.tradition);
    const dress = item.dressId ? DATA.dresses.find(d => d.id === item.dressId) : null;
    const likes = item.likes + (item.extraLikes || 0);
    return `
      <div class="card" style="break-inside:avoid;margin-bottom:var(--space-sm);overflow:hidden">
        <!-- Image area -->
        <div style="width:100%;min-height:120px;background:linear-gradient(135deg,${tradition ? tradition.color+'33' : 'var(--surface-2)'},var(--surface-2));display:flex;align-items:center;justify-content:center;font-size:3rem;padding:var(--space-md)">
          ${isUser && item.photoData
            ? `<img src="${item.photoData}" style="width:100%;max-height:180px;object-fit:cover;border-radius:4px" />`
            : item.emoji || '📸'}
        </div>
        <!-- Footer -->
        <div style="padding:8px 10px">
          <div style="font-size:0.78rem;font-weight:700;margin-bottom:3px">${item.title || item.caption || 'Bridal Look'}</div>
          ${tradition ? `<div style="font-size:0.7rem;color:var(--text-muted)">${tradition.emoji} ${tradition.label}</div>` : ''}
          ${dress ? `<div style="font-size:0.7rem;color:var(--gold);cursor:pointer" onclick="ROUTER.navigate('dress-detail',{id:'${dress.id}'})">${dress.images[0]} ${dress.name.split(' ').slice(0,3).join(' ')}</div>` : ''}
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
            <span style="font-size:0.72rem;color:var(--text-muted)">♥ ${likes}</span>
            <div style="display:flex;gap:4px">
              <button style="background:none;border:none;cursor:pointer;font-size:0.9rem;padding:2px" onclick="COMMUNITY_UPLOAD.like('${item.id}', this)" title="Like">👍</button>
              ${isUser ? `<button style="background:none;border:none;cursor:pointer;font-size:0.9rem;padding:2px;color:var(--error)" onclick="COMMUNITY_UPLOAD.deletePost('${item.id}')" title="Delete">🗑️</button>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _previewPhoto: null,

  handlePhoto(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { UI.toast('File too large. Max 5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      this._previewPhoto = e.target.result;
      const preview = document.getElementById('upload-preview');
      if (preview) {
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover" />`;
      }
    };
    reader.readAsDataURL(file);
  },

  submit() {
    const caption   = document.getElementById('post-caption')?.value.trim();
    const tradition = document.getElementById('post-tradition')?.value;
    const dressId   = document.getElementById('post-dress')?.value;

    if (!caption) { UI.toast('Please add a caption', 'error'); return; }

    if (!STATE.communityPosts) STATE.communityPosts = [];
    const user = STATE.currentUser;
    const post = {
      id: 'post_' + Date.now().toString(36),
      photoData: this._previewPhoto || null,
      emoji: this._previewPhoto ? null : '📸',
      caption,
      title: caption.split('.')[0].slice(0, 40),
      tradition: tradition || null,
      dressId: dressId || null,
      author: user?.name || 'Anonymous',
      avatar: user ? UTILS.generateAvatar(user.name) : 'A',
      likes: 0,
      extraLikes: 0,
      date: new Date().toISOString(),
    };
    STATE.communityPosts.push(post);
    this._previewPhoto = null;
    STORE.save();
    UI.toast('Your look has been shared! 📸', 'success');
    this.render();
  },

  like(id, btn) {
    // Check user posts first, then inspirations
    const post = (STATE.communityPosts || []).find(p => p.id === id);
    const inspo = STATE.inspirations.find(i => i.id === id);
    const item = post || inspo;
    if (!item) return;
    item.extraLikes = (item.extraLikes || 0) + 1;
    STORE.save();
    UI.toast('Liked! 👍');
    // Update likes count in DOM
    const card = btn.closest('.card');
    if (card) {
      const likesEl = card.querySelector('span');
      if (likesEl) likesEl.textContent = `♥ ${item.likes + (item.extraLikes||0)}`;
    }
  },

  deletePost(id) {
    if (!STATE.communityPosts) return;
    STATE.communityPosts = STATE.communityPosts.filter(p => p.id !== id);
    STORE.save();
    UI.toast('Post deleted');
    this.render();
  },
};
