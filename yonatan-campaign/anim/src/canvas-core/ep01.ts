// עוד קצת ילדות · EPISODE 1 · SLEEP. "Where does the phone sleep at night?"
// Script and storyboard: yonatan-campaign/03-scripts/ep01-sleep.md. Facts: anim/facts.json.
//
// Story: the house is asleep and one window is awake, screen-blue (token: the blue light). We go in
// through that window (its pane is a pair of paper shutters that swing open), meet the child awake
// beside the phone and the number (20 minutes). Turn at frame 450: a parent's hand lifts the phone and
// carries it to a shoebox bed in the kitchen. Outside again, the child's window is dark, a tiny blue
// charging dot sits in the kitchen window, a day sheet is glued over the night and the logo's sun rises.
//
// Medium: the notebook + paper-yard kit (yaldut.ts). Paper is laid down on twos; crayon and marker are
// drawn on, never faded. 30 fps, 60 bpm: a beat is 30 frames, every cut sits on a beat.
import { Gfx, PENCIL, rng, turn, type Ctx, type Env, type Layer, type P } from "./core";
import type { Film } from "./film";
import { blob, fillShape, mix, smooth } from "./gallery";
import { C, HAND, NUM, crescent, marker, measure, notebook, paperLayer, rect, ring, scribble, star, tape, wax, type Piece } from "./yaldut";

const W = 1080, H = 1920, FPS = 30, DUR = 1110;
// The picture is cut to Bar's recorded takes (narration sets the clock). The scenes were drawn on a 990-frame
// plan; line 2 runs 8 s instead of 6, so the bedroom holds 90 frames longer and the morning 30 frames longer.
// `old` is the plan's frame for a frame of the film; NOW is the film's own frame (captions run on it).
const oldOf = (n: number) => (n < 420 ? n : n < 990 ? n - 90 : n - 120);
let NOW = 0;
const RX = 940;                       // text hangs from just inside the red margin
const cl = (x: number) => Math.max(0, Math.min(1, x));
const span = (f: number, a: number, b: number) => cl((f - a) / (b - a));
const eOut = (t: number) => 1 - Math.pow(1 - cl(t), 3);
const eIn = (t: number) => Math.pow(cl(t), 3);
const eIO = (t: number) => { const c = cl(t); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const twos = (f: number) => f - (f % 2);                        // paper moves on twos, like stop-motion
const SKIN = "#EDBE96", SKIN_D = "#D79E74", HAIR = "#4B3426", WOOD = "#B9875A", WOOD_D = "#8F6440", BOX = "#C29466", BOX_D = "#9C7149";

// paper laid down by hand: it arrives a little high, its shadow long, and settles (on twos)
const lay = (f: number, at: number, dur = 10, from: P = [0, -60]): { off: P; lift: number; hide: boolean } => {
  const u = eOut(span(twos(f), at, at + dur));
  return { off: [from[0] * (1 - u), from[1] * (1 - u)], lift: 1 + 2.4 * (1 - u), hide: f < at };
};

// ---------------------------------------------------------------- shared pieces of every scene
const sheet = (g: Gfx, x0: number, y0: number, x1: number, y1: number, color: string, tilt: number, seed: number) => {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, T = (p: P[]) => turn(p, cx, cy, tilt);
  paperLayer(g, [{ shape: T(rect(x0, y0, x1, y1)), color, torn: 5, seed, fibre: 0.7, lift: 1.4 }]);
  return T;
};
const tapes = (g: Gfx, T: (p: P[]) => P[], x0: number, y0: number, x1: number, seed: number) => {
  const [a, b] = T([[x0 + 18, y0 + 20], [x1 - 18, y0 + 16]]);
  tape(g, a[0], a[1], 160, -40, seed); tape(g, b[0], b[1], 160, 38, seed + 1);
};
// a headline in marker, line by line, written right to left over `dur` frames per line
const headline = (g: Gfx, f: number, lines: string[], at: number, y0: number, px: number, lh: number, per = 14, color = C.marker) =>
  g.group("plain", () => lines.forEach((t, i) => marker(g, t, RX, y0 + i * lh, px, color, 800, span(f, at + i * per, at + (i + 1) * per))));
// crayon highlighter under one line of a headline
const highlight = (g: Gfx, f: number, text: string, y: number, px: number, at: number, seed: number, color = C.page) => {
  const w = measure(g, text, px);
  g.group("plain", () => scribble(g, rect(RX - w - 16, y - px * 0.42, RX + 14, y + 16), color, { angle: -0.12, gap: 8, w: 9, alpha: 0.9, seed, p: span(f, at, at + 12) }), { textures: ["pencilTooth"], blend: "multiply" });
};
// the campaign stamp, top left: the logo straight on the page (transparent), dropped in right after the hook (the same in every episode)
const size = (img: CanvasImageSource): P => { const i = img as HTMLImageElement; return [i.naturalWidth || i.width, i.naturalHeight || i.height]; };
const stamp = (g: Gfx, f: number) => {
  const img = g.env.image?.("yaldutH"); if (f < 60 || !img) return;
  const [iw, ih] = size(img), w = 330, h = (w * ih) / iw, x0 = 36, y0 = 112, d = lay(f, 60, 10, [0, -46]);
  if (!d.hide) g.group("plain", () => { g.cur.drawImage(img, x0 + d.off[0], y0 + d.off[1], w, h); g.touch(x0, y0, x0 + w, y0 + h + 60); });
};
// subtitles: on a torn white paper label, centred, under the collage (Rubik, legible at phone size)
type Cap = { from: number; to: number; text: string };
// film frames, measured from the recorded takes (05-voice/README.md)
const CAPS: Cap[] = [
  { from: 156, to: 207, text: "במחקר על כ-2,000 ילדים," },
  { from: 213, to: 348, text: "מי שישנו ליד טלפון או טאבלט, ישנו בממוצע 20 דקות פחות," },
  { from: 354, to: 412, text: "בלילות שלפני יום לימודים." },
  { from: 432, to: 520, text: "5 לילות כאלה, וזה כבר כמעט שעתיים." },
  { from: 558, to: 690, text: "רופאי הילדים בארה״ב ממליצים: בלי מכשירים בחדר השינה." },
  { from: 696, to: 840, text: "אז אולי הלילה, גם לטלפון תהיה מיטה משלו. במטבח." },
];
const wrap = (g: Gfx, text: string, font: string, max: number): string[] => {
  const c = g.cur; c.save(); c.font = font; const words = text.split(" "), out: string[] = []; let line = "";
  for (const w of words) { const t = line ? line + " " + w : w; if (c.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); c.restore(); return out;
};
const caption = (g: Gfx, _f: number) => {
  const f = NOW, cap = CAPS.find((c) => f >= c.from && f < c.to); if (!cap) return;
  const font = NUM(500, 46), lines = wrap(g, cap.text, font, 820), lh = 60, y0 = 1600 - ((lines.length - 1) * lh) / 2;
  const c = g.cur; c.save(); c.font = font; const wmax = Math.max(...lines.map((l) => c.measureText(l).width)); c.restore();
  const k = CAPS.indexOf(cap), drop = lay(f, cap.from, 6, [0, 26]);
  paperLayer(g, [{ shape: rect(W / 2 - wmax / 2 - 30, y0 - 50, W / 2 + wmax / 2 + 30, y0 + (lines.length - 1) * lh + 22), color: "#FFFFFF", torn: 2.2, seed: 900 + k, fibre: 0.25, lift: 0.5 * drop.lift, off: drop.off }]);
  g.group("plain", () => { const c2 = g.cur; c2.save(); c2.font = font; c2.direction = "rtl"; c2.textAlign = "center"; c2.fillStyle = C.navy; lines.forEach((l, i) => c2.fillText(l, W / 2 + drop.off[0], y0 + i * lh + drop.off[1])); c2.restore(); g.touch(W / 2 - wmax / 2, y0 - 50, W / 2 + wmax / 2, y0 + lines.length * lh); });
};
// the on-screen citation: one quiet line under the caption, set like a footnote
const source = (g: Gfx, f: number, text: string, at: number, to: number) => {
  if (f < at || f >= to) return;
  g.group("plain", () => { const c = g.cur; c.save(); c.font = NUM(400, 27); c.direction = "ltr"; c.textAlign = "center"; c.fillStyle = "#4A5578"; c.globalAlpha = 0.95; c.fillText(text, W / 2, 1700); c.restore(); g.touch(200, 1670, 880, 1712); });
};

// ---------------------------------------------------------------- the phone (always the cold thing in the picture)
const phone = (g: Gfx, cx: number, cy: number, ang: number, on: number, seed: number, scale = 1, off?: P, lift = 1) => {
  const w = 46 * scale, h = 84 * scale, R = (p: P[]) => turn(p, cx, cy, ang);
  paperLayer(g, [{ shape: R(rect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)), color: "#141B33", seed, lift: 0.5 * lift, off }]);
  const scr = mix("#20294A", C.sky, on);
  paperLayer(g, [{ shape: R(rect(cx - w / 2 + 4 * scale, cy - h / 2 + 8 * scale, cx + w / 2 - 4 * scale, cy + h / 2 - 10 * scale)), color: scr, seed: seed + 1, lift: 0.15, off }]);
};
const glow = (g: Gfx, cx: number, cy: number, r: number, amt: number, color = C.sky) => {
  if (amt <= 0.01) return;
  g.group("plain", () => fillShape(g, ring(cx, cy, r, r * 0.85), color, 0.55 * amt), { blur: r * 0.33, alpha: 0.9, blend: "screen" });
};

// ---------------------------------------------------------------- the yard (night, and morning)
type YardOpts = { childLit: number; kitchenDot: number; zzz: number; day: number; sun: number; rays: number; f: number; kid?: boolean };
const yard = (g: Gfx, o: YardOpts) => {
  const NX = 540, NY = 1255, TILT = -2.2, T = (pts: P[]) => turn(pts, NX, NY, TILT);
  paperLayer(g, [{ shape: T(rect(78, 770, 1002, 1740)), color: C.night, torn: 5, seed: 11, fibre: 0.7, lift: 1.4 }]);
  paperLayer(g, [{ shape: T(crescent(250, 930, 74, 64, 34, -0.6)), color: C.page, seed: 21, lift: 0.6 }]);
  paperLayer(g, [[420, 880, 18], [610, 840, 13], [820, 905, 20], [930, 1010, 12], [360, 1060, 11], [700, 990, 10]].map(([x, y, s], i) => ({ shape: T(star(x, y, s, s * 0.45, i * 0.4)), color: C.sun, seed: 30 + i, lift: 0.4 })));
  // morning: a sheet of day-blue paper glued over the night, pushed up from behind the hills
  if (o.day > 0) {
    const top = 1500 - (1500 - 760) * eOut(o.day);
    paperLayer(g, [{ shape: T([...smooth([[84, top + 14], [300, top], [560, top + 18], [800, top - 4], [996, top + 10]], false, 8), [996, 1500], [84, 1500]] as P[]), color: "#9FDCF6", torn: 4, seed: 15, fibre: 0.5, lift: 1.2 }]);
  }
  if (o.sun > 0) {   // the logo's sun, rising behind the far hill, with crayon rays drawn round it
    const sy = 1460 - 420 * eOut(o.sun);
    paperLayer(g, [{ shape: T(ring(800, sy, 72, 72, 40)), color: C.sun, seed: 17, lift: 0.6 }]);
    if (o.rays > 0) wax(g, () => { for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2 + o.f * 0.012; const p0: P = [800 + Math.cos(a) * 92, sy + Math.sin(a) * 92], p1: P = [800 + Math.cos(a) * 130, sy + Math.sin(a) * 130]; g.pen(T([p0, p1]), { w: 5, color: mix(C.sun, "#ff9a00", 0.25), seed: 170 + k, wobble: 1.4, boil: 0, opacity: 0.9, retrace: false, progress: cl(o.rays * 10 - k) }); } });
  }
  if (o.day > 0.6) paperLayer(g, [{ shape: T(blob(180 + (o.f - 800) * 3.2, 900, 74, 30, 18, 0.25, 14)), color: "#FFFFFF", torn: 2.5, seed: 19, lift: 0.7 }]);
  const night = 1 - cl(o.day);
  const dk = (c: string, k: number) => mix(c, C.navy, k * night);
  paperLayer(g, [{ shape: T([...smooth([[84, 1470], [260, 1410], [520, 1440], [760, 1390], [996, 1430]], false, 8), [996, 1734], [84, 1734]] as P[]), color: dk(C.green, 0.42), torn: 4, seed: 41, lift: 0.9 }]);
  paperLayer(g, [{ shape: T(rect(228, 1300, 254, 1520)), color: "#3E4E1C", seed: 51, lift: 0.5 }, { shape: T(blob(241, 1280, 70, 76, 52, 0.12, 14)), color: dk(C.green, 0.3), torn: 3, seed: 53, lift: 0.8 }]);
  const hx = 640, hy = 1560, hw = 330, hh = 230;
  paperLayer(g, [{ shape: T(rect(hx - hw / 2, hy - hh, hx + hw / 2, hy)), color: dk(C.purple, 0.38), seed: 61, lift: 0.8 }]);
  paperLayer(g, [{ shape: T([[hx - hw / 2 - 30, hy - hh + 4], [hx, hy - hh - 150], [hx + hw / 2 + 30, hy - hh + 4]]), color: dk(mix(C.purple, C.navy, 0.35), 0.4), seed: 62, lift: 0.9 }]);
  // the child's window (right) and the kitchen window (left)
  const wx = hx + 95, wy = hy - 168, ww = 76, wh = 66, kx = hx - 95;
  const flick = 1 - 0.12 * (0.5 + 0.5 * Math.sin(o.f * 0.9) * Math.sin(o.f * 0.37));
  glow(g, ...(T([[wx, wy + wh / 2]])[0]), 120, o.childLit * flick);
  if (o.childLit > 0.05) wax(g, () => { for (let k = 0; k < 9; k++) { const a = -Math.PI * 0.95 + (k / 8) * Math.PI * 1.25, cy = wy + wh / 2; g.pen(T([[wx + Math.cos(a) * 62, cy + Math.sin(a) * 56], [wx + Math.cos(a) * 104, cy + Math.sin(a) * 92]]), { w: 4.2, color: mix(C.sky, "#ffffff", 0.45), seed: 700 + k, wobble: 1.5, boil: 0, opacity: 0.9, retrace: false, progress: cl(o.childLit * 9 * Math.min(1, o.f / 40) - k) }); } });
  const pane = (x: number, lit: number, seed: number) => ({ shape: T(rect(x - ww / 2, wy, x + ww / 2, wy + wh)), color: mix(o.day > 0.5 ? "#BFE6F7" : "#262C4A", C.sky, lit), seed, lift: 0.3 });
  paperLayer(g, [pane(wx, o.childLit, 72), pane(kx, 0, 74), { shape: T(rect(hx - 28, hy - 112, hx + 28, hy)), color: dk(mix(C.navy, C.purple, 0.45), 0.3), seed: 75, lift: 0.3 }]);
  if (o.childLit > 0.3 && o.kid !== false) {   // the child, a small silhouette lit from below by the screen
    paperLayer(g, [{ shape: T(ring(wx + 6, wy + wh - 14, 15, 15, 20)), color: "#1E2E5C", seed: 76, lift: 0.2 }, { shape: T(rect(wx - 10, wy + wh - 4, wx + 22, wy + wh)), color: "#1E2E5C", seed: 77, lift: 0.1 }]);
  }
  if (o.kitchenDot > 0) {   // the token, small: a charging light in the kitchen window
    const [d] = T([[kx + 18, wy + wh - 16]]);
    glow(g, d[0], d[1], 20, o.kitchenDot * (0.7 + 0.3 * Math.sin(o.f * 0.2)));
    g.group("plain", () => fillShape(g, ring(d[0], d[1], 4.5, 4.5, 12), C.sky, o.kitchenDot));
  }
  paperLayer(g, [{ shape: T([...smooth([[70, 1612], [300, 1572], [600, 1600], [880, 1560], [1012, 1590]], false, 8), [1012, 1756], [70, 1756]] as P[]), color: dk(C.green, 0.2), torn: 4, seed: 81, lift: 1.1 }]);
  if (o.zzz > 0) wax(g, () => { const c = g.cur; c.save(); const [p] = T([[wx + 10, wy - 34]]); c.translate(p[0], p[1]); c.rotate(-0.3); c.fillStyle = mix(C.page, "#ffffff", 0.2); c.textAlign = "center"; [[40, 0, 0], [30, 26, -30], [22, 46, -54]].forEach(([px, x, y], i) => { if (o.zzz * 3 > i) { c.font = HAND(700, px); c.globalAlpha = 0.9 * cl(o.zzz * 3 - i); c.fillText("z", x, y); } }); c.restore(); g.touch(p[0] - 40, p[1] - 100, p[0] + 90, p[1] + 20); });
  const [a, b] = T([[96, 790], [984, 786]]);
  tape(g, a[0], a[1], 170, -40, 91); tape(g, b[0], b[1], 170, 38, 92);
  return T([[wx, wy + wh / 2]])[0];   // where the child's window is, for the camera
};

// ---------------------------------------------------------------- the bedroom
type RoomOpts = { f: number; lit: number; eyes: number; hand: { x: number; y: number; grip: number } | null; phoneOn: boolean; wedge: number; buzz: boolean };
const PH: P = [470, 1218];   // where the phone lies on the pillow
const bedroom = (g: Gfx, o: RoomOpts) => {
  const T = sheet(g, 110, 720, 970, 1510, mix(C.night, C.purple, 0.22), 1.4, 101);
  // window on the wall, with the same moon
  paperLayer(g, [{ shape: T(rect(190, 800, 370, 980)), color: "#16224C", seed: 110, lift: 0.5 }]);
  paperLayer(g, [{ shape: T(crescent(250, 860, 34, 29, 16, -0.6)), color: C.page, seed: 111, lift: 0.3 }, { shape: T(rect(276, 800, 284, 980)), color: "#E9E1CF", seed: 112, lift: 0.2 }, { shape: T(rect(190, 886, 370, 894)), color: "#E9E1CF", seed: 113, lift: 0.2 }]);
  // the clock, and the crayon wedge of 20 minutes (one third of the face, drawn to scale)
  const ccx = 790, ccy = 870, cr = 74;
  paperLayer(g, [{ shape: T(ring(ccx, ccy, cr, cr, 44)), color: "#FBF3E0", seed: 120, lift: 0.7 }]);
  if (o.wedge > 0) { const wedge: P[] = [[ccx, ccy]]; for (let i = 0; i <= 20; i++) { const a = -Math.PI / 2 + (i / 20) * (Math.PI * 2 / 3); wedge.push([ccx + Math.cos(a) * (cr - 6), ccy + Math.sin(a) * (cr - 6)]); } wax(g, () => scribble(g, T(wedge), C.heart, { angle: 0.7, gap: 6, w: 5, alpha: 0.85, seed: 121, p: o.wedge })); }
  wax(g, () => { for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; g.pen(T([[ccx + Math.cos(a) * (cr - 14), ccy + Math.sin(a) * (cr - 14)], [ccx + Math.cos(a) * (cr - 5), ccy + Math.sin(a) * (cr - 5)]]), { w: 2.6, color: C.navy, seed: 130 + k, wobble: 0.3, boil: 0, opacity: 0.9, retrace: false }); }
    g.pen(T([[ccx, ccy], [ccx + 26, ccy + 30]]), { w: 4, color: C.navy, seed: 140, wobble: 0.4, boil: 0, opacity: 0.95, retrace: false }); const mh = -Math.PI / 2 + o.f * 0.012; g.pen(T([[ccx, ccy], [ccx + Math.cos(mh) * 52, ccy + Math.sin(mh) * 52]]), { w: 3, color: C.navy, seed: 141, wobble: 0.4, boil: 0, opacity: 0.95, retrace: false }); });
  // the bed: headboard, mattress, pillow
  paperLayer(g, [{ shape: T(rect(170, 1110, 250, 1440)), color: WOOD_D, seed: 150, lift: 0.8 }]);
  paperLayer(g, [{ shape: T(rect(200, 1300, 930, 1440)), color: WOOD, seed: 151, lift: 0.9 }]);
  paperLayer(g, [{ shape: T(blob(330, 1236, 118, 54, 152, 0.08, 16)), color: "#FFFFFF", torn: 2, seed: 153, lift: 0.6 }]);
  // the child: head on the pillow, hair, face; the body under a checked blanket
  paperLayer(g, [{ shape: T(ring(330, 1206, 60, 62, 36)), color: SKIN, seed: 160, lift: 0.6 }]);
  paperLayer(g, [{ shape: T(smooth([[268, 1196], [272, 1160], [300, 1138], [340, 1134], [378, 1150], [392, 1180], [370, 1170], [340, 1164], [310, 1170], [288, 1186]], true, 6)), color: HAIR, torn: 1.4, seed: 161, lift: 0.4 }]);
  const blanket = T(smooth([[370, 1238], [520, 1218], [700, 1226], [910, 1240], [930, 1330], [380, 1336]], true, 6));
  paperLayer(g, [{ shape: blanket, color: C.page, torn: 3, seed: 170, lift: 0.9 }]);
  wax(g, () => { for (let x = 400; x < 920; x += 46) g.pen(T([[x, 1226], [x - 6, 1332]]), { w: 4, color: C.heart, seed: 171 + x, wobble: 1.2, boil: 0, opacity: 0.55, retrace: false }); for (let y = 1250; y < 1330; y += 30) g.pen(T([[380, y], [920, y + 4]]), { w: 4, color: C.heart, seed: 190 + y, wobble: 1.2, boil: 0, opacity: 0.5, retrace: false }); });
  // the face: eyes open toward the phone, or closed; a crayon mouth and a blush
  const blink = o.eyes < 0.5 && [96, 186, 278, 300, 392].some((b) => o.f % 420 >= b && o.f % 420 < b + 5);
  const eyesOpen = o.eyes < 0.5 && !blink;
  wax(g, () => {
    [[310, 1206], [350, 1206]].forEach(([x, y], i) => {
      if (eyesOpen) { const [[ex, ey]] = T([[x, y]]); fillShape(g, ring(ex, ey, 8, 9, 14), "#FFFFFF"); fillShape(g, ring(ex + 3, ey + 1, 4.6, 4.6, 12), C.navy); }
      else g.pen(T([[x - 9, y], [x, y + 5], [x + 9, y]]), { w: 3.4, color: C.navy, seed: 200 + i, wobble: 0.3, boil: 0, opacity: 0.95, retrace: false });
    });
    g.pen(T(eyesOpen ? [[322, 1238], [338, 1238]] : [[322, 1236], [330, 1241], [338, 1236]]), { w: 3, color: "#9B4A3E", seed: 210, wobble: 0.3, boil: 0, opacity: 0.9, retrace: false });
    scribble(g, T(ring(296, 1228, 11, 7, 12)), "#F28B8B", { angle: 0.5, gap: 4, w: 3, alpha: 0.5, seed: 211 });
    scribble(g, T(ring(364, 1228, 11, 7, 12)), "#F28B8B", { angle: 0.5, gap: 4, w: 3, alpha: 0.5, seed: 212 });
  });
  // the light on the face: screen-blue while the phone is there, warm moonlight after
  glow(g, ...(T([[400, 1214]])[0]), 150, o.lit * (o.buzz ? 1.15 : 0.85));
  glow(g, ...(T([[300, 1180]])[0]), 150, (1 - o.lit) * 0.45 * cl(o.eyes * 2), C.page);
  // the phone on the pillow (or in the hand), buzzing on the beat
  const jig = o.buzz ? ((o.f >> 1) % 2 ? 5 : -5) : 0;
  const [pp] = T([PH]);
  if (o.phoneOn && !o.hand) {
    phone(g, pp[0] + jig, pp[1], Math.PI / 2 - 0.2, 1, 230);
    if (o.buzz) wax(g, () => [-1, 1].forEach((s) => [0, 1, 2].forEach((k) => g.pen([[pp[0] + s * 40, pp[1] - 20 + k * 20], [pp[0] + s * 56, pp[1] - 24 + k * 20]], { w: 3.4, color: mix(C.sky, "#fff", 0.4), seed: 240 + k + (s > 0 ? 9 : 0), wobble: 0.6, boil: 0, opacity: 0.9, retrace: false }))));
  }
  if (o.hand) hand(g, o.hand.x, o.hand.y, o.hand.grip, true, Math.PI / 2);
  tapes(g, T, 110, 720, 970, 260);
};

// ---------------------------------------------------------------- a parent's hand, cut from paper, coming from above
// Built like a hand: a sleeve, the palm seen from the back, four fingers of different lengths and a thumb on
// the far side. `grip` 0 = open and reaching, 1 = closed round the phone (fingers shorten as they curl under).
const hand = (g: Gfx, x: number, y: number, grip: number, holding: boolean, ang = 0) => {
  const R = (p: P[]) => turn(p, x, y, ang * 57.2958);
  if (holding) { const [pc] = R([[x + 2, y + 150]]); phone(g, pc[0], pc[1], -0.2 + ang, 1, 330, 1, undefined, 1.6); }
  const sleeve: Piece = { shape: R(rect(x - 64, y - 700, x + 64, y - 6)), color: mix(C.green, C.navy, 0.15), seed: 300, lift: 1.4 };
  const cuff: Piece = { shape: R(rect(x - 66, y - 40, x + 66, y - 2)), color: C.leaf, seed: 301, lift: 1.4 };
  const palm: Piece = { shape: R(smooth([[x - 50, y - 6], [x + 50, y - 6], [x + 54, y + 60], [x + 44, y + 92], [x - 44, y + 92], [x - 54, y + 60]], true, 5)), color: SKIN, seed: 302, lift: 1.4 };
  const fl = [70, 82, 78, 62].map((l) => l * (1 - 0.55 * grip)), fx = [-36, -12, 12, 36];
  const fingers: Piece[] = fx.map((dx, i) => { const x0 = x + dx, y0 = y + 84, l = fl[i]; return { shape: R(smooth([[x0 - 11, y0], [x0 + 11, y0], [x0 + 11, y0 + l], [x0 + 6, y0 + l + 9], [x0 - 6, y0 + l + 9], [x0 - 11, y0 + l]], true, 4)), color: i % 2 ? SKIN : mix(SKIN, SKIN_D, 0.25), seed: 310 + i, lift: 1.4 }; });
  const thumb: Piece = { shape: R(smooth([[x + 46, y + 24], [x + 60, y + 30], [x + 74 - 30 * grip, y + 96], [x + 62 - 28 * grip, y + 106], [x + 48, y + 70]], true, 4)), color: SKIN_D, seed: 320, lift: 1.4 };
  paperLayer(g, [sleeve, cuff, palm, ...fingers, thumb]);
  wax(g, () => fx.slice(0, 3).forEach((dx, i) => g.pen(R([[x + dx + 12, y + 88], [x + dx + 12, y + 84 + fl[i] * 0.7]]), { w: 2, color: SKIN_D, seed: 340 + i, wobble: 0.3, boil: 0, opacity: 0.6, retrace: false })));
};

// ---------------------------------------------------------------- the kitchen
type KitOpts = { f: number; hand: { x: number; y: number; grip: number; holding: boolean } | null; placed: boolean; blanket: { off: P; lift: number; hide: boolean }; screen: number; zzz: number };
const kitchen = (g: Gfx, o: KitOpts) => {
  const T = sheet(g, 110, 720, 970, 1510, mix(C.page, "#FFFFFF", 0.55), -1.2, 401);
  wax(g, () => { for (let x = 150; x < 940; x += 70) g.pen(T([[x, 760], [x + 2, 1230]]), { w: 2.2, color: mix(C.sky, C.navy, 0.2), seed: 410 + x, wobble: 0.8, boil: 0, opacity: 0.35, retrace: false }); for (let y = 790; y < 1230; y += 70) g.pen(T([[140, y], [940, y + 2]]), { w: 2.2, color: mix(C.sky, C.navy, 0.2), seed: 470 + y, wobble: 0.8, boil: 0, opacity: 0.35, retrace: false }); });
  paperLayer(g, [{ shape: T(rect(640, 790, 880, 1010)), color: "#16224C", seed: 420, lift: 0.5 }]);
  paperLayer(g, [{ shape: T(crescent(820, 850, 30, 25, 14, -0.6)), color: C.page, seed: 421, lift: 0.3 }, { shape: T(rect(756, 790, 764, 1010)), color: "#FFFFFF", seed: 422, lift: 0.2 }, { shape: T(rect(640, 896, 880, 904)), color: "#FFFFFF", seed: 423, lift: 0.2 }]);
  paperLayer(g, [{ shape: T(rect(130, 1250, 950, 1300)), color: WOOD, seed: 430, lift: 0.9 }]);
  paperLayer(g, [{ shape: T(rect(150, 1300, 930, 1500)), color: mix(C.leaf, C.green, 0.25), seed: 431, lift: 0.8 }]);
  wax(g, () => { [345, 540, 735].forEach((x, i) => g.pen(T([[x, 1310], [x, 1490]]), { w: 3, color: mix(C.green, C.navy, 0.3), seed: 440 + i, wobble: 0.6, boil: 0, opacity: 0.8, retrace: false })); [[320, 1400], [370, 1400], [515, 1400], [565, 1400], [710, 1400], [760, 1400]].forEach(([x, y], i) => fillShape(g, T(ring(x, y, 7, 7, 10)), C.navy, 0.85)); });
  // the shoebox bed: lid leaning behind, the box, a little white pillow
  paperLayer(g, [{ shape: T(rect(420, 1080, 720, 1150)), color: BOX_D, seed: 450, lift: 0.7 }]);
  paperLayer(g, [{ shape: T(rect(400, 1150, 700, 1252)), color: BOX, seed: 451, lift: 0.9 }, { shape: T(blob(450, 1150, 36, 16, 452, 0.1, 12)), color: "#FFFFFF", torn: 1.5, seed: 453, lift: 0.5 }]);
  if (o.placed) {
    const [pc] = T([[560, 1146]]);
    glow(g, pc[0], pc[1], 90, o.screen * 0.9);
    phone(g, pc[0], pc[1], -Math.PI / 2 - 0.2, o.screen, 460, 1.0);
    if (o.screen < 0.5) { glow(g, pc[0] + 30, pc[1], 18, 0.8 + 0.2 * Math.sin(o.f * 0.2)); g.group("plain", () => fillShape(g, ring(pc[0] + 30, pc[1], 4, 4, 10), C.sky)); }
  }
  // the checked blanket, laid over the phone
  const bl = T(rect(500, 1128, 690, 1176));
  paperLayer(g, [{ shape: bl, color: C.page, torn: 2, seed: 470, lift: 0.6 * o.blanket.lift, off: o.blanket.off, hide: o.blanket.hide }]);
  if (!o.blanket.hide) wax(g, () => { for (let x = 520; x < 690; x += 34) g.pen(T([[x, 1130], [x - 3, 1174]]).map(([a, b]) => [a + o.blanket.off[0], b + o.blanket.off[1]] as P), { w: 3.4, color: C.heart, seed: 480 + x, wobble: 0.8, boil: 0, opacity: 0.55, retrace: false }); });
  if (o.zzz > 0) wax(g, () => { const c = g.cur; c.save(); const [p] = T([[640, 1080]]); c.translate(p[0], p[1]); c.rotate(-0.25); c.fillStyle = C.navy; c.textAlign = "center";
    for (let i = 0; i < 3; i++) { if (o.zzz * 3 <= i) continue; const ph = ((twos(o.f) - 706) / 60 + i / 3) % 1, px = 30 + 22 * ph; c.font = HAND(700, px); c.globalAlpha = 0.85 * cl(o.zzz * 3 - i) * Math.sin(ph * Math.PI); c.fillText("z", 60 * ph, -110 * ph); }
    c.restore(); g.touch(p[0] - 60, p[1] - 160, p[0] + 120, p[1] + 30); });
  if (o.hand) hand(g, o.hand.x, o.hand.y, o.hand.grip, o.hand.holding, -Math.PI / 2);
  tapes(g, T, 110, 720, 970, 490);
};

// ---------------------------------------------------------------- five nights (the second notebook page)
const nights = (g: Gfx, f: number) => {
  highlight(g, f, "5 לילות", 420, 150, 354, 501);
  headline(g, f, ["5 לילות"], 340, 420, 150, 0, 14);
  const labels = ["א", "ב", "ג", "ד", "ה"], cy = 820, r = 70;
  labels.forEach((lab, i) => {
    const cx = RX - 90 - i * 182, at = 372 + i * 12;   // right to left, one every 0.4 s
    wax(g, () => {
      g.pen(smooth(ring(cx, cy, r, r, 12, -1.4 + i), true, 6), { w: 4.2, color: C.navy, seed: 520 + i, wobble: 1.6, boil: 0, opacity: 0.9, retrace: false, progress: span(f, at, at + 8) });
      const wedge: P[] = [[cx, cy]]; for (let k = 0; k <= 16; k++) { const a = -Math.PI / 2 + (k / 16) * (Math.PI * 2 / 3); wedge.push([cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8)]); }
      scribble(g, wedge, C.heart, { angle: 0.7 + i * 0.2, gap: 6, w: 5, alpha: 0.85, seed: 530 + i, p: span(f, at + 6, at + 14) });
    });
    g.group("plain", () => marker(g, lab, cx + 14, cy + r + 66, 52, C.navy, 700, span(f, at + 8, at + 12)));
  });
  // a bracket under all five, an arrow, and the sum circled twice
  wax(g, () => {
    g.pen(smooth([[RX - 20, 1020], [RX - 30, 1050], [540, 1060], [150, 1050], [140, 1020]], false, 6), { w: 4, color: C.navy, seed: 560, wobble: 1.2, boil: 0, opacity: 0.85, retrace: false, progress: span(f, 432, 442) });
    g.pen([[540, 1062], [540, 1150]], { w: 4.4, color: C.navy, seed: 561, wobble: 1, boil: 0, opacity: 0.9, retrace: false, progress: span(f, 440, 446) });
    g.pen([[516, 1124], [540, 1152], [564, 1124]], { w: 4.4, color: C.navy, seed: 562, wobble: 0.6, boil: 0, opacity: 0.9, retrace: false, progress: span(f, 444, 448) });
  });
  const sum = "כמעט שעתיים";
  const sw = measure(g, sum, 112);
  g.group("plain", () => marker(g, sum, W / 2 + sw / 2, 1290, 112, C.heart, 800, span(f, 400, 416)));
  wax(g, () => [0, 1].forEach((k) => g.pen(smooth(ring(W / 2, 1252, sw / 2 + 40, 86 + k * 6, 14, -0.4 + k * 0.6), true, 6), { w: 3.6, color: C.heart, seed: 570 + k, wobble: 3, boil: 0, opacity: 0.85, retrace: false, progress: span(f, 416 + k * 6, 428 + k * 6) })));
};

// ---------------------------------------------------------------- the end card (the same in every episode)
// The campaign logo builds itself from its own layers (brand/logo/parts, layout.json): the hills are laid
// down, the sun rises from behind them, the rays are drawn one by one, and the words are written on.
const LOGO = { W: 654.912, H: 369.38, ix: 203.456, iy: 24, sc: 1.55, sun: [80, 66, 34], rays: [-90, -54, -126, -18, -162], r0: 44, r1: 56, ray: 7, base: 104, words: [24, 198.5, 630.912, 345.38] };
const endCard = (g: Gfx, f: number) => {
  const sun = g.env.image?.("ySun"), hills = g.env.image?.("yHills"), words = g.env.image?.("yWords"), lead = g.env.image?.("logo");
  const w = 860, k = w / LOGO.W, h = LOGO.H * k, x0 = (W - w) / 2, y0 = 280, c = g.cur;
  const at = (x: number, y: number): P => [x0 + (LOGO.ix + x * LOGO.sc) * k, y0 + (LOGO.iy + y * LOGO.sc) * k];
  const baseY = at(0, LOGO.base)[1];
  if (sun && f >= 871) {   // rising from behind the hills, never below them
    const rise = eOut(span(f, 871, 897)), dy = (1 - rise) * 80 * LOGO.sc * k;
    g.group("plain", () => { c.save(); c.beginPath(); c.rect(0, 0, W, baseY); c.clip(); c.drawImage(sun, x0, y0 + dy, w, h); c.restore(); g.touch(x0, y0, x0 + w, baseY); });
  }
  if (hills) { const u = eOut(span(f, 869, 879)), d = { off: [0, 40 * (1 - u)] as P, hide: f < 869 }; if (!d.hide) g.group("plain", () => { c.drawImage(hills, x0 + d.off[0], y0 + d.off[1], w, h); g.touch(x0, y0, x0 + w, y0 + h); }); }
  const [scx, scy] = at(LOGO.sun[0], LOGO.sun[1]);
  wax(g, () => LOGO.rays.forEach((deg, i) => { const a = (deg * Math.PI) / 180, r0 = LOGO.r0 * LOGO.sc * k, r1 = LOGO.r1 * LOGO.sc * k;
    g.pen([[scx + Math.cos(a) * r0, scy + Math.sin(a) * r0], [scx + Math.cos(a) * r1, scy + Math.sin(a) * r1]], { w: (LOGO.ray * LOGO.sc * k) / 1.45, color: C.sun, seed: 620 + i, wobble: 0.6, boil: 0, opacity: 1, retrace: false, taper: 0, progress: span(f, 890 + i * 3, 896 + i * 3) }); }));
  if (words) {   // written on from the right, the way the words are read
    const [wx0, wy0, wx1, wy1] = LOGO.words.map((v) => v * k), p = span(f, 877, 902), wd = wx1 - wx0;
    if (p > 0) g.group("plain", () => { c.save(); c.beginPath(); c.rect(x0 + wx1 - wd * p - 6, y0 + wy0 - 10, wd * p + 20, wy1 - wy0 + 30); c.clip(); c.drawImage(words, x0, y0, w, h); c.restore(); g.touch(x0 + wx0, y0 + wy0, x0 + wx1, y0 + wy1); });
  }
  const q = "מה דעתכם לנסות השבוע?", qw = measure(g, q, 66, 700);
  g.group("plain", () => marker(g, q, W / 2 + qw / 2, 930, 66, C.marker, 700, span(f, 906, 926)));
  // presented by: the parents' leadership, smaller, under its own label
  const by = "מטעם", bw = measure(g, by, 40, 700);
  g.group("plain", () => marker(g, by, W / 2 + bw / 2, 1100, 40, "#4A5578", 700, span(f, 914, 920)));
  if (lead) { const d = lay(f, 918, 10, [0, -40]), lw = 470, lh = (lw * 514) / 900, lx = (W - lw) / 2 + d.off[0], ly = 1130 + d.off[1];
    if (!d.hide) g.group("plain", () => { c.drawImage(lead, lx, ly, lw, lh); g.touch(lx, ly, lx + lw, ly + lh); }); }
  if (f >= 932) g.group("plain", () => { c.save(); c.font = NUM(500, 36); c.direction = "rtl"; c.textAlign = "center"; c.fillStyle = "#4A5578"; c.fillText("כל המקורות באתר", W / 2, 1520); c.restore(); g.touch(300, 1480, 780, 1532); });
};

// ---------------------------------------------------------------- flaps: shutters and page turns
// A rectangle of `src` hinged on one vertical edge and swung toward the viewer by `phi` (0 = flat,
// pi/2 = edge-on). Drawn in vertical strips with perspective, the far side darkening as it turns.
const flap = (ctx: Ctx, env: Env, src: Layer, x0: number, x1: number, hinge: "left" | "right", phi: number) => {
  if (phi >= Math.PI / 2 - 0.01) return;
  const k = env.scale, f = 2600, N = 60, w = x1 - x0, sp = Math.sin(phi), cp = Math.cos(phi);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < N; i++) {
    const d0 = (w * i) / N, d1 = (w * (i + 1)) / N, s0 = f / (f - d0 * sp), s1 = f / (f - d1 * sp);
    const p0 = d0 * cp * s0, p1 = d1 * cp * s1, sm = (s0 + s1) / 2, dh = H * sm, dy = H / 2 - dh / 2;
    const sx = hinge === "left" ? x0 + d0 : x1 - d1, dx = hinge === "left" ? x0 + p0 : x1 - p1;
    ctx.drawImage(src.canvas as CanvasImageSource, sx * k, 0, (d1 - d0) * k, H * k, Math.floor(dx * k), dy * k, Math.ceil((p1 - p0) * k) + 1, dh * k);
    ctx.fillStyle = "#0E1124"; ctx.globalAlpha = 0.45 * sp * (0.4 + 0.6 * (i / N)); ctx.fillRect(Math.floor(dx * k), dy * k, Math.ceil((p1 - p0) * k) + 1, dh * k); ctx.globalAlpha = 1;
  }
  ctx.restore();
};
// the soft shadow a lifted flap throws on the page beneath it
const flapShadow = (ctx: Ctx, env: Env, x0: number, x1: number, hinge: "left" | "right", phi: number) => {
  const k = env.scale, w = (x1 - x0) * Math.cos(phi), reach = 120 * Math.sin(phi);
  const a = hinge === "left" ? x0 + w : x1 - w, b = hinge === "left" ? a + reach : a - reach;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const gr = ctx.createLinearGradient(a * k, 0, b * k, 0);
  gr.addColorStop(0, `rgba(14,17,36,${0.35 * Math.sin(phi * 2)})`); gr.addColorStop(1, "rgba(14,17,36,0)");
  ctx.fillStyle = gr; ctx.fillRect(Math.min(a, b) * k, 0, Math.abs(b - a) * k, H * k); ctx.restore();
};
const offscreen = (env: Env, key: string): Layer => {
  const k = `ep01:${key}:${env.scale}`; let L = env.cache.get(k) as Layer | undefined;
  if (!L) { L = env.canvas(Math.round(W * env.scale), Math.round(H * env.scale)); env.cache.set(k, L); }
  L.ctx.setTransform(1, 0, 0, 1, 0, 0); L.ctx.clearRect(0, 0, L.canvas.width, L.canvas.height); return L;
};
// the window pane up close: blue glass behind white glazing bars, painted on the outside of two shutters
const pane = (g: Gfx, f: number) => {
  paperLayer(g, [{ shape: rect(-20, -20, W + 20, H + 20), color: mix(C.sky, C.navy, 0.12), seed: 700, fibre: 0.5 }]);
  glow(g, W / 2 + 120, H / 2 + 300, 700, 0.6 + 0.1 * Math.sin(f * 0.7));
  paperLayer(g, [{ shape: rect(W / 2 - 22, -20, W / 2 + 22, H + 20), color: "#EFE7D6", seed: 701, lift: 1.2 }, { shape: rect(-20, H / 2 - 22, W + 20, H / 2 + 22), color: "#EFE7D6", seed: 702, lift: 1.2 }]);
};

// ---------------------------------------------------------------- the frame
const breathe = (f: number) => 1 + 0.012 * (0.5 - 0.5 * Math.cos((f / 150) * Math.PI * 2));
const page = (ctx: Ctx, env: Env, f: number, draw: (g: Gfx) => void, cam?: { z: number; cx: number; cy: number; dx?: number; dy?: number }) => {
  const g = new Gfx(ctx, env, f, PENCIL);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  const b = breathe(f); g.push(W / 2 - b * W / 2, H / 2 - b * H / 2, b);
  if (cam) g.push(cam.cx - cam.z * cam.cx + (cam.dx ?? 0), cam.cy - cam.z * cam.cy + (cam.dy ?? 0), cam.z);
  notebook(g, W, H);
  draw(g);
  if (cam) g.pop();
  g.pop();
  return g;
};
const finish = (g: Gfx, f: number) => { caption(g, f); stamp(g, f); g.paper("paper", 0.12); };

// shot 1 · hook in the yard, the stamp, and the push into the awake window (0-110)
const sYard = (ctx: Ctx, f: number, env: Env) => {
  const win: P = [741, 1417], u = eIn(span(f, 90, 110));   // the awake window, after the yard sheet's tilt
  const z = 1 + 0.05 * span(f, 0, 90) + 30 * u;
  const g = page(ctx, env, f, (g2) => {
    g2.group("plain", () => marker(g2, "פרק 1 · שינה", RX, 168, 46, C.heart, 700, span(f, 0, 6)));
    const tw = measure(g2, "פרק 1 · שינה", 46, 700);
    wax(g2, () => [0, 1].forEach((k) => g2.pen(smooth(ring(RX - tw / 2, 152, tw / 2 + 34, 44 + k * 4, 14, -0.4 + k * 0.5), true, 6), { w: 3.2, color: C.heart, seed: 5 + k, wobble: 3, boil: 0, opacity: 0.85, retrace: false, progress: span(f, 4 + k * 4, 14 + k * 4) })));
    // frame 0 already holds the yard and the first word; the line is written in 0.6 s
    const lines = ["איפה הטלפון", "של הילד שלך", "ישן בלילה?"];
    highlight(g2, f, lines[2], 640, 118, 14, 9);
    g2.group("plain", () => lines.forEach((t, i) => marker(g2, t, RX, 360 + i * 140, 118, C.marker, 800, i === 0 ? 1 : span(f, 2 + (i - 1) * 6, 10 + (i - 1) * 6))));
    yard(g2, { childLit: 1, kitchenDot: 0, zzz: 0, day: 0, sun: 0, rays: 0, f, kid: u < 0.05 });
  }, { z, cx: win[0], cy: win[1], dx: (W / 2 - win[0]) * u, dy: (H / 2 - win[1]) * u });
  finish(g, f);
};
// shot 2 · the shutters swing open onto the bedroom (110-150)
const sShutters = (ctx: Ctx, f: number, env: Env) => {
  const g = page(ctx, env, f, (g2) => { bedroomScene(g2, f); }, { z: 1 + 0.03 * span(f, 110, 330), cx: 470, cy: 1218 });
  const cover = offscreen(env, "pane"); const gc = new Gfx(cover.ctx, env, f, PENCIL); cover.ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0); pane(gc, f);
  const phi = (Math.PI / 2) * eOut(span(f, 110, 144));
  flapShadow(ctx, env, 0, W / 2, "left", phi); flapShadow(ctx, env, W / 2, W, "right", phi);
  flap(ctx, env, cover, 0, W / 2, "left", phi); flap(ctx, env, cover, W / 2, W, "right", phi);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  finish(g, f);
};
// the bedroom page as it stands at frame f (used by shots 2-4 and under the page turns)
const bedroomScene = (g: Gfx, f: number) => {
  if (f < 450) {
    highlight(g, f, "20 דקות", 400, 170, 152, 302);
    headline(g, f, ["20 דקות"], 140, 400, 170, 0, 12);
    headline(g, f, ["פחות שינה בלילה"], 162, 560, 88, 0, 14);
    bedroom(g, { f, lit: 1, eyes: 0, hand: null, phoneOn: true, wedge: span(f, 196, 240), buzz: f % 30 < 14 });
  } else {
    highlight(g, f, "בחדר השינה", 520, 112, 506, 303);
    headline(g, f, ["בלי מכשירים", "בחדר השינה"], 474, 380, 112, 140, 14);
    // the hand comes in from the right, low over the bed, takes the phone and leaves the way it came
    const reach = eOut(span(twos(f), 470, 506)), lift = eIO(span(f, 516, 556)), exit = eIn(span(f, 556, 600));
    const hx = 1500 + (617 - 1500) * reach + 900 * exit, hy = 1214 - 90 * lift;
    const grip = span(f, 506, 518);
    const held = f >= 518;
    bedroom(g, { f, lit: 1 - eOut(span(f, 524, 566)), eyes: span(f, 548, 580), hand: held ? { x: hx, y: hy, grip } : null, phoneOn: !held, wedge: 1, buzz: false });
    if (f >= 470 && !held) hand(g, hx, hy, grip, false, Math.PI / 2);
  }
};
const sBedroom = (ctx: Ctx, f: number, env: Env) => {
  const camDx = f >= 556 ? -60 * eIn(span(f, 556, 600)) : 0;
  const g = page(ctx, env, f, (g2) => {
    bedroomScene(g2, f);
    source(g2, f, "Falbe et al., Pediatrics, 2015", 200, 420);
    source(g2, f, "AAP, Pediatrics, 2016", 490, 600);
  }, { z: 1 + 0.03 * span(f, 110, 330), cx: 470, cy: 1218, dx: camDx });
  finish(g, f);
};
// shots 4a/4b · the page turns to five nights and back (hinge on the right, as a Hebrew exercise book turns)
const sTurn = (ctx: Ctx, f: number, env: Env, from: (g: Gfx) => void, to: (g: Gfx) => void, at: number) => {
  const g = page(ctx, env, f, to);
  const top = offscreen(env, "turn"); const gt = new Gfx(top.ctx, env, f, PENCIL); top.ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0); notebook(gt, W, H); from(gt); gt.paper("paper", 0.12);
  const phi = (Math.PI / 2) * eIO(span(f, at, at + 18));
  flapShadow(ctx, env, 0, W, "right", phi); flap(ctx, env, top, 0, W, "right", phi);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  finish(g, f);
};
const sNights = (ctx: Ctx, f: number, env: Env) => {
  if (f < 348) return sTurn(ctx, f, env, (g) => bedroomScene(g, 329), (g) => nights(g, f), 330);
  if (f >= 450 && f < 468) return sTurn(ctx, f, env, (g) => nights(g, 449), (g) => bedroomScene(g, f), 450);
  const g = page(ctx, env, f, (g2) => nights(g2, f), { z: 1 + 0.06 * eIO(span(f, 348, 450)), cx: 540, cy: 1000 }); finish(g, f);
};
// shot 5 · the kitchen: the hand carries the phone in, lays it down, a blanket over it (600-750)
const sKitchen = (ctx: Ctx, f: number, env: Env) => {
  const g = page(ctx, env, f, (g2) => {
    highlight(g2, f, "מיטה משלו", 526, 116, 640, 304);
    headline(g2, f, ["לטלפון יש", "מיטה משלו"], 612, 380, 116, 146, 14);
    const inn = eOut(span(f, 600, 632)), down = eIO(span(f, 632, 656)), out = eIn(span(f, 666, 690));
    const placed = f >= 656;
    const hx = -500 + (411 - -500) * inn - 900 * out, hy = 1060 + 88 * down - 40 * out;
    kitchen(g2, { f, hand: f < 690 ? { x: hx, y: hy, grip: placed ? 1 - span(f, 656, 664) : 1, holding: !placed } : null, placed, blanket: lay(f, 674, 12, [10, -90]), screen: 1 - span(f, 690, 704), zzz: span(f, 706, 730) });
  }, { z: 1 + 0.06 * eIO(span(f, 680, 750)), cx: 560, cy: 1146, dx: 40 * (1 - eOut(span(f, 600, 640))) });
  finish(g, f);
};
// shot 6 · the kitchen closes like shutters; outside, the house asleep; morning is glued over the night (750-870)
const sMorning = (ctx: Ctx, f: number, env: Env) => {
  if (f < 768) {
    const g = page(ctx, env, f, (g2) => yardEnd(g2, f), { z: 1.6, cx: 640, cy: 1420 });
    const top = offscreen(env, "kit"); const gt = new Gfx(top.ctx, env, f, PENCIL); top.ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0); notebook(gt, W, H);
    kitchen(gt, { f: 749, hand: null, placed: true, blanket: { off: [0, 0], lift: 1, hide: false }, screen: 0, zzz: 1 }); highlight(gt, 749, "מיטה משלו", 526, 116, 640, 304); headline(gt, 749, ["לטלפון יש", "מיטה משלו"], 612, 380, 116, 146, 14); gt.paper("paper", 0.12);
    const phi = (Math.PI / 2) * eIO(span(f, 750, 768));
    flapShadow(ctx, env, 0, W / 2, "left", phi); flapShadow(ctx, env, W / 2, W, "right", phi);
    flap(ctx, env, top, 0, W / 2, "left", phi); flap(ctx, env, top, W / 2, W, "right", phi);
    ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
    return finish(g, f);
  }
  const g = page(ctx, env, f, (g2) => yardEnd(g2, f), { z: 1 + 0.6 * (1 - eOut(span(f, 768, 800))), cx: 640, cy: 1420 });
  finish(g, f);
};
const yardEnd = (g: Gfx, f: number) => {
  const lines = ["עוד קצת שינה.", "עוד קצת ילדות."];
  highlight(g, f, lines[1], 526, 112, 822, 305, C.leaf);
  headline(g, f, lines, 790, 380, 112, 146, 16);
  yard(g, { childLit: 0, kitchenDot: 1, zzz: span(f, 770, 796), day: span(f, 800, 838), sun: span(f, 812, 856), rays: span(f, 846, 866), f });
};
// shot 7 · the end card (870-990)
const sEnd = (ctx: Ctx, f: number, env: Env) => {
  const g = page(ctx, env, f, (g2) => endCard(g2, f), { z: 1 + 0.08 * eOut(span(f, 884, 960)), cx: W / 2, cy: 760 });
  if (f < 888) {   // the morning page turns over onto the end card
    const top = offscreen(env, "morning"); const gt = new Gfx(top.ctx, env, f, PENCIL); top.ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
    notebook(gt, W, H); yardEnd(gt, 869); stamp(gt, 869); gt.paper("paper", 0.12);
    const phi = (Math.PI / 2) * eIO(span(f, 870, 888));
    flapShadow(ctx, env, 0, W, "right", phi); flap(ctx, env, top, 0, W, "right", phi);
    ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  }
  g.paper("paper", 0.12);
};

const shot = (id: string, start: number, end: number, fn: (ctx: Ctx, f: number, env: Env) => void) => ({ id, start, end, draw: (ctx: Ctx, local: number, env: Env) => { NOW = start + local; fn(ctx, oldOf(NOW), env); } });

export const ep01: Film = {
  meta: {
    title: "עוד קצת ילדות · פרק 1 · שינה", W, H, fps: FPS, bpm: 60, durationFrames: DUR, kind: "explainer", poster: 40,
    holds: [[1050, 1110, "end card: the name, the logo and the question are read"]],
    captions: [
      { from: 3, to: 72, text: "איפה הטלפון של הילד שלך ישן בלילה?" },
      ...CAPS,
      { from: 870, to: 980, text: "עוד קצת שינה. עוד קצת ילדות." },
    ],
  },
  assets: { images: { logo: "assets/brand/logo.png", yaldutH: "assets/brand/yaldut/logo-horizontal.png", ySun: "assets/brand/yaldut/sun.png", yHills: "assets/brand/yaldut/hills.png", yWords: "assets/brand/yaldut/words.png" } },
  shots: [
    shot("yard", 0, 120, (c, f, e) => (f < 110 ? sYard(c, f, e) : sShutters(c, f, e))),
    shot("open", 120, 150, sShutters),
    shot("bedroom", 150, 420, sBedroom),
    shot("nights", 420, 570, (c, f, e) => (f < 468 ? sNights(c, f, e) : sBedroom(c, f, e))),
    shot("hand", 570, 690, sBedroom),
    shot("kitchen", 690, 840, sKitchen),
    shot("morning", 840, 990, sMorning),
    shot("end", 990, DUR, sEnd),
  ],
};
void rng; void blob;
