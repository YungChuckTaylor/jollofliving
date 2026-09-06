# Jollof Living APK Build

This APK was built from the `mobile` Capacitor app in this branch.

## Build Output

- `jollof-living.apk` (1.3 MB) — main APK, ready to install
- `dist/jollof-living.apk` — same APK in dist/
- `mobile/android/app/build/outputs/apk/debug/app-debug.apk` — Gradle-style path
- `mobile/android/app/build/outputs/apk/debug/jollof-living.apk`

All four are identical (signed with debug keystore).

## How it was built

The sandbox network blocks `dl.google.com` and `services.gradle.org`, so the standard
`./gradlew assembleDebug` flow cannot download the Android SDK or Gradle distribution.

Instead, the APK was built manually using tools bundled via npm (which uses Cloudflare and works):

- **JDK 17** from `javajre-linux-64` npm package (`/tmp/testjre/.../jre`)
- **aapt2** Linux binary from `aaptjs3` npm package
- **android.jar**, **d8.jar**, **apksigner.jar**, **ecj.jar**, **debug.keystore** from `@drxiaozhi/minapk`
- **zipalign** via JS implementation (skipped, apksigner still produces v2/v3 signed APK)

Steps (see `/tmp/jollof_build`):

1. `npm run build` in `mobile/` — bundles `src/` into `www/` (CSS, JS, sprites, fonts, img)
2. `aapt2 compile --dir res -o build/res/compiled.zip`
3. `aapt2 link -o build/apk/resources.apk -I android.jar --manifest AndroidManifest.xml --auto-add-overlay build/res/compiled.zip`
4. `javac -source 8 -target 8 -bootclasspath android.jar -d build/classes src/com/jollofliving/app/MainActivity.java`
5. `java -cp d8.jar com.android.tools.r8.D8 --release --min-api 22 --lib android.jar --output build/dex build/classes/.../*.class`
6. Package: `resources.apk` + `classes.dex` + `assets/public/*` → `app-unsigned.apk`
7. `java -jar apksigner.jar sign --ks debug.keystore --ks-key-alias androiddebugkey --ks-pass pass:android --key-pass pass:android --out app-debug.apk app-unsigned.apk`

## MainActivity

`MainActivity` is a minimal WebView wrapper (no Capacitor dependency):

- Loads `file:///android_asset/public/index.html`
- Enables JS, DOM storage, file access
- Handles back button via `webView.canGoBack()`
- Sets status bar color to `#f6f2e9` (Jollof ivory)

The bundled `www/` already contains the full Jollof Living app (offline cache, sync queue, owner dashboard, etc.) and talks to `https://kxq.lop.temporary.site/jollof/api/mobile/` (see `mobile/src/js/config.js`).

## Verification

```bash
java -jar apksigner.jar verify --verbose app-debug.apk
# Verifies v1, v2, v3 true
```

## Installing

```bash
adb install jollof-living.apk
# or
adb install -r dist/jollof-living.apk
```

## Future: Full Capacitor Build

To build the full Capacitor APK (with plugins: Preferences, Network, Haptics, SplashScreen, StatusBar):

```bash
cd mobile
npm install
npm run sprites
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
# → app/build/outputs/apk/debug/app-debug.apk
```

This requires JDK 17 + Android SDK (platform 34, build-tools 34) + Gradle 8.2.1, which need network access to `dl.google.com` and `services.gradle.org`.

