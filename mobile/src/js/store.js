/* ============================================================
   JOLLOF LIVING — app store
   ------------------------------------------------------------
   One source of truth on the device. Everything is a cache of
   the same MySQL database the website reads; nothing is
   invented here. Writes go to the server when there is signal
   and queue on disk when there is not.
   ============================================================ */
"use strict";

import { Preferences } from "@capacitor/preferences";
import { Network } from "@capacitor/network";
import { CONFIG } from "./config.js";

const KEY = {
  token: "jl_token",
  user: "jl_user",
  catalogue: "jl_catalogue",
  version: "jl_version",
  me: "jl_me",
  owner: "jl_owner",
  queue: "jl_queue",
  seen: "jl_onboarded",
  syncedAt: "jl_synced_at",
};

/* In-memory mirror so rendering never awaits disk. */
export const S = {
  token: null,
  user: null,
  catalogue: { properties: [], collections: [], neighborhoods: [], experiences: [], blog: [], tiers: [], rates: {}, fx: {}, addons: {}, promos: {}, payMethods: [], reviews: [], areas: [], propertyTypes: [] },
  me: null,
  owner: null,
  queue: [],
  online: true,
  syncing: false,
  syncedAt: null,
  version: null,
  onboarded: false,
};

const listeners = new Set();
export const onChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const emit = () => listeners.forEach((f) => { try { f(); } catch (e) { console.warn(e); } });

/* --------------------------------------------------------- disk */
async function read(k, fallback = null) {
  try {
    const { value } = await Preferences.get({ key: k });
    return value == null ? fallback : JSON.parse(value);
  } catch { return fallback; }
}
async function write(k, v) {
  try { await Preferences.set({ key: k, value: JSON.stringify(v) }); } catch (e) { console.warn("persist failed", e); }
}
async function drop(k) { try { await Preferences.remove({ key: k }); } catch {} }

/** Load whatever the last session left behind, so the app opens instantly. */
export async function hydrate() {
  const [token, user, catalogue, me, owner, queue, seen, version, syncedAt] = await Promise.all([
    read(KEY.token), read(KEY.user), read(KEY.catalogue), read(KEY.me),
    read(KEY.owner), read(KEY.queue, []), read(KEY.seen, false),
    read(KEY.version), read(KEY.syncedAt),
  ]);
  S.token = token; S.user = user;
  if (catalogue) S.catalogue = catalogue;
  S.me = me; S.owner = owner; S.queue = queue || [];
  S.onboarded = !!seen; S.version = version; S.syncedAt = syncedAt;

  const st = await Network.getStatus().catch(() => ({ connected: true }));
  S.online = !!st.connected;
  Network.addListener("networkStatusChange", (s) => {
    const was = S.online;
    S.online = !!s.connected;
    emit();
    if (!was && S.online) flushQueue();   // back online: replay what we owe
  });
  emit();
}

export const isSignedIn = () => !!S.token;
export const isOwner = () => !!(S.user && S.user.isHost);

export async function markOnboarded() {
  S.onboarded = true;
  await write(KEY.seen, true);
}

/* --------------------------------------------------------- network */

function apiUrl(path, params) {
  const u = new URL(CONFIG.apiBase.replace(/\/?$/, "/") + path);
  Object.entries(params || {}).forEach(([k, v]) => { if (v != null && v !== "") u.searchParams.set(k, v); });
  return u.toString();
}

async function request(path, { method = "GET", body, params, clientKey, timeout = CONFIG.timeoutMs } = {}) {
  const headers = { Accept: "application/json" };
  if (body) headers["Content-Type"] = "application/json";
  if (S.token) headers.Authorization = `Bearer ${S.token}`;
  if (clientKey) headers["X-Client-Key"] = clientKey;
  headers["X-App-Version"] = CONFIG.appVersion;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(apiUrl(path, params), {
      method, headers, signal: ctrl.signal,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); }
    catch { throw new Error("The server sent something we could not read."); }

    if (res.status === 401 && json.requiresAuth) {
      await signOutLocal();
      return { ok: false, requiresAuth: true, message: json.message || "Please sign in again." };
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------ auth */

export async function register({ name, email, password, phone, accountType }) {
  const r = await request("auth.php", {
    method: "POST",
    body: { action: "register", name, email, password, phone, account_type: accountType, device: CONFIG.device },
  });
  if (r.ok && r.data?.token) await adoptSession(r.data);
  return r;
}

export async function login({ email, password }) {
  const r = await request("auth.php", {
    method: "POST",
    body: { action: "login", email, password, device: CONFIG.device },
  });
  if (r.ok && r.data?.token) await adoptSession(r.data);
  return r;
}

export async function becomeOwner() {
  const r = await request("auth.php", { method: "POST", body: { action: "upgrade" } });
  if (r.ok && r.data?.user) {
    S.user = r.data.user;
    await write(KEY.user, S.user);
    await sync({ force: true });
  }
  return r;
}

async function adoptSession(data) {
  S.token = data.token;
  S.user = data.user;
  await Promise.all([write(KEY.token, S.token), write(KEY.user, S.user)]);
  emit();
  await sync({ force: true });
}

/** Clear the device only — the account itself is untouched. */
export async function signOutLocal() {
  S.token = null; S.user = null; S.me = null; S.owner = null;
  await Promise.all([drop(KEY.token), drop(KEY.user), drop(KEY.me), drop(KEY.owner)]);
  emit();
}

export async function signOut() {
  try { await request("auth.php", { method: "POST", body: { action: "logout" } }); } catch {}
  await signOutLocal();
}

/* ------------------------------------------------------------ sync */

/**
 * Pull everything this device should know. The catalogue is skipped when
 * the server's fingerprint matches what we already hold, so a routine
 * refresh costs a few hundred bytes rather than the whole brochure.
 */
export async function sync({ force = false, scope = "all" } = {}) {
  if (S.syncing) return { ok: true, skipped: true };
  if (!S.online) return { ok: false, offline: true };
  S.syncing = true; emit();
  try {
    await flushQueue();      // our writes go first, so the pull reflects them

    const r = await request("sync.php", {
      params: { scope, version: force ? "" : (S.version || "") },
    });
    if (!r.ok) return r;

    const d = r.data || {};
    if (d.catalogue) {
      S.catalogue = d.catalogue;
      S.version = d.version;
      await Promise.all([write(KEY.catalogue, S.catalogue), write(KEY.version, S.version)]);
    } else if (d.version) {
      S.version = d.version;
      await write(KEY.version, S.version);
    }
    if (d.me) { S.me = d.me; await write(KEY.me, S.me); }
    if (d.me?.user) { S.user = d.me.user; await write(KEY.user, S.user); }
    if (d.owner) { S.owner = d.owner; await write(KEY.owner, S.owner); }

    S.syncedAt = Date.now();
    await write(KEY.syncedAt, S.syncedAt);
    return r;
  } catch (e) {
    return { ok: false, message: navigator.onLine ? "We could not reach Jollof Living." : "You are offline." };
  } finally {
    S.syncing = false; emit();
  }
}

/* ----------------------------------------------------- offline queue */

const newKey = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Perform a write. Online it goes straight out; offline it is stored and
 * replayed later under the same client key, so a retry can never book
 * twice or save a duplicate review.
 */
export async function act(payload, { optimistic } = {}) {
  const clientKey = newKey();
  if (optimistic) optimistic();

  if (!S.online) {
    S.queue.push({ clientKey, payload, at: Date.now() });
    await write(KEY.queue, S.queue);
    emit();
    return { ok: true, queued: true, message: "Saved — we will send this when you are back online." };
  }

  try {
    const r = await request("action.php", { method: "POST", body: payload, clientKey });
    if (r.ok) await sync({ scope: "me" });
    return r;
  } catch (e) {
    // The request left but we never heard back; queue it under the same key
    // so the replay is recognised rather than duplicated.
    S.queue.push({ clientKey, payload, at: Date.now() });
    await write(KEY.queue, S.queue);
    emit();
    return { ok: true, queued: true, message: "Saved — we will send this when the connection returns." };
  }
}

export async function flushQueue() {
  if (!S.online || !S.queue.length) return;
  const pending = [...S.queue];
  const left = [];
  for (const item of pending) {
    try {
      const r = await request("action.php", {
        method: "POST", body: item.payload, clientKey: item.clientKey,
      });
      if (!r.ok && !r.replayed) {
        // A genuine rejection (dates gone, listing removed) — drop it rather
        // than retry forever, and let the next sync show the real state.
        console.warn("queued action refused:", r.message);
      }
    } catch {
      left.push(item);   // still no signal; keep for next time
    }
  }
  S.queue = left;
  await write(KEY.queue, S.queue);
  emit();
}

/* -------------------------------------------------------- selectors */

export const properties = () => S.catalogue.properties || [];
export const propertyBySlug = (slug) => properties().find((p) => p.id === slug || p.slug === slug) || null;
export const wishlistSlugs = () => {
  const w = S.me?.wishlists || {};
  const active = S.me?.activeWishlist || "default";
  return w[active] || w.default || [];
};
export const isWished = (slug) => wishlistSlugs().includes(slug);
export const bookings = () => S.me?.bookings || [];
export const notifications = () => S.me?.notifications || [];
export const unreadNotifs = () => S.me?.unreadNotifs || 0;
export const points = () => S.me?.points ?? S.user?.points ?? 0;
export const tier = () => S.me?.tier || S.user?.tier || "bronze";
export const ownerState = () => S.owner || null;

/** Money, matching the website's formatting. */
export function money(ngn) {
  const n = Math.round(Number(ngn) || 0);
  return "₦" + n.toLocaleString("en-NG");
}
export function shortMoney(ngn) {
  const n = Number(ngn) || 0;
  if (n >= 1000000) return "₦" + (n / 1000000).toFixed(1) + "m";
  if (n >= 1000) return "₦" + Math.round(n / 1000) + "k";
  return "₦" + n;
}
