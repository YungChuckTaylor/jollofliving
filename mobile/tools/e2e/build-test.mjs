/* Build a test bundle of the app.
   Two differences from the shipping build, both forced on us by jsdom:
   IIFE instead of ESM (jsdom will not execute module scripts), and the
   Capacitor native plugins swapped for doubles that talk to an in-memory
   device. The application code itself is byte-for-byte the same. */
import { build } from "esbuild";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");

const stub = {
  name: "capacitor-doubles",
  setup(b) {
    b.onResolve({ filter: /^@capacitor\// }, (a) => ({ path: a.path, namespace: "cap" }));
    b.onLoad({ filter: /.*/, namespace: "cap" }, (a) => {
      const which = a.path.replace("@capacitor/", "");
      const map = {
        preferences: `export const Preferences = window.__CAP__.Preferences;`,
        network: `export const Network = window.__CAP__.Network;`,
        app: `export const App = window.__CAP__.App;`,
        "splash-screen": `export const SplashScreen = window.__CAP__.SplashScreen;`,
        "status-bar": `export const StatusBar = window.__CAP__.StatusBar;
                       export const Style = { Dark: "DARK", Light: "LIGHT" };`,
        haptics: `export const Haptics = window.__CAP__.Haptics;
                  export const ImpactStyle = { Light: "LIGHT", Medium: "MEDIUM", Heavy: "HEAVY" };`,
        core: `export const Capacitor = { isNativePlatform: () => true, getPlatform: () => "android" };`,
      };
      return { contents: map[which] || "export default {};", loader: "js" };
    });
  },
};

const api = process.argv[2] || "http://localhost:8080/api/mobile/";

await build({
  entryPoints: [`${ROOT}/src/js/app.js`],
  bundle: true,
  format: "iife",
  target: ["es2020"],
  minify: false,
  outfile: `${ROOT}/www-test/app.test.js`,
  define: { __JL_API__: JSON.stringify(api) },
  plugins: [stub],
  logLevel: "warning",
});
console.log("test bundle written to www-test/app.test.js");
