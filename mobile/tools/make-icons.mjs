/* ============================================================
   JOLLOF LIVING — launcher icon and splash screen
   ------------------------------------------------------------
   Writes the Android density buckets directly, so no design
   tool or network access is needed to rebuild the branding.

     node tools/make-icons.mjs
   ============================================================ */
import { PNG } from "pngjs";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_IMG = `${ROOT}/src/img`;
const RES = `${ROOT}/android/app/src/main/res`;
if (!existsSync(RES)) {
  console.error("Run `npx cap add android` first — no res/ folder yet.");
  process.exit(1);
}

const GOLD = [201, 162, 39];
const GOLD_SOFT = [226, 196, 106];
const BG = [11, 15, 12];
const GREEN = [26, 61, 42];
const CREAM = [247, 243, 232];
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

/* ---------------------------------------------------------------- art

   The launcher icon is the Jollof Living wordmark. Two details matter
   at icon sizes and both are easy to get wrong:

   - Downscaling by point-sampling shatters a fine serif face. Every
     source pixel in the footprint is averaged instead (`drawArt`).
   - Averaging then makes hairline strokes translucent and grey, so the
     coverage is gamma-boosted to keep the letterforms solid cream.

   The full logo lockup is deliberately not used here: its "PREMIUM
   RESIDENCES" line is illegible below about 96px. The lockup still
   appears on the splash screen, where there is room for it. */

let _artCache = null;
function art(file) {
  if (_artCache && _artCache.file === file) return _artCache;
  const src = PNG.sync.read(readFileSync(`${SRC_IMG}/${file}`));
  let x0 = src.width, y0 = src.height, x1 = 0, y1 = 0;
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      if (src.data[((y * src.width + x) << 2) + 3] > 12) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  _artCache = { file, src, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  return _artCache;
}

function drawArt(c, a, targetW, ox, oy, { gamma = 0.6, colour = CREAM } = {}) {
  const scale = targetW / a.w;
  const th = Math.round(a.h * scale);
  const step = 1 / scale;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < targetW; x++) {
      let sum = 0, n = 0;
      const sx0 = a.x0 + x * step, sy0 = a.y0 + y * step;
      for (let sy = Math.floor(sy0); sy < Math.min(a.y0 + a.h, sy0 + step); sy++) {
        for (let sx = Math.floor(sx0); sx < Math.min(a.x0 + a.w, sx0 + step); sx++) {
          sum += a.src.data[((sy * a.src.width + sx) << 2) + 3] / 255;
          n++;
        }
      }
      if (!n) continue;
      let alpha = sum / n;
      if (alpha <= 0.004) continue;
      blend(c, x + ox, y + oy, colour, Math.min(1, Math.pow(alpha, gamma)));
    }
  }
  return th;
}

/* The wordmark on the brand tile. `fill` is the share of the width the
   art occupies; adaptive foregrounds need a smaller one because the
   launcher masks the outer third away. */
function mark(size, fill = 0.74) {
  const c = canvas(size, size, BG);
  disc(c, size / 2, size / 2, size * 0.48, GREEN, 0.55);
  const a = art("wordmark-dark.png");
  const tw = Math.round(size * fill);
  const th = Math.round(a.h * (tw / a.w));
  drawArt(c, a, tw, Math.round((size - tw) / 2), Math.round((size - th) / 2));
  return c;
}

/* The old drawn key, kept for reference. */
function keyMark(size, withBackground = true) {
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
  // Legacy square/round icon: the tile is ours to fill.
  const c = mark(px);
  save(c, `${RES}/mipmap-${dpi}/ic_launcher.png`);
  save(c, `${RES}/mipmap-${dpi}/ic_launcher_round.png`);

  // Adaptive foreground. The launcher keeps only the middle ~66 of 108
  // units and animates within that, so the wordmark is drawn small and
  // centred on a transparent canvas — the background layer supplies the
  // colour. Drawing it straight avoids the old brightness-threshold copy,
  // which chewed the antialiasing off the serifs.
  const fgSize = px * 2;
  const fg = canvas(fgSize, fgSize, BG);
  for (let i = 3; i < fg.d.length; i += 4) fg.d[i] = 0;   // transparent
  const a = art("wordmark-dark.png");
  const tw = Math.round(fgSize * 0.52);
  const th = Math.round(a.h * (tw / a.w));
  drawArt(fg, a, tw, Math.round((fgSize - tw) / 2), Math.round((fgSize - th) / 2));
  save(fg, `${RES}/mipmap-${dpi}/ic_launcher_foreground.png`);
  console.log(`  ${dpi.padEnd(8)} ${px}×${px}`);
}

/* Splash: the real wordmark lockup, not a drawn substitute. The
   launcher icon has to survive being 48px and masked to a circle, so it
   stays the key emblem; a splash screen is big enough for the actual
   logo, which is what people recognise from the website. */
function loadLogo() {
  const src = PNG.sync.read(readFileSync(`${SRC_IMG}/logo-dark.png`));
  return { w: src.width, h: src.height, d: src.data };
}
function drawLogo(c, logo, targetW, ox, oy) {
  const scale = targetW / logo.w;
  const th = Math.round(logo.h * scale);
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < targetW; x++) {
      const sx = Math.min(logo.w - 1, Math.floor(x / scale));
      const sy = Math.min(logo.h - 1, Math.floor(y / scale));
      const i = (sy * logo.w + sx) * 4;
      const a = logo.d[i + 3] / 255;
      if (a > 0.01) blend(c, x + ox, y + oy, [logo.d[i], logo.d[i + 1], logo.d[i + 2]], a);
    }
  }
  return th;
}

/* Splash: the mark centred on the brand background. */
const SPLASH = [
  ["drawable", 480, 800], ["drawable-port-mdpi", 320, 480], ["drawable-port-hdpi", 480, 800],
  ["drawable-port-xhdpi", 720, 1280], ["drawable-port-xxhdpi", 960, 1600], ["drawable-port-xxxhdpi", 1280, 1920],
  ["drawable-land-mdpi", 480, 320], ["drawable-land-hdpi", 800, 480], ["drawable-land-xhdpi", 1280, 720],
  ["drawable-land-xxhdpi", 1600, 960], ["drawable-land-xxxhdpi", 1920, 1280],
];
const LOGO = loadLogo();
console.log("Splash screens");
for (const [dir, w, h] of SPLASH) {
  const c = canvas(w, h, BG);
  const targetW = Math.round(Math.min(w, h) * 0.52);
  const th = Math.round(LOGO.h * (targetW / LOGO.w));
  drawLogo(c, LOGO, targetW, Math.round((w - targetW) / 2), Math.round((h - th) / 2));
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
    <color name="ic_launcher_background">#13281C</color>
</resources>
`);
console.log("\nBranding written.");
