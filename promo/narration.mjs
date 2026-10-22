// Cuts Bar's narration out of a broadcast recording and prepares it for the promo.
//
//   node promo/narration.mjs <file-or-url> <start> <end>
//
// start/end are positions in the source (seconds or mm:ss). URLs are fetched
// with yt-dlp. The clip should be about 4 seconds; the result is narration.wav.

import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [src, start, end] = process.argv.slice(2);
if (!src || !start || !end) {
  console.error('Usage: node promo/narration.mjs <file-or-url> <start> <end>');
  process.exit(1);
}
const tmp = join(here, 'out', 'tmp');
mkdirSync(tmp, { recursive: true });

let input = src;
if (/^https?:\/\//.test(src)) {
  const r = spawnSync('yt-dlp', ['-f', 'bestaudio/best', '-o', join(tmp, 'source.%(ext)s'), '--force-overwrites', src], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status);
  input = join(tmp, readdirSync(tmp).find(f => f.startsWith('source.')));
}

// broadcast voice chain: trim, mono, gentle EQ and compression, loudness, short fades
const chain = [
  'highpass=f=90', 'lowpass=f=9500',
  'acompressor=threshold=-20dB:ratio=3:attack=5:release=80',
  'loudnorm=I=-16:TP=-2:LRA=7',
  'afade=t=in:d=0.04', 'areverse', 'afade=t=in:d=0.25', 'areverse'
].join(',');
const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-ss', start, '-to', end,
  '-ac', '1', '-ar', '48000', '-af', chain, join(here, 'narration.wav')], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status);
console.log('Wrote promo/narration.wav');
