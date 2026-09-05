/* ============================================================
   JOLLOF LIVING — shared UI helpers
   ============================================================ */
"use strict";

import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { CONFIG } from "./config.js";
import { spriteTag } from "./sprites.js";

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const ICON = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  heart: '<path d="M12 20.5S3.5 15 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11.4-8.5 11.4z"/>',
  home: '<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15 9l-2 5-4 1 2-5z"/>',
  trips: '<rect x="3.5" y="6" width="17" height="14" rx="2.5"/><path d="M8 4v4M16 4v4M3.5 11h17"/>',
  user: '<circle cx="12" cy="8.5" r="3.7"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  bell: '<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>',
  star: '<path d="M12 3.6l2.5 5 5.6.8-4 4 .9 5.6-5-2.6-5 2.6.9-5.6-4-4 5.6-.8z"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  bed: '<path d="M3 18v-7h18v7"/><path d="M3 11V7M7 11V9h5v2"/>',
  bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M7 12V6a2 2 0 0 1 4 0"/>',
  users: '<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 7.5a3 3 0 0 1 0 5.6M17.5 19a5 5 0 0 0-2-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M16 12.5h3"/>',
  logout: '<path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/>',
  check: '<path d="M4 12.5l5 5L20 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  send: '<path d="M4 12l16-7-7 16-2-6z"/>',
  building: '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-1.5 5.5"/><path d="M20 5v6h-6"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
};

export const svg = (name, cls = "") =>
  `<svg viewBox="0 0 24 24" class="${cls}" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round">${ICON[name] || ""}</svg>`;

/* Property photos live on the website, so a picture swapped in the admin
   panel shows up in the app without shipping a new build. */
export function imgUrl(key) {
  if (!key) return CONFIG.imageBase + "p1.jpg";
  if (/^(https?:|data:)/.test(key)) return key;
  if (/\.(jpe?g|png|webp|avif|gif)$/i.test(key)) return CONFIG.imageBase + key;
  return CONFIG.imageBase + key + ".jpg";
}

/* --------------------------------------------------------- feedback */
let toastTimer;
export function toast(message, kind = "") {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.className = "on " + kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = ""; }, 2900);
}

export async function tap(style = ImpactStyle.Light) {
  try { await Haptics.impact({ style }); } catch {}
}

/* ------------------------------------------------------------ states */
export function emptyState(sprite, title, body, cta = "") {
  return `<div class="state fade-in">
    ${spriteTag(sprite, "sprite-md")}
    <h3>${esc(title)}</h3>
    <p>${esc(body)}</p>
    ${cta}
  </div>`;
}

export function loadingState(label = "Loading…") {
  return `<div class="state">
    ${spriteTag("loading", "sprite-sm")}
    <p class="small" style="margin-top:6px">${esc(label)}</p>
  </div>`;
}

export function skeletonList(n = 3) {
  return `<div class="stack">${Array.from({ length: n }, () =>
    `<div class="card"><div class="skel" style="aspect-ratio:4/3"></div>
     <div style="padding:12px"><div class="skel" style="height:15px;width:64%"></div>
     <div class="skel" style="height:12px;width:40%;margin-top:8px"></div></div></div>`).join("")}</div>`;
}

/* Rating and small formatting shared by several screens. */
export const stars = (r) => `${svg("star", "")}`.replace("<svg", '<svg style="width:13px;height:13px;fill:var(--gold);stroke:var(--gold)"') + ` ${Number(r || 0).toFixed(2)}`;
export const dateLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? String(iso) : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
export const shortDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? String(iso) : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
