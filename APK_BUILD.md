# Jollof Living APK Build

## Build Output (Dark Theme + Fixed Icons)

- `jollof-living.apk` (1.3 MB) — dark theme, location icons fixed to 12px
- `dist/jollof-living.apk`
- `mobile/android/app/build/outputs/apk/debug/app-debug.apk`
- `mobile/android/app/build/outputs/apk/debug/jollof-living.apk`

All signed with debug keystore, verified v1/v2/v3.

## UI Fixes Applied

### 1. Location icons way too big (screenshot: huge pin filling card)
**Root cause:** `svg()` in `ui.js` emitted `<svg viewBox="0 0 24 24">` with no width/height. Browser defaults to 24px+ or 100% width, causing 80-100px pins in `.stay .meta`.

**Fix:**
- `ui.js`: `svg()` now outputs `width="14" height="14"` + `class="ico ico-${name}"` + `style="flex-shrink:0"` by default
- `app.css`: Added aggressive constraints with `!important`:
```css
.ico{width:14px;height:14px;flex-shrink:0}
.ico-pin{width:12px !important;height:12px !important;max-width:12px;max-height:12px}
.stay .meta svg{width:12px !important;height:12px !important;max-width:12px;max-height:12px}
.stay .meta svg, .row.small svg, .badge svg, .small svg, .krow svg, .spread svg{
  width:12px !important;height:12px !important;max-width:12px;max-height:12px
}
.appbar svg{width:19px !important;height:19px !important}
.tabbar button svg{width:21px !important;height:21px !important}
```
Result: pin in Featured cards now 12px, aligned with "Lekki Phase 1, Lagos" text, not huge.

### 2. Dark theme mirroring website
Website dark theme (`[data-theme="dark"]` in `public_html/assets/css/site.css`):
- `--bg:#0a100d; --bg-2:#0f1713; --bg-3:#141d18`
- `--card:#121a16; --card-2:#16201b`
- `--line:#26322b; --line-soft:#1d2721`
- `--ink:#f2ecdd; --ink-soft:#a8b0a2; --ink-faint:#6f7a6e`
- `--gold:#d4af5e; --accent:#d4af5e`

Applied to `mobile/src/css/app.css`:
- Changed `:root` from light ivory `#f6f2e9` to dark `#0a100d`
- AppBar `rgba(15,23,19,.82)` instead of `rgba(253,251,245,.86)`
- TabBar `rgba(15,23,19,.92)` instead of light
- Cards, panels, chips, inputs all use dark vars
- `index.html`: `color-scheme: dark`, `theme-color: #0a100d`, logo `logo-dark.png`
- `ui.js`: `wordmark-dark.png` / `logo-dark.png` (light on dark)
- `app.js`: `StatusBar.setStyle({style: Style.Dark})`, background `#0a100d`
- `capacitor.config.json` already dark: `#0B0F0C`

## Build Steps (offline-friendly)

Network blocks `dl.google.com`, so manual build uses npm-bundled tools:
- JDK 17 from `javajre-linux-64`
- aapt2 from `aaptjs3`
- android.jar, d8.jar, apksigner.jar from `@drxiaozhi/minapk`

```bash
cd mobile
npm install
npm run sprites
npm run build  # www/ with 15KB dark css, 65KB js
# manual APK:
aapt2 compile --dir res -o compiled.zip
aapt2 link -o resources.apk -I android.jar --manifest AndroidManifest.xml --auto-add-overlay compiled.zip
javac -bootclasspath android.jar -d classes MainActivity.java
java -cp d8.jar com.android.tools.r8.D8 --release --min-api 22 --lib android.jar --output dex classes/...
cp resources.apk app-unsigned.apk
zip -u app-unsigned.apk classes.dex
zip -r -u app-unsigned.apk assets/public
java -jar apksigner.jar sign --ks debug.keystore --out app-debug.apk app-unsigned.apk
```

## Install

```bash
adb install jollof-living.apk
```
