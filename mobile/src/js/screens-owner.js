/* ============================================================
   JOLLOF LIVING — owner (host) workspace
   Reads Repo::hostState from the sync payload, so the phone
   and the website's owner dashboard show the same numbers.
   ============================================================ */
"use strict";

import * as store from "./store.js";
import { S, money, shortMoney } from "./store.js";
import { $, $$, esc, svg, imgUrl, toast, tap, emptyState, skeletonList, shortDate } from "./ui.js";
import { spriteTag } from "./sprites.js";
import { go } from "./router.js";

let tab = "overview";
export const setOwnerTab = (t) => { tab = t; };

const TABS = [
  ["overview", "Overview"], ["listings", "Listings"], ["bookings", "Bookings"],
  ["calendar", "Calendar"], ["earnings", "Earnings"], ["payouts", "Payouts"],
];

export function owner() {
  if (!store.isSignedIn()) {
    return `<div class="screen">${emptyState("keys", "Owner dashboard",
      "Sign in with your owner account to manage listings, bookings and payouts.",
      `<button class="btn btn-gold" data-go="auth">Sign in</button>`)}</div>`;
  }
  if (!store.isOwner()) {
    return `<div class="screen">${emptyState("building", "Start hosting",
      "Your account is not set up for hosting yet. Turn it on and keep every trip, wishlist and point you already have.",
      `<button class="btn btn-gold" data-act="become-owner">Become a host</button>`)}</div>`;
  }

  const H = store.ownerState();
  if (!H) return `<div class="screen">${skeletonList(2)}</div>`;

  const body = {
    overview: ovOverview, listings: ovListings, bookings: ovBookings,
    calendar: ovCalendar, earnings: ovEarnings, payouts: ovPayouts,
  }[tab] || ovOverview;

  return `<div class="screen flush fade-in">
    <div class="chips" style="padding-top:2px">
      ${TABS.map(([k, l]) => `<button class="chip ${tab === k ? "on" : ""}" data-tab="${k}">${l}</button>`).join("")}
    </div>
    <div style="padding:16px">${body(H)}</div>
  </div>`;
}

/* -------------------------------------------------------- overview */
function ovOverview(H) {
  const st = H.stats || {};
  if (!(H.listings || []).length) {
    return emptyState("building", "No listings yet",
      "Publish your first residence and your occupancy, earnings and bookings appear here.",
      `<button class="btn btn-gold" data-act="new-listing">Add a listing</button>`);
  }
  const kpis = [
    ["Occupancy", (st.occupancy || 0) + "%"],
    ["Avg nightly", st.adr ? shortMoney(st.adr) : "—"],
    ["RevPAR", st.revpar ? shortMoney(st.revpar) : "—"],
    ["Rating", st.rating ? String(st.rating) : "—"],
  ];
  const series = (H.earnings || []).filter((e) => typeof e.v === "number");
  const peak = Math.max(1, ...series.map((e) => e.v));
  const upcoming = (H.bookings || []).filter((b) => ["pending", "confirmed"].includes(b.status)).slice(0, 4);

  return `
    <div class="grid-2" style="gap:10px">
      ${kpis.map((k) => `<div class="kpi"><div class="lbl">${k[0]}</div><div class="val">${k[1]}</div></div>`).join("")}
    </div>

    ${series.length ? `
      <div class="panel" style="margin-top:14px">
        <h3 style="font-size:17px;margin-bottom:12px">Earnings</h3>
        <div style="display:flex;align-items:flex-end;gap:5px;height:96px">
          ${series.map((e) => `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
            <div style="background:var(--gold);border-radius:3px 3px 0 0;height:${Math.max(3, (e.v / peak) * 100)}%"></div>
          </div>`).join("")}
        </div>
        <div class="row" style="justify-content:space-between;margin-top:7px">
          <span class="small">${esc(series[0]?.l || "")}</span>
          <span class="small">${esc(series[series.length - 1]?.l || "")}</span>
        </div>
      </div>` : ""}

    ${upcoming.length ? `
      <div class="sec-head"><h2 style="font-size:18px">Next arrivals</h2></div>
      <div class="stack">
        ${upcoming.map((b) => `<div class="card" style="padding:12px">
          <div class="spread"><b style="font-size:14.5px">${esc(b.guest || b.name || "Guest")}</b>
            <span class="pill ${esc(b.status)}">${esc(b.status)}</span></div>
          <div class="small" style="margin-top:4px">${esc(b.property || b.listing || "")} · ${shortDate(b.in || b.checkin)} → ${shortDate(b.out || b.checkout)}</div>
          <div style="margin-top:6px;color:var(--gold);font-weight:600">${money(b.total || 0)}</div>
        </div>`).join("")}
      </div>` : ""}

    <button class="btn btn-gold btn-block" data-act="new-listing" style="margin-top:16px">
      ${svg("plus")} Add a listing</button>`;
}

/* -------------------------------------------------------- listings */
function ovListings(H) {
  const list = H.listings || [];
  if (!list.length) {
    return emptyState("building", "No listings yet",
      "Add your first residence — our team verifies it within 24 hours.",
      `<button class="btn btn-gold" data-act="new-listing">Add a listing</button>`);
  }
  return `<div class="stack">
    ${list.map((l) => `<div class="card" style="padding:13px">
      <div class="spread">
        <b style="font-size:15px">${esc(l.title || l.name)}</b>
        <span class="pill ${esc(l.status)}">${esc(l.status)}</span>
      </div>
      <div class="small" style="margin-top:4px">${esc(l.area || "")} · ${l.photos || 0} photos</div>
      <div class="spread" style="margin-top:10px">
        <b style="color:var(--gold)">${money(l.rate || l.price || 0)} <span class="small">/ night</span></b>
        <div class="row" style="gap:7px">
          <button class="btn btn-ghost" style="padding:8px 13px;min-height:0;font-size:12.5px"
                  data-price="${esc(l.id || l.slug)}" data-current="${l.rate || l.price || 0}">Price</button>
          <button class="btn btn-ghost" style="padding:8px 13px;min-height:0;font-size:12.5px"
                  data-status="${esc(l.id || l.slug)}" data-now="${esc(l.status)}">
            ${l.status === "live" ? "Pause" : "Go live"}</button>
        </div>
      </div>
    </div>`).join("")}
    <button class="btn btn-gold btn-block" data-act="new-listing">${svg("plus")} Add a listing</button>
  </div>`;
}

/* -------------------------------------------------------- bookings */
function ovBookings(H) {
  const list = H.bookings || [];
  if (!list.length) return emptyState("empty", "No bookings yet", "Reservations for your homes will appear here.");
  return `<div class="stack">
    ${list.map((b) => `<div class="card" style="padding:13px">
      <div class="spread"><b style="font-size:14.5px">${esc(b.guest || b.name || "Guest")}</b>
        <span class="pill ${esc(b.status)}">${esc(b.status)}</span></div>
      <div class="small" style="margin-top:4px">${esc(b.property || "")} · ${shortDate(b.in || b.checkin)} → ${shortDate(b.out || b.checkout)}</div>
      <div class="spread" style="margin-top:8px">
        <span class="small">${esc(b.ref || "")}</span>
        <b style="color:var(--gold)">${money(b.total || 0)}</b>
      </div>
    </div>`).join("")}
  </div>`;
}

/* -------------------------------------------------------- calendar */
function ovCalendar(H) {
  const cal = H.calendar || {};
  const days = cal.days || [];
  if (!days.length) return emptyState("empty", "No calendar yet", "Add a listing to manage availability and nightly pricing.");
  const dows = ["M", "T", "W", "T", "F", "S", "S"];
  const pad = Number(cal.firstDow || 0);

  return `<div class="panel">
    <div class="spread" style="margin-bottom:12px">
      <b>${esc(cal.monthLabel || "")}</b>
      <span class="small">${esc(cal.property?.name || cal.property?.title || "")}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center">
      ${dows.map((d) => `<div class="small" style="opacity:.6">${d}</div>`).join("")}
      ${Array.from({ length: pad }, () => `<div></div>`).join("")}
      ${days.map((d) => {
        const booked = d.status === "booked" || d.booked;
        const blocked = d.status === "blocked";
        return `<div style="aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;
                     align-items:center;justify-content:center;font-size:12px;
                     background:${booked ? "var(--gold)" : blocked ? "var(--card-2)" : "var(--card-2)"};
                     color:${booked ? "#231a05" : blocked ? "var(--ink-faint)" : "var(--ink)"};
                     ${blocked ? "text-decoration:line-through;opacity:.55" : ""}">
          <span>${d.d || d.day || ""}</span>
          ${d.price ? `<span style="font-size:8.5px;opacity:.8">${Math.round(d.price / 1000)}k</span>` : ""}
        </div>`;
      }).join("")}
    </div>
    <div class="row" style="gap:14px;margin-top:12px;flex-wrap:wrap">
      <span class="small"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--gold);margin-right:5px"></i>Booked</span>
      <span class="small"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--card-2);margin-right:5px"></i>Available</span>
    </div>
  </div>`;
}

/* -------------------------------------------------------- earnings */
function ovEarnings(H) {
  const st = H.stats || {};
  const sources = (H.sources || []).filter((s) => s.v > 0);
  const total = sources.reduce((a, s) => a + s.v, 0) || 1;
  return `
    <div class="grid-2" style="gap:10px">
      <div class="kpi"><div class="lbl">Gross earnings</div><div class="val">${shortMoney(st.gross || st.earnings || 0)}</div></div>
      <div class="kpi"><div class="lbl">Your take rate</div><div class="val">${Math.round((st.takeRate || 0.12) * 100)}%</div></div>
    </div>
    ${sources.length ? `
      <div class="panel" style="margin-top:14px">
        <h3 style="font-size:17px;margin-bottom:12px">Where bookings come from</h3>
        ${sources.map((s) => `
          <div style="margin-bottom:11px">
            <div class="spread" style="margin-bottom:5px">
              <span class="small">${esc(s.l)}</span>
              <span class="small">${Math.round((s.v / total) * 100)}%</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${(s.v / total) * 100}%"></div></div>
          </div>`).join("")}
      </div>` : ""}
    ${(H.insights || []).length ? `
      <div class="panel" style="margin-top:14px">
        <h3 style="font-size:17px;margin-bottom:8px">Suggestions</h3>
        ${(H.insights).slice(0, 4).map((i) => `<div class="krow"><span class="k">${esc(i.title || i.label || i)}</span>
          <span class="v small">${esc(i.value || "")}</span></div>`).join("")}
      </div>` : ""}`;
}

/* --------------------------------------------------------- payouts */
function ovPayouts(H) {
  const list = H.payouts || [];
  const set = H.payoutSettings || {};
  return `
    <div class="panel">
      <h3 style="font-size:17px;margin-bottom:8px">Payout account</h3>
      <div class="krow"><span class="k">Bank</span><span class="v">${esc(set.bank || "Not set")}</span></div>
      <div class="krow"><span class="k">Account</span><span class="v">${esc(set.account || set.account_number || "—")}</span></div>
      <div class="krow"><span class="k">Schedule</span><span class="v">${esc(set.schedule || "After check-in")}</span></div>
    </div>
    ${list.length ? `
      <div class="sec-head"><h2 style="font-size:18px">History</h2></div>
      <div class="stack">
        ${list.map((p) => `<div class="card" style="padding:12px">
          <div class="spread"><b>${money(p.amount || 0)}</b>
            <span class="pill ${esc(p.status)}">${esc(p.status)}</span></div>
          <div class="small" style="margin-top:4px">${esc(p.reference || "")} · ${shortDate(p.created_at || p.date)}</div>
        </div>`).join("")}
      </div>`
      : `<div style="margin-top:14px">${emptyState("empty", "No payouts yet",
          "Once a guest checks in, your earnings are released and appear here.")}</div>`}`;
}

/* --------------------------------------------------- new listing */

export function newListing() {
  return `<div class="screen fade-in">
    <div style="text-align:center;margin-bottom:16px">
      ${spriteTag("building" in {} ? "building" : "keys", "sprite-sm")}
      <h1 style="font-size:24px">Add a listing</h1>
      <p class="small">Our team verifies every home within 24 hours.</p>
    </div>
    <label class="field"><span>Title</span><input class="inp" id="lTitle" placeholder="Ocean-view penthouse"></label>
    <div class="grid-2">
      <label class="field"><span>Area</span><input class="inp" id="lArea" placeholder="Ikoyi"></label>
      <label class="field"><span>City</span><input class="inp" id="lCity" value="Lagos"></label>
    </div>
    <label class="field"><span>Nightly rate (₦)</span><input class="inp" id="lPrice" type="number" inputmode="numeric" placeholder="150000"></label>
    <div class="grid-2">
      <label class="field"><span>Bedrooms</span><input class="inp" id="lBeds" type="number" inputmode="numeric" value="1"></label>
      <label class="field"><span>Bathrooms</span><input class="inp" id="lBaths" type="number" inputmode="numeric" value="1"></label>
    </div>
    <label class="field"><span>Guests</span><input class="inp" id="lGuests" type="number" inputmode="numeric" value="2"></label>
    <label class="field"><span>Description</span><textarea class="inp" id="lDesc" rows="4"
      placeholder="What makes this home special?"></textarea></label>
    <button class="btn btn-gold btn-block" id="lGo">Submit for verification</button>
  </div>`;
}

export function bindNewListing(root) {
  $("#lGo", root)?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const title = $("#lTitle", root).value.trim();
    const price = Number($("#lPrice", root).value);
    if (title.length < 4) { toast("Please give your home a longer title.", "bad"); return; }
    if (!price || price < 1000) { toast("Please set a nightly rate of at least ₦1,000.", "bad"); return; }

    btn.disabled = true; btn.textContent = "Submitting…";
    const r = await store.act({
      do: "listing-create", title, price,
      area: $("#lArea", root).value.trim() || "Lagos",
      city: $("#lCity", root).value.trim() || "Lagos",
      beds: Number($("#lBeds", root).value) || 1,
      baths: Number($("#lBaths", root).value) || 1,
      guests: Number($("#lGuests", root).value) || 2,
      description: $("#lDesc", root).value.trim(),
    });
    btn.disabled = false; btn.textContent = "Submit for verification";
    if (!r.ok && !r.queued) { toast(r.message || "We could not submit that.", "bad"); return; }
    tap();
    toast(r.message, "good");
    setOwnerTab("listings");
    go("owner");
  });
}

/* --------------------------------------------------- tab handlers */

export function bindOwner(root) {
  $$("[data-tab]", root).forEach((b) => b.addEventListener("click", () => {
    tab = b.dataset.tab; tap(); go("owner");
  }));

  $$("[data-price]", root).forEach((b) => b.addEventListener("click", async () => {
    const now = b.dataset.current;
    const next = window.prompt("New nightly rate in naira", now);
    if (next == null) return;
    const price = Number(String(next).replace(/[^\d]/g, ""));
    if (!price || price < 1000) { toast("Please set a rate of at least ₦1,000.", "bad"); return; }
    const r = await store.act({ do: "listing-price", property: b.dataset.price, price });
    toast(r.message || (r.ok ? "Rate updated." : "Could not update."), r.ok || r.queued ? "good" : "bad");
    if (r.ok) go("owner");
  }));

  $$("[data-status]", root).forEach((b) => b.addEventListener("click", async () => {
    const status = b.dataset.now === "live" ? "paused" : "live";
    const r = await store.act({ do: "listing-status", property: b.dataset.status, status });
    toast(r.message || (r.ok ? "Updated." : "Could not update."), r.ok || r.queued ? "good" : "bad");
    if (r.ok) go("owner");
  }));

  $$('[data-act="new-listing"]', root).forEach((b) =>
    b.addEventListener("click", () => go("new-listing")));
}
