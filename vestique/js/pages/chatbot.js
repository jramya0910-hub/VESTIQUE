/* ============================================================
   VESTIQUE – AI Bridal Chatbot
   Floating smart assistant with contextual Q&A
   ============================================================ */

const CHATBOT = {
  _open: false,
  _messages: [],
  _typing: false,

  // Knowledge base
  _knowledge: {
    greet: { patterns: ['hi','hello','hey','namaste','hola'], reply: () => `Namaste! 💐 I'm Vee, your personal bridal stylist. How can I help you find your perfect look today?` },
    traditions: { patterns: ['tradition','culture','wedding type','south indian','north indian','muslim','christian','kerala','bengali'], reply: () => `We support ${DATA.traditions.length} wedding traditions including ${DATA.traditions.slice(0,4).map(t=>t.label).join(', ')} and more! Use the 🏮 Cultural Collections section on the home page to browse by tradition.` },
    budget: { patterns: ['budget','price','cost','cheap','affordable','expensive','how much'], reply: () => `Our dresses range from ${UTILS.formatPrice(Math.min(...DATA.dresses.map(d=>d.price)))} to ${UTILS.formatPrice(Math.max(...DATA.dresses.map(d=>d.price)))}. Use the Search page filters to set your price range. Tip: use coupon BRIDE10 for 10% off!` },
    sizes: { patterns: ['size','sizing','measurement','fit','small','large','xl','xxl'], reply: () => `We offer sizes XS to XXL and Free Size options. On any dress page, tap "Size Guide" for exact measurements. You can also use our Size Recommender — go to Profile → My Tools → Size Recommender!` },
    customize: { patterns: ['custom','customise','customize','tailor','alter','change','modify','personalize'], reply: () => `Yes! Every dress can be fully customized. Open any dress → tap ✏️ Customize → choose sleeve, neck design, embroidery, color and more. Your design goes to the designer for review within 3–5 days.` },
    delivery: { patterns: ['delivery','shipping','dispatch','arrive','when','days','track'], reply: () => `Standard delivery takes 7–14 business days. Custom orders take 14–21 days. Track your order in the 📦 Orders page. We offer FREE delivery on all orders!` },
    return: { patterns: ['return','refund','exchange','cancel','money back'], reply: () => `You can cancel any order before it ships. For returns, go to Orders → Order Details → Request Return. Custom/personalized orders are non-refundable. Exchanges accepted within 7 days of delivery.` },
    designers: { patterns: ['designer','brand','who made','creator','artist'], reply: () => `We work with ${DATA.designers.length} curated designers including ${DATA.designers.slice(0,3).map(d=>d.name).join(', ')}. Book a 1-on-1 consultation via Appointments → Book Designer!` },
    ar: { patterns: ['ar','try on','virtual','camera','photo','see how'], reply: () => `Our AR Studio lets you virtually try dresses! Go to the 📷 AR Studio tab → upload your photo → select a dress → see yourself in it. Save and share your preview!` },
    wishlist: { patterns: ['wishlist','wish','save','favourite','heart'], reply: () => `Tap the ❤️ heart on any dress to save it to your Wishlist. From Wishlist you can bulk-add all to cart, add to your Gift Registry, or create Lookbooks!` },
    quiz: { patterns: ['quiz','style','find','recommend','suggest','what dress'], reply: () => `Take our ✨ Find My Style Quiz! Go to Home → Quick Tools → Find My Style. Answer 5 questions and we'll recommend your perfect dresses based on tradition, style, fabric and budget.` },
    registry: { patterns: ['registry','gift','invite','share','list'], reply: () => `Create a 🎁 Gift Registry to share your wishlist with family and friends! They can see what you want and surprise you. Access it from Home → Quick Tools → Gift Registry.` },
    coupon: { patterns: ['coupon','discount','offer','code','promo','sale'], reply: () => `We have these coupon codes:\n🎁 BRIDE10 – 10% off\n🎁 VESTIQUE20 – 20% off\n🎁 FIRST15 – 15% off (first order)\nApply at Cart → Enter coupon code.` },
    payment: { patterns: ['pay','payment','upi','card','cod','cash','net banking'], reply: () => `We accept:\n💳 UPI (GPay, PhonePe, Paytm)\n💳 Credit/Debit Card\n🏦 Net Banking\n💵 Cash on Delivery\nAll payments are 100% secure.` },
    appointment: { patterns: ['appointment','consult','meet','talk','contact designer'], reply: () => `You can book a free consultation with any of our designers! Go to 📅 Appointments (More tab) to schedule a Video Call, In-Person, or Chat session.` },
    help: { patterns: ['help','support','problem','issue','contact'], reply: () => `For support:\n📞 +91 80000 99999 (9AM–6PM Mon–Sat)\n📧 support@vestique.com\nOr go to Settings → Help & Support for all options.` },
    default: { reply: (q) => {
      // Try to find a dress matching the query
      const q2 = q.toLowerCase();
      const match = DATA.dresses.find(d =>
        d.name.toLowerCase().includes(q2) ||
        d.category.toLowerCase().includes(q2) ||
        d.tradition.toLowerCase().includes(q2)
      );
      if (match) return `I found something! Check out the <strong>${match.name}</strong> by ${match.designer} for ${UTILS.formatPrice(match.price)} – rated ★${match.rating}. Tap Search and look for it, or I can show you more options!`;
      return `I'm not sure about that, but I'm happy to help with:\n• Dress recommendations\n• Sizing & customization\n• Delivery & payments\n• Designer consultations\n\nWhat would you like to know? 💐`;
    }},
  },

  _getReply(text) {
    const lower = text.toLowerCase().trim();
    for (const [, item] of Object.entries(this._knowledge)) {
      if (!item.patterns) continue;
      if (item.patterns.some(p => lower.includes(p))) {
        return typeof item.reply === 'function' ? item.reply() : item.reply;
      }
    }
    return this._knowledge.default.reply(text);
  },

  init() {
    // Create floating button + chat window
    if (document.getElementById('chatbot-fab')) return;

    // FAB button
    const fab = document.createElement('button');
    fab.id = 'chatbot-fab';
    fab.innerHTML = '💬';
    fab.title = 'Chat with Vee';
    fab.style.cssText = `
      position:fixed; bottom:calc(var(--nav-h) + 16px); right:16px; z-index:300;
      width:52px; height:52px; border-radius:50%;
      background:linear-gradient(135deg,var(--gold),var(--rose-gold));
      color:white; font-size:1.4rem; border:none; cursor:pointer;
      box-shadow:0 4px 16px rgba(201,168,76,0.5);
      transition:transform 0.2s ease, box-shadow 0.2s ease;
      display:flex; align-items:center; justify-content:center;
    `;
    fab.onmouseenter = () => { fab.style.transform='scale(1.1)'; };
    fab.onmouseleave = () => { fab.style.transform='scale(1)'; };
    fab.onclick = () => this.toggle();
    document.body.appendChild(fab);

    // Chat window
    const win = document.createElement('div');
    win.id = 'chatbot-window';
    win.style.cssText = `
      position:fixed; bottom:calc(var(--nav-h) + 80px); right:16px; z-index:301;
      width:320px; max-height:480px;
      background:var(--surface); border:1px solid var(--border);
      border-radius:var(--radius-xl); overflow:hidden;
      box-shadow:var(--shadow-lg); display:none; flex-direction:column;
      font-family:var(--font-body);
    `;
    win.innerHTML = `
      <div style="background:linear-gradient(135deg,var(--gold),var(--rose-gold));padding:14px 16px;display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.2rem">💐</div>
        <div style="flex:1">
          <div style="font-weight:700;color:white;font-size:0.95rem">Vee</div>
          <div style="font-size:0.72rem;color:rgba(255,255,255,0.8)">Your Bridal AI Assistant</div>
        </div>
        <button onclick="CHATBOT.close()" style="background:none;border:none;color:rgba(255,255,255,0.8);font-size:1.2rem;cursor:pointer;padding:4px">✕</button>
      </div>
      <div id="chatbot-messages" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;max-height:320px;min-height:200px"></div>
      <div style="padding:10px 12px;border-top:1px solid var(--border);display:flex;gap:8px">
        <input id="chatbot-input" type="text" placeholder="Ask me anything..." style="flex:1;padding:8px 12px;border:1.5px solid var(--border);border-radius:var(--radius-full);font-size:0.85rem;background:var(--surface-2);color:var(--text);outline:none" />
        <button onclick="CHATBOT.send()" style="width:36px;height:36px;border-radius:50%;background:var(--gold);color:white;border:none;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">→</button>
      </div>
    `;
    document.body.appendChild(win);

    // Enter key to send
    win.querySelector('#chatbot-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.send();
    });

    // Welcome message
    this._addMessage('bot', `Namaste! 💐 I'm <strong>Vee</strong>, your personal bridal AI stylist!<br><br>Ask me about dresses, sizes, delivery, customization, or anything bridal. How can I help you today?`);

    // Quick prompts
    this._addQuickPrompts();
  },

  _addMessage(role, html) {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    const el = document.createElement('div');
    el.style.cssText = role === 'user'
      ? 'align-self:flex-end;background:var(--gold-light);color:var(--text);padding:8px 12px;border-radius:14px 14px 4px 14px;font-size:0.85rem;max-width:85%;line-height:1.5'
      : 'align-self:flex-start;background:var(--surface-2);color:var(--text);padding:8px 12px;border-radius:14px 14px 14px 4px;font-size:0.85rem;max-width:90%;line-height:1.5;border:1px solid var(--border)';
    el.innerHTML = html;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  },

  _addQuickPrompts() {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    const prompts = ['👗 Recommend a dress', '📏 What size am I?', '💰 Budget options', '🚚 Delivery info'];
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:4px';
    el.innerHTML = prompts.map(p => `
      <button onclick="CHATBOT._quickSend('${p}')" style="
        padding:5px 10px;border-radius:var(--radius-full);
        border:1.5px solid var(--gold);background:transparent;
        color:var(--gold-dark);font-size:0.75rem;cursor:pointer;
        transition:background 0.2s;
      " onmouseover="this.style.background='var(--gold-light)'" onmouseout="this.style.background='transparent'">${p}</button>
    `).join('');
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  },

  _quickSend(text) {
    const input = document.getElementById('chatbot-input');
    if (input) input.value = text;
    this.send();
  },

  send() {
    const input = document.getElementById('chatbot-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this._addMessage('user', text);
    // Typing indicator
    const msgs = document.getElementById('chatbot-messages');
    const typing = document.createElement('div');
    typing.id = 'chatbot-typing';
    typing.style.cssText = 'align-self:flex-start;background:var(--surface-2);padding:8px 14px;border-radius:14px;font-size:0.85rem;color:var(--text-muted);border:1px solid var(--border)';
    typing.innerHTML = '● ● ●';
    if (msgs) { msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight; }
    setTimeout(() => {
      typing.remove();
      const reply = this._getReply(text);
      this._addMessage('bot', reply.replace(/\n/g, '<br>'));
    }, 700 + Math.random() * 400);
  },

  toggle() {
    const win = document.getElementById('chatbot-window');
    if (!win) { this.init(); return; }
    this._open = !this._open;
    win.style.display = this._open ? 'flex' : 'none';
    if (this._open) {
      const input = document.getElementById('chatbot-input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  },

  close() {
    this._open = false;
    const win = document.getElementById('chatbot-window');
    if (win) win.style.display = 'none';
  },
};
