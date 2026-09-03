#!/usr/bin/env python3
"""Jollof Living — multi-page site generator.

Builds a REAL multi-page website from a shared shell template:
  src/shell.html              -> chrome (header/drawer/footer/overlays)
  src/styles.css              -> design system           -> assets/css/site.css
  src/*.js (ordered bundle)   -> app logic               -> assets/js/site.js
  assets/img/*                -> image registry          -> assets/js/assets.js

Emits one HTML file per page (index.html, stays.html, stay-onyx.html,
admin.html, ...) — each with its own <title>, meta description and
<main id="view"> content rendered by the bundle.

Run:  python3 build.py
"""
import base64, io, json, os, re
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
IMG = os.path.join(ROOT, "assets", "img")
CACHE = os.path.join(IMG, "assets-cache.json")
ASSETS_JS = os.path.join(ROOT, "assets", "js")
ASSETS_CSS = os.path.join(ROOT, "assets", "css")

PNG_KEYS = ["logo-light", "logo-dark", "wordmark-light", "wordmark-dark"]
JPG_KEYS = ["hero", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8",
            "p9", "p10", "p11", "p12",
            "exp-boat", "exp-chef", "exp-tour", "exp-spa"]
JS_ORDER = ["data.js", "ui.js", "pages-discovery.js", "pages-booking.js",
            "pages-comm.js", "pages-host.js", "pages-misc.js", "app.js"]

DESC_DEFAULT = ("Jollof Living is a premium platform for luxurious high-end apartments in "
                "Lagos & Abuja - exclusive short-term and long-term stays, inspired by the "
                "vibrant culture and warmth of Nigeria.")


# ------------------------------------------------------------------ assets ----
def build_assets_js():
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    assets, missing = {}, []
    for k in PNG_KEYS + JPG_KEYS:
        ext = "png" if k in PNG_KEYS else "jpg"
        p = os.path.join(IMG, f"{k}.{ext}")
        if not os.path.exists(p):
            missing.append(k); print("  !! missing:", p); continue
        mt = os.path.getmtime(p)
        e = cache.get(k, {})
        if e.get("mtime") == mt and e.get("b64"):
            assets[k] = e["b64"]
        else:
            im = Image.open(p)
            buf = io.BytesIO()
            if ext == "png":
                im.convert("RGBA").save(buf, "PNG", optimize=True)
            else:
                im = im.convert("RGB")
                w, h = im.size
                if w > 1280:
                    im = im.resize((1280, int(h * 1280 / w)), Image.LANCZOS)
                im.save(buf, "JPEG", quality=78, optimize=True, progressive=True)
            assets[k] = base64.b64encode(buf.getvalue()).decode()
            cache[k] = {"mtime": mt, "b64": assets[k]}
    json.dump(cache, open(CACHE, "w"))
    if missing:
        raise SystemExit("missing images: %s" % missing)
    os.makedirs(ASSETS_JS, exist_ok=True)
    open(os.path.join(ASSETS_JS, "assets.js"), "w", encoding="utf-8").write(
        "/* generated: image registry */\nwindow.ASSETS=" + json.dumps(assets) + ";")
    return len(assets)


def build_css():
    css = open(os.path.join(SRC, "styles.css"), encoding="utf-8").read()
    os.makedirs(ASSETS_CSS, exist_ok=True)
    open(os.path.join(ASSETS_CSS, "site.css"), "w", encoding="utf-8").write(css)
    return len(css)


def build_site_js():
    parts = []
    for f in JS_ORDER:
        p = os.path.join(SRC, f)
        if not os.path.exists(p):
            raise SystemExit("missing module: " + p)
        parts.append("/* ===== %s ===== */\n" % f + open(p, encoding="utf-8").read())
    bundle = "\n\n".join(parts).replace("</script", "<\\/script")
    os.makedirs(ASSETS_JS, exist_ok=True)
    open(os.path.join(ASSETS_JS, "site.js"), "w", encoding="utf-8").write(bundle)
    return len(bundle)


# ------------------------------------------------------------------ pages ----
def url_for(path):
    """Mirror of the JS URL() helper: internal route -> real .html file."""
    p, qs = path, ""
    if "?" in p:
        p, qs = p.split("?", 1); qs = "?" + qs
    seg = [s for s in p.split("/") if s]
    s1, s2 = (seg + ["", ""])[:2]
    if s1 == "stay" and s2: return f"stay-{s2}.html{qs}"
    if s1 == "booking" and s2: return f"booking-{s2}.html{qs}"
    if s1 == "neighborhood" and s2: return f"neighborhood-{s2}.html{qs}"
    if s1 == "blog" and s2: return f"blog-{s2}.html{qs}"
    if s1 == "confirm" and s2: return f"confirm.html?ref={s2}"
    simple = {
        "": "index.html", "index": "index.html", "stays": "stays.html",
        "map": "map.html", "collections": "collections.html",
        "experiences": "experiences.html", "reviews": "reviews.html",
        "blog": "blog.html", "help": "help.html", "membership": "membership.html",
        "giftcards": "giftcards.html", "referral": "referral.html",
        "business": "business.html", "about": "about.html", "app": "app.html",
        "future": "future.html", "concierge": "concierge.html",
        "messages": "messages.html", "notifications": "notifications.html",
        "trips": "trips.html", "wishlist": "wishlist.html", "compare": "compare.html",
        "account": "account.html", "auth": "auth.html", "host": "host.html",
        "host/onboarding": "host-onboarding.html", "host/dashboard": "host-dashboard.html",
        "payments": "payments.html", "admin": "admin.html",
        "admin-login": "admin-login.html", "404": "404.html",
        "confirm": "confirm.html",
    }
    return simple.get(p, simple.get("/" + p, "404.html")) + qs


def slug_read(pattern):
    d = open(os.path.join(SRC, "data.js"), encoding="utf-8").read()
    m = re.search(pattern, d, re.S)
    return re.findall(r'id:"([a-z0-9-]+)"', m.group(1)) if m else []


def build_page_list():
    d = open(os.path.join(SRC, "data.js"), encoding="utf-8").read()
    pblock = re.search(r'const PROPERTIES = \[(.*?)\n\];', d, re.S)
    props = (re.findall(r'id:"([a-z0-9-]+)", \s*name:"([^"]+)"', pblock.group(1))
             if pblock else [])
    blogs = [("jollof-100", "Jollof 100"), ("escrow-explained", "Escrow Explained")]
    blogs = [(s, s.replace("-", " ").title()) for s in re.findall(r'slug:"([^"]+)"', d)]
    neighs = slug_read(r'const NEIGHBORHOODS = \[(.*?)\n\];')

    # (file, page_id, title, description)
    pages = []
    for pid, name in props:
        pages.append((f"stay-{pid}.html", "stay-" + pid,
                      f"{name} - Luxury Stay | Jollof Living",
                      f"{name}: a premium residence in Lagos or Abuja. Instant booking, escrow payments, 360 tour and concierge."))
        pages.append((f"booking-{pid}.html", "booking-" + pid,
                      f"Complete your reservation - {name} | Jollof Living",
                      f"Secure checkout for {name} - split payments, promo codes and escrow protection."))
    for slug, title in blogs:
        pages.append((f"blog-{slug}.html", "blog-" + slug,
                      f"{title} | The Journal - Jollof Living",
                      "Journal article from Jollof Living."))
    for nid in neighs:
        pages.append((f"neighborhood-{nid}.html", "neighborhood-" + nid,
                      f"{nid.replace('-', ' ').title()} - Neighbourhood Guide | Jollof Living",
                      "Insider's guide: restaurants, nightlife, safety tips and transport."))

    T = {
        "index": ("Jollof Living - Luxury Living, African Soul",
                  "Premium luxury apartments in Lagos & Abuja - exclusive short-term and long-term stays with concierge, escrow payments and AI."),
        "stays": ("The Collection - Luxury Stays | Jollof Living",
                  "Browse exclusive residences across Lekki, Victoria Island, Ikoyi, Banana Island and Abuja - filters, map and instant booking."),
        "map": ("Explore the Map | Jollof Living",
                "Interactive map of every Jollof Living residence in Lagos & Abuja with live nightly rates."),
        "collections": ("Curated Collections | Jollof Living",
                        "Waterfront escapes, sky penthouses, Abuja executive, heritage homes, romantic retreats and family villas."),
        "experiences": ("Experiences | Jollof Living",
                        "Boat cruises, private chefs, spa rituals, art tours, airport transfers, event hosting and VIP shopping."),
        "reviews": ("Reviews | Jollof Living",
                    "Verified guest reviews, AI summaries and the platform rules that keep them honest."),
        "blog": ("The Journal | Jollof Living",
                 "Travel guides, culture pieces and stories from the Jollof Living editorial desk."),
        "help": ("Help Centre | Jollof Living",
                 "Answers, dispute support, emergency assistance and 24/7 live help."),
        "membership": ("Jollof Club - Bronze to Platinum | Jollof Living",
                       "Earn Jollof Points on every stay, climb tiers, redeem rewards and gift cards."),
        "giftcards": ("Gift Cards | Jollof Living",
                      "Digital gift cards delivered by email or WhatsApp - never expire."),
        "referral": ("Refer & Earn - Give N10,000, Get N10,000 | Jollof Living",
                     "The most generous referral in Nigerian travel."),
        "business": ("Jollof for Business | Jollof Living",
                     "Corporate stays with centralized billing, PO support and travel policy enforcement."),
        "about": ("About Jollof Living - Luxury Living, African Soul",
                  "The story, standards and safeguards behind Nigeria's premium stay platform."),
        "app": ("Mobile App | Jollof Living",
                "Keyless check-in, live messaging, wallet passes and voice booking."),
        "future": ("Roadmap | Jollof Living",
                   "Live product roadmap - what's shipping, what's building, what's dreaming."),
        "concierge": ("Jollof Concierge - AI, 24/7 | Jollof Living",
                      "Ask about stays, prices, itineraries, transfers and chefs - in English, Pidgin, Yoruba, Hausa, Igbo or French."),
        "messages": ("Messages | Jollof Living", "Real-time chat with hosts, support and Jollof."),
        "notifications": ("Notifications | Jollof Living", "Booking alerts, price drops and promotions."),
        "trips": ("My Trips | Jollof Living",
                  "Every reservation, request and stay in one place - check-in codes, modify, cancel, review, invoices."),
        "wishlist": ("Wishlist | Jollof Living", "Named lists, price-drop alerts and sharing."),
        "compare": ("Compare Residences | Jollof Living",
                    "Side-by-side pricing, ratings and amenities - up to 3 residences."),
        "account": ("My Account - Adebayo | Jollof Living", "KYC, verification, profile, security and preferences."),
        "auth": ("Sign In | Jollof Living", "Email, phone or social - onboarding takes 90 seconds."),
        "host": ("Host with Jollof Living",
                 "List your residence, keep 88% - photography, pricing intelligence, guest screening and payouts handled."),
        "host-onboarding": ("Listing Wizard | Jollof Living",
                            "Guided step-by-step listing creation - save and return anytime."),
        "host-dashboard": ("Host Dashboard | Jollof Living",
                           "Earnings, occupancy, calendar, pricing, AI tools, co-hosts and payouts."),
        "payments": ("Payments & Payouts | Jollof Living",
                     "Invoices for guests, earnings and payouts for hosts - NGN, USD, GBP, EUR."),
        "admin": ("Back Office | Jollof Living",
                  "Platform operations - GMV, moderation, users, campaigns, fraud AI, CMS and audit. Restricted to the ops team."),
        "admin-login": ("Back Office Sign In | Jollof Living",
                        "Restricted sign-in for the Jollof Living platform operations console."),
        "404": ("Page Not Found | Jollof Living", "This address doesn't exist - yet."),
        "confirm": ("Booking Confirmed | Jollof Living",
                    "Your reservation is confirmed - invoice, check-in details and points earned."),
    }
    simple = {
        "index.html": "index", "stays.html": "stays", "map.html": "map",
        "collections.html": "collections", "experiences.html": "experiences",
        "reviews.html": "reviews", "blog.html": "blog", "help.html": "help",
        "membership.html": "membership", "giftcards.html": "giftcards",
        "referral.html": "referral", "business.html": "business", "about.html": "about",
        "app.html": "app", "future.html": "future", "concierge.html": "concierge",
        "messages.html": "messages", "notifications.html": "notifications",
        "trips.html": "trips", "wishlist.html": "wishlist", "compare.html": "compare",
        "account.html": "account", "auth.html": "auth", "host.html": "host",
        "host-onboarding.html": "host-onboarding",
        "host-dashboard.html": "host-dashboard", "payments.html": "payments",
        "admin.html": "admin", "admin-login.html": "admin-login",
        "404.html": "404", "confirm.html": "confirm",
    }
    for fname, pid in simple.items():
        pages.append((fname, pid, T[pid][0], T[pid][1]))
    return pages


def main():
    print("· assets.js ...")
    n = build_assets_js()
    print(f"  {n} images")
    print("· site.css ...")
    build_css()
    print("· site.js ...")
    build_site_js()

    shell = open(os.path.join(SRC, "shell.html"), encoding="utf-8").read()
    if "{{TITLE}}" not in shell or "{{PAGE}}" not in shell:
        raise SystemExit("shell markers missing")

    wanted = {f for f, *_ in build_page_list()}
    for f in os.listdir(ROOT):
        if f.endswith(".html") and f not in wanted:
            os.remove(os.path.join(ROOT, f))
            print("  removed stale:", f)

    written, seen = 0, set()
    for fname, page_id, title, desc in build_page_list():
        if fname in seen:
            continue
        seen.add(fname)
        html = shell.replace("{{TITLE}}", title)
        html = html.replace("{{DESC}}", desc or DESC_DEFAULT)
        html = html.replace("{{PAGE}}", page_id)
        html = re.sub(r'href="#/([^"]*)"',
                      lambda m: 'href="%s"' % url_for(m.group(1)), html)
        open(os.path.join(ROOT, fname), "w", encoding="utf-8").write(html)
        written += 1
    total = sum(os.path.getsize(os.path.join(ROOT, f))
                for f in os.listdir(ROOT) if f.endswith(".html"))
    print(f"OK generated {written} pages | html total {total/1e6:.1f} MB")


if __name__ == "__main__":
    main()
