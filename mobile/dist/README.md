# Jollof Living — built packages

Two Android packages, both built from `mobile/src` in this repository and both
signed, aligned and installable as they are.

| File | Signed with | Size | For |
|---|---|---|---|
| `jollof-living-1.0.0-debug.apk` | the standard Android debug key | 1.5 MB | sideloading and testing; remotely inspectable from `chrome://inspect` |
| `jollof-living-1.0.0-release.apk` | a Jollof Living key generated at build time | 1.5 MB | handing out a build that is not debuggable |

```
package        com.jollofliving.app
version        1.0.0 (versionCode 1)
label          Jollof Living
minSdk         22 (Android 5.1)   targetSdk 34 (Android 14)
signatures     v1 + v2 + v3
```

Certificate fingerprints (SHA-256):

```
debug     483f475dbcbac2caf73cfe0bf639a73cbceb16c4f39245babc048daec3c0fbf1
release   faa46c7c460e03bc271ee537062081012b9dd3cb330b85e44ff73cf9e860194c
```

The debug package is reproducible: building it again from the same sources
produces the same bytes (`sha256 bf55c0d4…`). The release package cannot be,
because a signature is only ever as stable as its key — see below.

## Install it

On the phone: copy the APK over, open it, and allow installs from your file
manager when Android asks.

Over USB, with developer options on:

```bash
adb install -r jollof-living-1.0.0-debug.apk
```

## What it talks to

The interface is bundled inside the APK, so it opens with no signal. Data comes
from `PRODUCTION_API` in `mobile/src/js/config.js`, which is currently:

```
https://kxq.lop.temporary.site/jollof/api/mobile/
```

To point a build at a different server:

```bash
cd mobile
npm run apk -- --api=https://your-domain.com/jollof/api/mobile/
```

The server needs `database/migrate-mobile-app.sql` applied once, and the app
must be served over https — Android blocks plain http.

## Rebuilding

```bash
cd mobile
npm install
npm run apk            # debug
npm run apk:release    # release
```

Nothing else has to be installed: the build fetches its own JDK, aapt2, d8 and
apksigner into `~/.cache/jollof-android-toolchain` the first time, and uses a
local Android SDK instead when it finds one.

**Release signing.** The build signs with `JL_KEYSTORE` if it is set, then with
`mobile/jollof-release.keystore` if that file exists, and only otherwise mints a
throwaway key in the toolchain cache — so a release build made on a fresh
machine carries a *different* certificate, and Android will refuse to install it
over an earlier one until the old copy is uninstalled. Google Play requires every update to carry the
same signature, so for anything you intend to publish, make your own key and
point the build at it:

```bash
keytool -genkeypair -keystore jollof.keystore -alias jollof \
        -keyalg RSA -keysize 2048 -validity 10950

JL_KEYSTORE=$PWD/jollof.keystore JL_KEYSTORE_PASS=… JL_KEY_ALIAS=jollof \
  npm run apk:release
```

Keep that file safe and out of the repository — losing it means never being able
to update the listing.
