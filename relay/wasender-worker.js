/**
 * WaSender relay (Cloudflare Worker).
 *
 * The site is static, so the WaSender API key can't live in it.
 * This Worker keeps the key as a secret, builds the message on the server
 * and sends it to a single fixed number (Bar's). See relay/README.md.
 *
 * Environment:
 *   WASENDER_API_KEY  (secret)  API key of the WaSender session
 *   TO_NUMBER                   recipient in E.164, e.g. +972503337074
 *   ALLOWED_ORIGINS             comma-separated, e.g. https://hagynwa.github.io
 */

const WASENDER_URL = 'https://www.wasenderapi.com/api/send-message';

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

const TEMPLATES = {
  he: {
    greeting: 'היי בר, הגעתי מהאתר שלך.',
    labels: { name: 'שם', company: 'חברה', phone: 'טלפון', email: 'אימייל', topic: 'נושא', message: 'הודעה' },
    defaultTopic: 'שיחת היכרות'
  },
  en: {
    greeting: 'Hi Bar, I found you through your website.',
    labels: { name: 'Name', company: 'Company', phone: 'Phone', email: 'Email', topic: 'Topic', message: 'Message' },
    defaultTopic: 'Intro call'
  }
};

const buildText = (d, lang) => {
  const { greeting, labels: l, defaultTopic } = lang === 'en' ? TEMPLATES.en : TEMPLATES.he;
  return [
    greeting,
    '',
    `*${l.name}:* ${d.name}`,
    d.company ? `*${l.company}:* ${d.company}` : null,
    d.phone ? `*${l.phone}:* ${d.phone}` : null,
    d.email ? `*${l.email}:* ${d.email}` : null,
    `*${l.topic}:* ${d.topic || defaultTopic}`,
    '',
    `*${l.message}:*`,
    d.message
  ].filter(line => line !== null).join('\n');
};

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : (allowed[0] || '*'),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    const reply = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply({ ok: false, error: 'method_not_allowed' }, 405);
    if (allowed.length && !allowed.includes(origin)) return reply({ ok: false, error: 'origin_not_allowed' }, 403);

    let body;
    try {
      body = await request.json();
    } catch {
      return reply({ ok: false, error: 'bad_json' }, 400);
    }

    // Honeypot: bots fill the hidden "website" field. Pretend it worked.
    if (body.website) return reply({ ok: true });

    const d = {
      name: clip(body.name, 80),
      phone: clip(body.phone, 30),
      email: clip(body.email, 120),
      company: clip(body.company, 120),
      topic: clip(body.topic, 60),
      message: clip(body.message, 2000)
    };
    if (!d.name || !d.message) return reply({ ok: false, error: 'missing_fields' }, 400);

    const res = await fetch(WASENDER_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.WASENDER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: env.TO_NUMBER || '+972503337074', text: buildText(d, body.lang) })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) return reply({ ok: false, error: 'upstream_failed' }, 502);

    return reply({ ok: true });
  }
};
