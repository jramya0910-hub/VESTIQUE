/* ============================================================
   VESTIQUE – Appointment Booking Page
   Book consultations with designers
   ============================================================ */

const APPOINTMENTS = {
  _selectedDesigner: null,
  _selectedDate: '',
  _selectedTime: '',
  _mode: 'video',

  render(params = {}) {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'appointments';
    if (params.designerId) this._selectedDesigner = params.designerId;
    const appointments = STATE.appointments || [];

    container.innerHTML = `
      <div class="page" id="appointments-page">
        ${UI.subPageHeader('Book Appointment 📅')}

        <!-- Designer Selector -->
        <div style="padding:var(--space-md)">
          <div class="section-title" style="margin-bottom:var(--space-md)">Choose a Designer</div>
          <div class="scroll-row" style="padding:0;margin-bottom:var(--space-lg)">
            ${DATA.designers.map(d => `
              <div style="min-width:130px;cursor:pointer" onclick="APPOINTMENTS.selectDesigner('${d.id}')">
                <div class="card" style="padding:var(--space-md);text-align:center;border:2px solid ${this._selectedDesigner === d.id ? 'var(--gold)' : 'transparent'};transition:border 0.2s">
                  <div class="avatar" style="width:48px;height:48px;margin:0 auto var(--space-sm);font-size:1.2rem;background:${this._selectedDesigner === d.id ? 'var(--gold-light)' : 'var(--surface-2)'}">${UTILS.generateAvatar(d.name)}</div>
                  <div style="font-weight:700;font-size:0.8rem">${d.name}</div>
                  <div style="font-size:0.7rem;color:var(--text-muted)">${d.location}</div>
                  <div style="font-size:0.7rem;color:var(--gold)">★ ${d.rating}</div>
                </div>
              </div>
            `).join('')}
          </div>

          ${this._selectedDesigner ? this._renderBookingForm() : `
            <div style="text-align:center;padding:var(--space-xl) 0;color:var(--text-muted);font-size:0.9rem">
              Select a designer above to book a consultation
            </div>
          `}

          <!-- My Appointments -->
          ${appointments.length > 0 ? `
          <div style="margin-top:var(--space-xl);border-top:1px solid var(--border);padding-top:var(--space-lg)">
            <div class="section-title" style="margin-bottom:var(--space-md)">My Appointments</div>
            <div style="display:flex;flex-direction:column;gap:var(--space-sm)">
              ${appointments.map((apt, i) => this._renderAppointment(apt, i)).join('')}
            </div>
          </div>
          ` : ''}
        </div>
        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _renderBookingForm() {
    const designer = DATA.designers.find(d => d.id === this._selectedDesigner);
    if (!designer) return '';

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 60);

    const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    return `
      <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-md)">
        <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);padding-bottom:var(--space-md);border-bottom:1px solid var(--border)">
          <div class="avatar" style="width:52px;height:52px;font-size:1.3rem;background:var(--gold-light)">${UTILS.generateAvatar(designer.name)}</div>
          <div>
            <div style="font-weight:700">${designer.name}</div>
            <div style="font-size:0.8rem;color:var(--text-muted)">${designer.speciality} • ${designer.location}</div>
            <div style="font-size:0.8rem;color:var(--gold)">★ ${designer.rating} • ${designer.products} designs</div>
          </div>
        </div>

        <!-- Mode selector -->
        <div class="form-group" style="margin-bottom:var(--space-md)">
          <label class="form-label">Consultation Mode</label>
          <div class="ar-mode-tabs" style="margin-top:var(--space-sm)">
            <div class="ar-mode-tab ${this._mode==='video'?'active':''}" onclick="APPOINTMENTS._mode='video';APPOINTMENTS.render({designerId:'${this._selectedDesigner}'})">
              📹 Video Call
            </div>
            <div class="ar-mode-tab ${this._mode==='inperson'?'active':''}" onclick="APPOINTMENTS._mode='inperson';APPOINTMENTS.render({designerId:'${this._selectedDesigner}'})">
              🏠 In-Person
            </div>
            <div class="ar-mode-tab ${this._mode==='chat'?'active':''}" onclick="APPOINTMENTS._mode='chat';APPOINTMENTS.render({designerId:'${this._selectedDesigner}'})">
              💬 Chat
            </div>
          </div>
        </div>

        <!-- Date picker -->
        <div class="form-group" style="margin-bottom:var(--space-md)">
          <label class="form-label">Preferred Date</label>
          <input class="form-input" id="apt-date" type="date"
                 min="${minDate.toISOString().split('T')[0]}"
                 max="${maxDate.toISOString().split('T')[0]}"
                 value="${this._selectedDate}"
                 onchange="APPOINTMENTS._selectedDate=this.value" />
        </div>

        <!-- Time slots -->
        <div class="form-group" style="margin-bottom:var(--space-lg)">
          <label class="form-label">Select Time Slot</label>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-top:var(--space-sm)">
            ${timeSlots.map(t => `
              <button style="
                padding:8px 16px;border-radius:var(--radius-full);font-size:0.82rem;font-weight:600;
                border:2px solid ${this._selectedTime===t?'var(--gold)':'var(--border)'};
                background:${this._selectedTime===t?'var(--gold-light)':'var(--surface)'};
                color:${this._selectedTime===t?'var(--gold-dark)':'var(--text-muted)'};
                cursor:pointer;transition:all 0.2s;
              " onclick="APPOINTMENTS._selectedTime='${t}'">${t}</button>
            `).join('')}
          </div>
        </div>

        <!-- Notes -->
        <div class="form-group" style="margin-bottom:var(--space-lg)">
          <label class="form-label">Notes (Optional)</label>
          <textarea class="form-input" id="apt-notes" rows="2"
                    placeholder="e.g., I want to discuss customization for my lehenga..."></textarea>
        </div>

        <button class="btn btn-primary btn-full btn-lg" onclick="APPOINTMENTS.book('${this._selectedDesigner}')">
          Confirm Appointment 📅
        </button>
      </div>
    `;
  },

  _renderAppointment(apt, idx) {
    const designer = DATA.designers.find(d => d.id === apt.designerId);
    const statusColors = { confirmed: 'var(--success)', pending: 'var(--warning)', cancelled: 'var(--error)' };
    return `
      <div class="card" style="padding:var(--space-md)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-weight:700;font-size:0.9rem">${designer?.name || 'Designer'}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${apt.date} at ${apt.time}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">${apt.mode === 'video' ? '📹 Video Call' : apt.mode === 'inperson' ? '🏠 In-Person' : '💬 Chat'}</div>
          </div>
          <span class="chip" style="background:${(statusColors[apt.status]||'var(--info)')}22;color:${statusColors[apt.status]||'var(--info)'};border-color:${statusColors[apt.status]||'var(--info)'}">
            ${apt.status === 'confirmed' ? '✓ Confirmed' : apt.status === 'pending' ? '⏳ Pending' : '✕ Cancelled'}
          </span>
        </div>
        ${apt.notes ? `<div style="font-size:0.78rem;color:var(--text-muted);margin-top:var(--space-sm);font-style:italic">"${apt.notes}"</div>` : ''}
        ${apt.status !== 'cancelled' ? `
        <button class="btn btn-ghost btn-sm" style="margin-top:var(--space-sm);color:var(--error)"
                onclick="APPOINTMENTS.cancel(${idx})">Cancel Appointment</button>
        ` : ''}
      </div>
    `;
  },

  selectDesigner(id) {
    this._selectedDesigner = id;
    this.render({ designerId: id });
  },

  book(designerId) {
    const date = document.getElementById('apt-date')?.value || this._selectedDate;
    const notes = document.getElementById('apt-notes')?.value.trim() || '';
    if (!date) { UI.toast('Please select a date', 'error'); return; }
    if (!this._selectedTime) { UI.toast('Please select a time slot', 'error'); return; }

    if (!STATE.appointments) STATE.appointments = [];
    STATE.appointments.push({
      id: 'APT-' + Date.now().toString(36).toUpperCase(),
      designerId,
      date,
      time: this._selectedTime,
      mode: this._mode,
      notes,
      status: 'confirmed',
      created: new Date().toISOString(),
    });
    STORE.save();
    // Add a notification
    STATE.notifications.unshift({
      id: 'n_apt_' + Date.now(),
      type: 'appointment',
      icon: '📅',
      title: 'Appointment Confirmed!',
      desc: `Your consultation with ${DATA.designers.find(d => d.id === designerId)?.name} is on ${date} at ${this._selectedTime}`,
      time: 'Just now',
      unread: true,
    });
    UI.updateNavBadges();
    this._selectedTime = '';
    this._selectedDate = '';
    UI.toast('Appointment booked! 📅', 'success');
    this.render({ designerId });
  },

  cancel(idx) {
    if (!STATE.appointments?.[idx]) return;
    STATE.appointments[idx].status = 'cancelled';
    STORE.save();
    UI.toast('Appointment cancelled');
    this.render();
  },
};
