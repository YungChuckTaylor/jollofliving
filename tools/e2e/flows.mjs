/**
 * Exercises every interactive flow in the site: mount the real page, drive the
 * real controls, assert the request reached its endpoint and that the database
 * changed. Run against a seeded install:
 *
 *   node tools/e2e/flows.mjs [baseUrl]
 */
import { mount, login, ok } from './harness.mjs';

const BASE = process.argv[2] || 'http://localhost:8080';
const stamp = Date.now();
const results = [];
const record = (name, passed, note = '') => { results.push({ name, passed, note }); };

const section = (t) => console.log('\n=== ' + t + ' ===');
const ping = (s) => s.errors.length ? '  [js errors: ' + s.errors[0] + ']' : '';

/* ---------------------------------------------------------------- guest auth */
async function authFlows() {
  section('Auth');
  const email = `flow${stamp}@example.com`;

  let s = await mount(`${BASE}/auth.php?mode=register`);
  s.set('#auName', 'Flow Tester');
  s.set('#auEmail', email);
  s.set('#auPass', 'Password12345');
  s.set('#auTerms', true);
  await s.submit('#authForm');
  const reg = s.apiCalls().find((c) => /auth\.php/.test(c.url));
  record('register posts to API', !!reg);
  record('register succeeds', !!reg?.json?.ok, reg?.json?.message);
  ok(!!reg, 'registration reaches /api/auth.php');
  ok(!!reg?.json?.ok, 'registration accepted', reg?.json?.message || '');

  s = await mount(`${BASE}/auth.php?mode=signin`);
  s.set('#auEmail', email);
  s.set('#auPass', 'Password12345');
  await s.submit('#authForm');
  const li = s.apiCalls().find((c) => /auth\.php/.test(c.url));
  record('sign-in succeeds', !!li?.json?.ok, li?.json?.message);
  ok(!!li?.json?.ok, 'sign-in accepted', li?.json?.message || '');

  s = await mount(`${BASE}/auth.php?mode=signin`);
  s.set('#auEmail', email);
  s.set('#auPass', 'WrongPassword!');
  await s.submit('#authForm');
  const bad = s.apiCalls().find((c) => /auth\.php/.test(c.url));
  record('bad password rejected', bad?.json?.ok === false, bad?.json?.message);
  ok(bad?.json?.ok === false, 'wrong password rejected', bad?.json?.message || '');

  return email;
}

/* -------------------------------------------------------------- newsletter */
async function newsletterFlow() {
  section('Newsletter');
  const s = await mount(`${BASE}/index.php`);
  if (!s.$('#newsInput')) { record('newsletter form present', false); return ok(false, 'newsletter input found'); }
  s.set('#newsInput', `news${stamp}@example.com`);
  await s.click('#newsBtn', 900);
  const call = s.apiCalls().find((c) => /newsletter/.test(c.url));
  record('newsletter subscribes', !!call?.json?.ok, call?.json?.message);
  ok(!!call, 'newsletter reaches /api/newsletter.php');
  ok(!!call?.json?.ok, 'newsletter accepted', call?.json?.message || '');
}

/* ------------------------------------------------------- wishlist + compare */
async function wishlistCompare(jar) {
  section('Wishlist & compare');
  const s = await mount(`${BASE}/stays.php`, { cookies: jar });
  const heart = s.$('[data-heart]');
  if (heart) {
    await s.click(heart);
    const call = s.apiCalls().find((c) => /wishlist/.test(c.url));
    record('wishlist toggle', !!call?.json?.ok, call?.json?.message);
    ok(!!call?.json?.ok, 'heart writes to /api/wishlist.php', call?.json?.message || '');
  } else record('wishlist toggle', false, 'no [data-heart]');

  const cmp = s.$('[data-cmp]');
  if (cmp) {
    await s.click(cmp);
    const call = s.apiCalls().find((c) => /compare/.test(c.url));
    record('compare toggle', !!call?.json?.ok, call?.json?.message);
    ok(!!call?.json?.ok, 'compare writes to /api/compare.php', call?.json?.message || '');
  } else record('compare toggle', false, 'no [data-cmp]');
}

/* ---------------------------------------------------------- booking wizard */
async function bookingFlow(jar) {
  section('Booking wizard');
  const s = await mount(`${BASE}/booking.php?p=onyx`, { cookies: jar });
  // pick a window far out and unique per run, so repeat runs never collide
  const d = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  const offset = 400 + (Math.floor(Date.now() / 1000) % 300);
  s.window.eval(`BOOK_STATE.in=${JSON.stringify(d(offset))};BOOK_STATE.out=${JSON.stringify(d(offset + 4))};`);
  await s.click('#bkNext1');
  const addon = s.$('[data-addon]');
  if (addon) addon.checked = true;
  const split = s.$('#bkSplit'); if (split) split.checked = true;
  await s.click('#bkNext2');
  const atPayment = /Payment/i.test(s.$('#bkStage h2')?.textContent || '');
  ok(atPayment, 'wizard advances to Payment with an add-on selected');
  await s.click('#bkNext3');
  const atReview = /Review/i.test(s.$('#bkStage h2')?.textContent || '');
  ok(atReview, 'wizard advances to Review');
  const terms = s.$('#bkTerms'); if (terms) terms.checked = true;
  await s.click('#bkConfirm', 1200);
  const call = s.apiCalls().find((c) => /booking-create/.test(c.url));
  record('booking creates', !!call?.json?.ok, call?.json?.message);
  ok(!!call, 'confirm reaches /api/booking-create.php');
  ok(!!call?.json?.ok, 'booking created', call?.json?.data?.ref || call?.json?.message || '');
  return call?.json?.data?.ref;
}

/* -------------------------------------------------------------- concierge */
async function conciergeFlow(jar) {
  section('Concierge');
  const s = await mount(`${BASE}/concierge.php`, { cookies: jar });
  const input = s.$('#concInput');
  if (!input) { record('concierge', false, 'no #concInput'); return ok(false, 'concierge input'); }
  input.value = 'What is available in Ikoyi under 200000?';
  await s.click('#concSend', 1500);
  const call = s.apiCalls().find((c) => /concierge/.test(c.url));
  record('concierge replies', !!call?.json?.ok, (call?.json?.data?.reply || '').slice(0, 60));
  ok(!!call, 'concierge reaches /api/concierge.php');
  ok(!!call?.json?.ok, 'concierge replied', (call?.json?.data?.reply || '').replace(/<[^>]+>/g, '').slice(0, 70));
}

/* --------------------------------------------------------------- messages */
async function messagesFlow(jar) {
  section('Messages');
  const s = await mount(`${BASE}/messages.php`, { cookies: jar });
  if (!s.$('#chatInp')) { record('message send', false, 'no #chatInp'); return ok(false, 'message input found'); }
  s.set('#chatInp', 'Hello from the flow suite');
  await s.click('#chatSend', 900);
  const call = s.apiCalls().find((c) => /message-send/.test(c.url));
  record('message send', !!call?.json?.ok, call?.json?.message);
  ok(!!call, 'reaches /api/message-send.php');
  ok(!!call?.json?.ok, 'message stored', call?.json?.message || '');
}

/* ----------------------------------------------------------- host listing */
async function hostFlow(jar) {
  section('Host listing wizard');
  const s = await mount(`${BASE}/host-onboarding.php`, { cookies: jar });
  const t = s.$('#wTitle');
  if (!t) { record('host listing', false, 'no #wTitle'); return ok(false, 'host wizard present'); }
  s.set('#wTitle', 'Flow Suite Residence');
  if (s.$('#wArea')) s.set('#wArea', 'Ikoyi');
  for (let i = 0; i < 8 && !s.$('#wizSubmit'); i++) {
    if (!s.$('#wizNext')) break;
    await s.click('#wizNext', 450);
  }
  ok(!!s.$('#wizSubmit'), 'wizard reaches the final step');
  if (s.$('#wizSubmit')) await s.click('#wizSubmit', 1400);
  const call = s.apiCalls().find((c) => /listing-create/.test(c.url));
  record('host listing submits', !!call?.json?.ok, call?.json?.message);
  ok(!!call, 'reaches /api/listing-create.php');
  ok(!!call?.json?.ok, 'listing created (pending review)', call?.json?.message || '');
}

/* ------------------------------------------------------------- gift cards */
async function giftFlow(jar) {
  section('Gift cards');
  const s = await mount(`${BASE}/giftcards.php`, { cookies: jar });
  const buy = [...s.document.querySelectorAll('button')].find((b) => /Buy this card/i.test(b.textContent));
  if (!buy) { record('gift card', false, 'no buy button'); return ok(false, 'gift card button'); }
  await s.click(buy, 600);
  if (s.$('#gcName')) {
    s.set('#gcName', 'Ada Obi');
    s.set('#gcEmail', `gift${stamp}@example.com`);
    const submit = [...s.document.querySelectorAll('button')].find((b) => /Buy for/i.test(b.textContent));
    if (submit) await s.click(submit, 1200);
  }
  const call = s.apiCalls().find((c) => /giftcard/.test(c.url));
  record('gift card purchase', !!call?.json?.ok, call?.json?.message);
  ok(!!call, 'reaches /api/giftcard.php');
  ok(!!call?.json?.ok, 'gift card issued', call?.json?.data?.code || call?.json?.message || '');
}

/* ------------------------------------------------------------ help search */
async function helpFlow() {
  section('Help centre');
  const s = await mount(`${BASE}/help.php`);
  if (!s.$('#helpSearch')) { record('help search', false, 'no #helpSearch'); return ok(false, 'help search'); }
  s.set('#helpSearch', 'refund');
  if (s.$('#helpGo')) await s.click('#helpGo', 500);
  record('help search runs', s.errors.length === 0, s.errors[0] || '');
  ok(s.errors.length === 0, 'help search without JS errors', s.errors[0] || '');
}

/* ----------------------------------------------------------------- admin */
async function adminFlows() {
  section('Admin console');
  let jar;
  try { jar = await login(BASE, 'ops@jollofliving.com', 'SuperSecret123', 'admin-auth.php'); }
  catch (e) { record('admin login', false, e.message); return ok(false, 'admin login', e.message); }
  ok(true, 'admin signs in');

  const s = await mount(`${BASE}/admin.php`, { cookies: jar });
  ok(s.errors.length === 0, 'admin dashboard renders clean', s.errors[0] || '');

  const tabs = ['dashboard','moderation','users','promotions','fraud','cms','reports','roles','audit'];
  let bad = 0; const broken = [];
  for (const t of tabs) {
    const p = await mount(`${BASE}/admin.php?tab=${t}`, { cookies: jar });
    if (p.errors.length) { bad++; broken.push(t + ': ' + p.errors[0].slice(0, 60)); }
  }
  record('admin tabs', bad === 0, `${tabs.length} tabs, ${bad} with errors${broken.length ? ' — ' + broken[0] : ''}`);
  ok(bad === 0, `all ${tabs.length} admin tabs render cleanly`, broken[0] || '');

  // a real moderation action
  const mod = s.document.querySelector('[data-mod]');
  if (mod) {
    await s.click(mod, 900);
    const call = s.apiCalls().find((c) => /admin-action/.test(c.url));
    record('moderation action', !!call?.json?.ok, call?.json?.message);
    ok(!!call?.json?.ok, 'moderation writes via /api/admin-action.php', call?.json?.message || '');
  }
}


/* ------------------------------------------------- booking lifecycle + review */
async function lifecycleFlow(jar, ref) {
  section('Booking lifecycle & review');
  if (!ref) { record('lifecycle', false, 'no booking ref'); return ok(false, 'have a booking to act on'); }
  const s = await mount(`${BASE}/trips.php`, { cookies: jar });
  ok(s.errors.length === 0, 'trips page renders clean', s.errors[0] || '');

  // drive the lifecycle through the API the page uses
  // window.eval hands back the pending Promise; await it inside the page so we
  // read the resolved body rather than a Promise object.
  const call = (js) => s.window.eval(`(async()=>{const r=await ${js};return JSON.stringify(r);})()`)
    .then((t) => JSON.parse(t));
  const step = (action) =>
    call(`api("booking-action.php",{ref:${JSON.stringify(ref)},action:${JSON.stringify(action)}})`);
  const ci = await step('checkin');
  ok(!!ci?.ok, `check-in accepted`, ci?.message || '');
  const co = await step('checkout');
  ok(!!co?.ok, `check-out accepted`, co?.message || '');
  record('booking lifecycle', !!ci?.ok && !!co?.ok, (ci?.message || '') + ' / ' + (co?.message || ''));

  const rv = await call(
    `api("review-create.php",{ref:${JSON.stringify(ref)},body:"Beautiful residence, flawless service from the flow suite.",scores:{cleanliness:5,accuracy:5,location:5,value:4}})`);
  record('review submits', !!rv?.ok, rv?.message);
  ok(!!rv?.ok, 'review stored', rv?.message || '');

  const dup = await call(
    `api("review-create.php",{ref:${JSON.stringify(ref)},body:"Second attempt should be refused.",scores:{}})`);
  record('duplicate review blocked', dup?.ok === false, dup?.message);
  ok(dup?.ok === false, 'duplicate review refused', dup?.message || '');
}

/* --------------------------------------------- waitlist, experience, account */
async function miscApiFlows(jar) {
  section('Waitlist / experience / account / notifications');
  const s = await mount(`${BASE}/account.php`, { cookies: jar });
  ok(s.errors.length === 0, 'account page renders clean', s.errors[0] || '');
  const call = (js) => s.window.eval(`(async()=>{const r=await ${js};return JSON.stringify(r);})()`)
    .then((t) => JSON.parse(t));

  const wl = await call(`api("waitlist.php",{property:"villa-azur"})`);
  record('waitlist join', !!wl?.ok, wl?.message);
  ok(!!wl?.ok, 'waitlist join', wl?.message || '');

  const ex = await call(
    `api("experience-book.php",{experience:"chef",date:"2027-03-04",guests:2,notes:"flow suite"})`);
  record('experience booking', !!ex?.ok, ex?.message);
  ok(!!ex?.ok, 'experience booking', ex?.message || '');

  const nf = await call(`api("notifications.php",{action:"read-all"})`);
  record('notifications read-all', !!nf?.ok, nf?.message);
  ok(!!nf?.ok, 'notifications mark-all-read', nf?.message || '');

  const pw = await call(
    `api("account.php",{action:"password",current:"Password12345",password:"NewPassword999",confirm:"NewPassword999"})`);
  record('password change', !!pw?.ok, pw?.message);
  ok(!!pw?.ok, 'password change', pw?.message || '');

  const bad = await call(
    `api("account.php",{action:"password",current:"totally-wrong",password:"Whatever12345",confirm:"Whatever12345"})`);
  record('wrong current password refused', bad?.ok === false, bad?.message);
  ok(bad?.ok === false, 'wrong current password refused', bad?.message || '');
}

/* ------------------------------------------------------------------- run */
const guestEmail = await authFlows();
await newsletterFlow();
const jar = await login(BASE, guestEmail, 'Password12345');
await wishlistCompare(jar);
const bookingRef = await bookingFlow(jar);
await conciergeFlow(jar);
await messagesFlow(jar);
await hostFlow(jar);
await giftFlow(jar);
await helpFlow();
await lifecycleFlow(jar, bookingRef);
await miscApiFlows(jar);
await adminFlows();

console.log('\n================ SUMMARY ================');
const failed = results.filter((r) => !r.passed);
for (const r of results) console.log(` ${r.passed ? 'ok  ' : 'FAIL'}  ${r.name}${r.note ? '  — ' + r.note : ''}`);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) { console.log('FAILURES:'); failed.forEach((f) => console.log('  - ' + f.name + (f.note ? ': ' + f.note : ''))); }
