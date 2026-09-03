/* ============================================================
   Jollof Living — PHP front-end build
   ------------------------------------------------------------
   Takes the design sources in src_php/ and produces the browser
   bundle used by the PHP site:

     src_php/styles.css   ->  public_html/assets/css/site.css
     src_php/*.js         ->  public_html/assets/js/site.js

   Differences from the old static build:
     • images are real files under assets/img (no base64 payload)
     • all content arrives from MySQL via window.JL (see includes/view.php)
     • links point at .php routes
     • state changes POST to /api/*.php

   Run:  node tools/build_php.mjs
   ============================================================ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src_php');
const OUT_JS = path.join(ROOT, 'public_html/assets/js');
const OUT_CSS = path.join(ROOT, 'public_html/assets/css');

const ORDER = [
  'data.js',
  'ui.js',
  'pages-discovery.js',
  'pages-booking.js',
  'pages-comm.js',
  'pages-host.js',
  'pages-misc.js',
  'app.js',
];

fs.mkdirSync(OUT_JS, { recursive: true });
fs.mkdirSync(OUT_CSS, { recursive: true });

const parts = ORDER.map((f) => {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) throw new Error('missing module: ' + p);
  return `/* ===== ${f} ===== */\n` + fs.readFileSync(p, 'utf8');
});

const bundle = parts.join('\n\n').replace(/<\/script/g, '<\\/script');
fs.writeFileSync(path.join(OUT_JS, 'site.js'), bundle);
fs.writeFileSync(path.join(OUT_CSS, 'site.css'), fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8'));

console.log('site.js  ', bundle.length, 'bytes');
console.log('site.css ', fs.statSync(path.join(OUT_CSS, 'site.css')).size, 'bytes');
