# Deploying Jollof Living to HostGator (cPanel)

The site is a PHP 8 + MySQL application. Everything the browser touches lives in
`public_html/`; the database DDL and seed data live in `database/`.

---

## 1. What to upload

Upload the **contents of `public_html/`** into your cPanel `public_html` folder
(or into `public_html/subfolder` if the site is not on the main domain).

```
public_html/
├── .htaccess              pretty URLs, HTTPS redirect, caching, security headers
├── index.php  stays.php  stay.php  booking.php  confirm.php  …   (37 pages)
├── sitemap.php  robots.txt
├── api/                   JSON endpoints the front-end calls
├── includes/              config, DB, auth, repository, pricing, mailer  (never web-served)
├── install/               one-time installer — DELETE after running it
└── assets/                css, js, img, fonts
```

Keep `database/schema.sql` and `database/seed.sql` **outside** `public_html`
(e.g. one level up). The installer looks for them at `../database/`. If your host
does not allow files above the web root, upload them into `public_html/database/`
and edit the two paths at the top of `install/index.php`.

---

## 2. Create the database

1. cPanel → **MySQL® Databases**
2. **Create a New Database** — e.g. `jollof` (cPanel prefixes it: `cpuser_jollof`)
3. **Add New User** with a strong password — e.g. `cpuser_jolluser`
4. **Add User To Database** → tick **ALL PRIVILEGES**

Write down the *prefixed* database name, user and password.

---

## 3. Configure

Copy the sample config and fill it in:

```bash
cp includes/config.sample.php includes/config.php
```

```php
'db' => [
    'driver' => 'mysql',
    'host'   => 'localhost',       // always localhost on HostGator shared
    'name'   => 'cpuser_jollof',
    'user'   => 'cpuser_jolluser',
    'pass'   => 'your-password',
],
'site' => [
    'url'      => 'https://www.jollofliving.com',
    'base_url' => '',              // '/subfolder' if not on the domain root
],
'security' => [
    'app_key' => '<a long random string>',
],
'debug' => false,                  // MUST be false on the live site
```

Then `chmod 600 includes/config.php`.

---

## 4. Install

Visit **https://your-domain.com/install/** and complete the form:

* administrator name, email and a password of at least 10 characters
* tick **Load the demo content** to install the 12 residences, collections,
  neighbourhood guides and journal posts; untick it for an empty catalogue

The installer creates all tables, loads the content, creates your administrator
and clears the placeholder passwords on the seeded demo accounts.

**Delete the `install/` folder afterwards.**

---

## 5. Post-install checklist

| Task | Where |
|---|---|
| Turn off debug | `includes/config.php` → `'debug' => false` |
| Lock the config file | `chmod 600 includes/config.php` |
| Enable HTTPS | cPanel → SSL/TLS Status → AutoSSL |
| Set the sending address | cPanel → Email Accounts, then `mail.from_email` |
| Submit the sitemap | Google Search Console → `https://…/sitemap.php` |
| Sign in to the console | `https://…/admin-login.php` |

---

## Email

Out of the box the site uses PHP `mail()`, which works on HostGator. For better
deliverability create a cPanel email account and switch to SMTP:

```php
'mail' => [
    'method' => 'smtp',
    'from_email' => 'no-reply@jollofliving.com',
    'admin_to'   => 'reservations@jollofliving.com',
    'smtp' => [
        'host' => 'mail.jollofliving.com',
        'port' => 465,
        'user' => 'no-reply@jollofliving.com',
        'pass' => 'the mailbox password',
        'secure' => 'ssl',
    ],
],
```

Emails sent: welcome on signup, booking confirmation, host listing alerts,
experience/modification enquiries to the operations inbox.

---

## Payments

Bookings are **recorded in the database** with an escrow status; no card is
charged. To go live with a gateway, set the mode and keys:

```php
'payments' => [
    'mode' => 'paystack',          // 'record_only' | 'paystack' | 'flutterwave'
    'paystack' => [
        'public_key' => 'pk_live_…',
        'secret_key' => 'sk_live_…',
    ],
],
```

The booking record, escrow state machine and payments table are already in
place — the gateway call is the only piece to add, in
`includes/pricing.php` → `BookingService::create()`.

---

## Escrow / booking lifecycle

```
pending ──approve──▶ confirmed ──checkin──▶ active ──checkout──▶ completed
   │                     │                   (escrow released)
   └──decline──┐         └──cancel──┐
               ▼                    ▼
           cancelled            cancelled
       (payments refunded, points deducted)
```

Instant-book listings skip `pending` and land on `confirmed`.

---

## Updating the site

Front-end sources live in `src_php/`. After editing them:

```bash
node tools/build_php.mjs      # rebuilds assets/css/site.css and assets/js/site.js
```

Then upload the two rebuilt files. Content (residences, guides, journal, FAQs,
promotions) is edited in the admin console, not in code.

To regenerate the seed file from the original JavaScript data:

```bash
node tools/gen_seed.mjs       # rewrites database/seed.sql
```

---

## Local development

No MySQL needed — the data layer runs on SQLite too:

```php
'db' => ['driver' => 'sqlite', 'sqlite_path' => __DIR__ . '/../../storage/jollof.sqlite'],
```

```bash
php -S 0.0.0.0:8080 -t public_html
```

Then open `/install/` as usual. The installer translates the MySQL DDL to
SQLite automatically.

---

## Troubleshooting

**"The site is temporarily unavailable. (Database connection failed.)"**
The credentials in `includes/config.php` are wrong, or the MySQL user has not
been added to the database with ALL PRIVILEGES.

**Blank page / 500**
Set `'debug' => true` temporarily, reload, and read the message. Check
cPanel → Errors as well. Set it back to `false` afterwards.

**Pretty URLs 404 but `.php` URLs work**
`mod_rewrite` is off, or the site is in a sub-folder — set `RewriteBase` in
`.htaccess` and `site.base_url` in the config to match.

**Styles or images missing**
`assets/` did not upload, or `base_url` is wrong. Every asset URL is printed
relative to `base_url`.

**Sessions drop on every request**
Make sure `/tmp` is writable, or set a session path in cPanel → MultiPHP INI Editor.
