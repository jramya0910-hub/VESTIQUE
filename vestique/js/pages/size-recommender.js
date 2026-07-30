/* ============================================================
   VESTIQUE – Size Recommender
   Input measurements → recommended size + matching dresses
   ============================================================ */

const SIZE_RECOMMENDER = {

  render() {
    const container = document.getElementById('page-container');
    STATE.currentPage = 'size-recommender';

    const saved = STATE.currentUser?.measurements || {};

    container.innerHTML = `
      <div class="page" id="size-rec-page">
        ${UI.subPageHeader('Size Recommender 📏')}

        <div style="padding:var(--space-md)">

          <!-- Intro card -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-lg);background:linear-gradient(135deg,var(--gold-light),var(--blush));border:none">
            <div style="font-size:2rem;margin-bottom:var(--space-sm)">📏</div>
            <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Find Your Perfect Fit</div>
            <div style="font-size:0.82rem;color:var(--text-muted)">Enter your body measurements and we'll recommend the ideal size and matching dresses for you.</div>
          </div>

          <!-- Measurement inputs -->
          <div class="section-title" style="margin-bottom:var(--space-md)">Your Measurements</div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-md)">
            ${[
              { id: 'bust',   label: 'Bust (inches)',  icon: '👚', placeholder: 'e.g. 34',  val: saved.bust  || '' },
              { id: 'waist',  label: 'Waist (inches)', icon: '⬚',  placeholder: 'e.g. 28',  val: saved.waist || '' },
              { id: 'hip',    label: 'Hip (inches)',   icon: '👗', placeholder: 'e.g. 38',  val: saved.hip   || '' },
              { id: 'height', label: 'Height (ft)',    icon: '📐', placeholder: 'e.g. 5.4', val: saved.height|| '' },
            ].map(f => `
              <div class="form-group">
                <label class="form-label">${f.icon} ${f.label}</label>
                <input class="form-input" id="meas-${f.id}" type="number" step="0.1"
                       placeholder="${f.placeholder}" value="${f.val}"
                       style="padding:10px 14px" />
              </div>
            `).join('')}
          </div>

          <button class="btn btn-primary btn-full btn-lg" onclick="SIZE_RECOMMENDER.calculate()">
            📏 Get My Size
          </button>

          <!-- Results -->
          <div id="size-results" style="margin-top:var(--space-xl)"></div>

          <!-- Size guide reference -->
          <div style="margin-top:var(--space-xl)">
            <div class="section-title" style="margin-bottom:var(--space-md)">Size Guide Reference</div>
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:0.8rem">
                <thead>
                  <tr style="background:var(--gold-light)">
                    ${['Size','Bust','Waist','Hip','Height'].map(h=>`<th style="padding:8px 10px;text-align:left;font-weight:700;border-bottom:2px solid var(--gold);white-space:nowrap">${h}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${[
                    ['XS',  '30–32','24–26','33–35',"4'10\"–5'2\""],
                    ['S',   '32–34','26–28','35–37',"5'1\"–5'4\""],
                    ['M',   '34–36','28–30','37–39',"5'3\"–5'6\""],
                    ['L',   '36–38','30–32','39–41',"5'5\"–5'8\""],
                    ['XL',  '38–40','32–34','41–43',"5'7\"–5'10\""],
                    ['XXL', '40–42','34–36','43–45',"5'9\"–6'0\""],
                  ].map((row,i)=>`
                    <tr style="background:${i%2?'var(--surface-2)':'var(--surface)'}">
                      ${row.map(c=>`<td style="padding:8px 10px;border-bottom:1px solid var(--border);white-space:nowrap">${c}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  calculate() {
    const bust   = parseFloat(document.getElementById('meas-bust')?.value)   || 0;
    const waist  = parseFloat(document.getElementById('meas-waist')?.value)  || 0;
    const hip    = parseFloat(document.getElementById('meas-hip')?.value)    || 0;
    const height = parseFloat(document.getElementById('meas-height')?.value) || 0;

    if (!bust && !waist && !hip) {
      UI.toast('Please enter at least bust, waist and hip measurements', 'error');
      return;
    }

    // Size determination based on bust (primary) with waist/hip confirmation
    const sizeChart = [
      { size: 'XS',  bust: [28,32], waist: [22,26], hip: [31,35] },
      { size: 'S',   bust: [32,34], waist: [26,28], hip: [35,37] },
      { size: 'M',   bust: [34,36], waist: [28,30], hip: [37,39] },
      { size: 'L',   bust: [36,38], waist: [30,32], hip: [39,41] },
      { size: 'XL',  bust: [38,40], waist: [32,34], hip: [41,43] },
      { size: 'XXL', bust: [40,44], waist: [34,38], hip: [43,47] },
    ];

    let recommended = null;
    let score = -1;
    for (const entry of sizeChart) {
      let s = 0;
      if (bust  && bust  >= entry.bust[0]  && bust  <= entry.bust[1])  s += 3;
      if (waist && waist >= entry.waist[0] && waist <= entry.waist[1]) s += 2;
      if (hip   && hip   >= entry.hip[0]   && hip   <= entry.hip[1])   s += 2;
      if (s > score) { score = s; recommended = entry.size; }
    }
    if (!recommended) recommended = bust > 42 ? 'XXL' : 'XS';

    // Save measurements to user profile
    if (STATE.currentUser) {
      STATE.currentUser.measurements = { bust, waist, hip, height };
      STATE.currentUser.recommendedSize = recommended;
      STORE.save();
    }

    // Find matching dresses that have this size
    const matches = DATA.dresses.filter(d =>
      d.sizes.includes(recommended) || d.sizes.includes('Free Size')
    ).slice(0, 6);

    const el = document.getElementById('size-results');
    if (!el) return;

    el.innerHTML = `
      <!-- Result Card -->
      <div class="card" style="padding:var(--space-lg);text-align:center;margin-bottom:var(--space-lg);background:linear-gradient(135deg,var(--gold-light),var(--blush));border:2px solid var(--gold)">
        <div style="font-size:0.78rem;letter-spacing:2px;color:var(--text-muted);margin-bottom:var(--space-sm)">YOUR RECOMMENDED SIZE</div>
        <div style="font-family:var(--font-display);font-size:3.5rem;color:var(--gold-dark);line-height:1;margin-bottom:var(--space-sm)">${recommended}</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">Based on your measurements • Saved to your profile</div>
        ${bust ? `
        <div style="display:flex;justify-content:center;gap:var(--space-lg);margin-top:var(--space-md)">
          ${bust  ? `<div><div style="font-weight:700">${bust}"</div><div style="font-size:0.72rem;color:var(--text-muted)">Bust</div></div>` : ''}
          ${waist ? `<div><div style="font-weight:700">${waist}"</div><div style="font-size:0.72rem;color:var(--text-muted)">Waist</div></div>` : ''}
          ${hip   ? `<div><div style="font-weight:700">${hip}"</div><div style="font-size:0.72rem;color:var(--text-muted)">Hip</div></div>` : ''}
        </div>` : ''}
      </div>

      <!-- Tip -->
      <div style="background:var(--surface-2);border-radius:var(--radius-md);padding:var(--space-md);margin-bottom:var(--space-lg);font-size:0.82rem;color:var(--text-muted);border-left:3px solid var(--gold)">
        💡 <strong>Tip:</strong> For sarees & lehengas, if you're between sizes, size up for a comfortable fit. Custom sizing is always available via the Customize option.
      </div>

      <!-- Matching dresses -->
      <div class="section-title" style="margin-bottom:var(--space-md)">Dresses Available in Size ${recommended} (${matches.length})</div>
      <div class="grid-2">
        ${matches.map(d => UI.dressCard(d)).join('')}
      </div>
    `;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    UI.toast(`Your size is ${recommended}! 📏`, 'success');
  },
};
