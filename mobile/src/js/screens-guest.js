/* ============================================================
   JOLLOF LIVING — guest screens
   Browse, search, stay detail, wishlist, booking, trips, account.
   Every figure comes from the synced database; nothing invented.
   ============================================================ */
"use strict";

import * as store from "./store.js";
import { S, money, shortMoney } from "./store.js";
import { $, $$, esc, svg, imgUrl, toast, tap, emptyState, skeletonList, dateLabel, shortDate } from "./ui.js";
import { spriteTag, mountSprite } from "./sprites.js";
import { go, back } from "./router.js";

/* -------------------------------------------------------- fragments */

export function stayCard(p) {
  const wished = store.isWished(p.id);
  return `<article class="stay" data-open="${esc(p.id)}">
    <div class="ph">
      <img loading="lazy" src="${imgUrl(p.img)}" alt="${esc(p.name)}">
      ${p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ""}
      <button class="heart ${wished ? "on" : ""}" data-wish="${esc(p.id)}" aria-label="Save">${svg("heart")}</button>
    </div>
    <div class="body">
      <h3>${esc(p.name)}</h3>
      <div class="meta">${svg("pin", "")} ${esc(p.area)}, ${esc(p.city)}
        <span style="margin-left:auto;color:var(--gold)">★ ${Number(p.rating || 0).toFixed(2)}</span></div>
      <div class="price"><b>${money(p.price)}</b> <span class="small">/ night</span></div>
    </div>
  </article>`;
}

function stayRow(p) {
  return `<div class="card stay-row" data-open="${esc(p.id)}">
    <img loading="lazy" src="${imgUrl(p.img)}" alt="">
    <div style="flex:1;min-width:0">
      <h3 style="font-size:15.5px">${esc(p.name)}</h3>
      <div class="small">${esc(p.area)} · ★ ${Number(p.rating || 0).toFixed(2)}</div>
      <div style="margin-top:5px"><b style="color:var(--gold)">${money(p.price)}</b> <span class="small">/ night</span></div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------ HOME */

export function home() {
  const props = store.properties();
  if (!props.length) {
    return S.syncing
      ? `<div class="screen">${skeletonList(3)}</div>`
      : `<div class="screen">${emptyState("offline", "Nothing to show yet",
          "We could not reach Jollof Living. Pull down to try again once you have signal.",
          `<button class="btn btn-gold" data-act="sync">Try again</button>`)}</div>`;
  }

  const featured = props.filter((p) => p.featured).slice(0, 6);
  const list = (featured.length ? featured : props.slice(0, 6));
  const fresh = props.filter((p) => p.isNew).slice(0, 6);
  const name = S.user ? S.user.name.split(" ")[0] : null;

  return `<div class="screen flush fade-in">
    <div style="padding:4px 16px 0">
      <p class="small" style="letter-spacing:.14em;text-transform:uppercase">${name ? `Welcome back, ${esc(name)}` : "Luxury living, African soul"}</p>
      <h1 style="font-size:29px;margin:6px 0 2px">Find your <em class="serif-i">next stay</em></h1>
    </div>

    <div style="padding:14px 16px 2px">
      <button class="btn btn-ghost btn-block" data-go="search" style="justify-content:flex-start;gap:10px">
        ${svg("search")} <span class="muted">Search Lagos, Abuja, anywhere…</span>
      </button>
    </div>

    <div class="sec-head" style="padding:0 16px"><h2>Featured</h2><a data-go="explore">See all</a></div>
    <div class="hscroll">${list.map(stayCard).join("")}</div>

    ${fresh.length ? `
      <div class="sec-head" style="padding:0 16px"><h2>Just added</h2></div>
      <div class="hscroll">${fresh.map(stayCard).join("")}</div>` : ""}

    ${(S.catalogue.collections || []).length ? `
      <div class="sec-head" style="padding:0 16px"><h2>Collections</h2></div>
      <div class="hscroll">
        ${(S.catalogue.collections).slice(0, 6).map((c) => `
          <div class="card" data-collection="${esc(c.id || c.slug)}" style="padding:15px">
            <h3 style="font-size:17px">${esc(c.name || c.title)}</h3>
            <p class="small" style="margin:6px 0 0">${esc(c.blurb || c.description || "")}</p>
          </div>`).join("")}
      </div>` : ""}

    <div style="padding:26px 16px 0">
      <div class="panel" style="text-align:center">
        ${spriteTag("concierge", "sprite-sm")}
        <h3 style="font-size:18px;margin-top:6px">Concierge on call</h3>
        <p class="small" style="margin:6px 0 12px">Chefs, drivers, airport pickup — arranged before you land.</p>
        <button class="btn btn-ghost" data-go="messages">Message the team</button>
      </div>
    </div>
  </div>`;
}

/* ---------------------------------------------------------- EXPLORE */

let filters = { q: "", area: "", type: "", max: 0 };

export function explore() {
  let list = store.properties();
  const f = filters;
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter((p) => [p.name, p.area, p.city, p.ptype].some((v) => String(v || "").toLowerCase().includes(q)));
  }
  if (f.area) list = list.filter((p) => p.area === f.area);
  if (f.type) list = list.filter((p) => p.ptype === f.type);
  if (f.max) list = list.filter((p) => Number(p.price) <= f.max);

  const areas = S.catalogue.areas || [];
  return `<div class="screen flush fade-in">
    <div style="padding:0 16px 12px">
      <input class="inp" id="q" placeholder="Search homes, areas…" value="${esc(f.q)}" inputmode="search">
    </div>
    <div class="chips">
      <button class="chip ${!f.area ? "on" : ""}" data-area="">All areas</button>
      ${areas.map((a) => `<button class="chip ${f.area === a ? "on" : ""}" data-area="${esc(a)}">${esc(a)}</button>`).join("")}
    </div>
    <div style="padding:14px 16px 0" class="small">${list.length} home${list.length === 1 ? "" : "s"}</div>
    <div style="padding:10px 16px 0" class="stack">
      ${list.length ? list.map(stayCard).join("")
        : emptyState("empty", "Nothing matches yet", "Try a wider search — clear the filters and start again.",
            `<button class="btn btn-ghost" data-act="clear-filters">Clear filters</button>`)}
    </div>
  </div>`;
}

export function bindExplore(root) {
  const q = $("#q", root);
  if (q) {
    q.addEventListener("input", () => {
      filters.q = q.value;
      const scroll = root.scrollTop;
      rerenderInto(root, explore());
      const nq = $("#q", root);
      if (nq) { nq.value = filters.q; nq.focus(); nq.setSelectionRange(nq.value.length, nq.value.length); }
      root.scrollTop = scroll;
    });
  }
  $$("[data-area]", root).forEach((b) => b.addEventListener("click", () => {
    filters.area = b.dataset.area; tap(); rerenderInto(root, explore()); bindExplore(root);
  }));
  $$('[data-act="clear-filters"]', root).forEach((b) => b.addEventListener("click", () => {
    filters = { q: "", area: "", type: "", max: 0 }; rerenderInto(root, explore()); bindExplore(root);
  }));
}

function rerenderInto(root, html) {
  root.innerHTML = html;
  import("./sprites.js").then((m) => m.mountAll(root));
}

/* ------------------------------------------------------ STAY DETAIL */

export function stay(params) {
  const p = store.propertyBySlug(params.slug);
  if (!p) return `<div class="screen">${emptyState("empty", "Home not found", "This residence is no longer listed.")}</div>`;

  const wished = store.isWished(p.id);
  const reviews = (S.catalogue.reviews || []).filter((r) => r.property === p.id || r.propertySlug === p.id).slice(0, 3);

  return `<div class="screen flush fade-in">
    <div style="position:relative">
      <img src="${imgUrl(p.img)}" alt="${esc(p.name)}" style="width:100%;aspect-ratio:4/3;object-fit:cover">
      <button class="heart ${wished ? "on" : ""}" data-wish="${esc(p.id)}"
        style="position:absolute;top:12px;right:12px;width:42px;height:42px;border-radius:50%;
               background:rgba(11,15,12,.62);backdrop-filter:blur(6px);display:grid;place-items:center">
        ${svg("heart")}
      </button>
    </div>

    <div style="padding:16px">
      <h1 style="font-size:25px">${esc(p.name)}</h1>
      <div class="row small" style="margin-top:6px">
        ${svg("pin")} ${esc(p.area)}, ${esc(p.city)}
        <span style="color:var(--gold);margin-left:auto">★ ${Number(p.rating || 0).toFixed(2)} · ${p.reviews || 0} reviews</span>
      </div>

      <div class="row" style="gap:14px;margin:14px 0;flex-wrap:wrap">
        <span class="badge">${svg("bed")} ${p.beds} beds</span>
        <span class="badge">${svg("bath")} ${p.baths} baths</span>
        <span class="badge">${svg("users")} ${p.guests} guests</span>
        ${p.instant ? `<span class="badge ok">Instant book</span>` : `<span class="badge warn">Request to book</span>`}
      </div>

      <p class="muted" style="font-size:14.5px">${esc(p.description || "")}</p>

      ${(p.amenities || []).length ? `
        <h3 style="font-size:18px;margin:20px 0 10px">What's here</h3>
        <div class="row" style="flex-wrap:wrap;gap:8px">
          ${p.amenities.slice(0, 10).map((a) => `<span class="badge">${esc(a.label || a)}</span>`).join("")}
        </div>` : ""}

      ${reviews.length ? `
        <h3 style="font-size:18px;margin:22px 0 10px">Guest reviews</h3>
        <div class="stack">
          ${reviews.map((r) => `<div class="panel">
            <div class="spread"><b style="font-size:14px">${esc(r.author)}</b>
              <span style="color:var(--gold);font-size:13px">★ ${Number(r.rating || 5).toFixed(1)}</span></div>
            <p class="small" style="margin:7px 0 0;color:var(--ink-soft)">${esc(r.body)}</p>
          </div>`).join("")}
        </div>` : ""}
    </div>

    <div style="position:sticky;bottom:calc(var(--tabbar-h) + var(--safe-bottom));background:rgba(11,15,12,.95);
                backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:13px 16px;display:flex;
                align-items:center;gap:14px">
      <div><b style="color:var(--gold);font-size:19px">${money(p.price)}</b><div class="small">per night</div></div>
      <button class="btn btn-gold" style="flex:1" data-book="${esc(p.id)}">
        ${p.instant ? "Book now" : "Request to book"}
      </button>
    </div>
  </div>`;
}

/* --------------------------------------------------------- BOOKING */

export function booking(params) {
  const p = store.propertyBySlug(params.slug);
  if (!p) return `<div class="screen">${emptyState("empty", "Home not found", "This residence is no longer listed.")}</div>`;

  const today = new Date();
  const inD = new Date(today.getTime() + 14 * 864e5).toISOString().slice(0, 10);
  const outD = new Date(today.getTime() + 18 * 864e5).toISOString().slice(0, 10);

  return `<div class="screen fade-in">
    <div class="card stay-row" style="margin-bottom:16px">
      <img src="${imgUrl(p.img)}" alt="">
      <div><h3 style="font-size:15.5px">${esc(p.name)}</h3>
        <div class="small">${esc(p.area)} · ${money(p.price)} / night</div></div>
    </div>

    <label class="field"><span>Check in</span><input class="inp" type="date" id="bIn" value="${inD}"></label>
    <label class="field"><span>Check out</span><input class="inp" type="date" id="bOut" value="${outD}"></label>
    <label class="field"><span>Guests</span>
      <select class="inp" id="bGuests">
        ${Array.from({ length: Math.max(1, p.guests) }, (_, i) =>
          `<option value="${i + 1}" ${i === 1 ? "selected" : ""}>${i + 1} guest${i ? "s" : ""}</option>`).join("")}
      </select></label>

    <div class="panel" id="quoteBox" style="margin:6px 0 16px">
      <div class="small">Working out your total…</div>
    </div>

    <button class="btn btn-gold btn-block" id="bGo" data-prop="${esc(p.id)}">
      ${p.instant ? "Confirm reservation" : "Send booking request"}
    </button>
    <p class="small" style="text-align:center;margin-top:10px">
      Priced by the same engine as the website — no surprises at checkout.</p>
  </div>`;
}

export function bindBooking(root, params) {
  const p = store.propertyBySlug(params.slug);
  if (!p) return;
  const box = $("#quoteBox", root);

  async function refreshQuote() {
    const checkin = $("#bIn", root).value, checkout = $("#bOut", root).value;
    if (!checkin || !checkout) return;
    box.innerHTML = `<div class="small">Working out your total…</div>`;
    const r = await store.act({ do: "quote", property: p.id, checkin, checkout, guests: Number($("#bGuests", root).value) });
    if (!r.ok) { box.innerHTML = `<div class="small" style="color:var(--bad)">${esc(r.message || "Could not price these dates.")}</div>`; return; }
    const q = r.data;
    box.innerHTML = `
      <div class="krow"><span class="k">${money(q.nightly)} × ${q.nights} nights</span><span class="v">${money(q.base)}</span></div>
      ${q.lengthDiscount ? `<div class="krow"><span class="k">Length discount</span><span class="v" style="color:var(--ok)">−${money(q.lengthDiscount)}</span></div>` : ""}
      ${q.cleaning ? `<div class="krow"><span class="k">Cleaning</span><span class="v">${money(q.cleaning)}</span></div>` : ""}
      <div class="krow"><span class="k">Service fee</span><span class="v">${money(q.service)}</span></div>
      <div class="krow"><span class="k">VAT</span><span class="v">${money(q.vat)}</span></div>
      <div class="krow" style="border-top:1px solid var(--line);margin-top:4px;padding-top:10px">
        <span class="k"><b style="color:var(--ink)">Total</b></span><span class="v" style="color:var(--gold);font-size:16px">${money(q.total)}</span></div>`;
  }

  ["bIn", "bOut", "bGuests"].forEach((id) => $("#" + id, root)?.addEventListener("change", refreshQuote));
  refreshQuote();

  $("#bGo", root)?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (!store.isSignedIn()) { go("auth", { next: "booking", slug: p.id }); return; }
    btn.disabled = true; btn.textContent = "Sending…";
    tap();
    const r = await store.act({
      do: "booking-create",
      property: p.id,
      checkin: $("#bIn", root).value,
      checkout: $("#bOut", root).value,
      guests: Number($("#bGuests", root).value),
      name: S.user?.name, email: S.user?.email, phone: S.user?.phone,
      request: !p.instant,
    });
    btn.disabled = false;
    btn.textContent = p.instant ? "Confirm reservation" : "Send booking request";
    if (r.queued) { toast(r.message, "good"); go("trips"); return; }
    if (!r.ok) { toast(r.message || "We could not complete that.", "bad"); return; }
    go("confirmed", { ref: r.data.ref, total: r.data.total });
  });
}

/* ------------------------------------------------------- CONFIRMED */

export function confirmed(params) {
  return `<div class="screen fade-in">
    <div class="state" style="padding-top:44px">
      ${spriteTag("success", "", 'data-sprite-loop="false"')}
      <h3 style="font-size:24px">Booking confirmed</h3>
      <p>Reference <b style="color:var(--gold)">${esc(params.ref || "")}</b>${
        params.total ? ` · ${money(params.total)}` : ""}</p>
      <p class="small">A confirmation is in your notifications, and the home's host has been told.</p>
      <div class="stack" style="width:100%;max-width:320px;margin-top:8px">
        <button class="btn btn-gold btn-block" data-go="trips">See my trips</button>
        <button class="btn btn-ghost btn-block" data-go="home">Back to browsing</button>
      </div>
    </div>
  </div>`;
}

/* -------------------------------------------------------- WISHLIST */

export function wishlist() {
  if (!store.isSignedIn()) return signInWall("Save the homes you love", "Sign in to keep a wishlist across your phone and the website.");
  const slugs = store.wishlistSlugs();
  const items = slugs.map((s) => store.propertyBySlug(s)).filter(Boolean);
  if (!items.length) {
    return `<div class="screen">${emptyState("heart", "No saved homes yet",
      "Tap the heart on any residence and it will appear here — on your phone and on the website.",
      `<button class="btn btn-gold" data-go="explore">Browse homes</button>`)}</div>`;
  }
  return `<div class="screen fade-in"><div class="stack">${items.map(stayRow).join("")}</div></div>`;
}

/* ----------------------------------------------------------- TRIPS */

export function trips() {
  if (!store.isSignedIn()) return signInWall("Your trips live here", "Sign in to see reservations you made here or on the website.");
  const all = store.bookings();
  if (!all.length) {
    return `<div class="screen">${emptyState("empty", "No trips yet",
      "When you book a residence it appears here, with your check-in code and receipt.",
      `<button class="btn btn-gold" data-go="explore">Find a stay</button>`)}</div>`;
  }
  const now = Date.now();
  const upcoming = all.filter((b) => new Date(b.out).getTime() >= now && b.status !== "cancelled");
  const past = all.filter((b) => new Date(b.out).getTime() < now || b.status === "cancelled");

  const card = (b) => `<div class="card" style="padding:13px">
    <div class="spread">
      <b style="font-size:15px">${esc(b.name)}</b>
      <span class="pill ${esc(b.status)}">${esc(b.status)}</span>
    </div>
    <div class="small" style="margin-top:5px">${shortDate(b.in)} → ${shortDate(b.out)} · ${b.nights} night${b.nights === 1 ? "" : "s"}</div>
    <div class="spread" style="margin-top:9px">
      <span class="small">Ref ${esc(b.ref)}</span>
      <b style="color:var(--gold)">${money(b.total)}</b>
    </div>
    ${b.code ? `<div class="small" style="margin-top:6px">Check-in code <b style="color:var(--ink)">${esc(b.code)}</b></div>` : ""}
  </div>`;

  return `<div class="screen fade-in">
    ${upcoming.length ? `<div class="sec-head" style="margin-top:2px"><h2>Upcoming</h2></div>
      <div class="stack">${upcoming.map(card).join("")}</div>` : ""}
    ${past.length ? `<div class="sec-head"><h2>Past</h2></div>
      <div class="stack">${past.map(card).join("")}</div>` : ""}
  </div>`;
}

/* --------------------------------------------------------- ACCOUNT */

export function account() {
  if (!store.isSignedIn()) return signInWall("Your account", "Sign in to see your points, tier and trips.");
  const u = S.user;
  const tier = store.tier();
  const pts = store.points();

  return `<div class="screen fade-in">
    <div class="panel" style="text-align:center">
      <div style="width:66px;height:66px;border-radius:50%;background:var(--gold);color:#231a05;
                  display:grid;place-items:center;font-size:26px;font-weight:700;margin:0 auto 10px;
                  font-family:var(--fs-serif)">${esc((u.name || "?")[0].toUpperCase())}</div>
      <h2 style="font-size:21px">${esc(u.name)}</h2>
      <p class="small">${esc(u.email)}</p>
      <div class="row" style="justify-content:center;gap:8px;margin-top:10px">
        <span class="badge ok">${esc(tier)} member</span>
        <span class="badge">${pts.toLocaleString("en-NG")} points</span>
        ${u.isHost ? `<span class="badge">Property owner</span>` : ""}
      </div>
    </div>

    <div class="stack" style="margin-top:16px">
      ${u.isHost ? `<button class="btn btn-gold btn-block" data-go="owner">${svg("chart")} Owner dashboard</button>`
                 : `<button class="btn btn-ghost btn-block" data-act="become-owner">${svg("building")} Become a host</button>`}
      <button class="btn btn-ghost btn-block" data-go="notifications">${svg("bell")} Notifications</button>
      <button class="btn btn-ghost btn-block" data-go="messages">${svg("send")} Messages</button>
      <button class="btn btn-ghost btn-block" data-act="sync">${svg("refresh")} Sync now</button>
      <button class="btn btn-ghost btn-block" data-act="signout" style="color:var(--bad)">${svg("logout")} Log out</button>
    </div>

    <p class="small" style="text-align:center;margin-top:18px">
      ${S.syncedAt ? `Last synced ${new Date(S.syncedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : "Not synced yet"}
      ${S.queue.length ? ` · ${S.queue.length} change${S.queue.length === 1 ? "" : "s"} waiting to send` : ""}
    </p>
  </div>`;
}

/* -------------------------------------------------- NOTIFICATIONS */

export function notifications() {
  if (!store.isSignedIn()) return signInWall("Notifications", "Sign in to see updates about your trips.");
  const items = store.notifications();
  if (!items.length) return `<div class="screen">${emptyState("empty", "Nothing new", "Booking updates and offers will appear here.")}</div>`;
  return `<div class="screen fade-in">
    <div class="stack">
      ${items.map((n) => `<div class="card" style="padding:13px">
        <div class="spread"><b style="font-size:14.5px">${esc(n.title)}</b>
          ${n.unread ? `<span class="badge warn">new</span>` : ""}</div>
        <p class="small" style="margin:5px 0 0">${esc(n.body)}</p>
        <div class="small" style="margin-top:6px;opacity:.7">${esc(n.time || n.created_at || "")}</div>
      </div>`).join("")}
    </div>
    <button class="btn btn-ghost btn-block" data-act="read-all" style="margin-top:14px">Mark all as read</button>
  </div>`;
}

/* ------------------------------------------------------- MESSAGES */

export function messages() {
  if (!store.isSignedIn()) return signInWall("Messages", "Sign in to talk to hosts and the concierge team.");
  const convs = S.me?.conversations || [];
  if (!convs.length) return `<div class="screen">${emptyState("concierge", "No messages yet",
    "Book a stay or ask the concierge anything — replies land here.")}</div>`;
  return `<div class="screen fade-in"><div class="stack">
    ${convs.map((c) => `<div class="card" style="padding:13px">
      <div class="spread"><b style="font-size:15px">${esc(c.name || c.title || "Conversation")}</b>
        ${c.unread ? `<span class="badge warn">${c.unread}</span>` : ""}</div>
      <p class="small" style="margin:5px 0 0">${esc(c.preview || (c.messages || []).slice(-1)[0]?.body || "")}</p>
    </div>`).join("")}
  </div></div>`;
}

/* ------------------------------------------------------------ wall */

function signInWall(title, body) {
  return `<div class="screen">${emptyState("keys", title, body,
    `<div class="stack" style="width:100%;max-width:300px">
       <button class="btn btn-gold btn-block" data-go="auth">Sign in</button>
       <button class="btn btn-ghost btn-block" data-go="auth" data-mode="register">Create an account</button>
     </div>`)}</div>`;
}
