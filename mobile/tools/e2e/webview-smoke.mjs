/* ============================================================
   JOLLOF LIVING — packaged-app smoke test
   ------------------------------------------------------------
   The other suite (app.mjs) swaps the Capacitor plugins for
   doubles. This one does the opposite: it boots the *shipping*
   bundle — the exact code inside the APK, real @capacitor/*
   packages and all — in a document served from https://localhost,
   which is how MainActivity serves it in the WebView.

   It proves the things that only break once the app is packaged:
   the plugins falling back to their browser implementations
   without throwing, storage surviving a restart, the offline copy
   painting with no network, and the back arrow the hardware key
   presses actually being there.

     node tools/e2e/webview-smoke.mjs
   ============================================================ */
import { build } from "esbuild";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const WWW = `${ROOT}/www`;

/* jsdom is a dev-only dependency; the repo's suites keep it in /tmp/jd. */
function loadJsdom() {
  const req = createRequire(import.meta.url);
  for (const spec of ["jsdom", "/tmp/jd/node_modules/jsdom/lib/api.js"]) {
    try {
      return req(spec);
    } catch {}
  }
  console.error("jsdom not found — npm i --prefix /tmp/jd jsdom");
  process.exit(2);
}
const { JSDOM, VirtualConsole } = loadJsdom();

const results = [];
const ok = (cond, label, detail = "") => {
  results.push(!!cond);
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* The shipping bundle, rebuilt as an IIFE because jsdom will not execute
   module scripts. Nothing else changes: no stubs, no substitutions. */
async function shippingBundle() {
  const out = await build({
    entryPoints: [`${ROOT}/src/js/app.js`],
    bundle: true,
    format: "iife",
    target: ["es2020"],
    write: false,
    define: { __JL_API__: JSON.stringify("https://example.test/api/mobile/") },
    logLevel: "silent",
  });
  return out.outputFiles[0].text;
}

/** Boot it the way MainActivity does: origin https://localhost, no network. */
async function launch(js, { storage = {}, online = false, respond = null } = {}) {
  const html = readFileSync(`${WWW}/index.html`, "utf8");
  const errors = [];
  const console2 = new VirtualConsole();
  console2.on("jsdomError", (e) => errors.push(String(e.message || e)));

  const dom = new JSDOM(html.replace(/<script[^>]*><\/script>/g, ""), {
    url: "https://localhost/index.html",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: console2,
  });
  const win = dom.window;

  for (const [k, v] of Object.entries(storage)) win.localStorage.setItem(k, v);
  Object.defineProperty(win.navigator, "onLine", { value: online, configurable: true });
  win.navigator.vibrate = () => true;
  win.matchMedia = win.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  win.scrollTo = () => {};
  win.fetch = async (url, init) => {
    if (!online) throw new win.Error("Failed to fetch");
    return respond ? respond(String(url), init) : { ok: true, status: 200, json: async () => ({}) };
  };
  win.HTMLCanvasElement.prototype.getContext = () => null;

  win.eval(js);
  await sleep(300);
  return { win, doc: win.document, errors };
}

const js = await shippingBundle();
console.log("Jollof Living — packaged app smoke test\n");

/* 1. First run: the app boots offline with no Capacitor bridge at all. */
{
  const { doc, win, errors } = await launch(js);
  const text = doc.body.textContent || "";
  ok(errors.length === 0, "boots with no native bridge", errors[0] || "no uncaught errors");
  ok(!!win.Capacitor, "Capacitor core initialised", win.Capacitor?.getPlatform?.());
  ok(win.Capacitor?.isNativePlatform?.() === false, "falls back to the web implementations");
  ok(/Jollof|Welcome|Lagos|Get started|Skip/i.test(text), "first screen painted", text.trim().slice(0, 40));
  ok(doc.querySelectorAll("[data-sprite], canvas").length > 0, "sprite animation mounted");
}

/* 2. Preferences with no native plugin must still persist: the web
      implementation writes to localStorage, which the WebView keeps for the
      life of the installed app. */
{
  const { win } = await launch(js);
  const prefs = win.Capacitor?.Plugins?.Preferences;
  ok(!!prefs, "Preferences plugin resolved");
  await prefs.set({ key: "jl_smoke", value: JSON.stringify({ saved: true }) });
  const back = await prefs.get({ key: "jl_smoke" });
  ok(back?.value === '{"saved":true}', "Preferences reads back what it wrote", back?.value);
  ok(win.localStorage.getItem("CapacitorStorage.jl_smoke") === '{"saved":true}',
     "…and it lands in the WebView's storage");
}

/* 3. A returning user with a cached catalogue sees it with no network. */
{
  const cached = {
    "CapacitorStorage.jl_onboarded": JSON.stringify(true),
    "CapacitorStorage.jl_catalogue": JSON.stringify({
      properties: [{ id: 1, slug: "ikoyi-penthouse", title: "Ikoyi Penthouse", name: "Ikoyi Penthouse",
                     city: "Lagos", area: "Ikoyi", price: 250000, nightly: 250000, currency: "NGN",
                     rating: 4.9, reviews: 24, image: "ikoyi.jpg", images: ["ikoyi.jpg"],
                     bedrooms: 3, beds: 3, baths: 3, type: "Penthouse", amenities: [] }],
      collections: [], neighborhoods: [], experiences: [], blog: [], tiers: [],
      rates: {}, fx: {}, addons: {}, promos: {}, payMethods: [], reviews: [],
      areas: ["Ikoyi"], propertyTypes: ["Penthouse"],
    }),
  };
  const { doc, errors } = await launch(js, { storage: cached });
  const text = doc.body.textContent || "";
  ok(errors.length === 0, "opens offline from the cached copy", errors[0] || "no uncaught errors");
  ok(/Ikoyi Penthouse/.test(text), "the cached home is on screen with no network");
  ok(/offline/i.test(text), "offline notice shown");
}

/* 4. The hardware back button presses #navBack; it has to exist once the
      app is deeper than a root tab. */
{
  const { doc, win } = await launch(js, {
    storage: { "CapacitorStorage.jl_onboarded": JSON.stringify(true) },
  });
  const notifications = doc.querySelector('[data-go="notifications"]');
  if (notifications) notifications.click();
  await sleep(120);
  ok(!!doc.getElementById("navBack"), "back arrow (#navBack) present on a pushed screen");
}

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
