// Renders promo.html to an MP4 with a synthesized news-style sound bed.
// If narration.wav exists (see narration.mjs), it is mixed into the
// "going live" scene and drives the on-screen mic meter.
//
//   node promo/render.mjs [output.mp4]

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const pw = await import('playwright').catch(() => import(process.env.PLAYWRIGHT_MODULE));
const { chromium } = pw.default ?? pw;

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(process.argv[2] || join(here, 'out', 'bar-promo.mp4'));
const TMP = join(here, 'out', 'tmp');
mkdirSync(TMP, { recursive: true });

const FPS = 25;
const DUR = 25;
const SR = 48000;
const NARR = { file: join(here, 'narration.wav'), start: 3.4, maxDur: 4.1 };

const run = (args, opts = {}) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { maxBuffer: 1 << 30, ...opts });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr}`);
  return r.stdout;
};

/* ---------- narration ---------- */
let narration = null;
if (existsSync(NARR.file)) {
  const pcm = run(['-i', NARR.file, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-']);
  const s = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
  const dur = s.length / SR;
  if (dur > NARR.maxDur + 0.2) console.warn(`Narration is ${dur.toFixed(2)}s; the slot fits about ${NARR.maxDur}s.`);
  const hop = SR / FPS;
  const levels = [];
  for (let i = 0; i + hop <= s.length; i += hop) {
    let sum = 0;
    for (let j = i; j < i + hop; j++) sum += s[j] * s[j];
    const db = 20 * Math.log10(Math.sqrt(sum / hop) + 1e-9);
    levels.push(Math.min(1, Math.max(0.04, (db + 48) / 42)));
  }
  narration = { dur, levels };
  console.log(`Narration: ${dur.toFixed(2)}s`);
} else {
  console.log('No narration.wav found; rendering with the sound bed only.');
}

/* ---------- sound bed ---------- */
function soundBed() {
  const N = Math.round(SR * DUR);
  const L = new Float32Array(N), R = new Float32Array(N);
  let seed = 7;
  const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 * 2 - 1; };
  // pan is -1 (left) … 1 (right), or a function of progress u
  const add = (t0, len, fn, gain = 1, pan = 0) => {
    const s0 = Math.round(t0 * SR);
    for (let k = 0, n = Math.round(len * SR); k < n; k++) {
      const i = s0 + k; if (i < 0 || i >= N) continue;
      const u = k / n, p = typeof pan === 'function' ? pan(u) : pan;
      const v = fn(k / SR, u) * gain;
      L[i] += v * Math.cos((p + 1) * Math.PI / 4); R[i] += v * Math.sin((p + 1) * Math.PI / 4);
    }
  };
  const ping = (f, d) => x => Math.sin(2 * Math.PI * f * x) * Math.exp(-x / d);
  const click = () => x => rnd() * Math.exp(-x / 0.0025);
  const kick = (d = 0.32) => x => Math.sin(2 * Math.PI * (48 * x + (140 - 48) * 0.035 * (1 - Math.exp(-x / 0.035)))) * Math.exp(-x / d);
  const tick = (t, f, g, pan) => { add(t, .06, ping(f, .012), g, pan); add(t, .02, click(), g * .5, pan); };

  // countdown ticks on the test pattern, then "going live"
  [0, 1, 2].forEach(t => tick(t, 2200, .35, 0));
  add(3, 1.2, kick(.35), .8);
  add(3, .6, (() => { let y = 0; return x => (y += .08 * (rnd() - y)) * Math.exp(-x / .25); })(), 1.2);
  [880, 1318.5, 1760].forEach(f => add(3, 1, ping(f, .25), .07, .2));

  // news-clock ticks under everything until the end card
  for (let t = 3.5, k = 0; t < 21.1; t += .5, k++) tick(t, k % 2 ? 1800 : 2400, .1, k % 2 ? -.3 : .3);

  // pulse
  for (let t = 8.05; t < 21.1; t += 1) add(t, .8, kick(.22), .32);
  for (let t = 8.55; t < 21.1; t += 1) { let y = 0; add(t, .05, x => { const n = rnd(); y += .5 * (n - y); return (n - y) * Math.exp(-x / .012); }, .09, .4); }

  // pad: one chord per scene, crossfaded
  const chords = [[8.05, [110, 164.81, 220, 261.63]], [12.45, [87.31, 130.81, 174.61, 220]], [17.95, [130.81, 196, 261.63, 329.63]]];
  chords.forEach(([t0, fs], ci) => {
    const t1 = ci < chords.length - 1 ? chords[ci + 1][0] : 21.3;
    const len = t1 - t0 + .4;
    fs.forEach((f, j) => add(t0 - .2, len, (x, u) => {
      const env = Math.min(1, x / .4) * Math.min(1, (len - x) / .4);
      return env * (Math.sin(2 * Math.PI * f * x) + .25 * Math.sin(2 * Math.PI * 2 * f * x + 1) + .5 * Math.sin(2 * Math.PI * f * 1.003 * x));
    }, .022, j % 2 ? -.4 : .4));
  });

  // whooshes that follow the blue wipes, right to left
  [7.75, 12.15, 17.65].forEach(t0 => {
    let y = 0;
    add(t0, .6, (x, u) => { y += (.02 + .25 * Math.sin(Math.PI * u)) * (rnd() - y); return y * Math.sin(Math.PI * u); }, .5, u => .8 - 1.6 * u);
  });

  // color-bar wipe: one ping per bar, then the closing chord
  [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66].forEach((f, i) => add(21.1 + i * .035, .3, ping(f, .08), .06, -.6 + i * .2));
  add(21.55, 1.2, kick(.4), .7);
  [220, 277.18, 329.63, 440, 554.37, 659.25].forEach((f, j) => add(21.55, 3.4, (x, u) => (Math.sin(2 * Math.PI * f * x) + .3 * Math.sin(2 * Math.PI * 2 * f * x)) * Math.exp(-x / 1.3) * Math.min(1, (3.4 - x) / .5), .05, j % 2 ? -.35 : .35));

  // duck under the narration
  if (narration) {
    const a = NARR.start - .12, b = NARR.start + narration.dur + .1;
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      const w = Math.min(Math.max((t - a) / .15, 0), 1) * Math.min(Math.max((b - t) / .15, 0), 1);
      const g = 1 - .65 * w;
      L[i] *= g; R[i] *= g;
    }
  }

  // master fade and peak normalize to -3 dBFS
  let peak = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, f = Math.min(1, (DUR - t) / .6);
    L[i] *= f; R[i] *= f;
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  const norm = 0.708 / (peak || 1);
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
  }
  return buf;
}

const bedPath = join(TMP, 'bed.wav');
writeFileSync(bedPath, soundBed());
const audioPath = join(TMP, 'audio.wav');
if (narration) {
  const ms = Math.round(NARR.start * 1000);
  run(['-i', bedPath, '-i', NARR.file, '-filter_complex',
    `[1:a]aformat=channel_layouts=stereo,adelay=${ms}|${ms},volume=1.6[n];[0:a][n]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]`,
    '-map', '[a]', '-ar', String(SR), audioPath]);
} else {
  run(['-i', bedPath, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', String(SR), audioPath]);
}

/* ---------- video ---------- */
const videoPath = join(TMP, 'video.mp4');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(here, 'promo.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (narration) await page.evaluate(([start, levels]) => { window.NARRATION = { start, levels }; }, [NARR.start, narration.levels]);

const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), videoPath], { stdio: ['pipe', 'inherit', 'inherit'] });
const frames = DUR * FPS;
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => window.render(t), f / FPS);
  const img = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 50 === 0) process.stdout.write(`\rframes ${f}/${frames}`);
}
ff.stdin.end();
await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg video encode failed'))));
await browser.close();
process.stdout.write(`\rframes ${frames}/${frames}\n`);

mkdirSync(dirname(OUT), { recursive: true });
run(['-i', videoPath, '-i', audioPath, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT]);
console.log(`Wrote ${OUT}`);
