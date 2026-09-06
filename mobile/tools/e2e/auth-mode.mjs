/* ============================================================
   JOLLOF LIVING — auth mode regression
   The reported bug: tapping "Sign in" opened the Create account
   screen. The cause was module-level `mode` persisting between
   visits, so whichever screen you saw last won. These checks pin
   the behaviour down: the tapped control decides the screen,
   every time, in any order.
   ============================================================ */
import { JSDOM, VirtualConsole } from "/tmp/jd/node_modules/jsdom/lib/api.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const WWW = resolve(HERE, "../../www");
const BASE = process.argv[2] || "http://localhost:8080";

let pass = 0, fail = 0;
const ok = (cond, label, detail = "") => {
  if (cond) { pass++; console.log(`  PASS  ${label}${detail ? `  — ${detail}` : ""}`); }
  else { fail++; console.log(`  FAIL  ${label}${detail ? `  — ${detail}` : ""}`); }
};

const vc = new VirtualConsole();
vc.on("jsdomError", () => {});

const dom = new JSDOM(readFileSync(`${WWW}/index.html`, "utf8"), {
  url: "https://localhost/", runScripts: "outside-only", pretendToBeVisual: true, virtualConsole: vc,
});
const { window } = dom;
const store = new Map();

window.fetch = async (url, init) => {
  const u = String(url).startsWith("http") ? String(url) : `${BASE}/api/mobile/${String(url).replace(/^\.?\//, "")}`;
  const r = await fetch(u, init);
  const body = await r.text();
  return { ok: r.ok, status: r.status, json: async () => JSON.parse(body), text: async () => body };
};
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.scrollTo = () => {};
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.__CAP__ = {
  Preferences: {
    get: async ({ key }) => ({ value: store.get(key) ?? null }),
    set: async ({ key, value }) => { store.set(key, value); },
    remove: async ({ key }) => { store.delete(key); },
  },
  Network: { getStatus: async () => ({ connected: true }), addListener: () => ({ remove() {} }) },
  Haptics: { impact: async () => {} },
  App: { addListener: () => ({ remove() {} }), exitApp: () => {} },
  StatusBar: { setStyle: async () => {}, setBackgroundColor: async () => {} },
  SplashScreen: { hide: async () => {} },
};

// skip onboarding so the auth screen is reachable directly
store.set("jl_onboarded", JSON.stringify(true));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
window.eval(readFileSync(resolve(HERE, "../../www-test/app.test.js"), "utf8"));
await wait(2500);

const $ = (s) => window.document.querySelector(s);
const $$ = (s) => [...window.document.querySelectorAll(s)];
const heading = () => ($("#view h1")?.textContent || "").trim();
/* The auth screen is not a root, so it hides the tab bar and shows a
   back arrow. Return to Account the way a user would. */
const goTab = async (name) => {
  const backBtn = $("#navBack");
  if (backBtn) { backBtn.dispatchEvent(new window.Event("click", { bubbles: true })); await wait(600); }
  const btn = $$(".tabbar button").find(
    (b) => (b.textContent || "").trim().toLowerCase() === name);
  if (!btn) throw new Error(`no ${name} tab: ${$$(".tabbar button").map((b) => b.textContent.trim())}`);
  btn.dispatchEvent(new window.Event("click", { bubbles: true }));
  await wait(600);
};
const tapAuth = async (mode) => {
  const sel = mode === "register" ? '[data-go="auth"][data-mode="register"]' : '[data-go="auth"][data-mode="signin"]';
  const el = $(sel);
  el?.dispatchEvent(new window.Event("click", { bubbles: true }));
  await wait(500);
  return !!el;
};

console.log("\n=== The tapped control decides the screen ===");

await goTab("account");
ok(!!$('[data-go="auth"][data-mode="signin"]'), "the account tab offers Sign in");

// 1. Sign in from a cold start
await tapAuth("signin");
ok(/welcome back/i.test(heading()), "Sign in opens the sign-in screen", heading());

// 2. Create account
await goTab("account");
await tapAuth("register");
ok(/create your account/i.test(heading()), "Create an account opens the register screen", heading());

// 3. THE BUG: sign in again, having just been on register
await goTab("account");
await tapAuth("signin");
ok(/welcome back/i.test(heading()),
  "Sign in still opens sign-in after visiting Create account", heading());

// 4. And back the other way, to be sure it is not simply pinned
await goTab("account");
await tapAuth("register");
ok(/create your account/i.test(heading()), "and Create account still works afterwards", heading());

// 5. The in-screen switch link keeps working
const link = $('[data-switch="signin"]');
link?.dispatchEvent(new window.Event("click", { bubbles: true }));
await wait(400);
ok(/welcome back/i.test(heading()), "the 'Already with us? Sign in' link switches too", heading());

console.log("\n=== The brand is present ===");
ok(!!$('#view img[src*="logo-light"], #view img[src*="wordmark"]'),
  "the auth screen shows the real Jollof Living mark",
  $('#view img[src*="logo"], #view img[src*="wordmark"]')?.getAttribute("src") || "none");

console.log(`\n================ SUMMARY ================\n${pass}/${pass + fail} checks passed`);
if (fail) process.exitCode = 1;
setTimeout(() => process.exit(fail ? 1 : 0), 100);
