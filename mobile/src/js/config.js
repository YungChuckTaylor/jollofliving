/* ============================================================
   JOLLOF LIVING — app configuration
   ------------------------------------------------------------
   Point apiBase at your own server before building a release.
   This is the ONLY line most people need to change.
   ============================================================ */
"use strict";

/* Your live site, plus the mobile API folder. Must be https for a
   release build: Android blocks plain http by default. */
const PRODUCTION_API = "https://kxq.lop.temporary.site/jollof/api/mobile/";

/* When you run `npm run build -- --dev`, the app talks to this instead,
   so you can test against a machine on your own network. Use your
   computer's LAN address, not localhost: the phone is a different device. */
const DEVELOPMENT_API = "http://192.168.1.100:8080/api/mobile/";

export const CONFIG = {
  apiBase: (typeof __JL_API__ !== "undefined" && __JL_API__) || PRODUCTION_API,
  devApiBase: DEVELOPMENT_API,
  appVersion: "1.0.0",
  device: "Android",
  timeoutMs: 15000,
  /* How long before a background refresh is worth doing again. */
  refreshAfterMs: 5 * 60 * 1000,
  /* Images live on the website; the app points at the same files so a
     photo swapped in the admin panel updates everywhere at once. */
  imageBase: PRODUCTION_API.replace(/api\/mobile\/?$/, "assets/img/"),
};
