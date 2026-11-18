import { Ctx, Env, rng } from "./core";
import { Film } from "./film";

const FPS = 30, BPM = 60, DURATION = 120;

const draw = (ctx: Ctx, local: number, env: Env) => {
  const W = env.W * env.scale, H = env.H * env.scale, r = rng(1);
  ctx.fillStyle = "#12161c"; ctx.fillRect(0, 0, W, H);
  // Everything below is a pure function of `local`. No clock, no Math.random, no assets.
  const t = local / DURATION;
  for (let i = 0; i < 90; i++) {
    const a = r() * Math.PI * 2, rad = (0.08 + r() * 0.36) * Math.min(W, H);
    const x = W / 2 + Math.cos(a + t * Math.PI * 2) * rad, y = H / 2 + Math.sin(a + t * Math.PI * 2) * rad;
    ctx.globalAlpha = 0.25 + r() * 0.6;
    ctx.fillStyle = "#e8e3d2";
    ctx.beginPath(); ctx.arc(x, y, (1 + r() * 2.5) * env.scale, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
};

export const look: Film = {
  meta: { title: "look", W: 1080, H: 1920, fps: FPS, bpm: BPM, durationFrames: DURATION },
  assets: { images: {} },
  shots: [{ id: "one", start: 0, end: DURATION, draw }],
  // audio: (sampleRate) => [left, right],   // see references/music/README.md before writing a note
};
