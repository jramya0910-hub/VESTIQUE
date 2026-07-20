/* ============================================================
   VESTIQUE – Authentication Pages
   ============================================================ */

const AUTH = {

  renderLogin() {
    document.getElementById('auth-container').innerHTML = `
      <div class="auth-page page stagger">
        <div class="auth-header">
          <div class="auth-logo"><span>V</span>estique</div>
          <div class="auth-tagline">YOUR BRIDAL FASHION DESTINATION</div>
        </div>

        <div class="auth-card auth-form">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to continue your bridal journey</p>

          <!-- Login tabs -->
          <div class="ar-mode-tabs" style="margin-bottom:var(--space-lg)">
            <div class="ar-mode-tab active" id="login-tab-email" onclick="AUTH.switchLoginTab('email')">Email</div>
            <div class="ar-mode-tab" id="login-tab-phone" onclick="AUTH.switchLoginTab('phone')">Mobile</div>
          </div>

          <!-- Email login -->
          <div id="login-email-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" id="login-email" type="email" placeholder="you@example.com" />
            </div>
            <div class="form-group" style="margin-top:var(--space-md)">
              <label class="form-label">Password</label>
              <input class="form-input" id="login-password" type="password" placeholder="Enter password" />
            </div>
            <div style="text-align:right;margin:var(--space-sm) 0">
              <a style="color:var(--gold);font-size:0.8rem;cursor:pointer" onclick="AUTH.renderForgotPassword()">Forgot Password?</a>
            </div>
            <button class="btn btn-primary btn-full btn-lg ripple" style="margin-top:var(--space-md)" onclick="AUTH.doEmailLogin()">
              Sign In
            </button>
          </div>

          <!-- Phone login -->
          <div id="login-phone-form" class="hidden">
            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <input class="form-input" id="login-phone" type="tel" placeholder="+91 9XXXXXXXXX" />
            </div>
            <button class="btn btn-primary btn-full btn-lg ripple" style="margin-top:var(--space-md)" onclick="AUTH.doPhoneLogin()">
              Send OTP
            </button>
          </div>

          <div class="divider-text" style="margin:var(--space-lg) 0;color:rgba(255,255,255,0.4)">
            <span>or continue with</span>
          </div>

          <button class="auth-social-btn" onclick="AUTH.doGoogleLogin()">
            <span style="font-size:1.2rem">G</span> Continue with Google
          </button>

          <div class="auth-switch">
            Don't have an account? <a onclick="AUTH.renderRegister()">Create Account</a>
          </div>
          <div class="auth-switch" style="margin-top:var(--space-sm)">
            Are you a designer? <a onclick="AUTH.renderDesignerLogin()">Designer Login</a>
          </div>
        </div>
      </div>
    `;
  },

  switchLoginTab(tab) {
    document.getElementById('login-tab-email').classList.toggle('active', tab === 'email');
    document.getElementById('login-tab-phone').classList.toggle('active', tab === 'phone');
    document.getElementById('login-email-form').classList.toggle('hidden', tab !== 'email');
    document.getElementById('login-phone-form').classList.toggle('hidden', tab !== 'phone');
  },

  doEmailLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;
    if (!email || !pass) { UI.toast('Please fill in all fields', 'error'); return; }
    // Simulate auth — accept any valid email
    if (!email.includes('@')) { UI.toast('Enter a valid email', 'error'); return; }
    this._loginSuccess({ name: email.split('@')[0], email, role: 'customer' });
  },

  doPhoneLogin() {
    const phone = document.getElementById('login-phone').value.trim();
    if (!phone || phone.length < 10) { UI.toast('Enter a valid mobile number', 'error'); return; }
    STATE.pendingPhone = phone;
    ROUTER.navigate('otp-verify', { phone, context: 'login' });
  },

  doGoogleLogin() {
    UI.toast('Signing in with Google...', 'success');
    setTimeout(() => {
      this._loginSuccess({ name: 'Google User', email: 'user@gmail.com', role: 'customer' });
    }, 1000);
  },

  renderDesignerLogin() {
    document.getElementById('auth-container').innerHTML = `
      <div class="auth-page page stagger">
        <div class="auth-header">
          <div class="auth-logo"><span>V</span>estique</div>
          <div class="auth-tagline">DESIGNER PORTAL</div>
        </div>
        <div class="auth-card auth-form">
          <h2 class="auth-title">Designer Login</h2>
          <p class="auth-subtitle">Manage your collections and orders</p>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" id="d-email" type="email" placeholder="designer@example.com" />
          </div>
          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Password</label>
            <input class="form-input" id="d-pass" type="password" placeholder="Enter password" />
          </div>
          <button class="btn btn-primary btn-full btn-lg ripple" style="margin-top:var(--space-lg)"
                  onclick="AUTH.doDesignerLogin()">Designer Sign In</button>
          <div class="auth-switch" style="margin-top:var(--space-md)">
            <a onclick="AUTH.renderLogin()">Back to Customer Login</a>
          </div>
        </div>
      </div>
    `;
  },

  doDesignerLogin() {
    const email = document.getElementById('d-email').value.trim();
    const pass  = document.getElementById('d-pass').value;
    if (!email || !pass) { UI.toast('Please fill in all fields', 'error'); return; }
    this._loginSuccess({ name: 'Meenakshi Couture', email, role: 'designer', designerId: 'des001' });
  },

  renderRegister() {
    document.getElementById('auth-container').innerHTML = `
      <div class="auth-page page stagger">
        <div class="auth-header">
          <div class="auth-logo"><span>V</span>estique</div>
          <div class="auth-tagline">BEGIN YOUR BRIDAL JOURNEY</div>
        </div>
        <div class="auth-card auth-form">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join thousands of brides discovering their perfect look</p>
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" id="reg-name" type="text" placeholder="Your full name" />
          </div>
          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Email Address</label>
            <input class="form-input" id="reg-email" type="email" placeholder="you@example.com" />
          </div>
          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Mobile Number</label>
            <input class="form-input" id="reg-phone" type="tel" placeholder="+91 9XXXXXXXXX" />
          </div>
          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Password</label>
            <input class="form-input" id="reg-pass" type="password" placeholder="Create a strong password" />
          </div>
          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Confirm Password</label>
            <input class="form-input" id="reg-pass2" type="password" placeholder="Confirm password" />
          </div>
          <button class="btn btn-primary btn-full btn-lg ripple" style="margin-top:var(--space-lg)" onclick="AUTH.doRegister()">
            Create Account
          </button>
          <div class="auth-switch" style="margin-top:var(--space-md)">
            Already have an account? <a onclick="AUTH.renderLogin()">Sign In</a>
          </div>
        </div>
      </div>
    `;
  },

  doRegister() {
    const name  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pass  = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    if (!name || !email || !phone) { UI.toast('Please fill in all required fields', 'error'); return; }
    if (!email.includes('@')) { UI.toast('Enter a valid email', 'error'); return; }
    if (pass !== pass2) { UI.toast('Passwords do not match', 'error'); return; }
    if (pass.length < 6) { UI.toast('Password must be at least 6 characters', 'error'); return; }
    STATE.pendingUser = { name, email, phone, role: 'customer' };
    ROUTER.navigate('otp-verify', { phone, context: 'register' });
  },

  renderOTP() {
    const params = STATE.pageParams;
    document.getElementById('auth-container').innerHTML = `
      <div class="auth-page page stagger">
        <div class="auth-header">
          <div class="auth-logo"><span>V</span>estique</div>
        </div>
        <div class="auth-card auth-form">
          <h2 class="auth-title">Verify OTP</h2>
          <p class="auth-subtitle">We sent a 6-digit code to ${params.phone || 'your phone'}</p>
          <div class="otp-inputs">
            ${[1,2,3,4,5,6].map(i => `
              <input class="otp-input" id="otp-${i}" maxlength="1" type="tel" oninput="AUTH.otpInput(this, ${i})" />
            `).join('')}
          </div>
          <button class="btn btn-primary btn-full btn-lg ripple" onclick="AUTH.verifyOTP('${params.context}')">
            Verify & Continue
          </button>
          <div class="auth-switch" style="margin-top:var(--space-lg)">
            Didn't receive? <a id="resend-otp-btn" onclick="AUTH.resendOTP()">Resend OTP</a>
          </div>
          <div class="auth-switch" style="margin-top:var(--space-sm)">
            <a onclick="AUTH.renderLogin()">← Back to Login</a>
          </div>
        </div>
      </div>
    `;
    // Auto-focus first input
    setTimeout(() => { const el = document.getElementById('otp-1'); if (el) el.focus(); }, 100);
  },

  otpInput(el, idx) {
    if (el.value && idx < 6) {
      const next = document.getElementById('otp-' + (idx + 1));
      if (next) next.focus();
    }
  },

  resendOTP() {
    UI.toast('OTP resent to your phone ✓', 'success');
    const btn = document.getElementById('resend-otp-btn');
    if (btn) { btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none'; }
    setTimeout(() => { if (btn) { btn.style.opacity = ''; btn.style.pointerEvents = ''; } }, 30000);
  },

  verifyOTP(context) {
    const otp = [1,2,3,4,5,6].map(i => {
      const el = document.getElementById('otp-' + i);
      return el ? el.value : '';
    }).join('');
    if (otp.length < 6) { UI.toast('Enter the complete 6-digit OTP', 'error'); return; }
    // Accept any 6-digit OTP in free version
    if (context === 'register' && STATE.pendingUser) {
      this._loginSuccess(STATE.pendingUser, true);
    } else {
      this._loginSuccess({ name: 'User', email: 'user@vestique.com', phone: STATE.pendingPhone, role: 'customer' });
    }
  },

  renderForgotPassword() {
    document.getElementById('auth-container').innerHTML = `
      <div class="auth-page page stagger">
        <div class="auth-header">
          <div class="auth-logo"><span>V</span>estique</div>
        </div>
        <div class="auth-card auth-form">
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-subtitle">Enter your email and we'll send a reset link</p>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input class="form-input" id="forgot-email" type="email" placeholder="you@example.com" />
          </div>
          <button class="btn btn-primary btn-full btn-lg ripple" style="margin-top:var(--space-lg)"
                  onclick="AUTH.doForgotPassword()">Send Reset Link</button>
          <div class="auth-switch" style="margin-top:var(--space-md)">
            <a onclick="AUTH.renderLogin()">← Back to Login</a>
          </div>
        </div>
      </div>
    `;
  },

  doForgotPassword() {
    const email = document.getElementById('forgot-email').value.trim();
    if (!email.includes('@')) { UI.toast('Enter a valid email', 'error'); return; }
    UI.toast('Password reset link sent! Check your email ✓', 'success');
    setTimeout(() => AUTH.renderLogin(), 2000);
  },

  renderProfileSetup() {
    document.getElementById('auth-container').innerHTML = `
      <div class="auth-page page stagger">
        <div class="auth-header">
          <div class="auth-logo"><span>V</span>estique</div>
          <div class="auth-tagline">LET'S PERSONALIZE YOUR EXPERIENCE</div>
        </div>
        <div class="auth-card auth-form">
          <h2 class="auth-title">Setup Your Profile</h2>
          <p class="auth-subtitle">Help us recommend the perfect bridal looks for you</p>

          <div class="form-group">
            <label class="form-label">Religion</label>
            <select class="form-select" id="setup-religion" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15);color:white">
              <option value="">Select Religion</option>
              <option>Hindu</option><option>Muslim</option><option>Christian</option>
              <option>Sikh</option><option>Buddhist</option><option>Jain</option><option>Other</option>
            </select>
          </div>

          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Wedding Tradition</label>
            <select class="form-select" id="setup-tradition" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15);color:white">
              <option value="">Select Tradition</option>
              ${DATA.traditions.map(t => `<option value="${t.id}">${t.label}</option>`).join('')}
            </select>
          </div>

          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Preferred Fashion Style</label>
            <div class="custom-options" style="margin-top:var(--space-sm)">
              ${['Traditional','Fusion','Modern','Minimalist','Maximalist','Classic'].map(s =>
                `<span class="custom-option" onclick="AUTH.selectStyle(this,'${s}')">${s}</span>`
              ).join('')}
            </div>
          </div>

          <div class="form-group" style="margin-top:var(--space-md)">
            <label class="form-label">Favorite Colors</label>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-top:var(--space-sm)">
              ${[
                {c:'#DC143C',n:'Red'},{c:'#FFD700',n:'Gold'},{c:'#FAD5A5',n:'Blush'},
                {c:'#FFFFF0',n:'Ivory'},{c:'#7B68EE',n:'Lavender'},{c:'#228B22',n:'Green'},
                {c:'#1B4F72',n:'Navy'},{c:'#800020',n:'Burgundy'}
              ].map(({c,n}) =>
                `<div class="color-swatch" style="background:${c};border:2px solid rgba(255,255,255,0.3)"
                      title="${n}" onclick="this.classList.toggle('active')"></div>`
              ).join('')}
            </div>
          </div>

          <button class="btn btn-primary btn-full btn-lg ripple" style="margin-top:var(--space-xl)" onclick="AUTH.saveProfile()">
            Complete Setup
          </button>
          <div style="text-align:center;margin-top:var(--space-md)">
            <a style="color:rgba(255,255,255,0.4);font-size:0.8rem;cursor:pointer" onclick="AUTH.skipSetup()">Skip for now</a>
          </div>
        </div>
      </div>
    `;
  },

  selectedStyle: null,
  selectStyle(el, style) {
    document.querySelectorAll('.custom-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedStyle = style;
  },

  saveProfile() {
    const religion  = document.getElementById('setup-religion').value;
    const tradition = document.getElementById('setup-tradition').value;
    if (STATE.currentUser) {
      STATE.currentUser.religion  = religion;
      STATE.currentUser.tradition = tradition;
      STATE.currentUser.style     = this.selectedStyle;
    }
    STORE.save();
    UI.toast('Profile setup complete! ✨', 'success');
    setTimeout(() => ROUTER.navigate('home'), 600);
  },

  skipSetup() {
    ROUTER.navigate('home');
  },

  _loginSuccess(user, isNew = false) {
    STATE.currentUser     = user;
    STATE.isAuthenticated = true;
    STORE.save();
    UI.toast(`Welcome${isNew ? '' : ' back'}, ${user.name.split(' ')[0]}! ✨`, 'success');
    if (user.role === 'designer') {
      setTimeout(() => ROUTER.navigate('designer-dashboard'), 600);
    } else if (isNew) {
      setTimeout(() => ROUTER.navigate('setup-profile'), 600);
    } else {
      setTimeout(() => ROUTER.navigate('home'), 600);
    }
  },
};
