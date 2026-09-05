/* ============================================================
   JOLLOF LIVING — Android app entry point
   ============================================================ */
"use strict";

import { App as CapApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

import * as store from "./store.js";
import { S } from "./store.js";
import { $, $$, esc, svg, toast, tap } from "./ui.js";
import { mountAll, unmountAll } from "./sprites.js";
import * as R from "./router.js";
import * as G from "./screens-guest.js";
import * as A from "./screens-auth.js";
import * as O from "./screens-owner.js";

/* Which screen renders what, and how the bar above it looks. */
const SCREENS = {
  home:        { view: G.home,        title: "Jollof Living", root: true },
  explore:     { view: G.explore,     title: "Explore", root: true, bind: G.bindExplore },
  wishlist:    { view: G.wishlist,    title: "Wishlist", root: true },
  trips:       { view: G.trips,       title: "My trips", root: true },
  account:     { view: G.account,     title: "Account", root: true },
  owner:       { view: O.owner,       title: "Owner dashboard", root: true, bind: O.bindOwner },
  stay:        { view: G.stay,        title: "" },
  booking:     { view: G.booking,     title: "Confirm your stay", bind: G.bindBooking },
  confirmed:   { view: G.confirmed,   title: "Confirmed" },
  auth:        { view: A.auth,        title: "", bind: A.bindAuth },
  notifications: { view: G.notifications, title: "Notifications" },
  messages:    { view: G.messages,    title: "Messages" },
  "new-listing": { view: O.newListing, title: "Add a listing", bind: O.bindNewListing },
};

const TABS = [
  ["home", "Home", "home"],
  ["explore", "Explore", "compass"],
  ["wishlist", "Saved", "heart"],
  ["trips", "Trips", "trips"],
  ["account", "Account", "user"],
];

/* --------------------------------------------------------- render */

function render() {
  const app = $("#app");
  const { name, params } = R.current();
  const screen = SCREENS[name] || SCREENS.home;

  unmountAll(app);

  const showTabs = !!screen.root;
  const canBack = R.depth() > 1;
  const title = typeof screen.title === "function" ? screen.title(params) : screen.title;

  app.innerHTML = `
    ${(title || canBack) ? `<header class="appbar">
      ${canBack ? `<button class="back" id="navBack" aria-label="Back">${svg("back")}</button>` : ""}
      <h1>${esc(title || "")}</h1>
      ${screen.root ? `<button class="act" data-go="notifications" aria-label="Notifications">
          ${svg("bell")}${store.unreadNotifs() ? `<span class="dot" style="top:4px;right:4px">${store.unreadNotifs()}</span>` : ""}
        </button>` : ""}
    </header>` : ""}
    <main id="view">${screen.view(params)}</main>
    ${showTabs ? tabbar(name) : ""}
  `;

  const view = $("#view", app);
  mountAll(app);
  wire(app, view, params);
  screen.bind?.(view, params);
  window.scrollTo?.(0, 0);
}
R.attach(render);

function tabbar(active) {
  const owner = store.isOwner();
  const tabs = owner
    ? [["home", "Home", "home"], ["explore", "Explore", "compass"],
       ["owner", "Hosting", "chart"], ["trips", "Trips", "trips"], ["account", "Account", "user"]]
    : TABS;
  return `<nav class="tabbar">
    ${tabs.map(([k, label, icon]) => `<button data-go="${k}" class="${active === k ? "on" : ""}">
      ${svg(icon)}<span>${label}</span>
      ${k === "wishlist" && store.wishlistSlugs().length ? `<span class="dot">${store.wishlistSlugs().length}</span>` : ""}
    </button>`).join("")}
  </nav>`;
}

/* --------------------------------------------------- interactions */

function wire(app, view, params) {
  $("#navBack", app)?.addEventListener("click", () => { tap(); R.back(); });

  $$("[data-go]", app).forEach((el) => el.addEventListener("click", (e) => {
    e.stopPropagation();
    tap();
    R.go(el.dataset.go, el.dataset.mode ? { mode: el.dataset.mode } : {});
  }));

  $$("[data-open]", app).forEach((el) => el.addEventListener("click", (e) => {
    if (e.target.closest("[data-wish]")) return;      // the heart is its own control
    tap();
    R.go("stay", { slug: el.dataset.open });
  }));

  $$("[data-book]", app).forEach((el) => el.addEventListener("click", () => {
    tap();
    R.go("booking", { slug: el.dataset.book });
  }));

  /* Wishlist heart: flips instantly, then reconciles with the server. */
  $$("[data-wish]", app).forEach((el) => el.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!store.isSignedIn()) { R.go("auth"); return; }
    const slug = el.dataset.wish;
    const turningOn = !el.classList.contains("on");
    el.classList.toggle("on", turningOn);
    tap();

    if (turningOn) burstHeart(el);
    const r = await store.act({ do: "wishlist-toggle", property: slug });
    if (!r.ok && !r.queued) {
      el.classList.toggle("on", !turningOn);           // put it back
      toast(r.message || "Could not save that.", "bad");
    } else if (r.queued) {
      toast(r.message, "");
    }
  }));

  $$('[data-act="sync"]', app).forEach((b) => b.addEventListener("click", async () => {
    toast("Syncing…");
    const r = await store.sync({ force: true });
    toast(r.ok ? "Up to date ✨" : (r.message || "Could not sync."), r.ok ? "good" : "bad");
    render();
  }));

  $$('[data-act="signout"]', app).forEach((b) => b.addEventListener("click", async () => {
    await store.signOut();
    toast("Signed out.");
    R.reset("home");
  }));

  $$('[data-act="become-owner"]', app).forEach((b) => b.addEventListener("click", async () => {
    b.disabled = true;
    const r = await store.becomeOwner();
    b.disabled = false;
    toast(r.message || (r.ok ? "Hosting enabled ✨" : "Could not enable hosting."), r.ok ? "good" : "bad");
    if (r.ok) R.go("owner");
  }));

  $$('[data-act="read-all"]', app).forEach((b) => b.addEventListener("click", async () => {
    await store.act({ do: "notifications-read" });
    render();
  }));

  $$("[data-collection]", app).forEach((el) => el.addEventListener("click", () => {
    R.go("explore");
  }));
}

/** A one-shot heart sprite over the button that was just tapped. */
function burstHeart(anchor) {
  const rect = anchor.getBoundingClientRect();
  const holder = document.createElement("div");
  holder.style.cssText = `position:fixed;left:${rect.left + rect.width / 2 - 120}px;
    top:${rect.top + rect.height / 2 - 120}px;width:240px;height:240px;pointer-events:none;z-index:400`;
  const inner = document.createElement("div");
  holder.appendChild(inner);
  document.body.appendChild(holder);
  import("./sprites.js").then(({ mountSprite }) => {
    const s = mountSprite(inner, "heart", { loop: false, onEnd: () => { s.destroy(); holder.remove(); } });
    if (!s) holder.remove();
  });
}

/* ------------------------------------------------------- lifecycle */

function paintOffline() {
  const bar = $("#offlineBar");
  if (!bar) return;
  const waiting = S.queue.length;
  bar.textContent = waiting
    ? `Offline — ${waiting} change${waiting === 1 ? "" : "s"} will send when you reconnect`
    : "You are offline — showing your saved copy";
  bar.classList.toggle("on", !S.online);
}

async function boot() {
  try { await StatusBar.setStyle({ style: Style.Dark }); } catch {}
  try { await StatusBar.setBackgroundColor({ color: "#0B0F0C" }); } catch {}

  await store.hydrate();
  store.onChange(paintOffline);
  paintOffline();

  // First run gets the animated introduction.
  if (!S.onboarded) {
    const host = document.createElement("div");
    host.innerHTML = A.onboarding();
    document.body.appendChild(host);
    mountAll(host);
    A.bindOnboarding(host, () => {
      host.remove();
      render();
      store.sync();
    });
    try { await SplashScreen.hide(); } catch {}
    return;
  }

  render();
  try { await SplashScreen.hide(); } catch {}

  // Refresh in the background; the cached copy is already on screen.
  store.sync().then(() => render());

  // Android back button walks the stack, then leaves the app.
  CapApp.addListener("backButton", () => {
    if (!R.back()) CapApp.exitApp();
  });

  // Returning to the app after a while: quietly catch up.
  CapApp.addListener("appStateChange", ({ isActive }) => {
    if (isActive && (!S.syncedAt || Date.now() - S.syncedAt > 5 * 60 * 1000)) {
      store.sync().then(() => render());
    }
  });
}

/* Start as soon as the document is usable. Listening for DOMContentLoaded
   alone is a trap: if the bundle finishes parsing after that event has
   already fired, the callback never runs and the app never starts. */
let booted = false;
const bootOnce = () => { if (!booted) { booted = true; boot(); } };
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootOnce);
} else {
  bootOnce();
}
