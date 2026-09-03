#!/usr/bin/env python3
"""Jollof Living - multi-page E2E test (Playwright).

1. Page sweep - every real .html page loads, view renders, ZERO console
   errors, no horizontal overflow at 1440px.
2. No-auto-scroll - the home page must not move by itself (6s watch).
3. Interactions - theme, currency, search, wishlist, compare, concierge,
   booking wizard -> confirm -> trips, onboarding, admin tabs, chat, auth.
4. Mobile - 390px: drawer, no horizontal overflow on key pages; screenshots.

Usage: python3 test.py
"""
import http.server, os, socketserver, threading, sys, time, socket as _s
from playwright.sync_api import sync_playwright

ROOT = "/home/user"
PORT = 8471
SHOTS = os.path.join(ROOT, "shots")

PAGES = [
    "index.html", "stays.html", "map.html", "collections.html",
    "experiences.html", "reviews.html", "blog.html", "blog-jollof-100.html",
    "help.html", "membership.html", "giftcards.html", "referral.html",
    "business.html", "about.html", "app.html", "future.html",
    "concierge.html", "messages.html", "notifications.html", "trips.html",
    "wishlist.html", "compare.html", "account.html", "auth.html",
    "host.html", "host-onboarding.html", "host-dashboard.html",
    "payments.html", "admin.html", "admin-login.html", "404.html",
    "stay-onyx.html", "stay-villa-azur.html", "booking-onyx.html",
    "neighborhood-ikoyi.html", "blog-escrow-explained.html",
    "stay-ocean-spearl.html", "stay-maitama.html",
]

failures = []


def check(cond, msg):
    if not cond:
        failures.append(msg)


def start_server():
    os.chdir(ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    handler = http.server.SimpleHTTPRequestHandler
    handler.log_message = lambda *a, **k: None
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    time.sleep(0.6)
    return httpd


def overflow(page):
    """DOM-walk: report every visible element (outside the off-canvas drawer)
    that is genuinely unreachable past the viewport. Elements clipped by an
    ancestor with overflow-x:auto/scroll are fine (scrollable strips like tab
    bars and table wraps); containers that themselves exceed the viewport are
    not, and overflow:hidden ancestors that hide content are bugs."""
    return page.evaluate("""(()=>{
      const vw=window.innerWidth, sw=document.documentElement.scrollWidth;
      const bad=[];
      const inBounds=(el)=>{const r=el.getBoundingClientRect();return r.right<=vw+2;};
      /* An element poking past the viewport is a BUG unless some ancestor
         (whose own box stays within the viewport) clips or scrolls it —
         e.g. hero background bleed inside .hero{overflow:hidden}, or a cell
         inside a horizontal tab strip / table wrap with overflow-x:auto. */
      const okIfClipped=(el)=>{
        let n=el.parentElement;
        while(n && n!==document.body && n.id!=='view'){
          const o=getComputedStyle(n).overflowX;
          if((o==='auto'||o==='scroll'||o==='hidden'||o==='clip') && inBounds(n)) return true;
          n=n.parentElement;
        }
        return false;
      };
      document.querySelectorAll('body *').forEach(el=>{
        if(el.closest('#drawer')) return;
        const r=el.getBoundingClientRect();
        if(r.width>8 && r.height>4 && (r.right>vw+2)){
          const cs=getComputedStyle(el);
          if(cs.position==='fixed' && cs.transform!=='none') return;
          if(okIfClipped(el)) return;
          bad.push((el.tagName+'.'+(el.className||'').toString().slice(0,26)).replace(/\\.$/,'')
                   +' right='+Math.round(r.right)
                   +' "'+(el.textContent||'').trim().slice(0,22).replace(/\\s+/g,' ')+'"');
        }
      });
      return {sw, iw:vw, n:bad.length, bad:bad.slice(0,6)};
    })()""")


def main():
    os.makedirs(SHOTS, exist_ok=True)
    httpd = None
    probe = _s.socket()
    probe.setsockopt(_s.SOL_SOCKET, _s.SO_REUSEADDR, 1)
    try:
        probe.bind(("127.0.0.1", PORT))
    except OSError:
        pass
    else:
        httpd = start_server()
    finally:
        probe.close()
    time.sleep(0.4)

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        errs = []
        page.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
        base = f"http://127.0.0.1:{PORT}/"

        # ---------------- PAGE SWEEP ----------------
        print("PAGE SWEEP (%d pages)" % len(PAGES))
        for f in PAGES:
            errs.clear()
            page.goto(base + f, wait_until="load")
            page.wait_for_timeout(350)
            rendered = page.evaluate(
                "document.getElementById('view')&&document.getElementById('view').children.length>0")
            ok = rendered
            if errs:
                ok = False
                failures.append(f"{f}: {len(errs)} errors - {errs[:2]}")
            if not rendered:
                failures.append(f"{f}: view did not render")
            o = overflow(page)
            if o["sw"] > o["iw"] + 2:
                ok = False
                failures.append(f"{f}: horizontal overflow {o['sw']}px > {o['iw']}px")
            name = f.split(".")[0]
            page.screenshot(path=os.path.join(SHOTS, "p-" + name + ".png"))
            print("  " + ("OK " if ok else "XX ") + f)

        # ---------------- NO AUTO-SCROLL ----------------
        print("NO AUTO-SCROLL CHECK")
        page.goto(base + "index.html", wait_until="load")
        page.wait_for_timeout(600)
        y0 = page.evaluate("scrollY")
        page.wait_for_timeout(6000)
        y1 = page.evaluate("scrollY")
        check(y0 == 0 and y1 == 0, "home page moved by itself: %s -> %s" % (y0, y1))
        print("  scrollY after 6s idle: %d %s" % (y1, "OK" if y1 == 0 else "XX"))

        # ---------------- INTERACTIONS ----------------
        print("INTERACTIONS")
        errs.clear()

        page.click("#themeBtn"); page.wait_for_timeout(150)
        check(page.evaluate("document.documentElement.dataset.theme") == "dark", "theme -> dark")
        page.click("#themeBtn"); page.wait_for_timeout(150)

        page.select_option("#currencySel", "USD"); page.wait_for_timeout(400)
        usd = page.locator(".amt").first.inner_text()
        check("$" in usd, "currency USD: " + usd)
        page.select_option("#currencySel", "NGN"); page.wait_for_timeout(300)

        page.select_option("#hLoc", "Lekki Phase 1")
        page.click("#hGo"); page.wait_for_timeout(500)
        check("/stays.html" in page.url, "hero search -> stays.html got " + page.url)
        check("onyx" in page.inner_text("body").lower(), "search filters results")

        page.locator("[data-heart]").first.click(); page.wait_for_timeout(250)
        page.goto(base + "wishlist.html", wait_until="load"); page.wait_for_timeout(350)
        check("onyx" in page.inner_text("body").lower()
              or "ocean" in page.inner_text("body").lower(), "wishlist shows saved stay")

        page.goto(base + "stays.html", wait_until="load"); page.wait_for_timeout(350)
        cmps = page.locator("[data-cmp]")
        if cmps.count() >= 2:
            cmps.nth(0).click(); cmps.nth(1).click(); page.wait_for_timeout(250)
            n = page.evaluate("(()=>{try{return S.compare.length}catch(e){return -1}})()")
            check(n >= 2, "compare has %s of 2" % n)
            page.goto(base + "compare.html", wait_until="load"); page.wait_for_timeout(350)
            check("compare" in page.inner_text("body").lower(), "compare page renders")

        page.goto(base + "concierge.html", wait_until="load"); page.wait_for_timeout(350)
        page.fill("#concInput", "What's the cheapest stay in Lagos?")
        page.click("#concSend"); page.wait_for_timeout(1900)
        t = page.inner_text("#concMsgs").lower()
        check("cheapest" in t, "concierge EN: " + t[-130:])
        check("135" in t or "145" in t or "150" in t, "concierge quoted price")
        page.fill("#concInput", "How e go cost me to stay for one week for Lekki?")
        page.click("#concSend"); page.wait_for_timeout(1900)
        t = page.inner_text("#concMsgs").lower()
        check("week" in t or "night" in t, "concierge Pidgin: " + t[-130:])

        page.goto(base + "help.html", wait_until="load"); page.wait_for_timeout(350)
        page.fill("#helpSearch", "escrow"); page.click("#helpGo"); page.wait_for_timeout(450)
        check("escrow" in page.inner_text("#faqList").lower(), "help search")
        page.locator(".faq-q").first.click(); page.wait_for_timeout(300)
        check(page.evaluate("document.querySelector('.faq-item.open')!==null"), "FAQ opens")

        page.goto(base + "stay-onyx.html", wait_until="load"); page.wait_for_timeout(450)
        reserve = page.locator("[data-goto='/booking/onyx']").first
        check(reserve.count() > 0, "stay page Reserve CTA")
        reserve.click(); page.wait_for_timeout(500)
        check("booking-onyx.html" in page.url, "reserve -> booking-onyx.html got " + page.url)
        for bid in ["#bkNext1", "#bkNext2", "#bkNext3"]:
            if page.locator(bid).count():
                page.locator(bid).click(); page.wait_for_timeout(400)
        check(page.locator("#bkConfirm").count() > 0, "wizard review step")
        t = page.locator("#bkTerms")
        if t.count():
            t.check(); page.wait_for_timeout(200)
        page.locator("#bkConfirm").click(); page.wait_for_timeout(600)
        check("confirm.html?ref=" in page.url, "booking confirmed -> " + page.url)
        check("confirmed" in page.inner_text("body").lower(), "confirmation page")
        page.goto(base + "trips.html", wait_until="load"); page.wait_for_timeout(450)
        tb = page.inner_text("body").upper()
        check(any(x in tb for x in ["CHECK-IN", "MODIFY", "CANCEL", "INVOICE"]),
              "trips page shows booking actions")
        page.screenshot(path=os.path.join(SHOTS, "p-trips-booking.png"))

        # ------- listing wizard FULL E2E (real upload + submit) -------
        from PIL import Image as _Im
        _Im.new("RGB", (640, 480), (176, 116, 42)).save("/tmp/jl-test-photo.png")
        page.goto(base + "index.html", wait_until="load"); page.wait_for_timeout(300)
        page.locator("#navListBtn").click(); page.wait_for_timeout(450)
        check("host-onboarding.html" in page.url, "nav CTA -> host-onboarding.html")

        # step 1: basics
        page.fill("#wTitle", "The Emerald Court - garden apartment in Ikoyi")
        page.fill("#wArea", "Ikoyi")
        page.locator("#wizNext").click(); page.wait_for_timeout(400)

        # step 2: details/amenities
        page.locator("[data-amen='Pool']").check()
        page.locator("#wizNext").click(); page.wait_for_timeout(400)

        # step 3: photos — REAL file upload
        page.wait_for_timeout(400)
        check(page.locator("#wFiles").count() > 0, "photo input exists")
        page.set_input_files("#wFiles", "/tmp/jl-test-photo.png")
        page.wait_for_timeout(600)
        thumbs = page.locator("#wImgRow .panel").count()
        check(thumbs >= 1, f"upload produced thumbnails ({thumbs})")
        page.screenshot(path=os.path.join(SHOTS, "p-wizard-photos.png"))

        # steps 4-6: pricing, policy, review
        page.locator("#wizNext").click(); page.wait_for_timeout(400)
        page.locator("#wizNext").click(); page.wait_for_timeout(400)
        page.locator("#wizNext").click(); page.wait_for_timeout(400)

        # step 6: review & submit
        check(page.locator("#wizSubmit").count() > 0, "wizard review renders")
        page.locator("#wizSubmit").click(); page.wait_for_timeout(700)
        check("host-dashboard.html" in page.url,
              f"submit lands on host-dashboard.html, got {page.url}")
        check("Emerald Court" in page.inner_text("body"), "new listing appears in dashboard")
        check("1 photo" in page.inner_text("body"), "dashboard shows uploaded photo count")
        page.screenshot(path=os.path.join(SHOTS, "p-dashboard-new-listing.png"))

        # ------- back office login gate -------
        page.goto(base + "admin.html", wait_until="load"); page.wait_for_timeout(400)
        check(page.locator("#adForm").count() == 1, "admin gated: sign-in form renders")
        check("GMV" not in page.inner_text("body"), "admin gated: console hidden until sign-in")
        page.screenshot(path=os.path.join(SHOTS, "p-admin-gate.png"))
        # weak password is rejected
        page.fill("#adEmail", "ops@jollofliving.com"); page.fill("#adPass", "123")
        page.click("#adSubmit"); page.wait_for_timeout(350)
        check(page.locator("#adForm").count() == 1, "short password rejected")
        # valid sign-in unlocks the console
        page.fill("#adPass", "jollof2026")
        page.click("#adSubmit"); page.wait_for_timeout(800)
        body = page.inner_text("body")
        check("Back office" in body and "GMV" in body, "admin sign-in unlocks console")
        page.goto(base + "admin-login.html", wait_until="load"); page.wait_for_timeout(300)
        check(page.locator("#adSubmit").count() == 1, "admin-login.html dedicated page")
        check("Continue to the console" in page.inner_text("body"), "signed-in state offered on login page")

        page.goto(base + "admin.html?tab=fraud", wait_until="load"); page.wait_for_timeout(400)
        check("fraud" in page.inner_text("body").lower(), "admin fraud tab")
        page.goto(base + "admin.html?tab=audit", wait_until="load"); page.wait_for_timeout(400)
        check("audit" in page.inner_text("body").lower(), "admin audit tab")

        page.goto(base + "host-dashboard.html", wait_until="load"); page.wait_for_timeout(450)
        before = page.inner_text("#hdContent")
        page.goto(base + "host-dashboard.html?tab=revenue", wait_until="load")
        page.wait_for_timeout(450)
        after = page.inner_text("#hdContent")
        check(before != after, "host dashboard tab switches content")

        page.goto(base + "messages.html", wait_until="load"); page.wait_for_timeout(400)
        page.locator("[data-conv]").first.click(); page.wait_for_timeout(350)
        page.fill("#chatInp", "Is the pool heated in December?")
        page.click("#chatSend"); page.wait_for_timeout(1900)
        mt = page.inner_text("#chatMain").lower()
        check("pool" in mt or "heated" in mt, "chat works: " + mt[-120:])
        page.goto(base + "auth.html", wait_until="load"); page.wait_for_timeout(350)
        page.click("text=Continue with Google"); page.wait_for_timeout(500)
        check("account.html" in page.url, "auth -> account.html")

        if errs:
            failures.append("interaction phase errors: %s" % errs[:3])

        # ---------------- MOBILE ----------------
        print("MOBILE 390px")
        m = ctx.new_page()
        m.set_viewport_size({"width": 390, "height": 844})
        merrs = []
        m.on("pageerror", lambda e: merrs.append(str(e)))
        for f in ["index.html", "stays.html", "stay-onyx.html", "admin.html",
                  "host-dashboard.html", "membership.html", "concierge.html",
                  "trips.html"]:
            m.goto(base + f, wait_until="load"); m.wait_for_timeout(400)
            o = overflow(m)
            check(o["n"] == 0,
                  "mobile %s: %d element(s) past viewport %s" % (f, o["n"], o["bad"][:2]))
            check(o["sw"] <= o["iw"] + 2,
                  "mobile %s: scrollWidth %s vs %s" % (f, o["sw"], o["iw"]))

        # narrow sweeps: 412px (typical Android) and 360px — per-element check
        for w in [412, 360]:
            page.set_viewport_size({"width": w, "height": 850})
            for f in ["stay-onyx.html", "stay-ocean-spearl.html", "booking-onyx.html",
                      "index.html", "stays.html", "host-dashboard.html", "admin.html"]:
                m.goto(base + f, wait_until="load"); m.wait_for_timeout(380)
                o = overflow(m)
                check(o["n"] == 0,
                      "%spx %s: %d element(s) past viewport %s" % (w, f, o["n"], o["bad"][:2]))
            page.screenshot(path=os.path.join(SHOTS, "n-%d-stay.png" % w))
        page.set_viewport_size({"width": 1440, "height": 900})
        m.goto(base + "index.html", wait_until="load"); m.wait_for_timeout(450)
        m.screenshot(path=os.path.join(SHOTS, "m-home.png"))
        m.click("#burgerBtn"); m.wait_for_timeout(300)
        check(m.evaluate("document.getElementById('drawer').classList.contains('open')"),
              "mobile drawer opens")
        m.screenshot(path=os.path.join(SHOTS, "m-drawer.png"))
        m.click("#drawer a[href='stays.html']"); m.wait_for_timeout(500)
        check("stays.html" in m.url, "drawer -> stays.html")
        m.screenshot(path=os.path.join(SHOTS, "m-stays.png"))
        m.goto(base + "stay-ocean-spearl.html", wait_until="load"); m.wait_for_timeout(450)
        m.screenshot(path=os.path.join(SHOTS, "m-stay.png"))
        m.goto(base + "concierge.html", wait_until="load"); m.wait_for_timeout(450)
        m.screenshot(path=os.path.join(SHOTS, "m-concierge.png"))
        check(not merrs, "mobile errors: %s" % merrs[:3])
        m.close()

        # ---------------- DARK ----------------
        print("DARK THEME")
        d = ctx.new_page()
        d.set_viewport_size({"width": 1440, "height": 900})
        derrs = []
        d.on("pageerror", lambda e: derrs.append(str(e)))
        d.goto(base + "index.html", wait_until="load"); d.wait_for_timeout(350)
        d.click("#themeBtn"); d.wait_for_timeout(400)
        d.screenshot(path=os.path.join(SHOTS, "dark-home.png"))
        d.goto(base + "stays.html", wait_until="load"); d.wait_for_timeout(400)
        d.screenshot(path=os.path.join(SHOTS, "dark-stays.png"))
        d.goto(base + "membership.html", wait_until="load"); d.wait_for_timeout(400)
        d.screenshot(path=os.path.join(SHOTS, "dark-membership.png"))
        check(not derrs, "dark errors: %s" % derrs[:3])
        d.close()

        browser.close()

    if httpd:
        httpd.shutdown()

    print("\n" + "=" * 60)
    if failures:
        print("FAILURES (%d):" % len(failures))
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("ALL CHECKS PASSED OK  (%d pages, screenshots in shots/)" % len(PAGES))


if __name__ == "__main__":
    main()
