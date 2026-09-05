/**
 * Jollof Living — browser-ish test harness.
 *
 * jsdom ships no fetch, so a page mounted naively cannot talk to the API at
 * all: every form silently reports "Network problem" and a test built on that
 * proves nothing. This bridges window.fetch to node's, carrying the session
 * cookie in both directions, and records every request so a test can assert
 * that a form actually reached its endpoint.
 *
 *   const s = await mount('http://host/auth.php');
 *   s.set('#auEmail', 'a@b.co');
 *   await s.submit('#authForm');
 *   s.calls   -> [{ url, body, status, json }]
 */
import { JSDOM, VirtualConsole } from '/tmp/jd/node_modules/jsdom/lib/api.js';

export async function mount(url, { cookies = [] } = {}) {
  const jar = [...cookies];
  const calls = [];
  const errors = [];
  const navigations = [];

  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => {
    const m = String(e.message || '');
    if (/Not implemented: navigation/.test(m)) navigations.push(m);
    else if (!/Not implemented/.test(m)) errors.push(m.slice(0, 300));
  });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ').slice(0, 300)));

  const absorb = (res) => {
    const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const c of sc) {
      const kv = c.split(';')[0];
      const k = kv.split('=')[0];
      const i = jar.findIndex((x) => x.startsWith(k + '='));
      if (i >= 0) jar[i] = kv; else jar.push(kv);
    }
  };

  // Load the page itself with the jar so a signed-in session carries over.
  const page = await fetch(url, { headers: jar.length ? { cookie: jar.join('; ') } : {} });
  absorb(page);
  const html = await page.text();

  const dom = new JSDOM(html, {
    url, runScripts: 'dangerously', resources: 'usable',
    pretendToBeVisual: true, virtualConsole: vc,
  });
  const w = dom.window;
  w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  w.scrollTo = () => {};

  w.fetch = async (input, opts = {}) => {
    const target = new URL(String(input), url).href;
    const headers = { ...(opts.headers || {}) };
    if (jar.length) headers.cookie = jar.join('; ');
    const res = await fetch(target, { ...opts, headers, redirect: 'manual' });
    absorb(res);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch { /* not json */ }
    calls.push({ url: target, body: opts.body ? String(opts.body) : null, status: res.status, text, json });
    // jsdom's window.Response is not constructible, so hand back a minimal
    // response shim. The body is a fresh string each time: reading it here and
    // then returning the real stream would leave api()'s res.json() to throw on
    // an already-consumed body.
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      statusText: res.statusText,
      url: target,
      redirected: false,
      headers: res.headers,
      clone() { return this; },
      text: async () => text,
      json: async () => JSON.parse(text),
    };
  };

  await new Promise((r) => w.addEventListener('load', r, { once: true }));
  await new Promise((r) => setTimeout(r, 900));

  const d = w.document;
  const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

  return {
    window: w, document: d, calls, errors, navigations, jar,
    $: (sel) => d.querySelector(sel),
    set(sel, value) {
      const el = d.querySelector(sel);
      if (!el) throw new Error('missing element: ' + sel);
      if (el.type === 'checkbox') el.checked = !!value; else el.value = value;
      el.dispatchEvent(new w.Event('input', { bubbles: true }));
      el.dispatchEvent(new w.Event('change', { bubbles: true }));
      return el;
    },
    async click(sel, ms = 600) {
      const el = typeof sel === 'string' ? d.querySelector(sel) : sel;
      if (!el) throw new Error('missing element: ' + sel);
      el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
      await wait(ms);
      return el;
    },
    async submit(sel, ms = 800) {
      const f = d.querySelector(sel);
      if (!f) throw new Error('missing form: ' + sel);
      f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
      await wait(ms);
      return f;
    },
    wait,
    toast: () => (d.querySelector('.toast') || {}).textContent || '',
    apiCalls: () => calls.filter((c) => /\/api\//.test(c.url)),
  };
}

/** Sign in over HTTP and return a cookie jar usable by mount(). */
export async function login(base, email, password, endpoint = 'auth.php') {
  const jar = [];
  const absorb = (res) => {
    for (const c of (res.headers.getSetCookie ? res.headers.getSetCookie() : [])) {
      const kv = c.split(';')[0];
      const k = kv.split('=')[0];
      const i = jar.findIndex((x) => x.startsWith(k + '='));
      if (i >= 0) jar[i] = kv; else jar.push(kv);
    }
  };
  const p = await fetch(base + '/index.php');
  absorb(p);
  const csrf = ((await p.text()).match(/"csrf":"([^"]+)"/) || [])[1];
  const r = await fetch(base + '/api/' + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf, cookie: jar.join('; ') },
    body: JSON.stringify(endpoint === 'admin-auth.php'
      ? { csrf, email, password }
      : { csrf, action: 'login', email, password }),
  });
  absorb(r);
  const body = await r.json();
  if (!body.ok) throw new Error('login failed: ' + (body.message || r.status));
  return jar;
}

export const ok = (cond, label, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
  return !!cond;
};
