/* ============================================================
   VESTIQUE – Wedding Milestones Tracker
   ============================================================ */

const MILESTONES = {
  _defaults: [
    { id: 'm1',  icon: '💍', label: 'Engagement',             dueMonths: -12 },
    { id: 'm2',  icon: '📋', label: 'Set Wedding Budget',      dueMonths: -10 },
    { id: 'm3',  icon: '🏛️', label: 'Book Wedding Venue',      dueMonths: -9  },
    { id: 'm4',  icon: '👗', label: 'Choose Bridal Outfit',    dueMonths: -8  },
    { id: 'm5',  icon: '📸', label: 'Book Photographer',       dueMonths: -7  },
    { id: 'm6',  icon: '🌸', label: 'Plan Floral Decor',       dueMonths: -6  },
    { id: 'm7',  icon: '🎂', label: 'Book Wedding Caterer',    dueMonths: -5  },
    { id: 'm8',  icon: '💌', label: 'Send Invitations',        dueMonths: -3  },
    { id: 'm9',  icon: '💄', label: 'Book Makeup Artist',      dueMonths: -2  },
    { id: 'm10', icon: '💅', label: 'Pre-Wedding Shoot',       dueMonths: -1  },
    { id: 'm11', icon: '🧳', label: 'Pack Honeymoon Bag',      dueMonths: -0.25 },
    { id: 'm12', icon: '🎊', label: 'Wedding Day!',            dueMonths: 0   },
  ],

  _getMilestones() {
    if (!STATE.weddingMilestones || STATE.weddingMilestones.length === 0) {
      STATE.weddingMilestones = this._defaults.map(d => ({ ...d, done: false }));
      STORE.save();
    }
    return STATE.weddingMilestones;
  },

  render() {
    const container = document.getElementById('page-container');
    const milestones = this._getMilestones();
    const done = milestones.filter(m => m.done).length;
    const total = milestones.length;
    const pct = Math.round((done / total) * 100);

    const weddingDate = STATE.weddingDate ? new Date(STATE.weddingDate) : null;

    container.innerHTML = `
      <div class="page" id="milestones-page">
        ${UI.subPageHeader('Wedding Milestones 💍')}

        <!-- Progress Summary -->
        <div style="margin:var(--space-md);background:linear-gradient(135deg,#1a1208,#2d200d);border-radius:var(--radius-xl);padding:var(--space-lg);color:white;text-align:center">
          <div style="font-size:0.78rem;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:var(--space-sm)">WEDDING CHECKLIST</div>
          <div style="font-family:var(--font-display);font-size:2.5rem;color:var(--gold)">${done}/${total}</div>
          <div style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:var(--space-md)">milestones completed</div>
          <div style="height:8px;background:rgba(255,255,255,0.1);border-radius:var(--radius-full);overflow:hidden;margin-bottom:var(--space-sm)">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--gold),var(--rose-gold));border-radius:var(--radius-full);transition:width 0.6s ease"></div>
          </div>
          <div style="font-size:0.78rem;color:var(--gold)">${pct}% Complete</div>
          ${!weddingDate ? `
            <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-md);color:rgba(255,255,255,0.5);font-size:0.78rem;border-color:rgba(255,255,255,0.2)"
                    onclick="HOME.showCountdownSetup()">Set Wedding Date for Timeline →</button>
          ` : `<div style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-top:var(--space-sm)">📅 ${new Date(STATE.weddingDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>`}
        </div>

        <!-- Quick Stats -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-sm);margin:0 var(--space-md) var(--space-md)">
          ${[
            { label: 'Done',      val: done,        color: 'var(--success)', icon: '✅' },
            { label: 'Pending',   val: total - done, color: 'var(--warning)', icon: '⏳' },
            { label: 'Progress',  val: pct + '%',   color: 'var(--gold)',    icon: '🎯' },
          ].map(s => `
            <div class="card" style="padding:var(--space-md);text-align:center">
              <div style="font-size:1.4rem">${s.icon}</div>
              <div style="font-family:var(--font-display);font-size:1.4rem;color:${s.color}">${s.val}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Milestones List -->
        <div style="padding:0 var(--space-md)">
          <div class="section-title" style="margin-bottom:var(--space-md)">Your Checklist</div>
          <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
            ${milestones.map((m, idx) => {
              const dueDate = weddingDate
                ? new Date(weddingDate.getTime() + m.dueMonths * 30 * 24 * 60 * 60 * 1000)
                : null;
              const dueDateStr = dueDate
                ? dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';
              const isOverdue = dueDate && !m.done && new Date() > dueDate;
              return `
                <div class="card milestone-item ${m.done ? 'done' : ''}" style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-md);cursor:pointer;border-left:3px solid ${m.done ? 'var(--success)' : isOverdue ? 'var(--error)' : 'var(--border)'}"
                     onclick="MILESTONES.toggle(${idx})">
                  <div style="font-size:1.6rem;opacity:${m.done ? '0.5' : '1'}">${m.icon}</div>
                  <div style="flex:1">
                    <div style="font-weight:700;font-size:0.9rem;${m.done ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${m.label}</div>
                    ${dueDateStr ? `<div style="font-size:0.75rem;color:${isOverdue ? 'var(--error)' : 'var(--text-muted)'};margin-top:2px">${isOverdue ? '⚠️ Overdue — ' : '📅 '}${dueDateStr}</div>` : ''}
                  </div>
                  <div style="width:28px;height:28px;border-radius:50%;border:2px solid ${m.done ? 'var(--success)' : 'var(--border)'};background:${m.done ? 'var(--success)' : 'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s">
                    ${m.done ? '<span style="color:white;font-size:0.8rem">✓</span>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Add Custom Milestone -->
        <div style="padding:var(--space-md)">
          <button class="btn btn-secondary btn-full" onclick="MILESTONES.showAddModal()">
            + Add Custom Milestone
          </button>
        </div>

        <!-- Reset -->
        <div style="padding:0 var(--space-md) var(--space-2xl);text-align:center">
          <button class="btn btn-ghost btn-sm" style="color:var(--error);font-size:0.8rem"
                  onclick="MILESTONES.resetAll()">Reset All Milestones</button>
        </div>
      </div>
    `;
  },

  toggle(idx) {
    const milestones = this._getMilestones();
    milestones[idx].done = !milestones[idx].done;
    STORE.save();
    const label = milestones[idx].label;
    UI.toast(milestones[idx].done ? `✅ "${label}" completed!` : `"${label}" marked pending`, milestones[idx].done ? 'success' : 'info');
    this.render();
  },

  showAddModal() {
    UI.showModal(`
      <div>
        <div style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:var(--space-md)">Add Milestone</div>
        <div class="form-group">
          <label class="form-label">Milestone Name</label>
          <input class="form-input" id="ms-label" placeholder="e.g., Book DJ, Buy Jewellery..." />
        </div>
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">Emoji Icon</label>
          <input class="form-input" id="ms-icon" placeholder="e.g., 🎵" value="📌" maxlength="2" />
        </div>
        <div class="form-group" style="margin-top:var(--space-md)">
          <label class="form-label">Due Date (Optional)</label>
          <input class="form-input" id="ms-due" type="date" />
        </div>
        <button class="btn btn-primary btn-full" style="margin-top:var(--space-lg)" onclick="MILESTONES.addCustom()">Add Milestone</button>
      </div>
    `);
  },

  addCustom() {
    const label = document.getElementById('ms-label')?.value.trim();
    const icon  = document.getElementById('ms-icon')?.value.trim() || '📌';
    const due   = document.getElementById('ms-due')?.value;
    if (!label) { UI.toast('Please enter a milestone name', 'error'); return; }
    const milestones = this._getMilestones();
    milestones.push({ id: 'custom_' + Date.now(), icon, label, done: false, dueDate: due || null, dueMonths: 0, custom: true });
    STORE.save();
    UI.hideModal();
    UI.toast(`Milestone "${label}" added ✓`, 'success');
    this.render();
  },

  resetAll() {
    STATE.weddingMilestones = this._defaults.map(d => ({ ...d, done: false }));
    STORE.save();
    UI.toast('Milestones reset', 'info');
    this.render();
  },
};
