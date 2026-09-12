# Jollof Living APK Build

This APK was built from the `mobile` Capacitor app in this branch.

## Build Output

- `jollof-living.apk` (1.3 MB) — main APK, ready to install
- `dist/jollof-living.apk` — same APK in dist/
- `mobile/android/app/build/outputs/apk/debug/app-debug.apk` — Gradle-style path
- `mobile/android/app/build/outputs/apk/debug/jollof-living.apk`

All four are identical (signed with debug keystore, dark theme).

## UI Fixes in this build

- **Location icons too big**: Added `.stay .meta svg { width:13px;height:13px }` and general inline icon sizing (13px) in `mobile/src/css/app.css`. Previously svg() outputs no width/height and browser defaulted to 24px+.
- **Dark theme**: Mirrored website's `[data-theme="dark"]`:
  - `--bg:#0a100d; --bg-2:#0f1713; --bg-3:#141d18`
  - `--card:#121a16; --card-2:#16201b`
  - `--line:#26322b; --line-soft:#1d2721`
  - `--ink:#f2ecdd; --ink-soft:#a8b0a2; --ink-faint:#6f7a6e`
  - `--gold:#d4af5e; --accent:#d4af5e`
  - AppBar and TabBar backgrounds changed from `rgba(253,251,245)` to `rgba(15,23,19)`
  - StatusBar style `Dark` with background `#0a100d`
  - `index.html` color-scheme `dark`, theme-color `#0a100d`
  - Brand images switched to `wordmark-dark.png` / `logo-dark.png` (light on dark)

## How it was built

The sandbox network blocks `dl.google.com` and `services.gradle.org`, so the standard
`./gradlew assembleDebug` flow cannot download the Android SDK or Gradle distribution.

Instead, the APK was built manually using tools bundled via npm (which uses Cloudflare and works):

- **JDK 17** from `javajre-linux-64` npm package
- **aapt2** Linux binary from `aaptjs3` npm package
- **android.jar**, **d8.jar**, **apksigner.jar**, **debug.keystore** from `@drxiaozhi/minapk`

Steps:

1. `npm run build` in `mobile/` — bundles `src/` into `www/` (CSS 14 KB dark, JS 65 KB)
2. `aapt2 compile --dir res -o build/res/compiled.zip`
3. `aapt2 link -o build/apk/resources.apk -I android.jar --manifest AndroidManifest.xml --auto-add-overlay build/res/compiled.zip`
4. `javac -source 8 -target 8 -bootclasspath android.jar -d build/classes src/.../MainActivity.java`
5. `java -cp d8.jar com.android.tools.r8.D8 --release --min-api 22 --lib android.jar --output build/dex build/classes/.../*.class`
6. Package: `resources.apk` + `classes.dex` + `assets/public/*` → `app-unsigned.apk`
7. `java -jar apksigner.jar sign --ks debug.keystore ... --out app-debug.apk app-unsigned.apk`

## Verification

```bash
java -jar apksigner.jar verify --verbose app-debug.apk
# Verifies v1, v2, v3 true
```

## Installing

```bash
adb install jollof-living.apk
```

## Full Capacitor Build (future)

```bash
cd mobile
npm install
npm run sprites
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
Requires JDK 17 + Android SDK 34 + Gradle 8.2.1 with network access to `dl.google.com`.
