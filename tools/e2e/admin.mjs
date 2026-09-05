/**
 * Admin console: every tab on real data, and every action writing to the
 * database. Also covers the logout controls across the site.
 *
 *   node tools/e2e/admin.mjs [baseUrl]
 */
import { mount, login, ok } from './harness.mjs';

const BASE = process.argv[2] || 'http://localhost:8080';
const stamp = Date.now();
const results = [];
const record = (name, passed, note = '') => { results.push({ name, passed, note }); };
const section = (t) => console.log('\n=== ' + t + ' ===');

const ADMIN = ['ops@jollofliving.com', 'SuperSecret123'];
const HOST = ['adebayo@jollofliving.com', 'Password12345'];

const call = (s, js) =>
  s.window.eval(`(async()=>{const r=await ${js};return JSON.stringify(r);})()`).then((t) => JSON.parse(t));

const adminState = (s) => JSON.parse(s.window.eval('JSON.stringify((JL.data.admin)||{})'));
const adminStats = (s) => JSON.parse(s.window.eval('JSON.stringify((JL.data.adminStats)||{})'));

/* ------------------------------------------------------------- logout UI */
async function logoutControls() {
  section('Logout controls');

  // signed out: the menu offers sign-in, never logout
  const out = await mount(`${BASE}/index.php`);
  const outCtas = out.$('#drawerCtas')?.textContent || '';
  record('signed-out menu offers sign in', /Sign in/i.test(outCtas), outCtas.trim().replace(/\s+/g, ' '));
  ok(/Sign in/i.test(outCtas), 'signed-out menu offers Sign in');
  ok(!/Log out/i.test(outCtas), 'and does NOT offer Log out');

  // signed in as a customer
  const email = `adm${stamp}@example.com`;
  let s = await mount(`${BASE}/auth.php?mode=register`);
  s.set('#auName', 'Menu Tester'); s.set('#auEmail', email);
  s.set('#auPass', 'Password12345'); s.set('#auTerms', true);
  await s.submit('#authForm');
  const jar = await login(BASE, email, 'Password12345');

  const inn = await mount(`${BASE}/index.php`, { cookies: jar });
  const inCtas = inn.$('#drawerCtas')?.textContent || '';
  record('signed-in menu offers logout', /Log out/i.test(inCtas), inCtas.trim().replace(/\s+/g, ' '));
  ok(/Log out/i.test(inCtas), 'signed-in menu offers Log out');
  ok(!/Sign in/i.test(inCtas), 'and no longer offers Sign in');

  // header
  ok(!!inn.$('#navLogoutBtn'), 'the header shows a Log out button when signed in');
  const outHdr = await mount(`${BASE}/index.php`);
  ok(!outHdr.$('#navLogoutBtn'), 'and hides it when signed out');

  // account page
  const acct = await mount(`${BASE}/account.php`, { cookies: jar });
  ok(/logout\.php/.test(acct.document.body.innerHTML), 'the account page has a logout link');

  // logout actually ends the session
  const res = await fetch(`${BASE}/logout.php`, { headers: { cookie: jar.join('; ') }, redirect: 'manual' });
  const after = await fetch(`${BASE}/account.php`, { headers: { cookie: jar.join('; ') }, redirect: 'manual' });
  record('logout ends the session', after.status === 302, `logout ${res.status}, account ${after.status}`);
  ok(after.status === 302, 'after logout, a gated page redirects to sign-in', String(after.status));
}

async function ownerLogout() {
  section('Owner dashboard logout');
  const jar = await login(BASE, ...HOST);
  const s = await mount(`${BASE}/host-dashboard.php`, { cookies: jar });
  const html = s.document.body.innerHTML;
  record('owner dashboard has logout', /logout\.php/.test(html));
  ok(/logout\.php/.test(html), 'the owner dashboard offers a logout');
  const nav = s.document.querySelector('.admin-nav')?.textContent || '';
  ok(/Log out/i.test(nav), 'and it sits in the owner nav where people look', nav.replace(/\s+/g, ' ').slice(-60));
}

/* --------------------------------------------------------- admin console */
async function adminTabs() {
  section('Admin tabs render on real data');
  const jar = await login(BASE, ...ADMIN, 'admin-auth.php');
  const tabs = ['dashboard', 'moderation', 'users', 'promotions', 'fraud', 'cms', 'reports', 'roles', 'audit'];
  let bad = 0; const broken = [];
  for (const t of tabs) {
    const p = await mount(`${BASE}/admin.php?tab=${t}`, { cookies: jar });
    const body = p.document.body.textContent || '';
    if (p.errors.length) { bad++; broken.push(`${t}: ${p.errors[0].slice(0, 60)}`); continue; }
    if (body.length < 400) { bad++; broken.push(`${t}: rendered almost nothing`); }
  }
  record('all admin tabs render', bad === 0, broken[0] || `${tabs.length} clean`);
  ok(bad === 0, `all ${tabs.length} admin tabs render cleanly`, broken.join(' | '));
  return jar;
}

async function adminData(jar) {
  section('Admin tabs are database-driven');
  const s = await mount(`${BASE}/admin.php?tab=users`, { cookies: jar });
  const st = adminState(s);
  const stats = adminStats(s);

  ok((st.users || []).length > 0, 'user list comes from the database', `${(st.users || []).length} users`);
  ok((st.audit || []).length > 0, 'audit log is populated', `${(st.audit || []).length} entries`);
  ok((st.campaigns || []).length > 0, 'campaigns come from the database', `${(st.campaigns || []).length}`);
  ok((st.cms || []).length > 0, 'CMS blocks come from the database', `${(st.cms || []).length}`);

  // roles used to be hardcoded zeros
  const roles = st.roles || [];
  record('roles have real counts', roles.length > 0 && roles.some((r) => r[2] > 0), JSON.stringify(roles));
  ok(roles.length > 0, 'roles tab has data', `${roles.length} roles`);
  ok(roles.some((r) => r[2] > 0), 'and shows real member counts, not zeros', roles.map((r) => `${r[0]}:${r[2]}`).join(' '));

  // dashboard stats must be computed
  ok(typeof stats.users === 'number' && stats.users > 0, 'dashboard user count is real', String(stats.users));
  ok(typeof stats.listings === 'number', 'dashboard listing count is real', String(stats.listings));

  // the CMS editor needs full blocks
  ok((st.cmsBlocks || []).length > 0, 'the CMS editor receives full blocks', `${(st.cmsBlocks || []).length}`);
  ok(typeof (st.cmsBlocks || [])[0]?.body === 'string', 'including the block body it edits');
}

/* ----------------------------------------- the reported moderation flow */
async function moderationFlow() {
  section('Host submits a listing, admin approves it');

  const hostJar = await login(BASE, ...HOST);
  const h = await mount(`${BASE}/account.php`, { cookies: hostJar });
  const title = `Admin Suite Listing ${stamp}`;
  const made = await call(h, `api("listing-create.php",{title:${JSON.stringify(title)},area:"Ikoyi",city:"Lagos",price:175000,guests:3,beds:2,baths:1,description:"Submitted by the admin test suite."})`);
  record('host submits a listing', !!made?.ok, made?.message);
  ok(!!made?.ok, 'the host submits a listing', made?.message || '');

  const jar = await login(BASE, ...ADMIN, 'admin-auth.php');
  let a = await mount(`${BASE}/admin.php?tab=moderation`, { cookies: jar });
  let queue = adminState(a).moderation || [];
  const mine = queue.find((m) => String(m[0]).includes(title));
  record('listing reaches the queue', !!mine, mine ? mine[0] : `${queue.length} rows, none matching`);
  ok(!!mine, 'it appears in the moderation queue');
  ok((a.document.body.textContent || '').includes(title), 'and is visible in the rendered table');

  if (!mine) return;
  ok(mine[6] === 'listing', 'tagged as a listing so approve routes correctly', String(mine[6]));

  const r = await call(a, `api("admin-action.php",{entity:"moderation",action:"approve",id:${mine[5]}})`);
  record('admin approves it', !!r?.ok, r?.message);
  ok(!!r?.ok, 'the admin can approve it', r?.message || '');

  a = await mount(`${BASE}/admin.php?tab=moderation`, { cookies: jar });
  queue = adminState(a).moderation || [];
  ok(!queue.find((m) => String(m[0]).includes(title)), 'and it leaves the queue once handled');

  // the listing must now be publicly live
  const stays = await mount(`${BASE}/stays.php`);
  const live = JSON.parse(stays.window.eval('JSON.stringify((JL.data.properties||[]).map(p=>p.name))'));
  record('approved listing goes live', live.includes(title), `${live.length} live listings`);
  ok(live.includes(title), 'the approved listing is now publicly visible');
}

async function reviewModeration() {
  section('Review moderation');
  const jar = await login(BASE, ...ADMIN, 'admin-auth.php');
  const a = await mount(`${BASE}/admin.php?tab=moderation`, { cookies: jar });
  const queue = adminState(a).moderation || [];
  const rev = queue.find((m) => m[6] === 'review');
  if (!rev) { record('review moderation', true, 'no pending reviews to action (not a failure)'); return ok(true, 'no pending reviews queued'); }
  const r = await call(a, `api("admin-action.php",{entity:"review",action:"approve",id:${rev[5]}})`);
  record('review approved', !!r?.ok, r?.message);
  ok(!!r?.ok, 'a queued review can be published', r?.message || '');
}

/* --------------------------------------------------------- admin actions */
async function adminActions(jar) {
  section('Admin actions write to the database');
  const s = await mount(`${BASE}/admin.php?tab=users`, { cookies: jar });
  const st = adminState(s);

  // pick a user who is not the admin
  const target = (st.users || []).find((u) => u[1] !== ADMIN[0]);
  if (!target) return ok(false, 'have a user to action');
  const uid = target[7];

  const susp = await call(s, `api("admin-action.php",{entity:"user",action:"suspend",id:${uid}})`);
  record('user suspend', !!susp?.ok, susp?.message);
  ok(!!susp?.ok, 'a user can be suspended', susp?.message || '');

  const rest = await call(s, `api("admin-action.php",{entity:"user",action:"restore",id:${uid}})`);
  ok(!!rest?.ok, 'and restored', rest?.message || '');

  const self = await call(s, `api("admin-action.php",{entity:"user",action:"suspend",id:${st.users.find((u) => u[1] === ADMIN[0])?.[7] || 0}})`);
  record('cannot action own account', self?.ok === false, self?.message);
  ok(self?.ok === false, 'an admin cannot suspend their own account', self?.message || '');

  // CMS save
  const cms = await call(s, `api("admin-action.php",{entity:"cms",action:"save",id:0,title:"Suite block ${stamp}",body:"Written by the admin test suite.",status:"Draft"})`);
  record('cms block saved', !!cms?.ok, cms?.message);
  ok(!!cms?.ok, 'a CMS block can be created', cms?.message || '');

  // campaign save
  const camp = await call(s, `api("admin-action.php",{entity:"campaign",action:"save",id:0,code:"SUITE${String(stamp).slice(-5)}",name:"Suite campaign",window:"Sep–Oct",status:"Scheduled"})`);
  record('campaign saved', !!camp?.ok, camp?.message);
  ok(!!camp?.ok, 'a campaign can be created', camp?.message || '');

  // fraud
  const fr = adminState(s).fraud || [];
  if (fr.length) {
    const f = await call(s, `api("admin-action.php",{entity:"fraud",action:"resolve",id:${fr[0][5]}})`);
    record('fraud case resolved', !!f?.ok, f?.message);
    ok(!!f?.ok, 'a fraud case can be resolved', f?.message || '');
  }

  // settings
  const set = await call(s, `api("admin-action.php",{entity:"setting",action:"save",key:"host_take_rate",value:"0.12"})`);
  record('setting saved', !!set?.ok, set?.message);
  ok(!!set?.ok, 'a platform setting can be saved', set?.message || '');

  // non-admin must be refused
  const guestJar = await login(BASE, ...HOST);
  const g = await mount(`${BASE}/account.php`, { cookies: guestJar });
  const denied = await call(g, `api("admin-action.php",{entity:"user",action:"suspend",id:${uid}})`);
  record('admin API refuses non-admins', denied?.ok === false, denied?.message);
  ok(denied?.ok === false, 'the admin API refuses a non-admin', denied?.message || '');
}

/* ------------------------------ the menu works without JavaScript ----- */
async function drawerServerRendered() {
  section('Menu is server-rendered (survives a JS failure)');
  const jar = await login(BASE, ...HOST);
  const grab = (html) => {
    const i = html.indexOf('id="drawerCtas"');
    return i < 0 ? '' : html.slice(i, i + 900);
  };
  let allOk = true; const notes = [];
  for (const page of ['index.php', 'stays.php', 'host-dashboard.php', 'account.php']) {
    const html = await (await fetch(`${BASE}/${page}`, { headers: { cookie: jar.join('; ') } })).text();
    const d = grab(html);
    if (!/logout\.php/.test(d) || /Sign in \/ Join/.test(d)) { allOk = false; notes.push(page); }
  }
  record('menu logout in raw HTML', allOk, notes.length ? `missing on ${notes.join(', ')}` : 'on every page');
  ok(allOk, 'the menu carries Log out in the HTML itself, on every page', notes.join(', '));

  const out = grab(await (await fetch(`${BASE}/index.php`)).text());
  ok(/Sign in \/ Join/.test(out) && !/logout\.php/.test(out), 'and offers Sign in instead when signed out');

  // owners get their dashboard link in the menu
  const inn = grab(await (await fetch(`${BASE}/index.php`, { headers: { cookie: jar.join('; ') } })).text());
  ok(/host-dashboard/.test(inn), 'an owner sees Owner dashboard in the menu');
}

/* ------------------------------ every admin menu item ----------------- */
async function everyMenuItem(jar) {
  section('Every admin menu item works');
  const expected = [
    ['dashboard', 'Dashboard'], ['moderation', 'Listings moderation'], ['users', 'User management'],
    ['promotions', 'Promotions & campaigns'], ['fraud', 'Fraud detection'], ['cms', 'Content (CMS)'],
    ['reports', 'Reports & analytics'], ['roles', 'Roles & permissions'], ['audit', 'Audit log'],
  ];
  const first = await mount(`${BASE}/admin.php?tab=dashboard`, { cookies: jar });
  const navText = first.document.querySelector('.admin-nav')?.textContent || '';
  const missing = expected.filter(([, label]) => !navText.includes(label));
  record('all 9 menu items present', missing.length === 0, missing.map((m) => m[1]).join(', ') || 'all there');
  ok(missing.length === 0, 'every menu item from the design is present', missing.map((m) => m[1]).join(', '));

  // each tab must render its own distinctive panel, not silently fall back
  const marker = {
    dashboard: 'Live operations', moderation: 'Moderation queue', users: 'User management',
    promotions: 'campaign manager', fraud: 'fraud detection', cms: 'Content management',
    reports: 'Reporting', roles: 'Role-based access', audit: 'Audit log',
  };
  const wrong = [];
  for (const [tab] of expected) {
    const p = await mount(`${BASE}/admin.php?tab=${tab}`, { cookies: jar });
    const body = p.document.body.textContent || '';
    if (!body.toLowerCase().includes(marker[tab].toLowerCase())) wrong.push(tab);
  }
  record('each tab renders its own panel', wrong.length === 0, wrong.join(', ') || '9 distinct panels');
  ok(wrong.length === 0, 'each tab renders its own panel rather than falling back', wrong.join(', '));

  // header badges must be computed, not the old fixed sample figures
  const head = first.document.querySelector('.head-actions')?.textContent || '';
  record('header stats are real', !head.includes('412m'), head.replace(/\s+/g, ' ').trim());
  ok(!head.includes('₦412m'), 'the header no longer shows a hardcoded GMV figure', head.replace(/\s+/g, ' ').trim());

  // the dashboard moderation count must agree with the queue length
  const st = adminState(first); const stats = adminStats(first);
  record('dashboard count matches queue', stats.moderation === (st.moderation || []).length,
    `stat ${stats.moderation} vs queue ${(st.moderation || []).length}`);
  ok(stats.moderation === (st.moderation || []).length,
    'the dashboard moderation count matches the queue', `${stats.moderation} vs ${(st.moderation || []).length}`);
}

async function userSearch(jar) {
  section('User search');
  const s = await mount(`${BASE}/admin.php?tab=users`, { cookies: jar });
  const total = (adminState(s).users || []).length;
  const box = s.$('#admUserSearch');
  record('search box exists', !!box);
  ok(!!box, 'the user list has a working search box');
  if (!box) return;
  box.value = 'adebayo';
  box.dispatchEvent(new s.window.Event('input', { bubbles: true }));
  await s.wait(60);
  const shown = s.document.querySelectorAll('#admUserBody tr').length;
  record('search filters', shown > 0 && shown < total, `${shown} of ${total}`);
  ok(shown > 0 && shown < total, 'typing a name filters the table', `${shown} of ${total} rows`);
}

/* ------------------------------------------------------------- reports */
async function reports(jar) {
  section('Report exports');
  const kinds = ['bookings', 'revenue', 'properties', 'users', 'reviews', 'subscribers', 'hosts', 'audit'];
  let bad = 0; const broken = [];
  for (const k of kinds) {
    const res = await fetch(`${BASE}/api/report.php?r=${k}&format=csv`, { headers: { cookie: jar.join('; ') } });
    const text = await res.text();
    if (res.status !== 200 || /error|no such column|exception/i.test(text.slice(0, 400))) {
      bad++; broken.push(`${k}: ${res.status} ${text.slice(0, 60)}`);
    }
  }
  record('all report CSVs export', bad === 0, broken[0] || `${kinds.length} exports fine`);
  ok(bad === 0, `all ${kinds.length} report exports work`, broken.join(' | '));
}

/* --------------------------------------------------------------------- */
await logoutControls();
await ownerLogout();
await drawerServerRendered();
const jar = await adminTabs();
await everyMenuItem(jar);
await adminData(jar);
await userSearch(jar);
await moderationFlow();
await reviewModeration();
await adminActions(jar);
await reports(jar);

console.log('\n================ SUMMARY ================');
let pass = 0;
for (const r of results) {
  console.log(` ${r.passed ? 'ok  ' : 'FAIL'}  ${r.name}${r.note ? '  — ' + r.note : ''}`);
  if (r.passed) pass++;
}
console.log(`\n${pass}/${results.length} checks passed`);
if (pass !== results.length) {
  console.log('FAILURES:');
  results.filter((r) => !r.passed).forEach((r) => console.log(`  - ${r.name}: ${r.note}`));
  process.exitCode = 1;
}
