/* ============================================================
   JOLLOF LIVING — ui.js  (icons, helpers, components)
   ============================================================ */

const I = {
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
  bed:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M3 18v2m18-2v2M6 9V7a2 2 0 0 1 2-2h3v4"/></svg>',
  bath:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z"/><path d="M6 12V5a2 2 0 0 1 4 0M7 19l-1 2m11-2l1 2"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M16 4.6a3.2 3.2 0 0 1 0 6.2M17.5 14.4c2 .7 3.3 2.3 3.7 4.6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>',
  ok:"✓", x:"✕",
  checkCircle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-5"/></svg>',
  wifi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 8.5C8 3.5 16 3.5 21.5 8.5M5.5 12c4-3.4 9-3.4 13 0M9 15.3c2-1.7 4-1.7 6 0"/><circle cx="12" cy="18.6" r="1.2" fill="currentColor"/></svg>',
  pool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 17c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M2 21c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M8 15V5.5A1.5 1.5 0 0 1 11 5m0 3.5A1.5 1.5 0 0 1 14 10m-6 5V3.8"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 16v-4l1.8-4.2A2 2 0 0 1 7.7 6.5h8.6a2 2 0 0 1 1.9 1.3L20 12v4m-16 0v2m16-2v2M4 16h16M6.5 13.5h.01M17.5 13.5h.01"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5l7.5 3v6c0 4.8-3.2 8.2-7.5 10-4.3-1.8-7.5-5.2-7.5-10v-6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg>',
  wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M16 15h2.5"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4zM19 16l.9 2.6L22.5 19l-2.6.9L19 22.5l-.9-2.6L15.5 19l2.6-.9z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 2.5V7m8-4.5V7"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20.5S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11.4-8.5 11.4z"/></svg>',
  heartFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11.4-8.5 11.4z"/></svg>',
  sun:'<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M4.5 19.5l1.8-1.8M17.7 6.3l1.8-1.8"/></svg>',
  moon:'<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  xsvg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.4-4.1-1L3 21l1.6-5A8.5 8.5 0 1 1 21 12z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.6 4.2 5.6 4.2 9S14.8 18.4 12 21c-2.8-2.6-4.2-5.6-4.2-9S9.2 5.6 12 3z"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="8" width="17" height="4"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13M12 8s-4.5.2-5.5-2C5.8 4.2 8 2.6 9.5 3.8 11 5 12 8 12 8zm0 0s4.5.2 5.5-2c.7-1.8-1.5-3.4-3-2.2C13 5 12 8 12 8z"/></svg>',
  broom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13.5 3l7 7-1.8 1.8a3 3 0 0 1-4.2 0L8 5.2M7 8L3 20l9-3.5M4.5 15.5L9 19"/></svg>',
  key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="15" r="4.5"/><path d="M11.5 11.5L20 3m-3 3l3 3m-6 0l2.5 2.5"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v18M5 21h14M5 6l7-3 7 3M5 6l-2.5 7a3 3 0 0 0 5 0L5 6zm14 0l-2.5 7a3 3 0 0 0 5 0L19 6z"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V5a2 2 0 0 1 2-2h13v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H19v-4"/></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 20c0-9 4-15 15-16-.5 10-5 16-13 16M5 20c1.5-6 5-10 10-12"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5z"/></svg>',
  tv:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6.5" width="18" height="12" rx="2"/><path d="M8 3l4 3.5L16 3"/></svg>',
  dumbbell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 8v8m10-8v8M3.5 9.5v5M20.5 9.5v5M7 12h10"/></svg>',
  wine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 3h8l-.7 6a3.3 3.3 0 0 1-6.6 0zM12 15v6M8.5 21h7M8.5 3l-2 4.5a2.5 2.5 0 0 0 4.8 1M15.5 3l2 4.5a2.5 2.5 0 0 1-4.8 1"/></svg>',
  ac:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="7" width="19" height="10" rx="2"/><path d="M7 10v4m5-4v4m5-4v4"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8.5 7h2m3 0h2m-7 4h2m3 0h2m-7 4h2m3 0h2M10 21v-3h4v3"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',
  bot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4.5V8M8.5 13h.01M15.5 13h.01M9 16.5h6"/><circle cx="12" cy="4" r="1.6"/></svg>',
  exchange:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/></svg>',
  gold:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7.5l4.2 3.3L12 4.5l4.8 6.3L21 7.5l-1.6 10.5H4.6z"/><path d="M5 21h14"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6.5" width="19" height="13" rx="2.5"/><path d="M8.5 6.5L10 4h4l1.5 2.5M12 10a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>',
  zoom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16M11 8v6M8 11h6"/></svg>',
  chatBell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="M15.5 10.5l6-3v9l-6-3z"/></svg>',
  call:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2m4 0l-.8 12a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L5 7M10 11v6m4-6v6"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20h4L20 8l-4-4L4 16zM13.5 6.5l4 4"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="2.6"/><circle cx="17.5" cy="5.5" r="2.6"/><circle cx="17.5" cy="18.5" r="2.6"/><path d="M8.3 10.8l6.9-4M8.3 13.2l6.9 4"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  notification:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></svg>',
};

/* ---------------- helpers ---------------- */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k,d){ try{ const v = localStorage.getItem("jl_"+k); return v===null?d:JSON.parse(v);}catch(e){return d;} },
  set(k,v){ try{ localStorage.setItem("jl_"+k, JSON.stringify(v)); }catch(e){} },
};
let currency = store.get("currency","NGN");
const fmt = (ngn) => { const c = FX[currency]; const v = ngn*c.r; return c.s + (v>=1000 ? Math.round(v).toLocaleString("en-NG") : v.toFixed(c.d)); };
const K = (ngn) => fmt(ngn).replace(/,000$/,"k");
/* "pending" -> "Pending"; safe on empty/undefined input */
const cap = (s) => { s = String(s == null ? "" : s); return s ? s[0].toUpperCase() + s.slice(1) : s; };

const todayStr = (off=0) => { const d=new Date(); d.setDate(d.getDate()+off); return d.toISOString().slice(0,10); };

/* ------------- routing -------------
   Authoring uses "/path"; the PHP site serves real .php files (with
   pretty-URL rewrites in .htaccess, so /stays and /stay/onyx also work). */
const SITE_BASE = (JL.base || "").replace(/\/?$/, "/");
const PAGE_MAP = {
  "/": "", "/index": "",
  "/stays": "stays.php", "/map": "map.php",
  "/collections": "collections.php",
  "/experiences": "experiences.php",
  "/reviews": "reviews.php",
  "/blog": "blog.php",
  "/help": "help.php",
  "/membership": "membership.php",
  "/giftcards": "giftcards.php",
  "/referral": "referral.php",
  "/business": "business.php",
  "/about": "about.php",
  "/app": "app.php",
  "/future": "future.php",
  "/concierge": "concierge.php",
  "/messages": "messages.php",
  "/notifications": "notifications.php",
  "/trips": "trips.php",
  "/wishlist": "wishlist.php",
  "/compare": "compare.php",
  "/account": "account.php",
  "/auth": "auth.php",
  "/logout": "logout.php",
  "/host": "host.php",
  "/host/onboarding": "host-onboarding.php",
  "/host/dashboard": "host-dashboard.php",
  "/payments": "payments.php",
  "/neighborhoods": "neighborhoods.php",
  "/admin": "admin.php",
  "/admin-login": "admin-login.php",
  "/404": "404.php",
  "/confirm": "confirm.php",
};
const URL = (path) => {
  let p = path || "/", qs = "";
  const qi = p.indexOf("?"); if (qi > -1) { qs = p.slice(qi); p = p.slice(0, qi); }
  const seg = p.split("/").filter(Boolean);
  const s1 = seg[0] || "", s2 = seg[1] || "";
  const at = (f) => SITE_BASE + f;
  if (s1 === "stay" && s2) return at(`stay.php?p=${encodeURIComponent(s2)}`) + qs.replace("?", "&");
  if (s1 === "booking" && s2) return at(`booking.php?p=${encodeURIComponent(s2)}`) + qs.replace("?", "&");
  if (s1 === "neighborhood" && s2) return at(`neighborhood.php?n=${encodeURIComponent(s2)}`) + qs.replace("?", "&");
  if (s1 === "blog" && s2) return at(`blog-post.php?s=${encodeURIComponent(s2)}`) + qs.replace("?", "&");
  if (s1 === "confirm" && s2) return at(`confirm.php?ref=${encodeURIComponent(s2)}`);
  if (PAGE_MAP[p] !== undefined) return at(PAGE_MAP[p]) + qs;
  const one = PAGE_MAP["/" + s1];
  return at(one !== undefined ? one : "404.php") + qs;
};
/* navigate to an internal route */
function nav(path) { location.href = URL(path); }
/* current page id — printed by the PHP layout as <body data-page="…"> */
const PAGE_ID = (document.body && document.body.getAttribute("data-page")) || "index";
const qp = (k) => new URLSearchParams(location.search).get(k);
const qps = () => Object.fromEntries(new URLSearchParams(location.search).entries());

/* turns data-goto="/stay/onyx" into real page navigation.
   Anchors already carry a resolved href from URL(), so they need no handling
   here -- and must not be intercepted, or modifier-clicks / open-in-new-tab
   would break. */
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (!g) return;
  // let a nested link, button or control inside the card do its own thing
  const inner = e.target.closest("a[href], button, input, select, textarea, [data-heart], [data-cmp]");
  if (inner && inner !== g && g.contains(inner)) return;
  location.href = URL(g.dataset.goto);
});

/* ============================================================
   Global state.
   Anything durable (wishlists, compare, trips, points, notifications)
   is owned by MySQL and arrives in window.JL.state; the client keeps a
   mirror for instant UI feedback and POSTs every change to /api/*.php.
   Purely ephemeral things (filters, the booking wizard) stay local.
   ============================================================ */
const BOOT_STATE = JL.state || {};

const S = {
  /* server-owned */
  wishlists:      BOOT_STATE.wishlists      || { default: [] },
  activeWishlist: BOOT_STATE.activeWishlist || "default",
  compare:        BOOT_STATE.compare        || [],
  bookings:       BOOT_STATE.bookings       || [],
  waitlist:       BOOT_STATE.waitlist       || [],
  recent:         BOOT_STATE.recent         || [],
  points:         BOOT_STATE.points         || 0,
  tier:           BOOT_STATE.tier           || "bronze",
  hostListings:   BOOT_STATE.hostListings   || [],
  notifications:  NOTIFS,
  unreadMsgs:     BOOT_STATE.unreadMsgs     || 0,
  signedIn:       !!USER,

  /* view-local */
  requests: [],
  promoApplied: null,
  giftApplied: null,
  filters: { loc: "all", guests: 1, price: 500, type: "all", instants: false, flex: false },
  searchDates: null,
};

/* View preferences are the only thing still kept in the browser. */
const dump = () => {
  store.set("theme", document.documentElement.getAttribute("data-theme"));
  store.set("currency", currency);
};

/* Ask the server to re-send state after a mutation, then repaint. */
async function syncState(repaint) {
  const r = await api("state.php");
  if (r && r.ok && r.data) {
    Object.assign(S, r.data);
    S.signedIn = !!USER;
  }
  renderBadges();
  if (repaint !== false && typeof render === "function") render();
  return r;
}

/* Guests must sign in before anything is written to their account. */
function requireAuth(what) {
  if (S.signedIn) return true;
  toast("Sign in to " + (what || "continue") + " — it takes 90 seconds.", "lock");
  setTimeout(() => nav("/auth?next=" + encodeURIComponent(location.pathname + location.search)), 900);
  return false;
}

/* recent views are recorded server-side by stay.php; keep the mirror tidy */
function recentAdd(id) {
  const i = S.recent.indexOf(id);
  if (i > -1) S.recent.splice(i, 1);
  S.recent.unshift(id);
  if (S.recent.length > 10) S.recent.length = 10;
}

/* ---------------- toast ---------------- */
function toast(msg, icon="check") {
  const t=document.createElement("div"); t.className="toast";
  t.innerHTML=(I[icon]?I[icon]:I.check)+`<span>${msg}</span>`;
  $("#toasts").appendChild(t);
  setTimeout(()=>t.classList.add("out"),3600); setTimeout(()=>t.remove(),4100);
}

/* ---------------- modal / sheet ---------------- */
function openModal(html, cls="") {
  const body=$("#modalBody"), panel=$("#modalPanel");
  body.innerHTML=html; panel.className="modal-panel "+cls;
  $("#modalRoot").classList.add("open"); document.body.style.overflow="hidden";
  const s=body.querySelector(".mscroll"); if(s){ const t=body.querySelector(".mtop"); if(t) t.scrollIntoView({block:"start"}); }
}
function closeModal(){ $("#modalRoot").classList.remove("open"); document.body.style.overflow=""; }
function openSheet(html){ $("#sheetPanel").innerHTML=html; $("#sheetRoot").classList.add("open"); document.body.style.overflow="hidden"; }
function closeSheet(){ $("#sheetRoot").classList.remove("open"); document.body.style.overflow=""; }
document.getElementById("modalX").addEventListener("click", closeModal);

/* ---------------- charts (pure SVG) ---------------- */
function lineChart(data, opts={}) {
  const W=560,H=210,P=34, vals=data.map(d=>d.v), min=Math.min(...vals)*0.92, max=Math.max(...vals)*1.06;
  const x=i=>P+i*(W-2*P)/(data.length-1), y=v=>H-P-(v-min)/(max-min)*(H-2*P);
  let path="", area=`M${x(0)},${y(vals[0])}`;
  vals.forEach((v,i)=>{ path+=`${i?"L":"M"}${x(i)},${y(v)}`; area+=` L${x(i)},${y(v)}`; });
  area+=` L${x(vals.length-1)},${H-P} L${x(0)},${H-P} Z`;
  const last=vals[vals.length-1];
  const grid=[0,0.5,1].map(f=>H-P-f*(H-2*P)).map(gy=>`<line x1="${P}" x2="${W-P}" y1="${gy}" y2="${gy}" stroke="var(--line-soft)" stroke-width="1"/>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" role="img">
    ${grid}
    <path d="${area}" fill="var(--gold-soft)"/>
    <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round"/>
    ${vals.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${i===vals.length-1?5:2.6}" fill="${i===vals.length-1?"var(--accent)":"var(--card)"}" stroke="var(--accent)" stroke-width="1.6"/>`).join("")}
    <text x="${x(vals.length-1)}" y="${y(last)-12}" text-anchor="end" font-size="13" font-family="Cormorant Garamond,serif" font-weight="600" fill="var(--accent)">${opts.fmt?opts.fmt(last):last}</text>
    ${(opts.labels||[]).map((l,i)=>`<text x="${x(i)}" y="${H-10}" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)" font-family="Jost,sans-serif">${l}</text>`).join("")}
  </svg>`;
}
function barChart(data, opts={}) {
  const W=560,H=210,P=44, max=Math.max(...data.map(d=>d.v))*1.12;
  const bw=(W-2*P)/data.length*0.58;
  return `<svg viewBox="0 0 ${W} ${H}">
    <line x1="${P}" x2="${W-P}" y1="${H-P}" y2="${H-P}" stroke="var(--line)" stroke-width="1"/>
    ${data.map((d,i)=>{ const h=(d.v/max)*(H-2*P); const x=P+i*(W-2*P)/data.length+( (W-2*P)/data.length-bw)/2; return `<rect x="${x}" y="${H-P-h}" width="${bw}" height="${h}" rx="6" fill="${d.c||"var(--accent)"}" opacity="${d.c?"0.9":"0.85"}"/><text x="${x+bw/2}" y="${H-P+16}" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)" font-family="Jost,sans-serif">${d.l}</text>`;}).join("")}
  </svg>`;
}
function donutChart(parts, center) {
  const total=parts.reduce((a,p)=>a+p.v,0); let acc=0;
  const ring=parts.map(p=>{ const a0=acc/total*360; acc+=p.v; const a1=acc/total*360;
    const large=a1-a0>180?1:0; const r1=54,r0=34, c=(x,y)=>[x,y];
    const pt=(r,a)=>{ const rad=(a-90)*Math.PI/180; return [100+r*Math.cos(rad),100+r*Math.sin(rad)]; };
    const [x0,y0]=pt(r1,a0),[x1,y1]=pt(r1,a1),[x2,y2]=pt(r0,a1),[x3,y3]=pt(r0,a0);
    return `<path d="M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z" fill="${p.c}"/>`;}).join("");
  return `<svg viewBox="0 0 200 200" style="max-width:200px;margin:0 auto">${ring}<text x="100" y="96" text-anchor="middle" font-size="24" font-family="Cormorant Garamond,serif" font-weight="600" fill="var(--ink)">${center[0]}</text><text x="100" y="116" text-anchor="middle" font-size="10.5" fill="var(--ink-faint)" font-family="Jost,sans-serif">${center[1]}</text></svg>`;
}
function sparkline(data, w=120, h=34) {
  const min=Math.min(...data), max=Math.max(...data);
  const pts=data.map((v,i)=>`${(i*(w-8)/(data.length-1)+4)},${h-5-(v-min)/(max-min||1)*(h-10)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" style="width:${w}px;height:${h}px"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/></svg>`;
}

/* ---------------- prices & booking math ---------------- */
function nightsBetween(a,b){ const n=Math.round((new Date(b)-new Date(a))/864e5); return n>0?n:0; }
function priceMath(p, n, opts={}) {
  const monthly=n>=30, weekly=n>=7;
  const discRate=monthly?RATES.monthlyDisc:weekly?RATES.weeklyDisc:0;
  const nightly=p.price*(1-discRate);
  const subtotal=nightly*n;
  /* callers pass [{k:"transfer"},…]; a bare key is tolerated too. Percentage
     add-ons (insurance, carbon) charge a share of the subtotal, flat ones a
     fixed fee. An unknown key must never take the page down. */
  let addons=0;
  (opts.addons||[]).forEach(a=>{
    const key = (a && typeof a==="object") ? a.k : a;
    const def = ADDONS[key];
    if(!def) return;
    addons += def.price>=1 ? def.price : subtotal*def.price;
  });
  /* Mirror Pricing::quote() on the server exactly: the service fee is charged
     on subtotal + add-ons, and VAT on subtotal + add-ons + cleaning + service.
     This is only an estimate for display -- the server recalculates and its
     figure is the one charged -- but the two must agree or the review step
     shows a different number from the invoice. */
  const svc=Math.round((subtotal+addons)*RATES.service);
  const vat=Math.round((subtotal+addons+RATES.cleaning+svc)*RATES.vat);
  const deposit=Math.round(subtotal*RATES.deposit);
  let total=subtotal+addons+RATES.cleaning+svc+vat;
  if(opts.promo){ const pr=PROMOS[opts.promo]; if(pr) total-= pr.off? Math.round(total*pr.off) : (pr.flat||0); }
  if(opts.gift) total-=Math.min(opts.gift, total>0?Math.max(0,total):0);
  return { monthly, weekly, discRate, nightly, subtotal, addons, svc, vat, deposit, total: Math.max(0,Math.round(total)), split: monthly||weekly };
}
function persist(){ renderBadges(); }

/* ---------------- badges ---------------- */
function renderBadges() {
  const wl=$("#wlCount");
  if(wl) wl.textContent=Object.values(S.wishlists||{}).reduce((a,l)=>a+(l?l.length:0),0);

  /* read state lives in the database — S.unreadNotifs is authoritative */
  const nc=$("#notifCount");
  if(nc){
    const u=(typeof S.unreadNotifs==="number")
      ? S.unreadNotifs
      : (S.notifications||[]).filter(n=>n.unread).length;
    nc.textContent=u; nc.style.display=u?"grid":"none";
  }

  const mc=$("#msgCount");
  if(mc){ const m=S.unreadMsgs||0; mc.textContent=m; mc.style.display=m?"grid":"none"; }
}

/* ---------------- stay card ---------------- */
function stayCard(p) {
  const fav=(S.wishlists[S.activeWishlist]||[]).includes(p.id);
  const cmp=S.compare.includes(p.id);
  return `
  <article class="stay-card reveal in">
    <div class="stay-media" data-goto="/stay/${p.id}">
      <img src="${img(p.img)}" alt="${esc(p.name)}" loading="lazy">
      <span class="ribbon ${p.badgeGold?"gold":""}">${p.badgeGold?I.gold:I.shield}${esc(p.badge)}</span>
      <button class="heart-btn ${fav?"active":""}" data-heart="${p.id}" aria-label="Save to wishlist">${fav?I.heartFill:I.heart}</button>
    </div>
    <div class="stay-body">
      <div class="stay-top">
        <div>
          <h3 data-goto="/stay/${p.id}">${esc(p.name)}</h3>
          <div class="stay-loc">${I.pin}${esc(p.area)}, ${esc(p.city)}</div>
        </div>
        <div class="stay-rating">${I.star}${p.rating.toFixed(2)}<span class="rev">(${p.reviews})</span></div>
      </div>
      <div class="stay-specs">
        <span class="spec">${I.bed}${p.beds} bd</span><span class="spec">${I.bath}${p.baths} ba</span><span class="spec">${I.users}${p.guests} guests</span>
      </div>
      <div class="stay-foot">
        <div class="price">${p.oldPrice?`<span class="old-price">${fmt(p.oldPrice)}</span>`:""}<span class="amt" data-price="${p.price}">${fmt(p.price)}</span><span class="per">/night</span></div>
        <div class="btnrow" style="gap:6px">
          ${S.compare.length<3||cmp?`<button class="btn btn-ghost btn-sm" data-cmp="${p.id}">${I.scale.replace("fill=\"none\"","fill=\"none\"")}Compare</button>`:""}
          <button class="btn btn-green btn-sm" data-goto="/stay/${p.id}">View</button>
        </div>
      </div>
    </div>
  </article>`;
}

/* ---------------- calendar widget ---------------- */
function calWidget(sel, soldRanges) {
  const now=new Date();
  const calTitle=(m,y)=>new Date(m,y,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  const cells=(m,y)=>{
    const first=new Date(m,y,1).getDay(), days=new Date(m,y+1,0).getDate();
    let h=`${["S","M","T","W","T","F","S"].map(d=>`<div class="dow">${d}</div>`).join("")}`;
    for(let i=0;i<first;i++) h+="<span></span>";
    for(let d=1;d<=days;d++){
      const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const past=iso<todayStr();
      const sold=(soldRanges||[]).some(r=>iso>=r[0]&&iso<=r[1]);
      let cls="cd"; if(past) cls+=" past"; if(sold) cls+=" sold"; if(iso===todayStr()) cls+=" today";
      if(sel && iso===sel.in) cls+=" edge"; else if(sel && iso===sel.out) cls+=" edge";
      else if(sel && iso>sel.in && iso<sel.out) cls+=" inrange";
      h+=`<div class="${cls}" data-d="${iso}">${d}</div>`;
    }
    return h;
  };
  const state={m:now.getMonth(),y:now.getFullYear()};
  return `<div class="cal" id="calBox">
    <div class="cals-head">
      <button class="icon-btn" data-cal="-1" aria-label="Previous month">‹</button>
      <b id="calTitle">${calTitle(state.m,state.y)}</b>
      <button class="icon-btn" data-cal="1" aria-label="Next month">›</button>
    </div>
    <div class="cal-grid" id="calGrid">${cells(state.m,state.y)}</div>
  </div>`;
}
function bindCal(sel, soldRanges, onPick) {
  const box=$("#calBox"); if(!box) return;
  const title=$("#calTitle");
  let m=box.dataset.m?+box.dataset.m:new Date().getMonth(), y=box.dataset.y?+box.dataset.y:new Date().getFullYear();
  const render=()=>{
    box.dataset.m=m; box.dataset.y=y;
    title.textContent=new Date(m,y,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
    box.querySelectorAll("#calGrid .cd").forEach(()=>{});
    const grid=box.querySelector("#calGrid");
    const first=new Date(m,y,1).getDay(), days=new Date(m,y+1,0).getDate();
    let h=grid.querySelector(".dow")?grid.outerHTML.match(/<div class="dow">[^]*?<\/div>/g)[0]:"";
    let cell="";
    for(let i=0;i<first;i++) cell+="<span></span>";
    for(let d=1;d<=days;d++){
      const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const past=iso<todayStr();
      const sold=(soldRanges||[]).some(r=>iso>=r[0]&&iso<=r[1]);
      let cls="cd"; if(past) cls+=" past"; if(sold) cls+=" sold"; if(iso===todayStr()) cls+=" today";
      if(sel && iso===sel.in) cls+=" edge"; else if(sel && iso===sel.out) cls+=" edge";
      else if(sel && iso>sel.in && iso<sel.out) cls+=" inrange";
      cell+=`<div class="${cls}" data-d="${iso}">${d}</div>`;
    }
    grid.innerHTML=cell;
    grid.querySelectorAll(".cd").forEach(c=>c.addEventListener("click",()=>{
      const d=c.dataset.d;
      if(!sel.in||(sel.in&&sel.out)||d<=sel.in){ sel.in=d; sel.out=null; }
      else if(d>sel.in){ sel.out=d; }
      render(); onPick&&onPick(sel);
    }));
  };
  box.querySelectorAll("[data-cal]").forEach(b=>b.addEventListener("click",()=>{ m+=+b.dataset.cal; if(m<0){m=11;y--;} if(m>11){m=0;y++;} render(); }));
  render();
}

/* ---------------- review stars ---------------- */
function stars(n, size=14) {
  let h="";
  for(let i=1;i<=5;i++) h+=`<svg viewBox="0 0 24 24" class="${i<=n?"":"off"}"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>`;
  return `<span class="stars-row">${h}</span>`;
}

/* ---------------- page scaffolding ---------------- */
function pageHead(crumbs, title, sub, actions="") {
  return `<div class="page-head"><div class="wrap">
    <div class="crumbs">${crumbs.map(c=>c[1]?`<a href="${c[1]}">${c[0]}</a>`:c[0]).join(" &nbsp;/&nbsp; ")}</div>
    <h1>${title}</h1>
    ${sub?`<p>${sub}</p>`:""}
    ${actions?`<div class="head-actions">${actions}</div>`:""}
  </div></div>`;
}

/* delegated actions (navigation for data-goto/`#/` links lives in ui.js helpers above) */
document.addEventListener("click", (e)=>{
  const hb=e.target.closest("[data-heart]");
  if(hb){ e.stopPropagation(); toggleWish(hb.dataset.heart, hb); }
  const cb=e.target.closest("[data-cmp]");
  if(cb){ e.stopPropagation(); toggleCompare(cb.dataset.cmp); return; }
  const cls=e.target.closest("[data-closeall]");
  if(cls){ closeModal(); closeSheet(); }
  const cl2=e.target.closest("[data-close]");
  if(cl2){ closeDrawer(); }
});


/* ---------------- clipboard ---------------- */
async function copyText(text, message){
  try{
    if(navigator.clipboard && window.isSecureContext){ await navigator.clipboard.writeText(text); }
    else{
      const ta=document.createElement("textarea");
      ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast(message||"Copied to clipboard","share");
    return true;
  }catch(e){
    toast("Copy that manually: "+text,"share");
    return false;
  }
}
