/* ============================================================
   JOLLOF LIVING — onboarding and authentication
   The onboarding pages are the animated sprite sequence a
   first-time user sees; auth mirrors the website's dual-role
   signup so an account works on both.
   ============================================================ */
"use strict";

import * as store from "./store.js";
import { S } from "./store.js";
import { $, $$, esc, svg, toast, tap } from "./ui.js";
import { spriteTag, mountAll, unmountAll } from "./sprites.js";
import { go } from "./router.js";

/* ------------------------------------------------------ ONBOARDING */

const SLIDES = [
  { sprite: "skyline",   title: "Luxury living,<br><em class='serif-i'>African soul</em>",
    body: "Penthouses over the lagoon, courtyard houses in Ikoyi, villas behind Banana Island's bridge." },
  { sprite: "compass",   title: "Find your <em class='serif-i'>bearing</em>",
    body: "Search by neighbourhood, browse curated collections, and see exactly what a night costs before you commit." },
  { sprite: "keys",      title: "Book with <em class='serif-i'>confidence</em>",
    body: "Payment held in escrow until check-in, verified homes, and a check-in code the moment you are confirmed." },
  { sprite: "concierge", title: "Concierge <em class='serif-i'>on call</em>",
    body: "Chefs, drivers, airport pickup and spa visits — arranged before you land." },
];

export function onboarding() {
  return `<div class="onboard" id="onboard">
    <div class="slides" id="slides">
      ${SLIDES.map((s) => `<section class="slide">
        ${spriteTag(s.sprite)}
        <h2>${s.title}</h2>
        <p>${esc(s.body)}</p>
      </section>`).join("")}
    </div>
    <div class="foot">
      <div class="dots" id="dots">${SLIDES.map((_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("")}</div>
      <button class="btn btn-ghost" id="obSkip">Skip</button>
      <button class="btn btn-gold" id="obNext">Next</button>
    </div>
  </div>`;
}

export function bindOnboarding(root, done) {
  const slides = $("#slides", root);
  const dots = $$("#dots i", root);
  const next = $("#obNext", root);
  const skip = $("#obSkip", root);
  let index = 0;

  const settle = () => {
    index = Math.round(slides.scrollLeft / slides.clientWidth);
    dots.forEach((d, i) => d.classList.toggle("on", i === index));
    next.textContent = index === SLIDES.length - 1 ? "Get started" : "Next";
    skip.style.visibility = index === SLIDES.length - 1 ? "hidden" : "visible";
  };
  slides.addEventListener("scroll", () => { clearTimeout(slides._t); slides._t = setTimeout(settle, 70); });

  next.addEventListener("click", async () => {
    tap();
    if (index >= SLIDES.length - 1) { await finish(); return; }
    slides.scrollTo({ left: (index + 1) * slides.clientWidth, behavior: "smooth" });
  });
  skip.addEventListener("click", finish);

  async function finish() {
    await store.markOnboarded();
    unmountAll(root);
    done();
  }
  settle();
}

/* ------------------------------------------------------------ AUTH */

let mode = "signin";
let accountType = "customer";

export function auth(params = {}) {
  if (params.mode) mode = params.mode;
  const register = mode === "register";

  return `<div class="screen fade-in">
    <div style="text-align:center;margin:6px 0 18px">
      ${spriteTag("keys", "sprite-sm")}
      <h1 style="font-size:26px;margin-top:4px">${register ? "Create your account" : "Welcome back"}</h1>
      <p class="small">${register ? "Trips, wishlists and points — synced with the website." : "Sign in to pick up where you left off."}</p>
    </div>

    ${register ? `
      <div class="grid-2" style="margin-bottom:16px">
        <button class="chip ${accountType === "customer" ? "on" : ""}" data-type="customer"
                style="width:100%;justify-content:center;padding:14px 10px;border-radius:14px;text-align:center">
          <div><div style="font-size:14px;font-weight:600">I'm travelling</div>
          <div class="small" style="margin-top:2px">Book stays</div></div>
        </button>
        <button class="chip ${accountType === "owner" ? "on" : ""}" data-type="owner"
                style="width:100%;justify-content:center;padding:14px 10px;border-radius:14px;text-align:center">
          <div><div style="font-size:14px;font-weight:600">I have a home</div>
          <div class="small" style="margin-top:2px">List and host</div></div>
        </button>
      </div>
      <label class="field"><span>Full name</span><input class="inp" id="aName" autocomplete="name"></label>
    ` : ""}

    <label class="field"><span>Email</span>
      <input class="inp" id="aEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off"></label>
    ${register ? `<label class="field"><span>Phone (optional)</span>
      <input class="inp" id="aPhone" type="tel" inputmode="tel" autocomplete="tel"></label>` : ""}
    <label class="field"><span>Password</span>
      <input class="inp" id="aPass" type="password" autocomplete="${register ? "new-password" : "current-password"}"></label>

    <button class="btn btn-gold btn-block" id="aGo" style="margin-top:6px">
      ${register ? "Create account" : "Sign in"}</button>

    <p class="small" style="text-align:center;margin-top:16px">
      ${register ? "Already with us?" : "New to Jollof Living?"}
      <a style="color:var(--gold)" data-switch="${register ? "signin" : "register"}">
        ${register ? "Sign in" : "Create an account"}</a>
    </p>
  </div>`;
}

export function bindAuth(root, params = {}) {
  $$("[data-type]", root).forEach((b) => b.addEventListener("click", () => {
    accountType = b.dataset.type; tap();
    root.innerHTML = auth(); bindAuth(root, params); mountAll(root);
  }));

  $$("[data-switch]", root).forEach((a) => a.addEventListener("click", () => {
    mode = a.dataset.switch;
    root.innerHTML = auth(); bindAuth(root, params); mountAll(root);
  }));

  $("#aGo", root)?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const email = $("#aEmail", root).value.trim();
    const password = $("#aPass", root).value;
    if (!email || !password) { toast("Please enter your email and password.", "bad"); return; }

    btn.disabled = true;
    btn.textContent = mode === "register" ? "Creating…" : "Signing in…";
    const r = mode === "register"
      ? await store.register({
          name: $("#aName", root).value.trim(), email, password,
          phone: $("#aPhone", root)?.value.trim() || "", accountType })
      : await store.login({ email, password });
    btn.disabled = false;
    btn.textContent = mode === "register" ? "Create account" : "Sign in";

    if (!r.ok) { toast(r.message || "That did not work.", "bad"); return; }
    tap();
    toast(r.message || "Welcome ✨", "good");
    // Straight back to whatever they were doing before we interrupted.
    if (params.next) go(params.next, params);
    else if (store.isOwner()) go("owner");
    else go("home");
  });
}
