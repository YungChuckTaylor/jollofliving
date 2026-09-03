# Jollof Living

Luxury short-stay residences in Lagos and Abuja — *Luxury Living, African Soul*.

A PHP 8 + MySQL application built to run on HostGator shared hosting via cPanel.
Content, bookings, users, messages and the back office are all database-driven.

---

## Layout

```
public_html/            everything the web server exposes
├── .htaccess           pretty URLs, HTTPS, caching, security headers
├── *.php               37 page controllers (index, stays, stay, booking, admin …)
├── sitemap.php         sitemap generated from the live catalogue
├── api/                JSON endpoints the front-end posts to
├── includes/           config, DB, auth, repository, pricing, mailer, view
├── install/            one-time web installer (delete after use)
└── assets/             css, js, img, fonts

database/
├── schema.sql          MySQL DDL (~50 tables)
└── seed.sql            demo catalogue: 12 residences, guides, journal, FAQs

src_php/                front-end sources — build with tools/build_php.mjs
tools/                  build_php.mjs, gen_pages.mjs, gen_seed.mjs
test.py                 Playwright end-to-end suite
DEPLOYMENT.md           step-by-step HostGator instructions
```

## Quick start

```bash
cp public_html/includes/config.sample.php public_html/includes/config.php
# edit the db block — or set driver to 'sqlite' for local development

php -S 0.0.0.0:8080 -t public_html
```

Open <http://localhost:8080/install/>, create the administrator, and you are running.

## Architecture

**Pages.** Each URL is a real `.php` file. It loads `includes/bootstrap.php`,
queries what that page needs and prints the shared chrome via `View::header()` /
`View::footer()`. The page's data is serialised into `window.JL`, and the
JavaScript bundle paints the view — so the design is byte-for-byte the original,
while every value comes from MySQL.

**State.** There is no client-side source of truth. Wishlists, comparisons,
bookings, messages, notifications and points live in the database; the browser
posts to `api/*.php` and re-reads `View::state()` from the response. Only the
theme and currency preference are kept in the browser (currency is also mirrored
to a cookie so PHP can format prices server-side).

**Security.** Sessions are server-side and regenerate on login; every mutating
endpoint requires POST plus a CSRF token; login and signup are rate-limited and
lock out after repeated failures; passwords are bcrypt; every admin action writes
to the audit log. `includes/` is denied by `.htaccess` and each file additionally
refuses to run unless bootstrapped.

**Booking lifecycle.**

```
pending ──approve──▶ confirmed ──checkin──▶ active ──checkout──▶ completed
   │                     │                (escrow released)
   └──decline──┐         └──cancel──┐
               ▼                    ▼
           cancelled            cancelled     (payments refunded, points deducted)
```

Payments are recorded, not charged: the `payments` table and escrow states are
live, and a gateway (Paystack/Flutterwave) drops in behind config keys.

## Features

Guest — search and filters, map, collections, neighbourhood guides, experiences,
wishlists (multiple lists), compare, booking wizard with promos/add-ons/split
payments, trips with check-in/modify/cancel, reviews, messaging, notifications,
Jollof Club tiers and points, gift cards, referrals.

Host — listing wizard, dashboard, calendar, earnings and payouts.

Admin — dashboard with live GMV and charts, listing moderation, user management,
promotions, fraud queue, CMS blocks, CSV reports, roles, audit log.

AI concierge — answers from live inventory and pricing (rule-based by default;
set `ai.api_key` in the config to route through a hosted model instead).

## Development

```bash
node tools/build_php.mjs     # src_php/*.js  -> public_html/assets/js/site.js
node tools/gen_pages.mjs     # regenerate the thin page controllers
node tools/gen_seed.mjs      # regenerate database/seed.sql
python3 test.py              # Playwright E2E (needs: pip install playwright)
```

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full HostGator/cPanel walkthrough.
