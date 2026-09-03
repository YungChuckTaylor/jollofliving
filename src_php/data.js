/* ============================================================
   JOLLOF LIVING — data.js  (database-backed)
   ------------------------------------------------------------
   Everything here used to be a hard-coded literal. It now comes
   from MySQL: includes/view.php prints a window.JL payload for the
   current page, and this module simply adapts it to the shapes the
   rendering code already expects.
   ============================================================ */
"use strict";

const JL = window.JL || {};
const BOOT = JL.data || {};

/* ---------------- pricing config ---------------- */
const FX = BOOT.fx || { NGN: { s: "\u20A6", r: 1, d: 0 } };
const RATES = BOOT.rates || {
  cleaning: 15000, service: 0.08, vat: 0.075,
  weeklyDisc: 0.12, monthlyDisc: 0.25, deposit: 0.20, insurance: 0.03,
};
const PROMOS = BOOT.promos || {};
const ADDONS = BOOT.addons || {};
const PAY_METHODS = BOOT.payMethods || [];
const AUTH_METHODS = ["Email", "Phone", "Google", "Apple", "Facebook"];

/* ---------------- catalogue ---------------- */
const PROPERTIES = BOOT.properties || [];
const COLLECTIONS = BOOT.collections || [];
const COLLECTION_MAP = BOOT.collectionMap || {};
const NEIGHBORHOODS = BOOT.neighborhoods || [];
const EXPERIENCES = BOOT.experiences || [];
const BLOG = BOOT.blog || [];

/* ---------------- editorial ---------------- */
const TESTIMONIALS = BOOT.testimonials || [];
const FAQS = BOOT.faqs || [];
const HELP_CATEGORIES = BOOT.helpCategories || [];
const ROADMAP = BOOT.roadmap || [];

/* ---------------- membership ---------------- */
const TIERS = BOOT.tiers || [];
const POINTS_LEDGER = BOOT.pointsLedger || [];

/* ---------------- user-scoped ---------------- */
const NOTIFS = BOOT.notifications || [];
const CONVERSATIONS = BOOT.conversations || [];

/* ---------------- back office ---------------- */
const ADMIN_STATE = BOOT.admin || {
  users: [], moderation: [], fraud: [], campaigns: [], audit: [], cms: [],
};
const ADMIN_STATS = BOOT.adminStats || {};

/* ---------------- signed-in user ---------------- */
const USER = JL.user || null;
const IS_ADMIN = !!JL.isAdmin;
const REFERRAL_CODE = (USER && USER.referral) || "JOLLOF";

/* ============================================================
   Image registry — real files served from assets/img, replacing
   the old base64 blob. img() returns a URL for a registry key.
   ============================================================ */
const IMG_BASE = (JL.imgBase || "assets/img/").replace(/\/?$/, "/");
const IMG_MAP = JL.images || {};

function img(key) {
  if (!key) return IMG_BASE + "p1.jpg";
  if (/^(https?:|data:|\/)/.test(key)) return key;           // absolute / uploaded
  if (IMG_MAP[key]) return IMG_BASE + IMG_MAP[key];
  if (/\.(jpe?g|png|webp|avif|gif)$/i.test(key)) return IMG_BASE + key;
  return IMG_BASE + key + ".jpg";
}

/* Gallery keys for a property: the images uploaded against the listing,
   falling back to the hero image. Only keys that resolve to a real file
   are returned, so a thumbnail strip never renders a broken image. */
function galleryKeys(p) {
  if (!p) return [];
  const known = (k) => !!k && (IMG_MAP[k] || /^(https?:|data:|\/)/.test(k) || /\.(jpe?g|png|webp|avif|gif)$/i.test(k));
  const out = [];
  for (const k of [p.img, ...(p.gallery || [])]) {
    if (known(k) && !out.includes(k)) out.push(k);
  }
  return out.length ? out : [p.img].filter(known);
}

/* Back-compat: legacy templates wrote `data:image/jpeg;base64,${ASSETS[k]}`.
   ASSETS is now a proxy returning a plain URL, and the build rewrites those
   template fragments to img(...) — this guard keeps stragglers working. */
const ASSETS = new Proxy({}, {
  get: (_t, k) => (typeof k === "string" ? img(k) : undefined),
  has: () => true,
});

/* ============================================================
   API client — every state change is persisted server-side.
   ============================================================ */
const API_BASE = JL.apiBase || "api/";

async function api(endpoint, payload, method) {
  const opts = {
    method: method || (payload ? "POST" : "GET"),
    headers: { "X-CSRF-Token": JL.csrf || "", "X-Requested-With": "fetch" },
    credentials: "same-origin",
  };
  if (payload) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(Object.assign({ csrf: JL.csrf || "" }, payload));
  }
  let res, body;
  try {
    res = await fetch(API_BASE + endpoint, opts);
    body = await res.json();
  } catch (err) {
    return { ok: false, message: "Network problem — please try again." };
  }
  return body && typeof body === "object" ? body : { ok: false, message: "Unexpected response." };
}

/* Fire-and-forget helper that surfaces the server message as a toast. */
function apiToast(endpoint, payload, okIcon) {
  return api(endpoint, payload).then((r) => {
    if (r.message) toast(r.message, r.ok ? (okIcon || "check") : "x");
    return r;
  });
}
