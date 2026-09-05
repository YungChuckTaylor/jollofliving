/* ============================================================
   JOLLOF LIVING — APK build
   ------------------------------------------------------------
   Turns mobile/src into an installable, signed Android package
   without Android Studio, Gradle or a Maven mirror:

     tools/build.mjs   →  www/            the interface
     aapt2 compile     →  compiled.zip    resources
     aapt2 link        →  linked/         + manifest, arsc, assets
     ecj (or javac)    →  classes/        MainActivity
     d8                →  classes.dex
     tools/apkzip.mjs  →  unsigned.apk    aligned zip
     apksigner         →  dist/*.apk      v1 + v2 + v3 signatures

   Usage:
     node tools/build-apk.mjs                    debug APK, production API
     node tools/build-apk.mjs --api=https://…/   point it at a server
     node tools/build-apk.mjs --release          release-signed APK
     node tools/build-apk.mjs --version-name=1.1 --version-code=2

   Release signing uses JL_KEYSTORE / JL_KEYSTORE_PASS /
   JL_KEY_ALIAS / JL_KEY_PASS when they are set; otherwise a
   keystore is created once in the toolchain cache and reused, and
   its location is printed so it can be kept somewhere safe — Play
   will refuse an update signed with a different key.
   ============================================================ */
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toolchain } from "./toolchain.mjs";
import { writeApk, checkAlignment } from "./apkzip.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NATIVE = join(ROOT, "native");
const CAP_RES = join(ROOT, "android", "app", "src", "main", "res");

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const value = (name, fallback = null) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const release = has("--release");
const versionName = value("version-name", pkg.version || "1.0.0");
const versionCode = value("version-code", "1");
const MIN_SDK = "22";
const TARGET_SDK = "34";

const step = (n, text) => console.log(`\n${n}. ${text}`);
const done = (text) => console.log(`  ${text}`);

function sh(cmd, cmdArgs, opts = {}) {
  const out = spawnSync(cmd, cmdArgs, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts });
  if (out.error) throw out.error;
  if (out.status !== 0) {
    const detail = [out.stdout, out.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${basename(cmd)} failed:\n${detail}`);
  }
  return (out.stdout || "") + (out.stderr || "");
}

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(relative(base, full));
  }
  return out;
}

const human = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

/* ------------------------------------------------------------------ build */

console.log(`Jollof Living — Android package (${release ? "release" : "debug"} ${versionName})`);

const tc = await toolchain();
const BUILD = join(tc.cache, "build");
rmSync(BUILD, { recursive: true, force: true });
mkdirSync(BUILD, { recursive: true });

/* 1 — the interface -------------------------------------------------- */
step(1, "Building the web bundle");
if (!has("--skip-web")) {
  const buildArgs = [join(ROOT, "tools", "build.mjs")];
  const api = value("api");
  if (api) buildArgs.push(`--api=${api}`);
  if (has("--dev")) buildArgs.push("--dev");
  process.stdout.write(sh(process.execPath, buildArgs, { cwd: ROOT }).replace(/^/gm, "  "));
} else {
  done("skipped (--skip-web)");
}
if (!existsSync(join(ROOT, "www", "index.html"))) {
  throw new Error("www/index.html is missing — run `npm run build` first");
}

/* 2 — resources ------------------------------------------------------ */
step(2, "Compiling resources");
const res = join(BUILD, "res");
mkdirSync(res, { recursive: true });

/* Icons and splash screens come from the Capacitor project so both builds
   look identical; its styles.xml and layout need androidx, so they are left
   behind and native/res supplies framework equivalents. */
for (const dir of readdirSync(CAP_RES)) {
  if (dir.startsWith("mipmap") || dir.startsWith("drawable")) {
    cpSync(join(CAP_RES, dir), join(res, dir), { recursive: true });
  }
}
mkdirSync(join(res, "values"), { recursive: true });
for (const file of ["strings.xml", "ic_launcher_background.xml"]) {
  const from = join(CAP_RES, "values", file);
  if (existsSync(from)) cpSync(from, join(res, "values", file));
}
cpSync(join(NATIVE, "res"), res, { recursive: true });

const compiled = join(BUILD, "resources.zip");
sh(tc.aapt2, ["compile", "--dir", res, "-o", compiled]);
done(`${walk(res).length} resource files`);

/* 3 — assets: the bundle ships inside the APK ------------------------ */
step(3, "Packing the bundle into assets");
const assets = join(BUILD, "assets");
mkdirSync(assets, { recursive: true });
cpSync(join(ROOT, "www"), join(assets, "public"), { recursive: true });
done(`assets/public — ${walk(join(assets, "public")).length} files`);

/* 4 — link ----------------------------------------------------------- */
step(4, "Linking the package");
const linked = join(BUILD, "linked");
const gen = join(BUILD, "gen");
mkdirSync(linked, { recursive: true });
mkdirSync(gen, { recursive: true });
sh(tc.aapt2, [
  "link",
  "-o", linked,
  "--output-to-dir",
  "--manifest", join(NATIVE, "AndroidManifest.xml"),
  "-I", tc.androidJar,
  "-A", assets,
  "--java", gen,
  "--min-sdk-version", MIN_SDK,
  "--target-sdk-version", TARGET_SDK,
  "--version-code", String(versionCode),
  "--version-name", versionName,
  "--replace-version",
  "--auto-add-overlay",
  /* A debug package is remotely inspectable from chrome://inspect. */
  ...(release ? [] : ["--debug-mode"]),
  compiled,
]);
done(`minSdk ${MIN_SDK}, targetSdk ${TARGET_SDK}, versionCode ${versionCode}`);

/* 5 — java ----------------------------------------------------------- */
step(5, "Compiling Java");
const classes = join(BUILD, "classes");
mkdirSync(classes, { recursive: true });
const sources = [
  ...walk(join(NATIVE, "java")).filter((f) => f.endsWith(".java")).map((f) => join(NATIVE, "java", f)),
  ...walk(gen).filter((f) => f.endsWith(".java")).map((f) => join(gen, f)),
];
/* android.jar carries its own java.lang, so it goes on the boot classpath:
   put it on -classpath instead and the compiler sees two java.base modules. */
if (tc.javac) {
  sh(tc.javac, ["-source", "1.8", "-target", "1.8", "-nowarn", "-proc:none",
    "-bootclasspath", tc.androidJar, "-d", classes, ...sources]);
} else {
  sh(tc.java, ["-jar", tc.ecj, "-source", "1.8", "-target", "1.8", "-nowarn", "-proc:none",
    "-bootclasspath", tc.androidJar, "-d", classes, ...sources]);
}
done(`${sources.length} source files → ${walk(classes).length} classes`);

/* 6 — dex ------------------------------------------------------------ */
step(6, "Dexing");
const classesJar = join(BUILD, "classes.jar");
writeApk(classesJar, walk(classes).map((f) => ({ name: f.split("\\").join("/"), data: join(classes, f), store: false })));
const dexDir = join(BUILD, "dex");
mkdirSync(dexDir, { recursive: true });
sh(tc.java, ["-cp", tc.d8, "com.android.tools.r8.D8",
  "--release", "--min-api", MIN_SDK, "--lib", tc.androidJar, "--output", dexDir, classesJar]);
done(readdirSync(dexDir).map((d) => `${d} ${human(statSync(join(dexDir, d)).size)}`).join(", "));

/* 7 — zip ------------------------------------------------------------ */
step(7, "Assembling the APK");
const entries = [];
const linkedFiles = walk(linked);
const manifestFirst = (a, b) =>
  (a === "AndroidManifest.xml" ? -1 : b === "AndroidManifest.xml" ? 1 : a.localeCompare(b));
for (const file of linkedFiles.sort(manifestFirst)) {
  entries.push({ name: file.split("\\").join("/"), data: join(linked, file) });
}
for (const dex of readdirSync(dexDir).sort()) {
  entries.push({ name: dex, data: join(dexDir, dex), store: false });
}
const unsigned = join(BUILD, "unsigned.apk");
writeApk(unsigned, entries);
done(`${entries.length} entries, ${human(statSync(unsigned).size)}`);

/* 8 — sign ----------------------------------------------------------- */
step(8, "Signing");
let keystore = tc.debugKeystore;
let storePass = "android";
let keyAlias = "androiddebugkey";
let keyPass = "android";

if (release) {
  if (process.env.JL_KEYSTORE) {
    keystore = process.env.JL_KEYSTORE;
    storePass = process.env.JL_KEYSTORE_PASS || "";
    keyAlias = process.env.JL_KEY_ALIAS || "jollof";
    keyPass = process.env.JL_KEY_PASS || storePass;
    done(`using ${keystore}`);
  } else {
    keystore = join(tc.cache, "jollof-release.keystore");
    storePass = keyPass = "jollofliving";
    keyAlias = "jollof";
    if (!existsSync(keystore)) {
      sh(tc.keytool, ["-genkeypair", "-keystore", keystore, "-alias", keyAlias,
        "-keyalg", "RSA", "-keysize", "2048", "-validity", "10950",
        "-storepass", storePass, "-keypass", keyPass,
        "-dname", "CN=Jollof Living, OU=Mobile, O=Jollof Living, L=Lagos, C=NG"]);
      done(`created ${keystore} — keep this file, updates must be signed with it`);
    } else {
      done(`using ${keystore}`);
    }
  }
}

const outDir = join(ROOT, "dist");
mkdirSync(outDir, { recursive: true });
const outFile = value("out", join(outDir, `jollof-living-${versionName}-${release ? "release" : "debug"}.apk`));
sh(tc.java, ["-jar", tc.apksigner, "sign",
  "--ks", keystore,
  "--ks-pass", `pass:${storePass}`,
  "--ks-key-alias", keyAlias,
  "--key-pass", `pass:${keyPass}`,
  "--min-sdk-version", MIN_SDK,
  "--v1-signing-enabled", "true",
  "--v2-signing-enabled", "true",
  "--v3-signing-enabled", "true",
  "--v4-signing-enabled", "false",
  "--out", outFile,
  unsigned]);

/* 9 — check ---------------------------------------------------------- */
step(9, "Verifying");
const verified = sh(tc.java, ["-jar", tc.apksigner, "verify", "--print-certs", "-v", outFile]);
const schemes = verified
  .split("\n")
  .filter((l) => /^Verified using/.test(l) && l.includes("true"))
  .map((l) => l.match(/v\d/)[0]);
const sha = verified.match(/Signer #1 certificate SHA-256 digest: (\w+)/)?.[1] ?? "";
done(`signatures: ${schemes.join(", ")}`);
done(`certificate: ${sha.slice(0, 32)}…`);

const misaligned = checkAlignment(outFile);
if (misaligned.length) throw new Error(`stored entries are not 4-byte aligned: ${misaligned.join(", ")}`);
done("alignment: every stored entry on a 4-byte boundary");

const badging = sh(tc.aapt2, ["dump", "badging", outFile]);
const field = (re) => badging.match(re)?.[1] ?? "?";
done(`package: ${field(/package: name='([^']+)'/)} ${field(/versionName='([^']+)'/)} (code ${field(/versionCode='([^']+)'/)})`);
done(`label: ${field(/application-label:'([^']+)'/)}`);
done(`sdk: min ${field(/minSdkVersion:'([^']+)'/)}, target ${field(/targetSdkVersion:'([^']+)'/)}`);

console.log(`\n${outFile}  ${human(statSync(outFile).size)}`);
console.log("Install with:  adb install -r " + relative(process.cwd(), outFile));
