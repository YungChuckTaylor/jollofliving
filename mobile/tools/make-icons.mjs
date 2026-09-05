/* ============================================================
   JOLLOF LIVING — launcher icon and splash screen
   ------------------------------------------------------------
   Writes the Android density buckets directly, so no design
   tool or network access is needed to rebuild the branding.

     node tools/make-icons.mjs
   ============================================================ */
import { PNG } from "pngjs";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RES = `${ROOT}/android/app/src/main/res`;
if (!existsSync(RES)) {
  console.error("Run `npx cap add android` first — no res/ folder yet.");
  process.exit(1);
}

const GOLD = [201, 162, 39];
const GOLD_SOFT = [226, 196, 106];
const BG = [11, 15, 12];
const GREEN = [26, 61, 42];
const clamp01 = (t) => Math.max(0, Math.min(1, t));

function canvas(w, h, bg) {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < d.length; i += 4) {
    d[i] = bg[0]; d[i + 1] = bg[1]; d[i + 2] = bg[2]; d[i + 3] = bg ? 255 : 0;
  }
  return { w, h, d };
}
function blend(c, x, y, col, a) {
  if (a <= 0 || x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  const i = ((y | 0) * c.w + (x | 0)) * 4;
  c.d[i] = col[0] * a + c.d[i] * (1 - a);
  c.d[i + 1] = col[1] * a + c.d[i + 1] * (1 - a);
  c.d[i + 2] = col[2] * a + c.d[i + 2] * (1 - a);
  c.d[i + 3] = 255;
}
function disc(c, cx, cy, r, col, alpha = 1) {
  for (let y = Math.floor(cy - r - 1); y <= cy + r + 1; y++)
    for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
      const cov = clamp01(r + 0.5 - Math.hypot(x + 0.5 - cx, y + 0.5 - cy));
      if (cov > 0) blend(c, x, y, col, cov * alpha);
    }
}
function ring(c, cx, cy, r, th, col, alpha = 1) {
  const steps = Math.max(60, Math.ceil(r * 9));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    disc(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r, th / 2, col, alpha);
  }
}
function line(c, x0, y0, x1, y1, th, col, alpha = 1) {
  const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    disc(c, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, th / 2, col, alpha);
  }
}
function save(c, path) {
  const png = new PNG({ width: c.w, height: c.h });
  png.data.set(c.d);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, PNG.sync.write(png));
}

/* The mark: a gold key inside a ring — the same motif as the
   onboarding "unlock" sprite, so app icon and first screen agree. */
function mark(size, withBackground = true) {
  const c = canvas(size, size, withBackground ? BG : BG);
  const s = size / 192;
  const cx = size / 2, cy = size / 2;

  if (withBackground) {
    disc(c, cx, cy, 92 * s, GREEN, 0.55);
    disc(c, cx, cy, 78 * s, BG, 1);
  }
  ring(c, cx, cy, 66 * s, 5 * s, GOLD, 0.9);

  // key: bow, shaft, two teeth
  const bowY = cy - 26 * s;
  ring(c, cx, bowY, 20 * s, 7.5 * s, GOLD, 1);
  disc(c, cx, bowY, 12.5 * s, BG, 1);
  line(c, cx, bowY + 18 * s, cx, cy + 40 * s, 8 * s, GOLD, 1);
  line(c, cx, cy + 20 * s, cx + 17 * s, cy + 20 * s, 7 * s, GOLD, 1);
  line(c, cx, cy + 33 * s, cx + 12 * s, cy + 33 * s, 6.5 * s, GOLD, 1);
  disc(c, cx, bowY, 4.5 * s, GOLD_SOFT, 0.85);
  return c;
}

/* Launcher icons, per density. */
const LAUNCHER = [["mdpi", 48], ["hdpi", 72], ["xhdpi", 96], ["xxhdpi", 144], ["xxxhdpi", 192]];
console.log("Launcher icons");
for (const [dpi, px] of LAUNCHER) {
  const c = mark(px);
  save(c, `${RES}/mipmap-${dpi}/ic_launcher.png`);
  save(c, `${RES}/mipmap-${dpi}/ic_launcher_round.png`);
  // Adaptive foreground needs generous padding — the system masks it.
  const fg = canvas(px * 2, px * 2, BG);
  const inner = mark(px * 2 * 0.62, false);
  const off = (px * 2 - inner.w) / 2;
  for (let y = 0; y < inner.h; y++)
    for (let x = 0; x < inner.w; x++) {
      const s = (y * inner.w + x) * 4;
      if (inner.d[s + 3]) {
        const near = inner.d[s] + inner.d[s + 1] + inner.d[s + 2];
        if (near > 60) blend(fg, x + off, y + off, [inner.d[s], inner.d[s + 1], inner.d[s + 2]], 1);
      }
    }
  save(fg, `${RES}/mipmap-${dpi}/ic_launcher_foreground.png`);
  console.log(`  ${dpi.padEnd(8)} ${px}×${px}`);
}

/* Splash: the mark centred on the brand background. */
const SPLASH = [
  ["drawable", 480, 800], ["drawable-port-mdpi", 320, 480], ["drawable-port-hdpi", 480, 800],
  ["drawable-port-xhdpi", 720, 1280], ["drawable-port-xxhdpi", 960, 1600], ["drawable-port-xxxhdpi", 1280, 1920],
  ["drawable-land-mdpi", 480, 320], ["drawable-land-hdpi", 800, 480], ["drawable-land-xhdpi", 1280, 720],
  ["drawable-land-xxhdpi", 1600, 960], ["drawable-land-xxxhdpi", 1920, 1280],
];
console.log("Splash screens");
for (const [dir, w, h] of SPLASH) {
  const c = canvas(w, h, BG);
  const size = Math.round(Math.min(w, h) * 0.34);
  const m = mark(size, false);
  const ox = Math.round((w - size) / 2), oy = Math.round((h - size) / 2);
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) {
      const s = (y * m.w + x) * 4;
      const bright = m.d[s] + m.d[s + 1] + m.d[s + 2];
      if (bright > 60) blend(c, x + ox, y + oy, [m.d[s], m.d[s + 1], m.d[s + 2]], 1);
    }
  save(c, `${RES}/${dir}/splash.png`);
}
console.log(`  ${SPLASH.length} sizes`);

/* Adaptive icon + brand colours. */
mkdirSync(`${RES}/mipmap-anydpi-v26`, { recursive: true });
const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
writeFileSync(`${RES}/mipmap-anydpi-v26/ic_launcher.xml`, adaptive);
writeFileSync(`${RES}/mipmap-anydpi-v26/ic_launcher_round.xml`, adaptive);

mkdirSync(`${RES}/values`, { recursive: true });
writeFileSync(`${RES}/values/ic_launcher_background.xml`,
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0B0F0C</color>
</resources>
`);
console.log("\nBranding written.");
