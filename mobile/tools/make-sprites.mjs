/* ============================================================
   JOLLOF LIVING — sprite sheet generator
   ------------------------------------------------------------
   Draws every animation frame by frame and writes one
   horizontal PNG strip per animation into src/sprites/.

   Generated rather than hand-drawn so the brand colours stay
   exact, the geometry always matches sprites.js, and anyone
   can regenerate them with `npm run sprites` after a tweak.
   ============================================================ */
import { PNG } from "pngjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../src/sprites");
mkdirSync(OUT, { recursive: true });

/* ---------------------------------------------------- brand palette */
const GOLD = [201, 162, 39];
const GOLD_SOFT = [226, 196, 106];
const GREEN = [26, 61, 42];
const GREEN_DEEP = [11, 15, 12];
const CREAM = [245, 240, 227];
const WHITE = [255, 255, 255];

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
const clamp01 = (t) => Math.max(0, Math.min(1, t));

/* ------------------------------------------------------ tiny canvas */
class Canvas {
  constructor(w, h) {
    this.w = w; this.h = h;
    this.d = new Uint8ClampedArray(w * h * 4);   // RGBA, transparent
  }
  blend(x, y, [r, g, b], a = 1) {
    if (a <= 0) return;
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    const d = this.d;
    const sa = Math.min(1, a);
    const da = d[i + 3] / 255;
    const out = sa + da * (1 - sa);
    if (out <= 0) return;
    d[i]     = (r * sa + d[i]     * da * (1 - sa)) / out;
    d[i + 1] = (g * sa + d[i + 1] * da * (1 - sa)) / out;
    d[i + 2] = (b * sa + d[i + 2] * da * (1 - sa)) / out;
    d[i + 3] = out * 255;
  }
  /** Anti-aliased disc. */
  disc(cx, cy, r, colour, alpha = 1) {
    if (r <= 0) return;
    const x0 = Math.floor(cx - r - 1), x1 = Math.ceil(cx + r + 1);
    const y0 = Math.floor(cy - r - 1), y1 = Math.ceil(cy + r + 1);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        const cov = clamp01(r + 0.5 - d);
        if (cov > 0) this.blend(x, y, colour, cov * alpha);
      }
    }
  }
  ring(cx, cy, r, thickness, colour, alpha = 1, fromA = 0, toA = TAU) {
    const steps = Math.max(24, Math.ceil(r * 7));
    for (let i = 0; i <= steps; i++) {
      const a = fromA + (toA - fromA) * (i / steps);
      this.disc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, thickness / 2, colour, alpha);
    }
  }
  line(x0, y0, x1, y1, thickness, colour, alpha = 1) {
    const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      this.disc(lerp(x0, x1, t), lerp(y0, y1, t), thickness / 2, colour, alpha);
    }
  }
  rect(x, y, w, h, colour, alpha = 1, radius = 0) {
    for (let yy = Math.floor(y); yy < y + h; yy++) {
      for (let xx = Math.floor(x); xx < x + w; xx++) {
        if (radius > 0) {
          const dx = Math.max(x + radius - xx - 0.5, 0, xx + 0.5 - (x + w - radius));
          const dy = Math.max(y + radius - yy - 0.5, 0, yy + 0.5 - (y + h - radius));
          if (Math.hypot(dx, dy) > radius) continue;
        }
        this.blend(xx, yy, colour, alpha);
      }
    }
  }
  star(cx, cy, r, colour, alpha = 1, rot = 0) {
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      const len = i % 2 === 0 ? r : r * 0.55;
      this.line(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len, Math.max(1.2, r * 0.16), colour, alpha);
    }
    this.disc(cx, cy, Math.max(1, r * 0.2), colour, alpha);
  }
}

/* Write frames side by side into one strip. */
function writeSheet(name, frames, w, h) {
  const png = new PNG({ width: w * frames.length, height: h });
  png.data.fill(0);
  frames.forEach((c, idx) => {
    const ox = idx * w;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const s = (y * w + x) * 4;
        const d = (y * png.width + ox + x) * 4;
        png.data[d] = c.d[s];
        png.data[d + 1] = c.d[s + 1];
        png.data[d + 2] = c.d[s + 2];
        png.data[d + 3] = c.d[s + 3];
      }
    }
  });
  const file = `${OUT}/${name}.png`;
  writeFileSync(file, PNG.sync.write(png));
  const kb = (PNG.sync.write(png).length / 1024).toFixed(0);
  console.log(`  ${name.padEnd(11)} ${String(frames.length).padStart(2)} frames  ${w}×${h}  ${kb} KB`);
}

/* ============================================================
   1. SKYLINE — Lagos towers rising, lights waking up.
   ============================================================ */
function skyline(n = 24, W = 360, H = 360) {
  const towers = [
    { x: 52,  w: 44, h: 150 }, { x: 104, w: 34, h: 208 },
    { x: 146, w: 52, h: 178 }, { x: 206, w: 38, h: 232 },
    { x: 252, w: 46, h: 162 }, { x: 306, w: 30, h: 196 },
  ];
  const out = [];
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);
    const base = 300;

    // moon arc
    const ma = -Math.PI * 0.85 + t * TAU * 0.12;
    c.disc(180 + Math.cos(ma) * 130, 150 + Math.sin(ma) * 90, 15, GOLD_SOFT, 0.5);

    towers.forEach((tw, i) => {
      // each tower eases up on its own beat, then holds
      const start = i * 0.05;
      const grow = ease(clamp01((t - start) / 0.42));
      const hh = tw.h * grow;
      if (hh < 2) return;
      c.rect(tw.x, base - hh, tw.w, hh, GREEN, 0.95, 3);
      c.rect(tw.x, base - hh, tw.w, Math.min(3, hh), GOLD, 0.55, 2);

      // windows switch on in a wave
      for (let wy = base - hh + 12; wy < base - 10; wy += 15) {
        for (let wx = tw.x + 8; wx < tw.x + tw.w - 8; wx += 13) {
          const phase = (wx * 0.021 + wy * 0.017 + i * 0.4);
          const lit = 0.5 + 0.5 * Math.sin(t * TAU + phase);
          if (lit > 0.45) c.rect(wx, wy, 5, 7, GOLD_SOFT, 0.35 + lit * 0.55, 1);
        }
      }
    });

    // ground line and its reflection
    c.rect(24, base, W - 48, 2.5, GOLD, 0.75, 1);
    towers.forEach((tw, i) => {
      const grow = ease(clamp01((t - i * 0.05) / 0.42));
      if (grow > 0.2) c.rect(tw.x, base + 3, tw.w, 16 * grow, GOLD, 0.09, 2);
    });

    // drifting stars
    for (let s = 0; s < 7; s++) {
      const sx = 40 + ((s * 61 + t * 34) % (W - 80));
      const sy = 44 + ((s * 37) % 74);
      c.star(sx, sy, 4 + (s % 2), CREAM, 0.2 + 0.5 * Math.abs(Math.sin(t * TAU + s)), t * 2);
    }
    out.push(c);
  }
  return out;
}

/* ============================================================
   2. KEYS — a key turning, unlocking a home.
   ============================================================ */
function keys(n = 20, W = 360, H = 360) {
  const out = [];
  const cx = 180, cy = 176;
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);
    const turn = ease(clamp01((t - 0.15) / 0.5)) * (Math.PI / 2);

    // door plate
    c.rect(96, 78, 168, 216, GREEN, 0.9, 16);
    c.rect(96, 78, 168, 216, GOLD, 0.16, 16);
    c.ring(cx, cy, 54, 2.4, GOLD, 0.5);

    // the key, rotating
    const kr = turn;
    const bowR = 21;
    const bx = cx - Math.cos(kr) * 40, by = cy - Math.sin(kr) * 40;
    c.ring(bx, by, bowR, 6.5, GOLD, 1);
    c.disc(bx, by, bowR - 7, GREEN_DEEP, 0.85);
    const tipX = cx + Math.cos(kr) * 52, tipY = cy + Math.sin(kr) * 52;
    c.line(bx, by, tipX, tipY, 7, GOLD, 1);
    // teeth
    const px = -Math.sin(kr), py = Math.cos(kr);
    for (let i = 0; i < 3; i++) {
      const at = 0.72 + i * 0.1;
      const ax = lerp(bx, tipX, at), ay = lerp(by, tipY, at);
      const len = 12 - i * 2.5;
      c.line(ax, ay, ax + px * len, ay + py * len, 5.5, GOLD, 1);
    }

    // unlocked: the glow blooms
    const open = clamp01((t - 0.62) / 0.38);
    if (open > 0) {
      c.disc(cx, cy, 40 + open * 78, GOLD, 0.2 * (1 - open));
      c.ring(cx, cy, 54 + open * 46, 3 * (1 - open) + 0.6, GOLD_SOFT, 0.7 * (1 - open));
      for (let s = 0; s < 8; s++) {
        const a = (s / 8) * TAU + open * 1.1;
        const d = 70 + open * 74;
        c.star(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 8 * (1 - open * 0.5), GOLD_SOFT, 0.85 * (1 - open), a);
      }
    }
    out.push(c);
  }
  return out;
}

/* ============================================================
   3. CONCIERGE — a bell with sound rings, always on call.
   ============================================================ */
function concierge(n = 22, W = 360, H = 360) {
  const out = [];
  const cx = 180, base = 240;
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);
    const ring = Math.sin(t * TAU * 2);
    const tilt = ring * 0.13;

    // desk
    c.rect(76, base + 6, 208, 9, GREEN, 0.95, 4);
    c.rect(76, base + 6, 208, 2.5, GOLD, 0.4, 2);

    // dome, drawn as stacked arcs so the tilt reads
    for (let i = 0; i < 46; i++) {
      const p = i / 45;
      const y = base - p * 96;
      const halfW = Math.sqrt(Math.max(0, 1 - p * p)) * 78;
      const sx = cx + tilt * (base - y) * 0.55;
      c.line(sx - halfW, y, sx + halfW, y, 2.6, GREEN, 0.95);
      if (p > 0.72) c.line(sx - halfW * 0.62, y, sx + halfW * 0.2, y, 2, GOLD_SOFT, 0.2);
    }
    const topX = cx + tilt * 96 * 0.55;
    c.disc(topX, base - 100, 9, GOLD, 1);
    c.rect(cx - 84 + tilt * 8, base - 6, 168, 8, GOLD, 0.9, 4);

    // sound rings on the strike
    for (let r = 0; r < 3; r++) {
      const phase = (t * 2 + r * 0.33) % 1;
      if (phase < 0.62) {
        const rad = 74 + phase * 108;
        c.ring(cx, base - 54, rad, 2.6, GOLD_SOFT, 0.5 * (1 - phase / 0.62), -Math.PI * 0.86, -Math.PI * 0.14);
      }
    }
    // a couple of sparkles on the ring-out
    if (ring > 0.55) {
      c.star(cx - 96, base - 120, 9, GOLD_SOFT, (ring - 0.55) * 1.9, t * 3);
      c.star(cx + 100, base - 104, 7, GOLD_SOFT, (ring - 0.55) * 1.6, -t * 3);
    }
    out.push(c);
  }
  return out;
}

/* ============================================================
   4. COMPASS — a needle finding its bearing. Discovery.
   ============================================================ */
function compass(n = 24, W = 360, H = 360) {
  const out = [];
  const cx = 180, cy = 180;
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);

    c.ring(cx, cy, 108, 3, GOLD, 0.85);
    c.ring(cx, cy, 96, 1.2, GOLD, 0.28);
    for (let m = 0; m < 12; m++) {
      const a = (m / 12) * TAU - Math.PI / 2;
      const long = m % 3 === 0;
      c.line(cx + Math.cos(a) * (long ? 84 : 90), cy + Math.sin(a) * (long ? 84 : 90),
             cx + Math.cos(a) * 100, cy + Math.sin(a) * 100,
             long ? 3.4 : 1.6, GOLD, long ? 0.9 : 0.45);
    }

    // needle: spins fast, then settles on north with a small overshoot
    const settle = clamp01(t / 0.72);
    const spin = (1 - ease(settle)) * TAU * 2.2;
    const wobble = settle >= 1 ? Math.sin((t - 0.72) * TAU * 3) * 0.05 : 0;
    const a = -Math.PI / 2 + spin + wobble;

    // Needle as two solid triangles meeting at the hub: gold pointing
    // north, pale cream trailing south. Filled by scanning each triangle
    // rather than stroking lines, which used to read as a striped cone.
    const nx = cx + Math.cos(a) * 76, ny = cy + Math.sin(a) * 76;
    const sx = cx - Math.cos(a) * 64, sy = cy - Math.sin(a) * 64;
    const px = -Math.sin(a), py = Math.cos(a);
    const tri = (tipX, tipY, halfW, colour, alpha) => {
      const steps = 90;
      for (let i = 0; i <= steps; i++) {
        const p = i / steps;                     // 0 at hub, 1 at tip
        const w = halfW * (1 - p);               // taper to a point
        const bx = lerp(cx, tipX, p), by = lerp(cy, tipY, p);
        c.line(bx + px * w, by + py * w, bx - px * w, by - py * w, 2.2, colour, alpha);
      }
    };
    tri(nx, ny, 14, GOLD, 0.98);
    tri(sx, sy, 12, CREAM, 0.5);
    c.disc(cx, cy, 12, GREEN_DEEP, 1);
    c.ring(cx, cy, 12, 3, GOLD, 1);
    c.disc(cx, cy, 4, GOLD_SOFT, 1);

    if (settle >= 1) {
      const pulse = Math.abs(Math.sin((t - 0.72) * TAU * 1.6));
      c.ring(cx, cy, 118 + pulse * 12, 2, GOLD, 0.3 * (1 - pulse));
      c.star(nx, ny, 11, GOLD_SOFT, 0.55 + pulse * 0.45, t * 2);
    }
    out.push(c);
  }
  return out;
}

/* ============================================================
   5. HEART — a wishlist save, drawn then pulsed.
   ============================================================ */
function heart(n = 18, W = 240, H = 240) {
  const out = [];
  const cx = 120, cy = 124;
  const shape = (u, s) => {
    // classic parametric heart
    const x = 16 * Math.pow(Math.sin(u), 3);
    const y = -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u));
    return [cx + x * s, cy + y * s];
  };
  for (let f = 0; f < n; f++) {
    const t = f / (n - 1);
    const c = new Canvas(W, H);
    const draw = clamp01(t / 0.5);
    const pop = clamp01((t - 0.5) / 0.28);
    const settle = clamp01((t - 0.78) / 0.22);
    const scale = 4.1 * (0.82 + ease(draw) * 0.18) * (1 + Math.sin(pop * Math.PI) * 0.16) * (1 - settle * 0.04);

    // filled body once the outline closes
    if (draw >= 1) {
      for (let ring = 1; ring >= 0.06; ring -= 0.055) {
        for (let i = 0; i <= 90; i++) {
          const [x, y] = shape((i / 90) * TAU, scale * ring);
          c.disc(x, y, scale * 0.5, GOLD, 0.14);
        }
      }
    }
    // outline being drawn
    const upto = Math.floor(120 * ease(draw));
    for (let i = 0; i <= upto; i++) {
      const [x, y] = shape((i / 120) * TAU, scale);
      c.disc(x, y, 3.6, GOLD, 1);
    }
    // burst on the pop
    if (pop > 0 && pop < 1) {
      for (let s = 0; s < 8; s++) {
        const a = (s / 8) * TAU + 0.3;
        const d = 52 + pop * 46;
        c.star(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 8 * (1 - pop), GOLD_SOFT, 0.9 * (1 - pop), a);
      }
    }
    out.push(c);
  }
  return out;
}

/* ============================================================
   6. SUCCESS — booking confirmed: a tick inside a ring.
   ============================================================ */
function success(n = 22, W = 260, H = 260) {
  const out = [];
  const cx = 130, cy = 130;
  for (let f = 0; f < n; f++) {
    const t = f / (n - 1);
    const c = new Canvas(W, H);
    const ring = ease(clamp01(t / 0.45));
    const tick = ease(clamp01((t - 0.4) / 0.34));
    const glow = clamp01((t - 0.72) / 0.28);

    c.disc(cx, cy, 74, GREEN, 0.22);
    c.ring(cx, cy, 74, 5, GOLD, 0.95, -Math.PI / 2, -Math.PI / 2 + TAU * ring);

    // the tick, drawn in two strokes
    const p1 = [cx - 32, cy + 2], p2 = [cx - 10, cy + 26], p3 = [cx + 36, cy - 26];
    if (tick > 0) {
      const first = clamp01(tick / 0.4);
      c.line(p1[0], p1[1], lerp(p1[0], p2[0], first), lerp(p1[1], p2[1], first), 8.5, GOLD, 1);
      if (tick > 0.4) {
        const second = clamp01((tick - 0.4) / 0.6);
        c.line(p2[0], p2[1], lerp(p2[0], p3[0], second), lerp(p2[1], p3[1], second), 8.5, GOLD, 1);
      }
    }
    if (glow > 0) {
      c.ring(cx, cy, 74 + glow * 34, 3 * (1 - glow) + 0.5, GOLD_SOFT, 0.6 * (1 - glow));
      for (let s = 0; s < 10; s++) {
        const a = (s / 10) * TAU;
        const d = 88 + glow * 52;
        c.star(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 8 * (1 - glow), GOLD_SOFT, 0.8 * (1 - glow), a);
      }
    }
    out.push(c);
  }
  return out;
}

/* ============================================================
   7. EMPTY — an open, waiting door. Used for empty lists.
   ============================================================ */
function empty(n = 20, W = 240, H = 240) {
  const out = [];
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);
    const breathe = Math.sin(t * TAU) * 0.5 + 0.5;

    // Doorway: a dark opening with warm light spilling out. The door
    // panel swings from the left hinge across a wide arc, so the frame
    // reads as genuinely opening and closing rather than shimmering.
    c.rect(62, 48, 116, 156, GREEN_DEEP, 1, 8);
    c.ring(120, 48 + 22, 50, 2.4, GOLD, 0.34, Math.PI, TAU);

    // light pouring through the gap, brighter the wider it opens
    const open = 0.18 + ease(breathe) * 0.78;      // 0 shut … 1 wide
    for (let y = 58; y < 198; y++) {
      const p = (y - 58) / 140;
      const spill = 1 - Math.abs(p - 0.5) * 0.55;
      c.line(70, y, 172, y, 1, GOLD_SOFT, 0.05 + open * 0.3 * spill);
    }

    // the swinging panel, hinged at x=70 and foreshortened as it opens
    const hinge = 70;
    const panelW = 100 * (1 - open * 0.86);
    c.rect(hinge, 58, Math.max(3, panelW), 140, GREEN, 0.97, 3);
    c.rect(hinge, 58, Math.max(3, panelW), 140, GOLD, 0.12, 3);
    if (panelW > 14) {
      c.rect(hinge + 8, 74, Math.max(2, panelW - 16), 48, GOLD, 0.1, 2);
      c.rect(hinge + 8, 132, Math.max(2, panelW - 16), 48, GOLD, 0.1, 2);
      c.disc(hinge + panelW - 9, 132, 3.6, GOLD, 0.95);
    }
    c.line(hinge + panelW, 58, hinge + panelW, 198, 3, GOLD, 0.85);
    c.rect(62, 48, 116, 156, GOLD, 0.16, 8);

    // welcome mat and a drifting sparkle
    c.rect(78, 200, 84, 8, GOLD, 0.24, 4);
    c.star(120 + Math.sin(t * TAU) * 34, 96 - breathe * 16, 7, GOLD_SOFT, 0.3 + breathe * 0.4, t * TAU);
    out.push(c);
  }
  return out;
}

/* ============================================================
   8. LOADING — an orbit of dots. Small and cheap.
   ============================================================ */
function loading(n = 16, W = 160, H = 160) {
  const out = [];
  const cx = 80, cy = 80;
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);
    c.ring(cx, cy, 44, 1.4, GOLD, 0.16);
    for (let d = 0; d < 8; d++) {
      const a = (d / 8) * TAU + t * TAU;
      const fade = 0.16 + 0.84 * ((d / 8 + t) % 1);
      c.disc(cx + Math.cos(a) * 44, cy + Math.sin(a) * 44, 4.4 + fade * 3.4, GOLD, fade);
    }
    c.disc(cx, cy, 7, GOLD_SOFT, 0.45 + 0.35 * Math.sin(t * TAU * 2));
    out.push(c);
  }
  return out;
}

/* ============================================================
   9. OFFLINE — a cloud with a slash, for the no-signal state.
   ============================================================ */
function offlineSheet(n = 18, W = 240, H = 240) {
  const out = [];
  for (let f = 0; f < n; f++) {
    const t = f / n;
    const c = new Canvas(W, H);
    const drift = Math.sin(t * TAU) * 5;
    const cx = 120 + drift, cy = 106;

    c.disc(cx - 30, cy + 10, 26, GREEN, 0.92);
    c.disc(cx + 2, cy - 12, 34, GREEN, 0.92);
    c.disc(cx + 34, cy + 8, 25, GREEN, 0.92);
    c.rect(cx - 32, cy + 8, 68, 26, GREEN, 0.92, 12);
    c.ring(cx + 2, cy - 12, 34, 2, GOLD, 0.2, Math.PI, TAU);

    // slash
    c.line(cx - 44, cy - 40, cx + 46, cy + 44, 7, GOLD, 0.95);

    // queued items waiting below, gently pulsing
    for (let i = 0; i < 3; i++) {
      const p = (t + i / 3) % 1;
      c.disc(96 + i * 24, 186, 5.4, GOLD_SOFT, 0.24 + 0.5 * Math.abs(Math.sin(p * Math.PI)));
    }
    out.push(c);
  }
  return out;
}

/* ------------------------------------------------------------ run */
console.log("Generating Jollof Living sprite sheets…\n");
writeSheet("skyline",  skyline(),      360, 360);
writeSheet("keys",     keys(),         360, 360);
writeSheet("concierge",concierge(),    360, 360);
writeSheet("compass",  compass(),      360, 360);
writeSheet("heart",    heart(),        240, 240);
writeSheet("success",  success(),      260, 260);
writeSheet("empty",    empty(),        240, 240);
writeSheet("loading",  loading(),      160, 160);
writeSheet("offline",  offlineSheet(), 240, 240);
console.log(`\nWritten to ${OUT}`);
