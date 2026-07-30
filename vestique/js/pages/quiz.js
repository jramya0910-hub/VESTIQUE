/* ============================================================
   VESTIQUE – "Find My Style" Quiz Page
   ============================================================ */

const QUIZ = {
  _step: 0,
  _answers: {},

  _questions: [
    {
      key: 'tradition',
      q: 'What is your wedding tradition?',
      emoji: '🕌',
      options: [], // filled dynamically at render time
    },
    {
      key: 'style',
      q: 'What style speaks to you most?',
      emoji: '✨',
      options: ['Traditional & Classic', 'Modern & Fusion', 'Minimalist & Elegant', 'Maximalist & Grand', 'Vintage & Royal'],
    },
    {
      key: 'fabric',
      q: 'Which fabric do you love most?',
      emoji: '🧵',
      options: ['Pure Silk', 'Georgette', 'Satin & Lace', 'Cotton-Silk Blend', 'Net & Embroidered'],
    },
    {
      key: 'color',
      q: 'Pick your dream bridal color palette:',
      emoji: '🎨',
      options: ['Deep Reds & Burgundy', 'Gold & Champagne', 'Ivory & White', 'Pastels & Blush', 'Jewel Tones (Teal, Purple)', 'Classic Black & Navy'],
    },
    {
      key: 'budget',
      q: 'What is your bridal outfit budget?',
      emoji: '💰',
      options: ['Under ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹50,000', 'Above ₹50,000'],
    },
  ],

  render() {
    // Fill tradition options dynamically
    this._questions[0].options = DATA.traditions.map(t => t.label);
    const container = document.getElementById('page-container');
    STATE.currentPage = 'quiz';

    if (this._step >= this._questions.length) {
      this._renderResult(container);
      return;
    }

    const q = this._questions[this._step];
    const progress = Math.round((this._step / this._questions.length) * 100);

    container.innerHTML = `
      <div class="page" id="quiz-page">
        ${UI.subPageHeader('Find My Style ✨')}

        <div style="padding:var(--space-md)">
          <!-- Progress bar -->
          <div style="height:6px;background:var(--surface-2);border-radius:var(--radius-full);overflow:hidden;margin-bottom:var(--space-lg)">
            <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--gold),var(--rose-gold));border-radius:var(--radius-full);transition:width 0.4s ease"></div>
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:var(--space-lg)">
            Question ${this._step + 1} of ${this._questions.length}
          </div>

          <!-- Question -->
          <div style="text-align:center;margin-bottom:var(--space-xl)">
            <div style="font-size:3rem;margin-bottom:var(--space-md)">${q.emoji}</div>
            <div style="font-family:var(--font-display);font-size:1.3rem;line-height:1.4">${q.q}</div>
          </div>

          <!-- Options -->
          <div style="display:flex;flex-direction:column;gap:var(--space-sm)" id="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option-btn ${this._answers[q.key] === opt ? 'selected' : ''}"
                      id="qopt-${i}"
                      onclick="QUIZ.selectOption('${q.key}','${opt.replace(/'/g,"\\'")}', this)"
                      style="
                        padding:var(--space-md) var(--space-lg);
                        border:2px solid ${this._answers[q.key] === opt ? 'var(--gold)' : 'var(--border)'};
                        border-radius:var(--radius-md);
                        background:${this._answers[q.key] === opt ? 'var(--gold-light)' : 'var(--surface)'};
                        color:${this._answers[q.key] === opt ? 'var(--gold-dark)' : 'var(--text)'};
                        font-weight:${this._answers[q.key] === opt ? '700' : '500'};
                        text-align:left;font-size:0.9rem;
                        transition:all 0.2s ease;cursor:pointer;
                      ">
                ${opt}
              </button>
            `).join('')}
          </div>

          <!-- Navigation -->
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-xl)">
            ${this._step > 0 ? `
              <button class="btn btn-secondary" style="flex:1" onclick="QUIZ._step--;QUIZ.render()">← Back</button>
            ` : ''}
            <button class="btn btn-primary" style="flex:2"
                    onclick="QUIZ.nextQuestion()"
                    ${!this._answers[q.key] ? 'disabled' : ''} id="quiz-next-btn">
              ${this._step < this._questions.length - 1 ? 'Next →' : 'See My Matches ✨'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  selectOption(key, value, el) {
    this._answers[key] = value;
    // Update all option buttons visually
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.style.border = '2px solid var(--border)';
      btn.style.background = 'var(--surface)';
      btn.style.color = 'var(--text)';
      btn.style.fontWeight = '500';
    });
    el.style.border = '2px solid var(--gold)';
    el.style.background = 'var(--gold-light)';
    el.style.color = 'var(--gold-dark)';
    el.style.fontWeight = '700';
    // Enable next button
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) nextBtn.removeAttribute('disabled');
  },

  nextQuestion() {
    const q = this._questions[this._step];
    if (!this._answers[q.key]) { UI.toast('Please select an option', 'warning'); return; }
    this._step++;
    this.render();
  },

  _renderResult(container) {
    const matches = this._getMatches();
    // Save tradition preference to user if matched
    if (this._answers.tradition && STATE.currentUser) {
      const matched = DATA.traditions.find(t => t.label === this._answers.tradition);
      if (matched) STATE.currentUser.tradition = matched.id;
      STORE.save();
    }

    container.innerHTML = `
      <div class="page" id="quiz-result-page">
        ${UI.subPageHeader('Your Style Results ✨')}
        <div style="padding:var(--space-md)">

          <div style="text-align:center;padding:var(--space-lg) 0">
            <div style="font-size:3rem;margin-bottom:var(--space-md)">🎉</div>
            <div style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:var(--space-sm)">Your Perfect Matches</div>
            <div style="font-size:0.85rem;color:var(--text-muted)">Based on your preferences, here are your top picks</div>
          </div>

          <!-- Style Summary Card -->
          <div class="card" style="padding:var(--space-md);margin-bottom:var(--space-lg);background:linear-gradient(135deg,var(--gold-light),var(--blush))">
            <div style="font-weight:700;margin-bottom:var(--space-sm)">Your Style Profile</div>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm)">
              ${Object.entries(this._answers).map(([k, v]) =>
                `<span class="chip chip-gold" style="font-size:0.75rem">${v}</span>`
              ).join('')}
            </div>
          </div>

          <!-- Matched Dresses -->
          <div class="section-title" style="margin-bottom:var(--space-md)">Recommended Dresses (${matches.length})</div>
          <div class="grid-2">
            ${matches.map(d => UI.dressCard(d)).join('')}
          </div>

          <div style="margin-top:var(--space-xl);display:flex;gap:var(--space-sm)">
            <button class="btn btn-secondary" style="flex:1" onclick="QUIZ._step=0;QUIZ._answers={};QUIZ.render()">Retake Quiz</button>
            <button class="btn btn-primary" style="flex:2" onclick="ROUTER.navigate('search')">Browse All Dresses</button>
          </div>
        </div>
        <div style="height:var(--space-xl)"></div>
      </div>
    `;
  },

  _getMatches() {
    let results = [...DATA.dresses];
    const budgetMap = {
      'Under ₹15,000': [0, 15000],
      '₹15,000 – ₹30,000': [15000, 30000],
      '₹30,000 – ₹50,000': [30000, 50000],
      'Above ₹50,000': [50000, Infinity],
    };
    if (this._answers.tradition) {
      const trad = DATA.traditions.find(t => t.label === this._answers.tradition);
      if (trad) results = results.filter(d => d.tradition === trad.id);
    }
    if (this._answers.fabric) {
      const fab = this._answers.fabric;
      const partial = fab.split(' ')[0].toLowerCase();
      results = results.filter(d => d.fabric.toLowerCase().includes(partial) || results.includes(d));
    }
    if (this._answers.budget && budgetMap[this._answers.budget]) {
      const [min, max] = budgetMap[this._answers.budget];
      results = results.filter(d => d.price >= min && d.price <= max);
    }
    return results.length ? results.slice(0, 6) : DATA.dresses.slice(0, 6);
  },
};
