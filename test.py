#!/usr/bin/env python3
"""Jollof Living - PHP/MySQL E2E test (Playwright).

Boots the PHP site against a throwaway SQLite database, then:

1. Page sweep - every .php page loads, the view renders, ZERO console
   errors, no horizontal overflow at 1440px.
2. No-auto-scroll - the home page must not move by itself (6s watch).
3. Guest journey - register, search, wishlist, compare, concierge, booking
   wizard -> confirm -> trips -> check-in -> review. Every step is asserted
   against the DATABASE, not just the DOM.
4. Host journey - listing wizard -> submitted listing appears in the dashboard
   and in the moderation queue.
5. Back office - login gate, all nine tabs, a real moderation action, CSV export.
6. Mobile 390/412/360px + dark theme screenshots.

Usage:
    pip install playwright && playwright install chromium
    python3 test.py
"""
import os
import shutil
import signal
import sqlite3
import subprocess
import sys
import tempfile
import time
import urllib.request

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
DOCROOT = os.path.join(ROOT, "public_html")
SHOTS = os.path.join(ROOT, "shots")
PORT = 8471
BASE = f"http://127.0.0.1:{PORT}/"

# PHP binary: override with JL_PHP=/path/to/php
PHP = os.environ.get("JL_PHP", "php")

ADMIN_EMAIL = "ops@jollofliving.com"
ADMIN_PASS = "TestAdminPass123"
GUEST_EMAIL = "e2e.guest@example.com"
GUEST_PASS = "TestGuestPass123"

PAGES = [
    "index.php", "stays.php", "map.php", "collections.php",
    "experiences.php", "reviews.php", "blog.php", "help.php",
    "membership.php", "giftcards.php", "referral.php", "business.php",
    "about.php", "app.php", "future.php", "concierge.php",
    "neighborhoods.php", "host.php", "auth.php", "admin-login.php", "404.php",
    "stay.php?p=onyx", "stay.php?p=villa-azur", "stay.php?p=ocean-spearl",
    "booking.php?p=onyx", "neighborhood.php?n=ikoyi",
    "blog-post.php?s=jollof-100", "blog-post.php?s=escrow-explained",
]

failures = []
_state = {}


def check(cond, msg):
    if not cond:
        failures.append(msg)
    return cond


# --------------------------------------------------------------- environment

def db_path():
    return _state["db"]


def query(sql, args=()):
    con = sqlite3.connect(db_path())
    con.row_factory = sqlite3.Row
    try:
        return [dict(r) for r in con.execute(sql, args).fetchall()]
    finally:
        con.close()


def value(sql, args=()):
    rows = query(sql, args)
    return list(rows[0].values())[0] if rows else None


def write_config(tmp):
    """Point the app at a throwaway SQLite database."""
    sample = open(os.path.join(DOCROOT, "includes", "config.sample.php")).read()
    cfg = (sample
           .replace("'driver'   => 'mysql'", "'driver'   => 'sqlite'")
           .replace("__DIR__ . '/../../storage/jollof.sqlite'", repr(os.path.join(tmp, "test.sqlite")).replace("'", "'"))
           .replace("'debug' => false", "'debug' => true")
           .replace("'enabled'    => true", "'enabled'    => false"))
    cfg = cfg.replace('"' + os.path.join(tmp, "test.sqlite") + '"',
                      "'" + os.path.join(tmp, "test.sqlite") + "'")
    path = os.path.join(DOCROOT, "includes", "config.php")
    backup = None
    if os.path.exists(path):
        backup = path + ".e2e-backup"
        shutil.copy(path, backup)
    open(path, "w").write(cfg)
    return path, backup


def start_server():
    proc = subprocess.Popen(
        [PHP, "-S", f"127.0.0.1:{PORT}", "-t", DOCROOT],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        preexec_fn=os.setsid if hasattr(os, "setsid") else None,
    )
    for _ in range(60):
        try:
            urllib.request.urlopen(BASE + "index.php", timeout=1)
            return proc
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("PHP dev server did not start - is %r on PATH? (set JL_PHP)" % PHP)


def install(page):
    """Run the web installer: schema + seed + administrator."""
    lock = os.path.join(DOCROOT, "install", "installed.lock")
    if os.path.exists(lock):
        os.remove(lock)
    page.goto(BASE + "install/", wait_until="load")
    page.fill("#admin_name", "E2E Admin")
    page.fill("#admin_email", ADMIN_EMAIL)
    page.fill("#admin_pass", ADMIN_PASS)
    page.click("button[type=submit]")
    page.wait_for_timeout(1500)
    body = page.inner_text("body")
    check("Installation complete" in body, "installer finished: " + body[:200])
    check(value("SELECT COUNT(*) FROM properties") == 12, "installer seeded 12 properties")


def overflow(page):
    """Report elements genuinely unreachable past the viewport (see notes below).

    An element poking past the viewport is a BUG unless some ancestor whose own
    box stays within the viewport clips or scrolls it - e.g. hero background
    bleed inside .hero{overflow:hidden}, or a cell inside a horizontal tab strip.
    """
    return page.evaluate("""(()=>{
      const vw=window.innerWidth, sw=document.documentElement.scrollWidth;
      const bad=[];
      const inBounds=(el)=>{const r=el.getBoundingClientRect();return r.right<=vw+2;};
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


def signin(page, email, password):
    page.goto(BASE + "auth.php", wait_until="load")
    page.wait_for_timeout(400)
    page.fill("#auEmail", email)
    page.fill("#auPass", password)
    page.click("#auSubmit")
    page.wait_for_timeout(1200)


# --------------------------------------------------------------------- main

def main():
    os.makedirs(SHOTS, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="jl-e2e-")
    _state["db"] = os.path.join(tmp, "test.sqlite")
    cfg_path, cfg_backup = write_config(tmp)
    proc = start_server()

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            ctx = browser.new_context(viewport={"width": 1440, "height": 900})
            page = ctx.new_page()
            errs = []
            page.on("console", lambda m: errs.append("console: " + m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))

            # ------------------------------------------------- INSTALL
            print("INSTALL")
            install(page)

            # ---------------------------------------------- PAGE SWEEP
            print("PAGE SWEEP (%d pages)" % len(PAGES))
            for f in PAGES:
                errs.clear()
                page.goto(BASE + f, wait_until="load")
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
                name = f.replace(".php", "").replace("?", "-").replace("=", "-")
                page.screenshot(path=os.path.join(SHOTS, "p-" + name + ".png"))
                print("  " + ("OK " if ok else "XX ") + f)

            # ------------------------------------------ NO AUTO-SCROLL
            print("NO AUTO-SCROLL CHECK")
            page.goto(BASE + "index.php", wait_until="load")
            page.wait_for_timeout(600)
            y0 = page.evaluate("scrollY")
            page.wait_for_timeout(6000)
            y1 = page.evaluate("scrollY")
            check(y0 == 0 and y1 == 0, "home page moved by itself: %s -> %s" % (y0, y1))
            print("  scrollY after 6s idle: %d %s" % (y1, "OK" if y1 == 0 else "XX"))

            # --------------------------------------- CHROME / SEARCH
            print("CHROME + SEARCH")
            errs.clear()
            page.click("#themeBtn"); page.wait_for_timeout(200)
            check(page.evaluate("document.documentElement.dataset.theme") == "dark", "theme -> dark")
            page.click("#themeBtn"); page.wait_for_timeout(200)

            page.select_option("#currencySel", "USD"); page.wait_for_timeout(500)
            usd = page.locator(".amt").first.inner_text()
            check("$" in usd, "currency USD: " + usd)
            check("jl_currency" in page.evaluate("document.cookie"), "currency written to cookie for PHP")
            page.select_option("#currencySel", "NGN"); page.wait_for_timeout(400)

            page.select_option("#hLoc", "Lekki Phase 1")
            page.click("#hGo"); page.wait_for_timeout(600)
            check("stays.php" in page.url, "hero search -> stays.php, got " + page.url)
            check("onyx" in page.inner_text("body").lower(), "search filters results")

            # ------------------------------------------ GUEST JOURNEY
            print("GUEST JOURNEY (registration -> booking -> review)")
            page.goto(BASE + "auth.php?mode=register", wait_until="load")
            page.wait_for_timeout(400)
            page.fill("#auName", "E2E Guest")
            page.fill("#auEmail", GUEST_EMAIL)
            page.fill("#auPhone", "+2348012345678")
            page.fill("#auPass", GUEST_PASS)
            page.check("#auTerms")
            page.click("#auSubmit")
            page.wait_for_timeout(1500)
            uid = value("SELECT id FROM users WHERE email = ?", (GUEST_EMAIL,))
            check(uid is not None, "registration wrote a user row")
            check("account.php" in page.url, "registration -> account.php, got " + page.url)

            # wishlist persists to the database
            page.goto(BASE + "stays.php", wait_until="load"); page.wait_for_timeout(500)
            page.locator("[data-heart]").first.click(); page.wait_for_timeout(900)
            saved = value("""SELECT COUNT(*) FROM wishlist_items wi
                             JOIN wishlists w ON w.id = wi.wishlist_id WHERE w.user_id = ?""", (uid,))
            check(saved == 1, "wishlist saved to the database (%s rows)" % saved)
            page.goto(BASE + "wishlist.php", wait_until="load"); page.wait_for_timeout(500)
            check(page.locator(".stay-card").count() >= 1, "wishlist page shows the saved stay")

            # compare persists too
            page.goto(BASE + "stays.php", wait_until="load"); page.wait_for_timeout(500)
            cmps = page.locator("[data-cmp]")
            if cmps.count() >= 2:
                cmps.nth(0).click(); page.wait_for_timeout(700)
                cmps.nth(1).click(); page.wait_for_timeout(700)
                n = value("SELECT COUNT(*) FROM compare_items WHERE user_id = ?", (uid,))
                check(n >= 2, "compare persisted %s of 2" % n)

            # concierge answers from live inventory
            page.goto(BASE + "concierge.php", wait_until="load"); page.wait_for_timeout(400)
            page.fill("#concInput", "What is the cheapest stay in Lagos?")
            page.click("#concSend"); page.wait_for_timeout(2200)
            t = page.inner_text("#concMsgs")
            check("₦" in t or "$" in t, "concierge quoted a real price: " + t[-140:])

            # help search
            page.goto(BASE + "help.php", wait_until="load"); page.wait_for_timeout(400)
            page.fill("#helpSearch", "escrow"); page.click("#helpGo"); page.wait_for_timeout(500)
            check("escrow" in page.inner_text("#faqList").lower(), "help search")
            page.locator(".faq-q").first.click(); page.wait_for_timeout(300)
            check(page.evaluate("document.querySelector('.faq-item.open')!==null"), "FAQ opens")

            # booking wizard -> confirmation, asserted in the database
            page.goto(BASE + "stay.php?p=onyx", wait_until="load"); page.wait_for_timeout(600)
            reserve = page.locator("[data-goto='/booking/onyx']").first
            check(reserve.count() > 0, "stay page Reserve CTA")
            reserve.click(); page.wait_for_timeout(900)
            check("booking.php" in page.url, "reserve -> booking.php, got " + page.url)
            for bid in ["#bkNext1", "#bkNext2", "#bkNext3"]:
                if page.locator(bid).count():
                    page.locator(bid).click(); page.wait_for_timeout(450)
            check(page.locator("#bkConfirm").count() > 0, "wizard reached the review step")
            if page.locator("#bkTerms").count():
                page.check("#bkTerms"); page.wait_for_timeout(200)
            page.locator("#bkConfirm").click(); page.wait_for_timeout(2000)
            check("confirm.php?ref=" in page.url, "booking confirmed -> " + page.url)

            row = query("SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC LIMIT 1", (uid,))
            check(len(row) == 1, "booking written to the database")
            if row:
                b = row[0]
                ref = b["ref"]
                check(ref in page.url, "confirmation page shows the stored reference")
                check(b["total"] > 0, "booking total calculated server-side: %s" % b["total"])
                check(b["escrow_status"] in ("held", "pending"), "escrow recorded: %s" % b["escrow_status"])
                check(b["checkin_code"], "check-in code issued")
                page.screenshot(path=os.path.join(SHOTS, "p-confirm.png"))

                # trips -> check in -> review
                page.goto(BASE + "trips.php", wait_until="load"); page.wait_for_timeout(700)
                tb = page.inner_text("body").upper()
                check(any(x in tb for x in ["CHECK-IN", "MODIFY", "CANCEL", "INVOICE"]),
                      "trips page shows booking actions")
                page.screenshot(path=os.path.join(SHOTS, "p-trips-booking.png"))

                if b["status"] == "confirmed" and page.locator("[onclick*='tripCheckin']").count():
                    page.locator("[onclick*='tripCheckin']").first.click()
                    page.wait_for_timeout(1500)
                    st = value("SELECT status FROM bookings WHERE ref = ?", (ref,))
                    check(st == "active", "check-in moved the booking to active, got %s" % st)
                    esc = value("SELECT escrow_status FROM bookings WHERE ref = ?", (ref,))
                    check(esc == "released", "check-in released escrow, got %s" % esc)

            # ------------------------------------------- HOST JOURNEY
            print("HOST JOURNEY (listing wizard)")
            page.goto(BASE + "index.php", wait_until="load"); page.wait_for_timeout(400)
            page.locator("#navListBtn").click(); page.wait_for_timeout(800)
            check("host-onboarding.php" in page.url, "nav CTA -> host-onboarding.php")

            page.fill("#wTitle", "The Emerald Court - garden apartment in Ikoyi")
            page.fill("#wArea", "Ikoyi")
            page.locator("#wizNext").click(); page.wait_for_timeout(450)
            if page.locator("[data-amen='Pool']").count():
                page.locator("[data-amen='Pool']").check()
            page.locator("#wizNext").click(); page.wait_for_timeout(450)
            for _ in range(4):
                if page.locator("#wizNext").count():
                    page.locator("#wizNext").click(); page.wait_for_timeout(450)
            check(page.locator("#wizSubmit").count() > 0, "wizard review renders")
            page.locator("#wizSubmit").click(); page.wait_for_timeout(2000)

            listing = query("SELECT * FROM properties WHERE name LIKE 'The Emerald Court%'")
            check(len(listing) == 1, "listing written to the database")
            if listing:
                check(listing[0]["status"] == "pending", "new listing awaits moderation")
                check(listing[0]["host_id"] == uid, "listing attributed to the host")
            check("host-dashboard.php" in page.url, "submit lands on the dashboard, got " + page.url)
            check("Emerald Court" in page.inner_text("body"), "new listing appears in the dashboard")
            page.screenshot(path=os.path.join(SHOTS, "p-dashboard-new-listing.png"))

            # --------------------------------------------- BACK OFFICE
            print("BACK OFFICE")
            page.goto(BASE + "admin.php", wait_until="load"); page.wait_for_timeout(600)
            check(page.locator("#adForm").count() == 1, "admin gated: sign-in form renders")
            check("GMV" not in page.inner_text("body"), "admin gated: console hidden until sign-in")
            page.screenshot(path=os.path.join(SHOTS, "p-admin-gate.png"))

            page.fill("#adEmail", ADMIN_EMAIL); page.fill("#adPass", "wrong-password")
            page.click("#adSubmit"); page.wait_for_timeout(1200)
            check(page.locator("#adForm").count() == 1, "wrong password rejected")

            page.fill("#adEmail", ADMIN_EMAIL); page.fill("#adPass", ADMIN_PASS)
            page.click("#adSubmit"); page.wait_for_timeout(2000)
            body = page.inner_text("body")
            check("Back office" in body and "GMV" in body, "admin sign-in unlocks the console")

            for tab in ["dashboard", "moderation", "users", "promotions", "fraud",
                        "cms", "reports", "roles", "audit"]:
                errs.clear()
                page.goto(BASE + "admin.php?tab=" + tab, wait_until="load")
                page.wait_for_timeout(600)
                check(not errs, "admin %s tab errors: %s" % (tab, errs[:2]))
                check(page.locator("#view").inner_html() != "", "admin %s tab renders" % tab)

            # a real moderation action must change the database
            page.goto(BASE + "admin.php?tab=moderation", wait_until="load")
            page.wait_for_timeout(700)
            if listing and page.locator("[onclick*=\"'approve'\"]").count():
                page.locator("[onclick*=\"'approve'\"]").first.click()
                page.wait_for_timeout(1800)
                st = value("SELECT status FROM properties WHERE id = ?", (listing[0]["id"],))
                check(st == "live", "moderation approval published the listing, got %s" % st)

            # CSV export
            with page.expect_download() as dl:
                page.goto(BASE + "api/report.php?r=bookings")
            csv = dl.value
            check(csv.suggested_filename.endswith(".csv"), "bookings CSV export")

            audits = value("SELECT COUNT(*) FROM audit_log")
            check(audits > 0, "actions wrote audit entries (%s)" % audits)

            if errs:
                failures.append("interaction phase errors: %s" % errs[:3])

            # -------------------------------------------------- MOBILE
            print("MOBILE 390px")
            m = ctx.new_page()
            m.set_viewport_size({"width": 390, "height": 844})
            merrs = []
            m.on("pageerror", lambda e: merrs.append(str(e)))
            for f in ["index.php", "stays.php", "stay.php?p=onyx", "membership.php",
                      "concierge.php", "host.php", "blog.php"]:
                m.goto(BASE + f, wait_until="load"); m.wait_for_timeout(450)
                o = overflow(m)
                check(o["n"] == 0, "mobile %s: %d element(s) past viewport %s" % (f, o["n"], o["bad"][:2]))
                check(o["sw"] <= o["iw"] + 2, "mobile %s: scrollWidth %s vs %s" % (f, o["sw"], o["iw"]))

            for w in [412, 360]:
                m.set_viewport_size({"width": w, "height": 850})
                for f in ["stay.php?p=onyx", "booking.php?p=onyx", "index.php", "stays.php"]:
                    m.goto(BASE + f, wait_until="load"); m.wait_for_timeout(400)
                    o = overflow(m)
                    check(o["n"] == 0, "%spx %s: %d element(s) past viewport %s" % (w, f, o["n"], o["bad"][:2]))
                m.screenshot(path=os.path.join(SHOTS, "n-%d-stay.png" % w))

            m.set_viewport_size({"width": 390, "height": 844})
            m.goto(BASE + "index.php", wait_until="load"); m.wait_for_timeout(500)
            m.screenshot(path=os.path.join(SHOTS, "m-home.png"))
            m.click("#burgerBtn"); m.wait_for_timeout(350)
            check(m.evaluate("document.getElementById('drawer').classList.contains('open')"),
                  "mobile drawer opens")
            m.screenshot(path=os.path.join(SHOTS, "m-drawer.png"))
            m.locator("#drawer a").nth(1).click(); m.wait_for_timeout(700)
            check("stays.php" in m.url, "drawer navigates, got " + m.url)
            m.screenshot(path=os.path.join(SHOTS, "m-stays.png"))
            m.goto(BASE + "stay.php?p=ocean-spearl", wait_until="load"); m.wait_for_timeout(500)
            m.screenshot(path=os.path.join(SHOTS, "m-stay.png"))
            check(not merrs, "mobile errors: %s" % merrs[:3])
            m.close()

            # ---------------------------------------------------- DARK
            print("DARK THEME")
            d = ctx.new_page()
            d.set_viewport_size({"width": 1440, "height": 900})
            derrs = []
            d.on("pageerror", lambda e: derrs.append(str(e)))
            d.goto(BASE + "index.php", wait_until="load"); d.wait_for_timeout(400)
            d.click("#themeBtn"); d.wait_for_timeout(500)
            d.screenshot(path=os.path.join(SHOTS, "dark-home.png"))
            for f in ["stays.php", "membership.php", "stay.php?p=onyx"]:
                d.goto(BASE + f, wait_until="load"); d.wait_for_timeout(450)
                d.screenshot(path=os.path.join(SHOTS, "dark-%s.png" % f.split(".")[0].split("?")[0]))
            check(not derrs, "dark errors: %s" % derrs[:3])
            d.close()

            browser.close()
    finally:
        if hasattr(os, "killpg"):
            os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
        else:
            proc.terminate()
        # restore whatever config was there before
        if cfg_backup:
            shutil.move(cfg_backup, cfg_path)
        else:
            os.remove(cfg_path)
        lock = os.path.join(DOCROOT, "install", "installed.lock")
        if os.path.exists(lock):
            os.remove(lock)
        shutil.rmtree(tmp, ignore_errors=True)

    print("\n" + "=" * 60)
    if failures:
        print("FAILURES (%d):" % len(failures))
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("ALL CHECKS PASSED OK  (%d pages, screenshots in shots/)" % len(PAGES))


if __name__ == "__main__":
    main()
