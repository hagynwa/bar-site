(() => {
  'use strict';

  const CONFIG = {
    // Bar's WhatsApp number, international format without "+".
    whatsapp: '972503337074',
    // Optional: URL of the WaSender relay (see README.md).
    // Empty = the form opens WhatsApp with a ready-made message.
    relayUrl: ''
  };

  const STRINGS = {
    he: {
      pause: 'עצירת המבזקים',
      play: 'הפעלת המבזקים',
      greeting: 'היי בר, הגעתי מהאתר שלך.',
      labels: { name: 'שם', company: 'חברה', phone: 'טלפון', email: 'אימייל', topic: 'נושא', message: 'הודעה' },
      defaultTopic: 'שיחת היכרות',
      errors: {
        name: 'כתבו את השם שלכם, כדי שאדע למי לחזור.',
        phoneInvalid: 'המספר לא נראה תקין. נסו בפורמט 050-1234567.',
        email: 'כתובת האימייל לא נראית תקינה. בדקו שיש בה @ ונקודה.',
        message: 'כתבו כמה מילים על מה שאתם צריכים.'
      },
      submit: 'שליחה בוואטסאפ',
      sending: 'שליחה…',
      opened: 'וואטסאפ נפתח עם ההודעה. נשאר רק ללחוץ על שליחה. לא נפתח?',
      manual: 'פתיחה ידנית של וואטסאפ',
      relayOk: 'ההודעה הגיעה אליי לוואטסאפ. אחזור אליכם בהקדם.',
      relayFail: 'השליחה האוטומטית לא עברה. אפשר לשלוח את אותה הודעה ישירות מוואטסאפ:'
    },
    en: {
      pause: 'Pause headlines',
      play: 'Play headlines',
      greeting: 'Hi Bar, I found you through your website.',
      labels: { name: 'Name', company: 'Company', phone: 'Phone', email: 'Email', topic: 'Topic', message: 'Message' },
      defaultTopic: 'Intro call',
      errors: {
        name: 'Add your name so I know who to get back to.',
        phoneInvalid: 'That number doesn’t look right. Try a format like +972 50-123-4567.',
        email: 'That email doesn’t look right. Check it has an @ and a dot.',
        message: 'Add a few words about what you need.'
      },
      submit: 'Send on WhatsApp',
      sending: 'Sending…',
      opened: 'WhatsApp is open with your message. Just hit send. Didn’t open?',
      manual: 'Open WhatsApp manually',
      relayOk: 'Your message reached me on WhatsApp. I’ll get back to you soon.',
      relayFail: 'Automatic sending didn’t go through. You can send the same message straight from WhatsApp:'
    }
  };

  const lang = document.documentElement.lang === 'en' ? 'en' : 'he';
  const t = STRINGS[lang];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- Masthead ---------- */
  const mast = document.querySelector('.masthead');
  const onScroll = () => mast.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Direct WhatsApp links get a greeting ---------- */
  document.querySelectorAll('.js-wa').forEach(a => { a.href = waLink(t.greeting); });

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
    // runs through the opening sequence, then holds so nothing ticks while people read
    if (reduceMotion) {
      render(t0);
    } else {
      const loop = now => { render(now); if (now - t0 < 4200) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }

  /* ---------- Ticker: pause and play ---------- */
  const ticker = document.querySelector('.ticker');
  const toggle = ticker && ticker.querySelector('.ticker__toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const paused = ticker.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? t.play : t.pause);
    });
  }

  /* ---------- Studio meter: a few seconds of level when it comes into view ---------- */
  const studio = document.querySelector('.studio');
  if (studio && !reduceMotion && 'IntersectionObserver' in window) {
    let timer = 0;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !timer) {
        studio.classList.add('is-live');
        timer = setTimeout(() => studio.classList.remove('is-live'), 4000);
      } else if (!entry.isIntersecting && timer) {
        clearTimeout(timer); timer = 0;
        studio.classList.remove('is-live');
      }
    }, { threshold: 0.5 }).observe(studio);
  }

  /* ---------- Timeline: "today" follows the calendar ---------- */
  const gantt = document.querySelector('.gantt');
  if (gantt) {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 1), end = new Date(d.getFullYear() + 1, 0, 1);
    const now = (d.getFullYear() + (d - start) / (end - start)).toFixed(2);
    gantt.style.setProperty('--today', now);
    gantt.querySelectorAll('[data-until-now]').forEach(el => el.style.setProperty('--e', now));
    gantt.querySelectorAll('[data-from-now]').forEach(el => el.style.setProperty('--s', now));
    const label = gantt.querySelector('.g-axis__today');
    if (label) label.style.setProperty('--y', now);
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Contact form → WhatsApp ---------- */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const note = document.getElementById('form-note');
  const submit = document.getElementById('f-submit');
  const val = name => (form.elements[name] && form.elements[name].value || '').trim();

  const getData = () => ({
    name: val('name'),
    phone: val('phone'),
    email: val('email'),
    company: val('company'),
    topic: val('topic') || t.defaultTopic,
    message: val('message')
  });

  // The WhatsApp message, line by line. Empty optional fields are left out.
  const lines = d => [
    { text: t.greeting },
    { blank: true },
    { key: 'name', value: d.name },
    { key: 'company', value: d.company, optional: true },
    { key: 'phone', value: d.phone, optional: true },
    { key: 'email', value: d.email, optional: true },
    { key: 'topic', value: d.topic },
    { blank: true },
    { key: 'message', value: d.message, block: true }
  ].filter(l => !(l.optional && !l.value));

  const buildText = d => lines(d).map(l => {
    if (l.blank) return '';
    if (l.text) return l.text;
    const label = t.labels[l.key];
    return l.block ? `*${label}:*\n${l.value}` : `*${label}:* ${l.value}`;
  }).join('\n');

  const rules = {
    name: v => v ? '' : t.errors.name,
    // Israeli numbers start with 0 (or 972); anything else needs its +country code
    phone: v => !v || /^(0[2-9]\d{7,8}|\+?972[2-9]\d{7,8}|\+[1-9]\d{7,14})$/.test(v.replace(/[\s\-().]/g, '')) ? '' : t.errors.phoneInvalid,
    email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : t.errors.email,
    message: v => v ? '' : t.errors.message
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
    // Checking on blur waits for the first submit, so an error line never shifts the button mid-click
    input.addEventListener('blur', () => { if (form.dataset.tried) check(name); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(name); });
  });

  const showStatus = (text, linkUrl) => {
    status.replaceChildren(text);
    if (linkUrl) {
      const a = document.createElement('a');
      a.href = linkUrl;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = t.manual;
      status.append(' ', a);
    }
    status.hidden = false;
    note.hidden = true;
  };

  const setBusy = busy => {
    submit.setAttribute('aria-busy', String(busy));
    submit.disabled = busy;
    submit.querySelector('.btn__label').textContent = busy ? t.sending : t.submit;
  };

  const sendViaRelay = async d => {
    try {
      const res = await fetch(CONFIG.relayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...d, lang, website: val('website') })
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
    form.dataset.tried = '1';

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
        showStatus(t.relayOk);
        form.reset();
        return;
      }
      showStatus(t.relayFail, url);
      return;
    }

    const win = window.open(url, '_blank');
    if (win) {
      win.opener = null;
      showStatus(t.opened, url);
    } else {
      window.location.href = url;
    }
  });
})();
