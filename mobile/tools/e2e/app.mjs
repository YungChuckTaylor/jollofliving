/**
 * Jollof Living Android app — end-to-end suite.
 *
 * Boots the real bundled app in jsdom against a running server and drives
 * it the way a thumb would: taps, form fills, screen changes. Then checks
 * the database actually changed and that the website agrees.
 *
 *   node tools/e2e/app.mjs [baseUrl]
 */
import { JSDOM, VirtualConsole } from "/tmp/jd/node_modules/jsdom/lib/api.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const WWW = resolve(HERE, "../../www");
const BASE = process.argv[2] || "http://localhost:8080";
const API = `${BASE}/api/mobile`;

const results = [];
const ok = (cond, label, detail = "") => {
  results.push({ passed: !!cond, label, detail });
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
  return !!cond;
};
const section = (t) => console.log(`\n=== ${t} ===`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------------------------------------------------- harness */

/** Boot the app exactly as the APK does, with storage and network stubbed. */
async function launch({ storage = {}, online = true } = {}) {
  const html = readFileSync(`${WWW}/index.html`, "utf8");
  const css = readFileSync(`${WWW}/css/app.css`, "utf8");
  const js = readFileSync(resolve(HERE, "../../www-test/app.test.js"), "utf8");

  const vc = new VirtualConsole();
  const errors = [];
  vc.on("jsdomError", (e) => errors.push(String(e.message || e)));

  const dom = new JSDOM(html.replace('<script type="module" src="js/app.js"></script>', ""), {
    url: "https://localhost/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const w = dom.window;

  // jsdom has no IntersectionObserver; sprites use it to pause off-screen.
  w.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { this.cb([{ isIntersecting: true, target: el }]); }
    disconnect() {}
  };
  w.scrollTo = () => {};
  w.fetch = (url, opts) => fetch(String(url), opts);
  w.AbortController = AbortController;
  w.prompt = () => null;

  // The device: storage that persists across launches, and a network switch.
  const store = { ...storage };
  const netListeners = [];
  const appListeners = {};
  w.__CAP__ = {
    Preferences: {
      get: async ({ key }) => ({ value: key in store ? store[key] : null }),
      set: async ({ key, value }) => { store[key] = value; },
      remove: async ({ key }) => { delete store[key]; },
    },
    Network: {
      getStatus: async () => ({ connected: online }),
      addListener: (ev, cb) => { netListeners.push(cb); return { remove() {} }; },
    },
    App: {
      addListener: (ev, cb) => { (appListeners[ev] ||= []).push(cb); return { remove() {} }; },
      exitApp: () => {},
    },
    SplashScreen: { hide: async () => {} },
    StatusBar: { setStyle: async () => {}, setBackgroundColor: async () => {} },
    Haptics: { impact: async () => {} },
  };

  const style = w.document.createElement("style");
  style.textContent = css;
  w.document.head.appendChild(style);

  const script = w.document.createElement("script");
  script.textContent = js;
  w.document.body.appendChild(script);

  await sleep(50);
  w.document.dispatchEvent(new w.Event("DOMContentLoaded"));
  await sleep(340);

  return {
    w, doc: w.document, errors, storage: store,
    goOnline: async () => { for (const cb of netListeners) await cb({ connected: true }); await sleep(700); },
    $: (s) => w.document.querySelector(s),
    $$: (s) => [...w.document.querySelectorAll(s)],
    text: () => w.document.body.textContent || "",
    click: async (sel, wait = 260) => {
      const el = typeof sel === "string" ? w.document.querySelector(sel) : sel;
      if (!el) throw new Error(`nothing to click: ${sel}`);
      el.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
      await sleep(wait);
    },
    set: (sel, v) => {
      const el = w.document.querySelector(sel);
      if (!el) throw new Error(`no field: ${sel}`);
      el.value = v;
      el.dispatchEvent(new w.Event("input", { bubbles: true }));
      el.dispatchEvent(new w.Event("change", { bubbles: true }));
    },
    wait: sleep,
  };
}

/* Direct API helpers for setting up and verifying state. */
const call = async (path, body, token) => {
  const r = await fetch(`${API}/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.json();
};

/* ============================================================ tests */

async function tFirstRun() {
  section("First run shows the animated onboarding");
  const app = await launch();
  const ob = app.$("#onboard");
  ok(!!ob, "the onboarding sequence appears on a fresh install");
  ok(app.$$("#onboard").length === 1, "exactly once, not layered twice",
    `${app.$$("#onboard").length} instances`);

  const slides = ob ? [...ob.querySelectorAll(".slide")] : [];
  ok(slides.length === 4, "it has four intro pages", `${slides.length} slides`);

  const sprites = ob ? [...ob.querySelectorAll("[data-sprite]")] : [];
  ok(sprites.length === 4, "each page carries a sprite animation", sprites.map((s) => s.dataset.sprite).join(", "));

  // the sheets must be wired up, not just declared
  const painted = sprites.filter((s) => (s.style.backgroundImage || "").includes("sprites/"));
  ok(painted.length === 4, "and every sprite has its sheet attached", `${painted.length}/4 painted`);

  // frames must actually advance
  const first = sprites[0];
  const before = first.style.backgroundPosition;
  await app.wait(420);
  const after = first.style.backgroundPosition;
  ok(before !== after, "the frames advance over time", `${before || "0 0"} → ${after}`);

  await app.click("#obSkip");
  ok(!app.$("#onboard"), "Skip dismisses it");
  ok(app.storage.jl_onboarded === "true", "and it is remembered, so it never nags again");
  return app;
}

async function tReturningUser() {
  section("A returning user goes straight in");
  const app = await launch({ storage: { jl_onboarded: "true" } });
  ok(!app.$("#onboard"), "no onboarding on later launches");
  ok(!!app.$(".tabbar"), "the tab bar is there");
  ok(app.$$(".tabbar button").length === 5, "with five destinations");
  return app;
}

async function tCatalogueSync() {
  section("The catalogue syncs from the database");
  const app = await launch({ storage: { jl_onboarded: "true" } });
  await app.wait(900);
  ok(!app.errors.length, "the app boots with no script errors", app.errors[0] || "");

  const cards = app.$$("[data-open]");
  ok(cards.length > 0, "homes from the database are on screen", `${cards.length} cards`);

  const stored = app.storage.jl_catalogue ? JSON.parse(app.storage.jl_catalogue) : null;
  ok(!!stored?.properties?.length, "and cached to the device for next time",
    `${stored?.properties?.length || 0} properties cached`);

  const server = await call("sync.php?scope=catalogue");
  ok(stored.properties.length === server.data.catalogue.properties.length,
    "the app holds exactly what the server sent",
    `app ${stored.properties.length} vs server ${server.data.catalogue.properties.length}`);
  return app;
}

async function tOfflineOpen() {
  section("It opens offline from the cached copy");
  const warm = await launch({ storage: { jl_onboarded: "true" } });
  await warm.wait(900);
  const cache = { ...warm.storage };

  const app = await launch({ storage: cache, online: false });
  await app.wait(400);
  const cards = app.$$("[data-open]");
  ok(cards.length > 0, "homes still render with no connection", `${cards.length} cards`);
  ok(app.$("#offlineBar")?.classList.contains("on"), "and an offline notice is shown");
}

async function tSignUpAndSync() {
  section("Signing up in the app creates a real account");
  const app = await launch({ storage: { jl_onboarded: "true" } });
  await app.wait(700);

  await app.click('.tabbar button[data-go="account"]');
  ok(/Sign in/i.test(app.text()), "a signed-out account tab invites you to sign in");

  await app.click('[data-go="auth"]');
  await app.wait(200);
  const email = `app${Date.now()}@example.com`;

  // switch to register
  const sw = app.$('[data-switch="register"]');
  if (sw) await app.click(sw);
  ok(!!app.$("#aName"), "the create-account form is shown");

  app.set("#aName", "App Tester");
  app.set("#aEmail", email);
  app.set("#aPass", "Password12345");
  await app.click("#aGo", 1400);

  ok(!!app.storage.jl_token, "a session token is stored on the device");
  const me = await call("auth.php", { action: "me" }, JSON.parse(app.storage.jl_token || '""'));
  ok(me.ok && me.data.user.email === email, "and the account exists on the server", me.data?.user?.email || me.message);
  return { app, email, token: JSON.parse(app.storage.jl_token) };
}

async function tWishlistBothWays() {
  section("Wishlist syncs both ways");
  const email = `wish${Date.now()}@example.com`;
  const reg = await call("auth.php", { action: "register", name: "Wish Tester", email, password: "Password12345" });
  const token = reg.data.token;

  // save one on the SERVER first
  await call("action.php", { do: "wishlist-toggle", property: "villa-azur" }, token);

  // the app should pick it up on launch
  const app = await launch({ storage: { jl_onboarded: "true", jl_token: JSON.stringify(token), jl_user: JSON.stringify(reg.data.user) } });
  await app.wait(1100);
  await app.click('.tabbar button[data-go="wishlist"]');
  ok(/Villa Azur/i.test(app.text()), "a home saved elsewhere shows in the app",
    app.text().slice(0, 60).replace(/\s+/g, " "));

  // now save one IN the app
  await app.click('.tabbar button[data-go="home"]');
  await app.wait(300);
  const heart = app.$("[data-wish]");
  const slug = heart?.dataset.wish;
  await app.click(heart, 900);
  ok(heart.classList.contains("on"), "tapping the heart fills it straight away");

  const after = await call("sync.php?scope=me", null, token);
  const saved = after.data.me.wishlists.default || [];
  ok(saved.includes(slug), "and the server has it moments later", saved.join(", "));
  return { token, email };
}

async function tBookingJourney() {
  section("Booking a stay, end to end");
  const email = `book${Date.now()}@example.com`;
  const reg = await call("auth.php", { action: "register", name: "Book Tester", email, password: "Password12345" });
  const token = reg.data.token;

  const app = await launch({ storage: { jl_onboarded: "true", jl_token: JSON.stringify(token), jl_user: JSON.stringify(reg.data.user) } });
  await app.wait(1100);

  await app.click("[data-open]", 400);
  ok(/night/i.test(app.text()), "the stay page opens with a nightly rate");
  const bookBtn = app.$("[data-book]");
  ok(!!bookBtn, "and offers a booking button");

  await app.click(bookBtn, 500);
  ok(!!app.$("#bIn"), "the booking form appears");
  await app.wait(900);
  ok(/Total/i.test(app.text()), "with a live price breakdown from the server");

  // Fixed dates collide across runs; derive a unique window each time.
  const offset = 300 + Math.floor(Math.random() * 900);
  const d = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  app.set("#bIn", d(offset));
  app.set("#bOut", d(offset + 4));
  await app.wait(900);

  await app.click("#bGo", 1600);
  const confirmed = /confirmed/i.test(app.text()) || /JL-/.test(app.text());
  ok(confirmed, "booking succeeds and the confirmation screen shows",
    (app.text().match(/JL-\d{4}-\d+/) || [""])[0]);

  await app.wait(300);
  const successSprite = app.$('[data-sprite="success"]');
  ok(!!successSprite, "with the success sprite animation",
    successSprite ? (successSprite.style.backgroundImage || "").slice(0, 40) : "not found");

  const state = await call("sync.php?scope=me", null, token);
  const refs = (state.data.me.bookings || []).map((b) => b.ref);
  ok(refs.length === 1, "exactly one booking reached the database", refs.join(", "));
  return { token, email, ref: refs[0] };
}

async function tOfflineQueue() {
  section("Offline actions queue and replay once");
  const email = `queue${Date.now()}@example.com`;
  const reg = await call("auth.php", { action: "register", name: "Queue Tester", email, password: "Password12345" });
  const token = reg.data.token;

  // warm the cache while online
  const warm = await launch({ storage: { jl_onboarded: "true", jl_token: JSON.stringify(token), jl_user: JSON.stringify(reg.data.user) } });
  await warm.wait(1100);
  const cache = { ...warm.storage };

  // go offline and save a wishlist
  const app = await launch({ storage: cache, online: false });
  await app.wait(400);
  const heart = app.$("[data-wish]");
  const slug = heart?.dataset.wish;
  await app.click(heart, 500);

  const queue = JSON.parse(app.storage.jl_queue || "[]");
  ok(queue.length === 1, "the action is written to the offline queue", `${queue.length} queued`);
  ok(queue[0].clientKey, "with a replay key so it cannot be applied twice");

  const server = await call("sync.php?scope=me", null, token);
  ok(!(server.data.me.wishlists.default || []).includes(slug),
    "and nothing has reached the server yet, as expected");

  // reconnect: a fresh launch with the queue present should flush it
  const back = await launch({ storage: app.storage, online: true });
  await back.wait(1500);
  const after = await call("sync.php?scope=me", null, token);
  ok((after.data.me.wishlists.default || []).includes(slug),
    "reconnecting sends it", (after.data.me.wishlists.default || []).join(", "));
  ok(JSON.parse(back.storage.jl_queue || "[]").length === 0, "and clears the queue");
}

async function tOwnerDashboard() {
  section("Owner dashboard on real data");
  const login = await call("auth.php", { action: "login", email: "adebayo@jollofliving.com", password: "Password12345" });
  ok(login.ok, "an owner can sign in", login.message);
  const token = login.data.token;

  const app = await launch({ storage: { jl_onboarded: "true", jl_token: JSON.stringify(token), jl_user: JSON.stringify(login.data.user) } });
  await app.wait(1400);

  const hostTab = app.$('.tabbar button[data-go="owner"]');
  ok(!!hostTab, "an owner gets a Hosting tab in the bar");
  await app.click(hostTab, 500);

  const txt = app.text();
  ok(/Occupancy/i.test(txt), "the overview shows real occupancy");
  ok(/Add a listing/i.test(txt), "and offers to add a listing");

  // every tab must render
  const tabs = ["listings", "bookings", "calendar", "earnings", "payouts"];
  const broken = [];
  for (const t of tabs) {
    const btn = app.$(`[data-tab="${t}"]`);
    if (!btn) { broken.push(`${t}: no tab`); continue; }
    await app.click(btn, 380);
    if ((app.text() || "").length < 200) broken.push(`${t}: blank`);
  }
  ok(broken.length === 0, "every owner tab renders", broken.join(", ") || `${tabs.length} tabs fine`);

  // listings must be the owner's own
  await app.click('[data-tab="listings"]', 400);
  const server = await call("sync.php?scope=owner", null, token);
  const count = (server.data.owner.listings || []).length;
  const shown = app.$$("[data-status]").length;
  ok(shown === count, "the listing count matches the database", `app ${shown} vs db ${count}`);
  return token;
}

async function tOwnerSubmitsListing(token) {
  section("A listing added on the phone reaches admin moderation");
  const app = await launch({ storage: { jl_onboarded: "true", jl_token: JSON.stringify(token),
    jl_user: JSON.stringify((await call("auth.php", { action: "me" }, token)).data.user) } });
  await app.wait(1400);
  await app.click('.tabbar button[data-go="owner"]', 500);
  await app.click('[data-act="new-listing"]', 500);
  ok(!!app.$("#lTitle"), "the add-listing form opens");

  const title = `Phone Listing ${Date.now()}`;
  app.set("#lTitle", title);
  app.set("#lArea", "Ikoyi");
  app.set("#lPrice", "165000");
  app.set("#lDesc", "Submitted from the Android app by the test suite.");
  await app.click("#lGo", 1500);

  // It must appear in the admin moderation queue on the website. Reuse the
  // website's own e2e harness rather than hand-rolling the CSRF dance.
  const { mount, login } = await import("../../../tools/e2e/harness.mjs");
  const jar = await login(BASE, "ops@jollofliving.com", "SuperSecret123", "admin-auth.php");
  const admin = await mount(`${BASE}/admin.php?tab=moderation`, { cookies: jar });
  const queue = JSON.parse(admin.window.eval("JSON.stringify(JL.data.admin.moderation||[])"));
  const found = queue.find((m) => String(m[0]).includes(title));
  ok(!!found, "the phone-submitted listing is in the admin moderation queue", title);
  ok(found && found[6] === "listing", "tagged so Approve routes correctly", found ? found[6] : "");

  // and the admin can approve it, which publishes it for everyone
  if (found) {
    const res = await admin.window.eval(
      `(async()=>{const r=await api("admin-action.php",{entity:"moderation",action:"approve",id:${found[5]}});return JSON.stringify(r);})()`
    ).then(JSON.parse);
    ok(res.ok, "and approving it from the back office works", res.message || "");
  }
}

async function tSignOut() {
  section("Signing out clears the device");
  const email = `out${Date.now()}@example.com`;
  const reg = await call("auth.php", { action: "register", name: "Out Tester", email, password: "Password12345" });
  const app = await launch({ storage: { jl_onboarded: "true", jl_token: JSON.stringify(reg.data.token), jl_user: JSON.stringify(reg.data.user) } });
  await app.wait(1100);
  await app.click('.tabbar button[data-go="account"]', 400);
  ok(/Log out/i.test(app.text()), "the account tab offers Log out");
  await app.click('[data-act="signout"]', 700);
  ok(!app.storage.jl_token, "the token is wiped from the device");
  ok(/Sign in/i.test(app.text()), "and the app returns to a signed-out state");
}

/* ------------------------------------------------------------- run */

const app1 = await tFirstRun();
await tReturningUser();
await tCatalogueSync();
await tOfflineOpen();
await tSignUpAndSync();
await tWishlistBothWays();
await tBookingJourney();
await tOfflineQueue();
const ownerToken = await tOwnerDashboard();
await tOwnerSubmitsListing(ownerToken);
await tSignOut();

console.log("\n================ SUMMARY ================");
const pass = results.filter((r) => r.passed).length;
console.log(`${pass}/${results.length} checks passed`);
if (pass !== results.length) {
  console.log("\nFAILURES:");
  results.filter((r) => !r.passed).forEach((r) => console.log(`  - ${r.label}${r.detail ? ": " + r.detail : ""}`));
  process.exitCode = 1;
}
