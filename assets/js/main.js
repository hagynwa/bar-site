(() => {
  'use strict';

  const CONFIG = {
    // Bar's WhatsApp number, international format without "+".
    whatsapp: '972503337074',
    // Optional: URL of the WaSender relay (see relay/README.md).
    // Empty = the form opens WhatsApp with a ready-made message.
    relayUrl: ''
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- Masthead ---------- */
  const mast = document.querySelector('.masthead');
  const onScroll = () => mast.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Direct WhatsApp links get a greeting ---------- */
  document.querySelectorAll('.js-wa').forEach(a => {
    a.href = waLink('היי בר, הגעתי מהאתר שלך.');
  });

  /* ---------- Timecode: PAL 25fps, starting at the 20:00 news hour ---------- */
  const tc = document.getElementById('timecode');
  if (tc) {
    const pad = n => String(n).padStart(2, '0');
    const start = 20 * 3600 * 25;
    const t0 = performance.now();
    let last = -1;
    const render = now => {
      const frames = start + Math.floor((now - t0) / 40);
      if (frames === last) return;
      last = frames;
      const s = Math.floor(frames / 25);
      tc.textContent = `${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(reduceMotion ? 0 : frames % 25)}`;
    };
    if (reduceMotion) {
      setInterval(() => render(performance.now()), 1000);
    } else {
      const loop = now => { render(now); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }

  /* ---------- Israel clock in the ticker ---------- */
  const clock = document.getElementById('clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jerusalem' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Contact form → WhatsApp ---------- */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const preview = document.getElementById('preview');
  const status = document.getElementById('form-status');
  const note = document.getElementById('form-note');
  const submit = document.getElementById('f-submit');
  const val = name => (form.elements[name] && form.elements[name].value || '').trim();

  const getData = () => ({
    name: val('name'),
    phone: val('phone'),
    email: val('email'),
    company: val('company'),
    topic: val('topic') || 'שיחת היכרות',
    message: val('message')
  });

  // One description of the message, used for both the preview and the text sent.
  const lines = d => [
    { text: 'היי בר, הגעתי מהאתר שלך.' },
    { blank: true },
    { label: 'שם', value: d.name, ph: 'השם שלכם' },
    { label: 'חברה', value: d.company, optional: true },
    { label: 'טלפון', value: d.phone, ph: '050-0000000' },
    { label: 'אימייל', value: d.email, optional: true },
    { label: 'נושא', value: d.topic },
    { blank: true },
    { label: 'הודעה', value: d.message, ph: 'כמה מילים על מה שאתם צריכים', block: true }
  ].filter(l => !(l.optional && !l.value));

  const buildText = d => lines(d).map(l => {
    if (l.blank) return '';
    if (l.text) return l.text;
    return l.block ? `*${l.label}:*\n${l.value}` : `*${l.label}:* ${l.value}`;
  }).join('\n');

  const renderPreview = () => {
    const frag = document.createDocumentFragment();
    lines(getData()).forEach((l, i) => {
      if (i) frag.append('\n');
      if (l.blank) return;
      if (l.text) { frag.append(l.text); return; }
      const b = document.createElement('b');
      b.textContent = `${l.label}:`;
      frag.append(b, l.block ? '\n' : ' ');
      if (l.value) {
        frag.append(l.value);
      } else {
        const ph = document.createElement('span');
        ph.className = 'ph';
        ph.textContent = l.ph;
        frag.append(ph);
      }
    });
    preview.replaceChildren(frag);
  };

  const rules = {
    name: v => v ? '' : 'כתבו את השם שלכם, כדי שאדע למי לחזור.',
    phone: v => {
      if (!v) return 'השאירו מספר טלפון לחזרה.';
      return /^\+?\d{9,15}$/.test(v.replace(/[\s\-().]/g, '')) ? '' : 'המספר לא נראה תקין. נסו בפורמט 050-1234567.';
    },
    email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'כתובת האימייל לא נראית תקינה. בדקו שיש בה @ ונקודה.',
    message: v => v ? '' : 'כתבו כמה מילים על מה שאתם צריכים.'
  };

  const check = name => {
    const input = form.elements[name];
    const msg = rules[name](val(name));
    input.closest('.field').classList.toggle('is-invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    document.getElementById(`${name}-error`).textContent = msg;
    return !msg;
  };

  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    input.addEventListener('blur', () => { if (input.value.trim() || input.getAttribute('aria-invalid')) check(name); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(name); });
  });

  form.addEventListener('input', renderPreview);
  form.addEventListener('change', renderPreview);
  renderPreview();

  const showStatus = (text, linkUrl) => {
    status.replaceChildren(text);
    if (linkUrl) {
      const a = document.createElement('a');
      a.href = linkUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'פתיחה ידנית של וואטסאפ';
      status.append(' ', a);
    }
    status.hidden = false;
    note.hidden = true;
  };

  const setBusy = busy => {
    submit.setAttribute('aria-busy', String(busy));
    submit.disabled = busy;
    submit.querySelector('.btn__label').textContent = busy ? 'שליחה…' : 'שליחה בוואטסאפ';
  };

  const sendViaRelay = async d => {
    try {
      const res = await fetch(CONFIG.relayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...d, website: val('website') })
      });
      const json = await res.json().catch(() => ({}));
      return res.ok && json.ok === true;
    } catch (_) {
      return false;
    }
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (val('website')) return; // bots fill the hidden field

    const invalid = Object.keys(rules).filter(name => !check(name));
    if (invalid.length) {
      form.elements[invalid[0]].focus();
      return;
    }

    const d = getData();
    const url = waLink(buildText(d));

    if (CONFIG.relayUrl) {
      setBusy(true);
      const ok = await sendViaRelay(d);
      setBusy(false);
      if (ok) {
        showStatus('ההודעה הגיעה אליי לוואטסאפ. אחזור אליכם בהקדם.');
        form.reset();
        renderPreview();
        return;
      }
      showStatus('השליחה האוטומטית לא עברה. אפשר לשלוח את אותה הודעה ישירות מוואטסאפ:', url);
      return;
    }

    const win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
      showStatus('וואטסאפ נפתח עם ההודעה. נשאר רק ללחוץ על שליחה. לא נפתח?', url);
    } else {
      window.location.href = url;
    }
  });
})();
