/* ============================================================
   JOLLOF LIVING — Android toolchain
   ------------------------------------------------------------
   Finds, or fetches, the five things needed to turn the app into
   an APK without Android Studio:

     java + keytool   a JDK 17          (system, or the jdk4py wheel)
     aapt2            resource compiler (Android SDK, or the aaptjs3 package)
     android.jar      the API 34 stubs  (Android SDK, or bundled)
     d8.jar           class -> dex      (Android SDK, or bundled)
     apksigner.jar    signing           (Android SDK, or bundled)

   A locally installed JDK or Android SDK is always preferred. What
   is missing is downloaded once into
   ~/.cache/jollof-android-toolchain (override with
   JL_ANDROID_TOOLCHAIN) and reused by every later build.
   ============================================================ */
import { execFileSync, spawnSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, readdirSync, chmodSync, statSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const NPM_MINAPK = "https://registry.npmjs.org/@drxiaozhi/minapk/-/minapk-0.3.0.tgz";
const NPM_AAPT2 = "https://registry.npmjs.org/aaptjs3/-/aaptjs3-2.0.2.tgz";
const PYPI_JDK = "https://pypi.org/pypi/jdk4py/17.0.9.2/json";

export const CACHE =
  process.env.JL_ANDROID_TOOLCHAIN || join(homedir(), ".cache", "jollof-android-toolchain");

const log = (msg) => console.log(`  ${msg}`);

function run(cmd, args, opts = {}) {
  const out = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (out.error || out.status !== 0) {
    const detail = [out.stdout, out.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${cmd} ${args.join(" ")} failed\n${detail}`);
  }
  return out.stdout ?? "";
}

async function download(url, dest) {
  if (existsSync(dest)) return dest;
  mkdirSync(join(dest, ".."), { recursive: true });
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest + ".part"));
  run("mv", [dest + ".part", dest]);
  return dest;
}

function untar(tarball, into, members = []) {
  mkdirSync(into, { recursive: true });
  run("tar", ["xzf", tarball, "-C", into, ...members]);
}

/* ------------------------------------------------------------------ java */

function systemJava() {
  for (const home of [process.env.JAVA_HOME, "/usr/lib/jvm/default-java"].filter(Boolean)) {
    const java = join(home, "bin", "java");
    if (existsSync(java)) return { java, keytool: join(home, "bin", "keytool"), javac: join(home, "bin", "javac") };
  }
  const which = spawnSync("which", ["java"], { encoding: "utf8" });
  if (which.status === 0) {
    const java = which.stdout.trim();
    const keytool = java.replace(/java$/, "keytool");
    const javac = java.replace(/java$/, "javac");
    return { java, keytool: existsSync(keytool) ? keytool : null, javac: existsSync(javac) ? javac : null };
  }
  return null;
}

async function fetchJava() {
  const runtime = join(CACHE, "jdk4py", "jdk4py", "java-runtime");
  const java = join(runtime, "bin", "java");
  if (!existsSync(java)) {
    log("fetching a JDK 17 (jdk4py, from PyPI)…");
    const meta = await (await fetch(PYPI_JDK)).json();
    const arch = process.arch === "arm64" ? "aarch64" : "x86_64";
    const wheel = meta.urls.find((u) => u.filename.includes("manylinux") && u.filename.includes(arch))
      || meta.urls.find((u) => u.packagetype === "bdist_wheel");
    if (!wheel) throw new Error("no jdk4py wheel for this platform");
    const file = await download(wheel.url, join(CACHE, "downloads", wheel.filename));
    mkdirSync(join(CACHE, "jdk4py"), { recursive: true });
    run("python3", ["-m", "zipfile", "-e", file, join(CACHE, "jdk4py")]);
  }
  for (const bin of readdirSync(join(runtime, "bin"))) chmodSync(join(runtime, "bin", bin), 0o755);
  for (const lib of ["lib/jspawnhelper", "lib/jexec"]) {
    const p = join(runtime, lib);
    if (existsSync(p)) chmodSync(p, 0o755);
  }
  return { java, keytool: join(runtime, "bin", "keytool"), javac: null };
}

/* -------------------------------------------------------------- sdk bits */

function sdkRoot() {
  for (const dir of [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT, join(homedir(), "Android", "Sdk")]) {
    if (dir && existsSync(dir)) return dir;
  }
  return null;
}

function newestBuildTools(root) {
  const dir = join(root, "build-tools");
  if (!existsSync(dir)) return null;
  const versions = readdirSync(dir).filter((v) => existsSync(join(dir, v))).sort();
  return versions.length ? join(dir, versions[versions.length - 1]) : null;
}

function platformJar(root) {
  const dir = join(root, "platforms");
  if (!existsSync(dir)) return null;
  const levels = readdirSync(dir)
    .filter((d) => /^android-\d+$/.test(d) && existsSync(join(dir, d, "android.jar")))
    .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
  return levels.length ? join(dir, levels[levels.length - 1], "android.jar") : null;
}

async function fetchBundledTools() {
  const dir = join(CACHE, "tools");
  const marker = join(dir, "android.jar");
  if (!existsSync(marker)) {
    log("fetching android.jar, d8, apksigner and ecj (npm: @drxiaozhi/minapk)…");
    const tgz = await download(NPM_MINAPK, join(CACHE, "downloads", "minapk.tgz"));
    const stage = join(CACHE, "stage-minapk");
    untar(tgz, stage, ["package/tools"]);
    mkdirSync(dir, { recursive: true });
    for (const f of readdirSync(join(stage, "package", "tools"))) {
      run("cp", [join(stage, "package", "tools", f), join(dir, f)]);
      chmodSync(join(dir, f), 0o644);
    }
    run("rm", ["-rf", stage]);
  }
  return {
    androidJar: join(dir, "android.jar"),
    d8: join(dir, "d8.jar"),
    apksigner: join(dir, "apksigner.jar"),
    ecj: join(dir, "ecj-3.45.0.jar"),
    debugKeystore: join(dir, "debug.keystore"),
  };
}

async function fetchAapt2() {
  const dest = join(CACHE, "tools", "aapt2");
  if (!existsSync(dest)) {
    log("fetching aapt2 (npm: aaptjs3)…");
    const tgz = await download(NPM_AAPT2, join(CACHE, "downloads", "aaptjs3.tgz"));
    const stage = join(CACHE, "stage-aapt2");
    const platform = process.platform === "darwin" ? "darwin" : "linux";
    const arch = process.arch === "arm64" ? "arm64" : "x64";
    untar(tgz, stage, [`package/bin/${arch}/${platform}/aapt2`]);
    mkdirSync(join(CACHE, "tools"), { recursive: true });
    run("cp", [join(stage, "package", "bin", arch, platform, "aapt2"), dest]);
    run("rm", ["-rf", stage]);
  }
  chmodSync(dest, 0o755);
  return dest;
}

/* ------------------------------------------------------------------ main */

export async function toolchain({ quiet = false } = {}) {
  if (!quiet) console.log("Toolchain");
  mkdirSync(CACHE, { recursive: true });

  let jdk = systemJava();
  if (jdk) {
    const version = spawnSync(jdk.java, ["-version"], { encoding: "utf8" });
    const line = (version.stderr || version.stdout || "").split("\n")[0].trim();
    if (!quiet) log(`java: ${line} (system)`);
  } else {
    jdk = await fetchJava();
    if (!quiet) log("java: OpenJDK 17 (jdk4py)");
  }

  const bundled = await fetchBundledTools();
  const root = sdkRoot();
  const buildTools = root ? newestBuildTools(root) : null;

  const pick = (sdkPath, fallback, label) => {
    if (sdkPath && existsSync(sdkPath)) {
      if (!quiet) log(`${label}: ${sdkPath}`);
      return sdkPath;
    }
    if (!quiet) log(`${label}: ${fallback}`);
    return fallback;
  };

  const aapt2 = pick(buildTools && join(buildTools, "aapt2"), await fetchAapt2(), "aapt2");
  const androidJar = pick(root && platformJar(root), bundled.androidJar, "android.jar");
  const d8 = pick(buildTools && join(buildTools, "lib", "d8.jar"), bundled.d8, "d8");
  const apksigner = pick(buildTools && join(buildTools, "lib", "apksigner.jar"), bundled.apksigner, "apksigner");

  const userDebugKeystore = join(homedir(), ".android", "debug.keystore");

  return {
    cache: CACHE,
    java: jdk.java,
    javac: jdk.javac,
    keytool: jdk.keytool,
    ecj: bundled.ecj,
    aapt2,
    androidJar,
    d8,
    apksigner,
    debugKeystore: existsSync(userDebugKeystore) ? userDebugKeystore : bundled.debugKeystore,
  };
}

export { run };
