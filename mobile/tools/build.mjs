/* ============================================================
   JOLLOF LIVING — mobile build
   ------------------------------------------------------------
   Bundles the app into www/, which Capacitor copies into the
   APK. No framework and no transpiler: esbuild resolves the
   Capacitor plugin imports and emits one small module.

     node tools/build.mjs                 production API
     node tools/build.mjs --dev           local API from config.js
     node tools/build.mjs --api=https://… a specific server
   ============================================================ */
import { build } from "esbuild";
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = `${ROOT}/src`;
const OUT = `${ROOT}/www`;

const args = process.argv.slice(2);
const dev = args.includes("--dev");
const apiArg = args.find((a) => a.startsWith("--api="));

/* Which server the build talks to. */
let api = null;
if (apiArg) api = apiArg.slice(6);
else if (dev) {
  const cfg = readFileSync(`${SRC}/js/config.js`, "utf8");
  api = (cfg.match(/DEVELOPMENT_API\s*=\s*"([^"]+)"/) || [])[1] || null;
}

if (!existsSync(`${SRC}/sprites/skyline.png`)) {
  console.error("Sprite sheets are missing — run `npm run sprites` first.");
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

cpSync(`${SRC}/index.html`, `${OUT}/index.html`);
cpSync(`${SRC}/css`, `${OUT}/css`, { recursive: true });
cpSync(`${SRC}/sprites`, `${OUT}/sprites`, { recursive: true });

const result = await build({
  entryPoints: [`${SRC}/js/app.js`],
  bundle: true,
  format: "esm",
  target: ["es2020"],
  minify: true,
  sourcemap: false,
  outfile: `${OUT}/js/app.js`,
  define: api ? { __JL_API__: JSON.stringify(api) } : { __JL_API__: "undefined" },
  logLevel: "warning",
});

const size = (p) => (readFileSync(p).length / 1024).toFixed(0) + " KB";
console.log(`Built www/`);
console.log(`  js/app.js   ${size(`${OUT}/js/app.js`)}`);
console.log(`  css/app.css ${size(`${OUT}/css/app.css`)}`);
console.log(`  API         ${api || "production (see src/js/config.js)"}`);
if (result.warnings.length) console.log(`  ${result.warnings.length} warning(s)`);
