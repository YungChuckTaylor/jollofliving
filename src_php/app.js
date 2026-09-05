/* ============================================================
   JOLLOF LIVING — app.js  (multi-page boot & per-page dispatch)
   Each page is a REAL .html file; this file reads <body data-page>
   and renders that page's view + wires the shared chrome.
   Load order: data.js → ui.js → pages-discovery.js →
   pages-booking.js → pages-comm.js → pages-host.js →
   pages-misc.js → app.js
   ============================================================ */

/* ---------------- per-page dispatch ---------------- */
const PAGE_RENDER = {
  index:            () => ({ html: pHome(), bind: bindHome }),
  stays:            () => ({ html: pStays(qps()), bind: bindStays }),
  map:              () => ({ html: pStays(qps()), bind: bindStays }),
  collections:      () => ({ html: pCollections(), bind: bindCollections }),
  neighborhoods:    () => ({ html: pNeighborhoods() }),
  experiences:      () => ({ html: pExperiences(), bind: bindExperiences }),
  reviews:          () => ({ html: pReviews() }),
  blog:             () => ({ html: pBlog() }),
  blog_post:        (p) => ({ html: pBlogPost(p) }),
  help:             () => ({ html: pHelp(qps()), bind: bindHelp }),
  membership:       () => ({ html: pMembership() }),
  giftcards:        () => ({ html: pGiftCards() }),
  referral:         () => ({ html: pReferral() }),
  business:         () => ({ html: pBusiness() }),
  about:            () => ({ html: pAbout() }),
  app:              () => ({ html: pApp() }),
  future:           () => ({ html: pFuture() }),
  concierge:        () => ({ html: pConcierge(qps()), bind: bindConcierge }),
  messages:         () => ({ html: pMessages(qps()), bind: bindMessages }),
  notifications:    () => ({ html: pNotif() }),
  trips:            () => ({ html: pTrips(qps()), bind: bindTrips }),
  wishlist:         () => ({ html: pWishlist(), bind: bindWishlist }),
  compare:          () => ({ html: pCompare() }),
  account:          () => ({ html: pAccount(), bind: bindAccount }),
  auth:             () => ({ html: pAuth(qp("mode") || "signin"), bind: bindAuth }),
  host:             () => ({ html: pHost(), bind: bindHost }),
  host_onboarding:  () => ({ html: pHostOnboarding(), bind: bindHostOnboarding }),
  host_dashboard:   () => ({ html: pHostDashboard(qps()), bind: bindHostDashboard }),
  payments:         () => ({ html: pPayments(qps()), bind: bindPayments }),
  admin:            () => ({ html: pAdmin(qps()), bind: bindAdminLogin }),
  admin_login:      () => ({ html: pAdminLogin(), bind: bindAdminLogin }),
  confirm:          () => ({ html: pConfirm(qp("ref") || "") }),
  notfound:         () => ({ html: p404() }),
  /* dynamic pages keyed by the id carried in <body data-page="stay-onyx"> */
  stay:             (p) => ({ html: pStay(p), bind: () => bindStay(p) }),
  booking:          (p) => ({ html: pBooking(p, qps()), bind: () => bindBooking(p, qps()) }),
  neighborhood:     (p) => ({ html: pNeighborhood(p) || p404() }),
  blog_post:        (p) => ({ html: pBlogPost(p) }),
};

function pageKey() {
  const id = PAGE_ID;                       // e.g. "stay-onyx" | "blog-jollof-100" | "host-dashboard"
  if (id.startsWith("stay-")) return ["stay", id.slice(5)];
  if (id.startsWith("booking-")) return ["booking", id.slice(8)];
  if (id.startsWith("neighborhood-")) return ["neighborhood", id.slice(13)];
  if (id.startsWith("blog-")) return ["blog_post", id.slice(5)];
  return [id.replace(/-/g, "_"), null];    // host-dashboard → host_dashboard
}

function render() {
  const [key, param] = pageKey();
  const entry = PAGE_RENDER[key] || PAGE_RENDER.notfound;
  let out;
  try { out = entry(param); } catch (err) { console.error(err); out = { html: p404() }; }
  const view = $("#view"); if (!view) return;
  view.innerHTML = out.html || p404();
  observeReveals();
  if (out.bind) { try { out.bind(); } catch (err) { console.error("[bind]", err); } }
  renderBadges();
  window.scrollTo(0, 0);
}

/* ---------------- theme ---------------- */
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  store.set("theme", t);
  const pick = (d, l) => (t === "dark" ? d : l);
  const wm = $("#brandImg"), dw = $("#drawerLogo"), fl = $("#footLogo");
  if (wm) wm.src = img(pick("wordmark-dark", "wordmark-light"));
  if (dw) dw.src = img(pick("wordmark-dark", "wordmark-light"));
  if (fl) fl.src = img(pick("logo-dark", "logo-light"));
}
$("#themeBtn").addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  toast(next === "dark" ? "Dark mode — good evening ✦" : "Light mode — good morning ☀", next === "dark" ? "moon" : "sun");
});

/* ---------------- header ---------------- */
addEventListener("scroll", () => { $("#header").classList.toggle("scrolled", scrollY > 30); }, { passive: true });

/* ---------------- active nav state ---------------- */
(function () {
  const id = PAGE_ID;
  const section =
    id === "index" ? "/" :
    id.startsWith("stay") || id.startsWith("booking") || id === "stays" || id === "map" || id === "collections" ? "/stays" :
    id === "experiences" ? "/experiences" :
    id.startsWith("neighborhood") ? "/neighborhoods" :
    id.startsWith("host") ? "/host" :
    id === "membership" ? "/membership" :
    id === "help" ? "/help" : null;
  if (!section) return;
  $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("data-r") === section));
})();

/* ---------------- drawer ---------------- */
function openDrawer() { $("#drawer").classList.add("open"); document.body.style.overflow = "hidden"; }
function closeDrawer() { const d = $("#drawer"); if (d) d.classList.remove("open"); document.body.style.overflow = ""; }
$("#burgerBtn").addEventListener("click", openDrawer);
$("#drawer").addEventListener("click", (e) => { if (e.target.closest("a")) closeDrawer(); });

/* drawer content: real page links, adjusted for who is signed in */
(function () {
  const links = [["/", "Home"], ["/stays", "Stays"], ["/experiences", "Experiences"],
    ["/neighborhoods", "Neighbourhoods"], ["/concierge", "AI Concierge"],
    ["/trips", "My trips"], ["/wishlist", "Wishlist"], ["/host", "Host"],
    ["/membership", "Jollof Club"], ["/reviews", "Reviews"], ["/blog", "Journal"], ["/help", "Help"]];
  // Owners get a direct route to their workspace.
  if (IS_OWNER) links.splice(8, 0, ["/host/dashboard", "Owner dashboard"]);
  const dl = $("#drawerLinks");
  if (dl && !dl.children.length) dl.innerHTML = links.map(([h, l]) => `<a href="${URL(h)}">${l}</a>`).join("");

  // Signing out only makes sense when signed in, and offering "Sign in" to
  // someone who already is was the bug users reported. view.php renders
  // these server-side so they survive a JS failure; only fill in if empty.
  const dc = $("#drawerCtas");
  if (dc && !dc.children.length) dc.innerHTML = USER
    ? `<a class="btn btn-gold" href="${URL(IS_OWNER ? "/host/dashboard" : "/host/onboarding")}">${IS_OWNER ? "Owner dashboard" : "List your home"}</a>
       <a class="btn btn-ghost" href="${URL("/account")}">My account</a>
       <a class="btn btn-ghost" href="${JL.base}logout.php" id="drawerLogout">Log out</a>`
    : `<a class="btn btn-gold" href="${URL("/host/onboarding")}">List your home</a>
       <a class="btn btn-ghost" href="${URL("/auth")}">Sign in / Join</a>
       <a class="btn btn-ghost" href="${URL("/auth?mode=register")}">Create account</a>`;
})();

/* ---------------- quick actions (real page links) ---------------- */
$("#notifBtn").addEventListener("click", () => nav("/notifications"));
$("#msgBtn").addEventListener("click", () => nav("/messages"));
$("#wlBtn").addEventListener("click", () => nav("/wishlist"));
$("#chatFab").addEventListener("click", () => nav("/concierge"));

/* ---------------- currency ---------------- */
const curSel = $("#currencySel");
curSel.value = currency;
curSel.addEventListener("change", () => {
  currency = curSel.value; store.set("currency", currency);
  document.cookie = "jl_currency=" + encodeURIComponent(currency) + ";path=/;max-age=" + (60*60*24*365) + ";samesite=lax";
  render();
  toast("Prices shown in " + currency, "exchange");
});

/* ---------------- newsletter ---------------- */
$("#newsBtn").addEventListener("click", async () => {
  const input = $("#newsInput");
  const em = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { toast("Please enter a valid email", "x"); return; }
  const btn = $("#newsBtn"); btn.disabled = true;
  const r = await api("newsletter.php", { email: em, source: PAGE_ID });
  btn.disabled = false;
  if (!r.ok) { toast(r.message || "Could not subscribe — please try again", "x"); return; }
  input.value = "";
  toast(r.message || "Welcome to the inner circle — check your inbox ✨", "check");
});
$("#newsInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#newsBtn").click(); });

/* ---------------- scrims & escape ---------------- */
$$(".modal-root .scrim, .sheet .scrim").forEach((s) => s.addEventListener("click", () => { closeModal(); closeSheet(); closeDrawer(); }));
addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeSheet(); closeDrawer(); } });

/* ---------------- reveal on scroll (visual only — never scrolls the page) ---------------- */
let io = null;
function observeReveals() {
  if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
  $$(".reveal, .stagger").forEach((el) => io.observe(el));
}

/* ---------------- boot ---------------- */
$("#yearNow").textContent = new Date().getFullYear();
applyTheme(store.get("theme", (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"));
render();
