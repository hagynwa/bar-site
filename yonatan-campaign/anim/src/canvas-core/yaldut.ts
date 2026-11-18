// עוד קצת ילדות · THE LOOK. A child's maths notebook with a paper collage glued into it.
//
// The medium is what a kid actually makes in class: a squared exercise-book page (printed blue grid,
// a red margin ruled down the right, because Hebrew is written from the right), a marker for the
// words, a wax crayon for the highlighter and the doodles, and pieces of coloured construction paper
// torn or cut and stuck on with glue and clear tape. The torn-paper technique follows the fox plate
// (white fibrous core on a torn edge, soft shadow under each lifted piece); the crayon follows the
// balloon plate (back-and-forth scribble that skips the tooth of the sheet). Nothing fades in.
//
// The idea of this frame (episode 1, the hook): the house is asleep, and one window glows screen-blue.
// Focal subject: that window. Light: a pale moon upper left, and the cold glow of the screen.
// Palette: the parents' leadership logo (navy #001A3F, greens #699F03 / #B5D96E, sun #FECC0C,
// page yellow #FEE55A, heart red #F61621, purple #CC90CE, sky #3ABCFE).
import { Gfx, PENCIL, fractal, rng, turn, type Ctx, type Env, type P } from "./core";
import type { Film } from "./film";
import { blob, bounds, clipped, fillShape, hatchRuns, inside, mix, resample, smooth } from "./gallery";
import playpen from "../../assets/fonts/PlaypenSansHebrew.ttf";
import rubik from "../../assets/fonts/Rubik.ttf";

// ---------------------------------------------------------------- fonts (inlined, registered once)
type FontFile = { data: string };
const registered = new Set<string>();
const registerFace = (family: string, file: FontFile) => {
  const gl = globalThis as unknown as { FontFace?: new (f: string, s: ArrayBuffer, d?: Record<string, string>) => { load(): Promise<unknown> }; document?: { fonts: { add(f: unknown): void } } };
  if (!gl.FontFace || !gl.document || registered.has(family)) return; registered.add(family);
  const bin = atob(file.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const face = new gl.FontFace(family, u8.buffer, { weight: "1 1000", style: "normal" }); gl.document.fonts.add(face); void face.load();
};
registerFace("Playpen Sans Hebrew", playpen as unknown as FontFile);
registerFace("Rubik", rubik as unknown as FontFile);
export const HAND = (w: number, px: number) => `${w} ${px}px "Playpen Sans Hebrew", sans-serif`;
export const NUM = (w: number, px: number) => `${w} ${px}px "Rubik", sans-serif`;

// ---------------------------------------------------------------- palette (logo first, then paper and media)
export const C = {
  navy: "#001A3F", green: "#699F03", leaf: "#B5D96E", sun: "#FECC0C", page: "#FEE55A", heart: "#F61621", purple: "#CC90CE", sky: "#3ABCFE",
  sheet: "#FBFAF3", grid: "#BCD3EE", margin: "#EE8F96", marker: "#14224C", night: "#1B2E63", core: "#FBF5E6", shadow: "#1C1A2E", tape: "#F4EDD2",
};

// ---------------------------------------------------------------- torn and cut paper (after fox.ts)
type Piece = { shape: P[]; color: string; torn?: number; seed: number; fibre?: number; lift?: number };
const normals = (s: P[]): P[] => s.map((_, i) => { const a = s[(i - 1 + s.length) % s.length], b = s[(i + 1) % s.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; });
const ringLen = (s: P[]) => s.reduce((a, p, i) => a + Math.hypot(p[0] - s[(i + 1) % s.length][0], p[1] - s[(i + 1) % s.length][1]), 0);
const tear = (shape: P[], amp: number, seed: number, grow = 0): P[] => {
  const n = Math.max(24, Math.round(ringLen(shape) / 2.6)), s = resample([...shape, shape[0]], n).slice(0, -1), nr = normals(s), r = rng(seed);
  return s.map(([x, y], i) => { const d = (fractal(seed, x, y, 0.09, 0.09, 3) - 0.5) * amp * 2.2 + (r() - 0.5) * amp * 0.6 + grow; return [x + nr[i][0] * d, y + nr[i][1] * d]; });
};
const cut = (shape: P[], seed: number): P[] => { const s = resample([...shape, shape[0]], Math.max(24, Math.round(ringLen(shape) / 4))).slice(0, -1), r = rng(seed); return s.map(([x, y]) => [x + (r() - 0.5) * 0.8, y + (r() - 0.5) * 0.8]); };
const fibres = (g: Gfx, shape: P[], color: string, seed: number, density: number) => {
  const b = bounds(shape), r = rng(seed), areaPx = (b.x1 - b.x0) * (b.y1 - b.y0), c = g.cur;
  clipped(g, shape, () => {
    for (let i = 0; i < 5; i++) fillShape(g, blob(b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * (b.y1 - b.y0), 30 + r() * 110, 20 + r() * 70, seed + i, 0.4, 12, r() * 3), r() < 0.5 ? mix(color, "#ffffff", 0.14) : mix(color, "#000000", 0.1), 0.25);
    c.lineCap = "round";
    const n = Math.round((areaPx / 900) * density);
    for (let i = 0; i < n; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = b.y0 + r() * (b.y1 - b.y0), a = r() * Math.PI, l = 3 + r() * 9; c.strokeStyle = r() < 0.55 ? mix(color, "#fff8e8", 0.4) : mix(color, "#0a0a1a", 0.3); c.globalAlpha = 0.22 + r() * 0.25; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
    c.globalAlpha = 1;
  });
};
// one layer of paper: shadows first (soft, down and right), then the pieces with their torn white core
const paperLayer = (g: Gfx, pieces: Piece[]) => {
  const shapes = pieces.map((p) => (p.torn ? tear(p.shape, p.torn, p.seed) : cut(p.shape, p.seed)));
  g.group("plain", () => pieces.forEach((p, i) => { const l = p.lift ?? 1; fillShape(g, shapes[i].map(([x, y]) => [x + 4 * l, y + 7 * l] as P), C.shadow, 0.5); }), { blur: 5, alpha: 0.42 });
  g.group("plain", () => pieces.forEach((p, i) => {
    if (p.torn) fillShape(g, tear(p.shape, p.torn * 0.8, p.seed + 1, p.torn * 0.75), C.core);
    fillShape(g, shapes[i], p.color);
    fibres(g, shapes[i], p.color, p.seed + 2, p.fibre ?? 1);
  }));
};
const ring = (cx: number, cy: number, rx: number, ry = rx, n = 48, a0 = 0): P[] => Array.from({ length: n }, (_, i) => { const a = a0 + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as P; });
const rect = (x0: number, y0: number, x1: number, y1: number): P[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const star = (x: number, y: number, r1: number, r0: number, rot = 0): P[] => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + rot + (k / 10) * Math.PI * 2, rr = k % 2 ? r0 : r1; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as P; });
// a scissor-cut crescent: the outer disc minus a disc pushed toward `ang`
const crescent = (cx: number, cy: number, r1: number, r2: number, d: number, ang: number): P[] => {
  const phi = Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1)), c2: P = [cx + Math.cos(ang) * d, cy + Math.sin(ang) * d], out: P[] = [];
  for (let i = 0; i <= 40; i++) { const a = ang + phi + (i / 40) * (Math.PI * 2 - 2 * phi); out.push([cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]); }
  const b0 = Math.atan2(out[out.length - 1][1] - c2[1], out[out.length - 1][0] - c2[0]), b1 = Math.atan2(out[0][1] - c2[1], out[0][0] - c2[0]);
  // the inner arc runs past the side of the inner disc that faces the outer centre
  const s1 = (((b1 - b0) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), s2 = s1 - Math.PI * 2, face = ang + Math.PI;
  const span = Math.cos(b0 + s1 / 2 - face) > Math.cos(b0 + s2 / 2 - face) ? s1 : s2;
  for (let i = 1; i < 40; i++) { const a = b0 + (i / 40) * span; out.push([c2[0] + Math.cos(a) * r2, c2[1] + Math.sin(a) * r2]); }
  return out;
};

// ---------------------------------------------------------------- wax crayon (after balloon.ts)
const scribble = (g: Gfx, region: P[], color: string, o: { angle: number; gap: number; w: number; alpha: number; seed: number; keep?: (x: number, y: number) => boolean }) => {
  const { angle, gap, w, alpha, seed, keep = () => true } = o, r = rng(seed), b = bounds(region);
  const runs = hatchRuns({ x0: b.x0 - 8, y0: b.y0 - 8, x1: b.x1 + 8, y1: b.y1 + 8 }, angle, gap, (x, y) => inside(region, x, y) && keep(x, y), 5, seed);
  const c = g.cur; g.touch(b.x0 - 14, b.y0 - 14, b.x1 + 14, b.y1 + 14);
  c.save(); c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = color; c.lineWidth = w;
  let prev: P | null = null;
  runs.forEach((run, i) => {
    const pts = (i % 2 ? [...run].reverse() : run).filter((_, k, a) => k % 3 === 0 || k === a.length - 1).map(([x, y]) => [x + (r() - 0.5) * 1.8, y + (r() - 0.5) * 1.8] as P);
    const jump = prev ? Math.hypot(pts[0][0] - prev[0], pts[0][1] - prev[1]) : 0;
    c.globalAlpha = alpha * (0.7 + r() * 0.4); c.beginPath();
    if (prev && jump < gap * 3.2) { c.moveTo(prev[0], prev[1]); pts.forEach(([x, y]) => c.lineTo(x, y)); } else pts.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke(); prev = pts[pts.length - 1];
  });
  c.restore();
};
const wax = (g: Gfx, fn: () => void) => g.group("plain", fn, { textures: ["pencilTooth"] });

// ---------------------------------------------------------------- the notebook page
export const notebook = (g: Gfx, W: number, H: number) => {
  g.group("plain", () => {
    fillShape(g, rect(-10, -10, W + 10, H + 10), C.sheet);
    const c = g.cur; c.lineWidth = 2; c.strokeStyle = C.grid; c.globalAlpha = 0.85;
    for (let x = 54; x < W; x += 54) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = 54; y < H; y += 54) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    c.globalAlpha = 1; c.lineWidth = 3; c.strokeStyle = C.margin; c.beginPath(); c.moveTo(W - 108, 0); c.lineTo(W - 108, H); c.stroke();
  });
};
// marker lettering, right to left; a second faint pass where the felt tip pooled
export const marker = (g: Gfx, text: string, x: number, y: number, px: number, color = C.marker, w = 800) => {
  const c = g.cur; c.save(); c.font = HAND(w, px); c.direction = "rtl"; c.textAlign = "right"; c.textBaseline = "alphabetic";
  const m = c.measureText(text); g.touch(x - m.width - 10, y - px * 1.1, x + 10, y + px * 0.4);
  c.fillStyle = color; c.globalAlpha = 0.94; c.fillText(text, x, y); c.globalAlpha = 0.22; c.fillText(text, x + 1.2, y + 0.8);
  c.restore(); return m.width;
};
const measure = (g: Gfx, text: string, px: number, w = 800) => { const c = g.cur; c.save(); c.font = HAND(w, px); c.direction = "rtl"; const m = c.measureText(text).width; c.restore(); return m; };
const tape = (g: Gfx, x: number, y: number, len: number, ang: number, seed: number) => {
  const r = rng(seed), half = len / 2, wdt = 26, raw: P[] = [];
  for (let i = 0; i <= 6; i++) raw.push([-half + (r() - 0.5) * 6, -wdt + (i / 6) * wdt * 2]);
  const right: P[] = []; for (let i = 0; i <= 6; i++) right.push([half + (r() - 0.5) * 6, wdt - (i / 6) * wdt * 2]);
  const shape = turn([...raw, ...right].map(([px, py]) => [x + px, y + py] as P), x, y, ang);
  g.group("plain", () => fillShape(g, shape.map(([px, py]) => [px + 2, py + 3] as P), C.shadow, 0.25), { blur: 3, alpha: 0.35 });
  g.group("plain", () => { fillShape(g, shape, C.tape, 0.62); fillShape(g, turn(rect(x - half, y - wdt, x + half, y - wdt + 7), x, y, ang), "#ffffff", 0.35); });
};

// ---------------------------------------------------------------- episode 1 hook: the house asleep, one window awake
const W = 1080, H = 1920, NX = 540, NY = 1255, TILT = -2.2;   // the night sheet's centre and tilt (degrees)
const T = (pts: P[]) => turn(pts, NX, NY, TILT);
const nightYard = (g: Gfx) => {
  // the sheet of dark-blue construction paper, torn out of a bigger pad, glued on slightly crooked
  paperLayer(g, [{ shape: T(rect(78, 770, 1002, 1740)), color: C.night, torn: 5, seed: 11, fibre: 0.7, lift: 1.4 }]);
  // moon: yellow paper cut with scissors; stars punched from gold paper
  paperLayer(g, [{ shape: T(crescent(250, 930, 74, 64, 34, -0.6)), color: C.page, seed: 21, lift: 0.6 }]);
  paperLayer(g, [[420, 880, 18], [610, 840, 13], [820, 905, 20], [930, 1010, 12], [360, 1060, 11], [700, 990, 10]].map(([x, y, s], i) => ({ shape: T(star(x, y, s, s * 0.45, i * 0.4)), color: C.sun, seed: 30 + i, lift: 0.4 })));
  // two hills of green paper, darkened for night, torn along the top
  paperLayer(g, [{ shape: T([...smooth([[84, 1470], [260, 1410], [520, 1440], [760, 1390], [996, 1430]], false, 8), [996, 1734], [84, 1734]] as P[]), color: mix(C.green, C.navy, 0.42), torn: 4, seed: 41, lift: 0.9 }]);
  // the lollipop tree from the logo
  paperLayer(g, [{ shape: T(rect(228, 1300, 254, 1520)), color: "#3E4E1C", seed: 51, lift: 0.5 }, { shape: T(blob(241, 1280, 70, 76, 52, 0.12, 14)), color: mix(C.green, C.navy, 0.3), torn: 3, seed: 53, lift: 0.8 }]);
  // the house: purple paper walls, a darker roof, a door
  const hx = 640, hy = 1560, hw = 330, hh = 230;
  paperLayer(g, [{ shape: T(rect(hx - hw / 2, hy - hh, hx + hw / 2, hy)), color: mix(C.purple, C.navy, 0.38), seed: 61, lift: 0.8 }]);
  paperLayer(g, [{ shape: T([[hx - hw / 2 - 30, hy - hh + 4], [hx, hy - hh - 150], [hx + hw / 2 + 30, hy - hh + 4]]), color: mix(C.purple, C.navy, 0.62), seed: 62, lift: 0.9 }]);
  // the window that is awake: the glow first (soft light spilling on the wall and the night), then the pane
  const wx = hx + 95, wy = hy - 168, ww = 76, wh = 66;
  g.group("plain", () => fillShape(g, T(ring(wx, wy + wh / 2, 120, 100)), C.sky, 0.5), { blur: 38, alpha: 0.85, blend: "screen" });
  // a child's rays of light, in pale-blue crayon, round the pane
  wax(g, () => { for (let k = 0; k < 9; k++) { const a = -Math.PI * 0.95 + (k / 8) * Math.PI * 1.25, cy = wy + wh / 2; g.pen(T([[wx + Math.cos(a) * 62, cy + Math.sin(a) * 56], [wx + Math.cos(a) * 104, cy + Math.sin(a) * 92]]), { w: 4.2, color: mix(C.sky, "#ffffff", 0.45), seed: 700 + k, wobble: 1.5, boil: 0, opacity: 0.9, retrace: false }); } });
  paperLayer(g, [{ shape: T(rect(wx - ww / 2, wy, wx + ww / 2, wy + wh)), color: C.sky, seed: 72, lift: 0.3 }]);
  wax(g, () => { g.pen(T([[wx - 24, wy + 30], [wx - 8, wy + 14]]), { w: 3.4, color: "#ffffff", seed: 731, wobble: 0.6, boil: 0, opacity: 0.85, retrace: false }); g.pen(T([[wx - 22, wy + 46], [wx + 6, wy + 18]]), { w: 3.4, color: "#ffffff", seed: 732, wobble: 0.6, boil: 0, opacity: 0.7, retrace: false }); });
  // the window that sleeps, and the door
  paperLayer(g, [{ shape: T(rect(hx - 95 - ww / 2, wy, hx - 95 + ww / 2, wy + wh)), color: "#262C4A", seed: 74, lift: 0.3 }, { shape: T(rect(hx - 28, hy - 112, hx + 28, hy)), color: mix(C.navy, C.purple, 0.25), seed: 75, lift: 0.3 }]);
  // the near hill in front of everything
  paperLayer(g, [{ shape: T([...smooth([[70, 1612], [300, 1572], [600, 1600], [880, 1560], [1012, 1590]], false, 8), [1012, 1756], [70, 1756]] as P[]), color: mix(C.green, C.navy, 0.2), torn: 4, seed: 81, lift: 1.1 }]);
  // crayon over the collage: "zzz" coming off the sleeping window, in the child's own hand
  wax(g, () => { const c = g.cur; c.save(); c.translate(hx - 100, wy - 40); c.rotate((TILT * Math.PI) / 180 - 0.25); c.font = HAND(700, 40); c.fillStyle = mix(C.page, "#ffffff", 0.2); c.globalAlpha = 0.85; c.textAlign = "center"; c.fillText("z", 0, 0); c.font = HAND(700, 30); c.fillText("z", 26, -30); c.font = HAND(700, 22); c.fillText("z", 46, -54); c.restore(); g.touch(hx - 120, wy - 140, hx + 20, wy - 20); });
  // clear tape on two corners
  const [a, b] = T([[96, 790], [984, 786]]);
  tape(g, a[0], a[1], 170, -40, 91); tape(g, b[0], b[1], 170, 38, 92);
};

const drawHook = (ctx: Ctx, _local: number, env: Env) => {
  const g = new Gfx(ctx, env, 0, PENCIL);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  notebook(g, W, H);
  const RX = W - 140;   // text hangs from just inside the red margin
  // the episode tag: red marker, circled twice in red crayon
  g.group("plain", () => { const w = marker(g, "פרק 1 · שינה", RX, 168, 46, C.heart, 700); g.env.cache.set("tagw", w); });
  const tw = measure(g, "פרק 1 · שינה", 46, 700);
  wax(g, () => { [0, 1].forEach((k) => g.pen(smooth(ring(RX - tw / 2, 152, tw / 2 + 34, 44 + k * 4, 14, -0.4 + k * 0.5), true, 6), { w: 3.2, color: C.heart, seed: 5 + k, wobble: 3, boil: 0, opacity: 0.85, retrace: false })); });
  // the hook, in marker, with the last line gone over in yellow crayon highlighter
  const lines = ["איפה הטלפון", "של הילד שלך", "ישן בלילה?"], px = 118, y0 = 360, lh = 140;
  const lw = measure(g, lines[2], px);
  wax(g, () => scribble(g, rect(RX - lw - 18, y0 + 2 * lh - px * 0.42, RX + 16, y0 + 2 * lh + 18), C.page, { angle: -0.12, gap: 8, w: 9, alpha: 0.9, seed: 9 }));
  g.group("plain", () => lines.forEach((t, i) => marker(g, t, RX, y0 + i * lh, px)));
  nightYard(g);
  g.paper("paper", 0.12);
};

export const yaldut: Film = {
  meta: { title: "עוד קצת ילדות · look still, episode 1 hook", W, H, fps: 30, bpm: 60, durationFrames: 30, kind: "explainer" },
  assets: { images: {} },
  shots: [{ id: "hook", start: 0, end: 30, draw: drawHook }],
};
