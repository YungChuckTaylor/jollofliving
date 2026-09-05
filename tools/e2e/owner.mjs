/**
 * Customer vs property-owner accounts: signup choice, routing, access control
 * and every tab of the owner dashboard.
 *
 *   node tools/e2e/owner.mjs [baseUrl]
 */
import { mount, login, ok } from './harness.mjs';

const BASE = process.argv[2] || 'http://localhost:8080';
const stamp = Date.now();
const results = [];
const record = (name, passed, note = '') => { results.push({ name, passed, note }); };
const section = (t) => console.log('\n=== ' + t + ' ===');

const customerEmail = `cust${stamp}@example.com`;
const ownerEmail = `owner${stamp}@example.com`;
const PASS = 'Password12345';

/** Await an api() promise inside the page and get the resolved body back. */
const call = (s, js) =>
  s.window.eval(`(async()=>{const r=await ${js};return JSON.stringify(r);})()`).then((t) => JSON.parse(t));

/* ------------------------------------------------------------- signup choice */
async function signupChoice() {
  section('Signup — account type choice');

  const s = await mount(`${BASE}/auth.php?mode=register`);
  const opts = [...s.document.querySelectorAll('.acct-opt')];
  record('chooser rendered', opts.length === 2, `${opts.length} options`);
  ok(opts.length === 2, 'signup offers two account types');

  const values = [...s.document.querySelectorAll('input[name="account_type"]')].map((i) => i.value);
  ok(values.includes('customer') && values.includes('owner'), 'options are customer + owner', values.join(', '));

  const def = s.document.querySelector('input[name="account_type"]:checked');
  ok(def?.value === 'customer', 'customer is the default choice', def?.value || 'none');

  // ?type=owner should preselect the owner card
  const o = await mount(`${BASE}/auth.php?mode=register&type=owner`);
  const pre = o.document.querySelector('input[name="account_type"]:checked');
  record('type=owner preselects owner', pre?.value === 'owner', pre?.value);
  ok(pre?.value === 'owner', '?type=owner preselects the owner card', pre?.value || 'none');

  // sign-in must NOT show the chooser
  const i = await mount(`${BASE}/auth.php?mode=signin`);
  ok(i.document.querySelectorAll('.acct-opt').length === 0, 'sign-in has no account chooser');
}

/* ------------------------------------------------------- register both types */
async function registerBoth() {
  section('Registering a customer and an owner');

  // --- customer ---
  let s = await mount(`${BASE}/auth.php?mode=register`);
  s.set('#auName', 'Cust Tester');
  s.set('#auEmail', customerEmail);
  s.set('#auPass', PASS);
  s.set('#auTerms', true);
  await s.submit('#authForm');
  let r = s.apiCalls().find((c) => /auth\.php/.test(c.url));
  const custBody = JSON.parse(r?.body || '{}');
  record('customer signup sends type', custBody.account_type === 'customer', custBody.account_type);
  ok(custBody.account_type === 'customer', 'customer signup posts account_type=customer', String(custBody.account_type));
  ok(!!r?.json?.ok, 'customer account created', r?.json?.message || '');
  ok(/account\.php/.test(r?.json?.data?.redirect || ''), 'customer is routed to /account', r?.json?.data?.redirect || '');

  // --- owner ---
  s = await mount(`${BASE}/auth.php?mode=register&type=owner`);
  s.set('#auName', 'Owner Tester');
  s.set('#auEmail', ownerEmail);
  s.set('#auPass', PASS);
  s.set('#auTerms', true);
  await s.submit('#authForm');
  r = s.apiCalls().find((c) => /auth\.php/.test(c.url));
  const ownBody = JSON.parse(r?.body || '{}');
  record('owner signup sends type', ownBody.account_type === 'owner', ownBody.account_type);
  ok(ownBody.account_type === 'owner', 'owner signup posts account_type=owner', String(ownBody.account_type));
  ok(!!r?.json?.ok, 'owner account created', r?.json?.message || '');
  record('owner routed to dashboard', /host-dashboard\.php/.test(r?.json?.data?.redirect || ''), r?.json?.data?.redirect);
  ok(/host-dashboard\.php/.test(r?.json?.data?.redirect || ''), 'owner is routed to the owner dashboard', r?.json?.data?.redirect || '');
}

/* -------------------------------------------------------------- access control */
async function accessControl() {
  section('Access control');

  // A customer must not reach the owner dashboard.
  const custJar = await login(BASE, customerEmail, PASS);
  const res = await fetch(`${BASE}/host-dashboard.php`, {
    headers: { cookie: custJar.join('; ') },
    redirect: 'manual',
  });
  const bounced = res.status === 302 || res.status === 303;
  const dest = res.headers.get('location') || '';
  record('customer blocked from dashboard', bounced, `${res.status} -> ${dest}`);
  ok(bounced, 'customer is redirected away from the owner dashboard', `${res.status} ${dest}`);
  ok(/host\.php/.test(dest), 'and is sent to the hosting page, not an error', dest);

  // An owner gets in.
  const ownJar = await login(BASE, ownerEmail, PASS);
  const res2 = await fetch(`${BASE}/host-dashboard.php`, {
    headers: { cookie: ownJar.join('; ') },
    redirect: 'manual',
  });
  record('owner reaches dashboard', res2.status === 200, String(res2.status));
  ok(res2.status === 200, 'owner reaches the dashboard', String(res2.status));

  // A customer must not drive owner-only API actions.
  const cs = await mount(`${BASE}/account.php`, { cookies: custJar });
  const denied = await call(cs, `api("host-action.php",{action:"listing-status",property:1,status:"paused"})`);
  record('owner API refuses customers', denied?.ok === false, denied?.message);
  ok(denied?.ok === false, 'owner-only API refuses a customer', denied?.message || '');
}

/* ------------------------------------------------------------ upgrade journey */
async function upgradeFlow() {
  section('Customer becomes an owner');

  const jar = await login(BASE, customerEmail, PASS);
  const s = await mount(`${BASE}/host.php`, { cookies: jar });
  ok(s.errors.length === 0, '/host renders clean for a customer', s.errors[0] || '');

  const btn = s.$('#hostUpgrade');
  record('upgrade button shown', !!btn);
  ok(!!btn, 'a signed-in customer is offered the upgrade');
  if (!btn) return null;

  await s.click('#hostUpgrade', 1200);
  const up = s.apiCalls().find((c) => /host-action\.php/.test(c.url));
  record('upgrade calls API', !!up, up?.json?.message);
  ok(!!up?.json?.ok, 'upgrade succeeds', up?.json?.message || '');

  // now the same account must reach the dashboard
  const jar2 = await login(BASE, customerEmail, PASS);
  const res = await fetch(`${BASE}/host-dashboard.php`, { headers: { cookie: jar2.join('; ') }, redirect: 'manual' });
  record('upgraded user reaches dashboard', res.status === 200, String(res.status));
  ok(res.status === 200, 'the upgraded account now reaches the dashboard', String(res.status));

  // ...and keeps its customer features
  const t = await fetch(`${BASE}/trips.php`, { headers: { cookie: jar2.join('; ') }, redirect: 'manual' });
  record('upgraded user keeps customer pages', t.status === 200, String(t.status));
  ok(t.status === 200, 'and still has its customer pages (trips)', String(t.status));
  return jar2;
}

/* --------------------------------------------------------- dashboard, all tabs */
async function dashboardTabs() {
  section('Owner dashboard — all tabs');

  // The seeded host owns the 12 demo properties, so it exercises real data.
  // The installer clears seeded passwords, so fall back to the owner we made
  // above rather than depending on seed internals.
  let jar = null;
  try {
    jar = await login(BASE, 'adebayo@jollofliving.com', PASS);
  } catch {
    console.log('  (seeded host unavailable — run tools/e2e/seed-owner.mjs to enable the full-data checks)');
  }
  if (!jar) {
    jar = await login(BASE, ownerEmail, PASS);
    record('owner dashboard (no seeded listings)', true, 'used the new owner account');
  }

  const tabs = ['overview', 'calendar', 'listings', 'analytics', 'revenue', 'ai', 'team', 'templates', 'channels', 'payouts'];
  let bad = 0; const broken = [];
  for (const t of tabs) {
    const p = await mount(`${BASE}/host-dashboard.php?tab=${t}`, { cookies: jar });
    const body = p.document.body.textContent || '';
    if (p.errors.length) { bad++; broken.push(`${t}: ${p.errors[0].slice(0, 70)}`); continue; }
    if (body.length < 400) { bad++; broken.push(`${t}: rendered almost nothing`); }
  }
  record('all owner tabs render', bad === 0, broken[0] || `${tabs.length} tabs clean`);
  ok(bad === 0, `all ${tabs.length} owner tabs render without errors`, broken.join(' | '));

  return jar;
}

/* ------------------------------------------------- dashboard shows real data */
async function realData(jar) {
  section('Dashboard shows the owner\'s real data');
  if (!jar) return ok(false, 'have an owner session');

  const s = await mount(`${BASE}/host-dashboard.php?tab=listings`, { cookies: jar });
  const host = JSON.parse(s.window.eval('JSON.stringify(JL.data.host||{})'));

  record('host payload present', !!host.stats, Object.keys(host).join(','));
  ok(!!host.stats, 'the owner payload reaches the page');
  const n = (host.listings || []).length;
  ok(n > 0, 'owner sees their own listings', `${n} listings`);

  // the rendered table must actually name one of them
  const text = s.document.body.textContent || '';
  const first = (host.listings || [])[0];
  if (first) ok(text.includes(first.name), 'a real listing name is rendered', first.name);

  // and must NOT contain the old hardcoded demo listing unless it is genuinely theirs
  const ownNames = (host.listings || []).map((l) => l.name);
  const demoLeak = text.includes('The Island Retreat') && !ownNames.includes('The Island Retreat');
  record('no demo data leak', !demoLeak);
  ok(!demoLeak, 'no hardcoded demo listing leaks into the table');

  // stats must be derived, not fixed
  const st = host.stats || {};
  ok(typeof st.gross === 'number', 'gross earnings computed from real bookings', String(st.gross));
  ok(typeof st.occupancy === 'number', 'occupancy computed', String(st.occupancy));

  return host;
}

/* ------------------------------------------------------- owner actions write */
async function ownerActions(jar, host) {
  section('Owner actions persist');
  if (!jar || !host?.listings?.length) return ok(false, 'have listings to act on');
  const pid = host.listings[0].id;

  const s = await mount(`${BASE}/host-dashboard.php?tab=calendar`, { cookies: jar });

  // calendar: set a price on a far-future date
  const day = new Date(Date.now() + 200 * 86400000).toISOString().slice(0, 10);
  const set = await call(s, `api("host-action.php",{action:"set-day",property:${pid},day:${JSON.stringify(day)},price:222000,blocked:false})`);
  record('calendar day saved', !!set?.ok, set?.message);
  ok(!!set?.ok, 'a calendar date can be priced', set?.message || '');
  const saved = (set?.data?.calendar?.days || []).find((d) => d.iso === day);
  ok(saved?.price === 222000, 'the new price comes back in the calendar', String(saved?.price));

  // blocking a date
  const blk = await call(s, `api("host-action.php",{action:"set-day",property:${pid},day:${JSON.stringify(day)},price:222000,blocked:true})`);
  const blocked = (blk?.data?.calendar?.days || []).find((d) => d.iso === day);
  ok(blocked?.blocked === true, 'a date can be blocked', JSON.stringify(blocked || {}));

  // pricing rule
  const rule = await call(s, `api("host-action.php",{action:"rule-add",name:"Detty December",adjust:25,kind:"seasonal"})`);
  record('pricing rule added', !!rule?.ok, rule?.message);
  ok(!!rule?.ok, 'a pricing rule can be added', rule?.message || '');

  // co-host invite
  const team = await call(s, `api("host-action.php",{action:"team-invite",name:"Kemi Test",email:"kemi${stamp}@example.com",role:"cohost",permissions:"calendar,messages"})`);
  record('co-host invited', !!team?.ok, team?.message);
  ok(!!team?.ok, 'a co-host can be invited', team?.message || '');

  // template
  const tpl = await call(s, `api("host-action.php",{action:"template-save",id:0,title:"Late checkout",body:"Happy to offer a 2pm checkout.",trigger:"manual"})`);
  record('template saved', !!tpl?.ok, tpl?.message);
  ok(!!tpl?.ok, 'a message template can be saved', tpl?.message || '');

  // payout settings
  const pay = await call(s, `api("host-action.php",{action:"payout-settings",schedule:"monthly",bank:"Zenith Bank",account_name:"Adebayo O",account:"0123456789"})`);
  record('payout settings saved', !!pay?.ok, pay?.message);
  ok(!!pay?.ok, 'payout settings can be saved', pay?.message || '');
  ok(pay?.data?.host?.payoutSettings?.accountLast === '6789', 'only the last 4 digits are stored', pay?.data?.host?.payoutSettings?.accountLast || '');

  // listing pause / relist
  const pause = await call(s, `api("host-action.php",{action:"listing-status",property:${pid},status:"paused"})`);
  ok(!!pause?.ok, 'a listing can be paused', pause?.message || '');
  const live = await call(s, `api("host-action.php",{action:"listing-status",property:${pid},status:"live"})`);
  ok(!!live?.ok, 'and set live again', live?.message || '');

  // nightly rate
  const price = await call(s, `api("host-action.php",{action:"listing-price",property:${pid},price:199000})`);
  ok(!!price?.ok, 'the nightly rate can be changed', price?.message || '');

  // validation still bites
  const bad = await call(s, `api("host-action.php",{action:"listing-price",property:${pid},price:5})`);
  record('rate validation', bad?.ok === false, bad?.message);
  ok(bad?.ok === false, 'an absurd nightly rate is refused', bad?.message || '');
}

/* --------------------------------------------------- cross-owner isolation */
async function isolation() {
  section('Owners cannot touch each other\'s data');

  const jar = await login(BASE, ownerEmail, PASS);  // brand-new owner, no listings
  const s = await mount(`${BASE}/host-dashboard.php`, { cookies: jar });

  const host = JSON.parse(s.window.eval('JSON.stringify(JL.data.host||{})'));
  record('new owner sees no listings', (host.listings || []).length === 0, String((host.listings || []).length));
  ok((host.listings || []).length === 0, 'a new owner sees zero listings, not someone else\'s', String((host.listings || []).length));

  const text = s.document.body.textContent || '';
  ok(/No listings yet/i.test(text), 'and gets an empty state instead of fake numbers');

  // try to drive another owner's property by id
  const steal = await call(s, `api("host-action.php",{action:"listing-price",property:1,price:1000})`);
  record('cross-owner write blocked', steal?.ok === false, steal?.message);
  ok(steal?.ok === false, 'writing to another owner\'s listing is refused', steal?.message || '');

  const steal2 = await call(s, `api("host-action.php",{action:"set-day",property:1,day:"2027-01-01",price:1000,blocked:true})`);
  ok(steal2?.ok === false, 'and so is editing their calendar', steal2?.message || '');
}

/* ---------------------------------------------------- listing => owner promo */
async function listingPromotes() {
  section('Publishing a listing turns a customer into an owner');

  const email = `lister${stamp}@example.com`;
  let s = await mount(`${BASE}/auth.php?mode=register`);
  s.set('#auName', 'Lister Tester');
  s.set('#auEmail', email);
  s.set('#auPass', PASS);
  s.set('#auTerms', true);
  await s.submit('#authForm');

  const jar = await login(BASE, email, PASS);
  const before = await fetch(`${BASE}/host-dashboard.php`, { headers: { cookie: jar.join('; ') }, redirect: 'manual' });
  ok(before.status !== 200, 'starts without dashboard access', String(before.status));

  const p = await mount(`${BASE}/account.php`, { cookies: jar });
  const made = await call(p, `api("listing-create.php",{title:"Owner Flow Residence ${stamp}",area:"Ikoyi",city:"Lagos",price:150000,guests:4,beds:2,baths:2,description:"A test listing from the owner flow suite."})`);
  record('listing created', !!made?.ok, made?.message);
  ok(!!made?.ok, 'the listing is submitted', made?.message || '');

  const jar2 = await login(BASE, email, PASS);
  const after = await fetch(`${BASE}/host-dashboard.php`, { headers: { cookie: jar2.join('; ') }, redirect: 'manual' });
  record('listing grants owner access', after.status === 200, String(after.status));
  ok(after.status === 200, 'and the account now reaches the owner dashboard', String(after.status));
}

/* --------------------------------------------------------------------- run */
await signupChoice();
await registerBoth();
await accessControl();
await upgradeFlow();
const jar = await dashboardTabs();
const host = await realData(jar);
await ownerActions(jar, host);
await isolation();
await listingPromotes();

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
