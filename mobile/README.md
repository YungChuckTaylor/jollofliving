# Jollof Living — Android app

The phone app for Jollof Living. Its screens are bundled inside the APK so it
opens instantly and keeps working with no signal, while every piece of data —
homes, prices, trips, wishlists, points, listings, payouts — comes from the
**same MySQL database the website uses**. There is one backend, so the two can
never drift apart.

```
mobile/
  src/            the app: screens, store, sprite engine, styles
  tools/          build, APK build, sprite generator, icon generator, tests
  native/         the Android host: manifest, theme, MainActivity
  android/        the Android Studio project (Capacitor)
  ci/             a GitHub Actions workflow that builds the APK
  dist/           the built, signed packages
  www/            the built bundle that goes inside the APK
```

---

## Build the APK

```bash
cd mobile
npm install
npm run apk            # dist/jollof-living-1.0.0-debug.apk
npm run apk:release    # dist/jollof-living-1.0.0-release.apk
```

That is the whole thing — no Android Studio, no Gradle, no Maven. The first run
downloads a JDK 17 (`jdk4py` from PyPI) plus `aapt2`, `android.jar`, `d8` and
`apksigner` (from npm) into `~/.cache/jollof-android-toolchain`, roughly 90 MB,
and reuses them afterwards. If you already have a JDK or an Android SDK
installed, those are used instead.

`tools/build-apk.mjs` runs the same pipeline Gradle would:

```
tools/build.mjs   →  www/            the interface
aapt2 compile     →  resources.zip   icons, splash, theme
aapt2 link        →  linked/         manifest, resources.arsc, assets
ecj / javac       →  classes/        MainActivity
d8                →  classes.dex
tools/apkzip.mjs  →  unsigned.apk    4-byte aligned zip
apksigner         →  dist/*.apk      v1 + v2 + v3 signatures
```

Useful flags:

```bash
npm run apk -- --api=https://your-domain.com/jollof/api/mobile/
npm run apk -- --version-name=1.1 --version-code=2
npm run apk -- --skip-web        # reuse the bundle already in www/
```

Release signing looks for `JL_KEYSTORE` (with `JL_KEYSTORE_PASS`,
`JL_KEY_ALIAS`, `JL_KEY_PASS`), then for `mobile/jollof-release.keystore`, and
only then mints a throwaway key in the toolchain cache. Keep a real keystore in
one of the first two places: Android ties every future update to the
certificate the first install carried. See `dist/README.md`.

The debug package is byte-for-byte reproducible — same sources in, same APK
out — so two builds can be compared with `sha256sum`.

### The Android host

`native/` holds the whole native side: an `AndroidManifest.xml`, a
platform-only theme and one `MainActivity`. The activity serves the bundled
interface to a WebView over **https://localhost** — the same origin a Capacitor
build uses, which is what `api/mobile/_mobile.php` already allows in its CORS
rules — and lets requests to your server through untouched. The hardware back
button presses the app's own back arrow, so both routes behave identically.

Because it compiles against `android.jar` alone, no androidx artifacts are
needed; the Capacitor plugins fall back to their browser implementations
(`Preferences` → localStorage, `Network` → `navigator.onLine`, `Haptics` →
the Vibration API), which `tools/e2e/webview-smoke.mjs` checks on every build.

### With Android Studio instead

The Capacitor project in `android/` is still there and still works:

```bash
npm run sync         # build www/ and copy it into the Android project
npx cap open android # Android Studio → press ▶ Run
npm run apk:gradle   # or from the command line
```

That route needs the Android SDK and can reach Google's Maven repository. There
is also `ci/build-jollof-apk.yml`: copy it to `.github/workflows/` and GitHub
Actions will build the APK on demand, attach it to the run and, if you ask it
to, commit it back under `mobile/dist/`.

### Point it at your server first

Open `src/js/config.js` and set:

```js
const PRODUCTION_API = "https://your-domain.com/jollof/api/mobile/";
```

It must be **https** — Android blocks plain http by default. To test against a
machine on your own network:

```bash
npm run build -- --api=http://192.168.1.50:8080/api/mobile/
```

Use your computer's LAN address, never `localhost`: the phone is a different
device.

---

## Server side

The website's own API authenticates with a session cookie and a CSRF token,
which suits a browser on the same origin. A packaged app is a different origin,
so it uses bearer tokens instead. Three files were added under
`public_html/api/mobile/`:

| File | Does |
|---|---|
| `_mobile.php` | CORS, token auth, offline-replay safety |
| `auth.php` | register, login, logout, upgrade to owner, push token |
| `sync.php` | one call returning catalogue + member state + owner workspace |
| `action.php` | every write: wishlist, booking, review, listing, profile |

**Run `database/migrate-mobile-app.sql` once** in phpMyAdmin. It adds two
tables (`api_tokens`, `sync_operations`) and is safe to run twice.

Beneath that entry layer everything calls the same `Repo`, `Pricing` and
`BookingService` the website does, so a rule only has to be written once. The
member payload is literally `View::state()` — the very computation that renders
the website.

---

## How syncing works

**Reading.** One `sync.php` call returns everything. The catalogue carries a
fingerprint; if nothing has changed the server says so instead of resending
twelve properties, and a routine refresh costs a few hundred bytes. The result
is cached on the device, so the app opens on the last known good copy before
the network has answered.

**Writing.** Actions go straight out when there is signal. With no signal they
are written to a queue on disk and replayed on reconnect.

**The duplicate problem.** A flaky connection can send the same booking twice —
once before the timeout, once on replay. Every queued action carries a
client-generated key; the server records it against the response and returns
the *original* answer to a repeat rather than acting again. This is tested:
sending the same booking twice yields one row and the same reference.

---

## The animated sprite pages

Nine hand-drawn animations, generated by `tools/make-sprites.mjs` into
horizontal PNG strips and played frame by frame by `src/js/sprites.js`.

| Sprite | Frames | Where it appears |
|---|---|---|
| `skyline` | 24 | Onboarding 1 — Lagos towers rising, windows waking |
| `compass` | 24 | Onboarding 2 — a needle finding north |
| `keys` | 20 | Onboarding 3 — a key turning, then a burst |
| `concierge` | 22 | Onboarding 4 — a bell ringing |
| `heart` | 18 | Bursts over the button when you save a home |
| `success` | 22 | Booking confirmed |
| `empty` | 20 | Empty trips, empty listings — a door opening |
| `loading` | 16 | Loading states |
| `offline` | 18 | No connection |

Sprite sheets rather than GIF or video: one bundled PNG with no network
request, exact frame-rate control, no decode stall on a mid-range phone, and
they pause automatically when scrolled off screen so they cost nothing when
nobody is looking. Regenerate any time with `npm run sprites` — the drawing
code is plain maths, so tweaking a colour or timing is a one-line change.

---

## Tests

```bash
node tools/e2e/build-test.mjs                    # test bundle
node tools/e2e/app.mjs http://localhost:8080     # 49 checks
node tools/e2e/webview-smoke.mjs                 # 12 checks, no server needed
```

The first suite boots the real bundled app in jsdom and drives it like a thumb —
taps, typing, screen changes — then checks the database actually changed and
that the website agrees. It covers the onboarding animation advancing frames,
opening offline from cache, signing up, booking end to end, the offline queue
replaying exactly once, every owner tab, and a listing added on the phone
reaching admin moderation and being approved.

`webview-smoke.mjs` covers what only breaks once the app is packaged: it boots
the *shipping* bundle — the exact code inside the APK, real `@capacitor/*`
packages and no doubles — in a document served from `https://localhost`, then
checks the plugins fall back to the browser without throwing, that Preferences
still persists, that the cached copy paints with no network, and that the back
arrow the hardware key presses is really on screen.

**49/49 and 12/12 passing**, alongside the website's 22 + 25 + 26.

---

## What is not here

- **Push notifications.** The plumbing is ready — `api_tokens.push_token` and
  an `auth.php` action that stores it — but Firebase needs a
  `google-services.json` from your own Firebase console.
- **Payments in-app.** Bookings record a payment method as the website does;
  the gateway itself is still stubbed behind config keys on the server.
- **Photo upload for listings.** A listing submitted from the phone gets the
  placeholder image; add photos from the website's owner dashboard.
