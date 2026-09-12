#!/usr/bin/env python3
"""Jollof Living — investor financial projection PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color, HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "Jollof-Living-Investor-Financial-Projections.pdf")
COVER = os.path.join(ROOT, "docs", "investor-cover.jpg")

W, H = A4  # 595.27 x 841.89
GOLD = HexColor("#c9a227")
GOLD2 = HexColor("#e0d3a4")
INK = HexColor("#f2ead2")
MUTED = HexColor("#b8b09a")
DARK = HexColor("#0c0e0b")
DARK2 = HexColor("#141714")
CARD = HexColor("#1a1d18")
LINE = HexColor("#2c2f28")
OK = HexColor("#8fb89a")
WARN = HexColor("#d4a574")

MARGIN = 18 * mm
CX = W / 2


def money(n, dec=1):
    """n in NGN billions -> string."""
    if abs(n) >= 100:
        return f"₦{n:,.0f}bn"
    if abs(n) >= 10:
        return f"₦{n:.1f}bn"
    return f"₦{n:.2f}bn"


def usd(ngn_bn):
    u = ngn_bn * 1000 / 1600  # bn NGN / 1600 = m USD... wait
    # 1 bn NGN = 1e9 / 1600 = 625,000 USD = 0.625m
    m = ngn_bn * 1e9 / 1600 / 1e6
    if m >= 100:
        return f"${m:,.0f}m"
    if m >= 10:
        return f"${m:.0f}m"
    return f"${m:.1f}m"


class Deck:
    def __init__(self):
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        self.c = canvas.Canvas(OUT, pagesize=A4)
        self.c.setTitle("Jollof Living — Investor Financial Projections")
        self.c.setAuthor("Jollof Living")
        self.c.setSubject("3-, 5- and 10-year financial projections for investors")
        self.page = 0

    def bg(self):
        self.c.setFillColor(DARK)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)

    def footer(self, last=False):
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.4)
        self.c.line(MARGIN, 12 * mm, W - MARGIN, 12 * mm)
        self.c.setFillColor(MUTED)
        self.c.setFont("Times-Italic", 7.5)
        self.c.drawString(MARGIN, 7.5 * mm, "Jollof Living  ·  Confidential  ·  Investor discussion materials  ·  September 2026")
        self.c.setFont("Times-Roman", 7.5)
        self.c.drawRightString(W - MARGIN, 7.5 * mm, str(self.page))

    def header(self, kicker, title, sub=None):
        self.c.setFillColor(GOLD)
        self.c.setFont("Times-Italic", 8)
        self.c.drawString(MARGIN, H - 16 * mm, kicker.upper())
        self.c.setStrokeColor(GOLD)
        self.c.setLineWidth(0.6)
        self.c.line(MARGIN, H - 17.5 * mm, MARGIN + 22 * mm, H - 17.5 * mm)
        self.c.setFillColor(INK)
        self.c.setFont("Times-Bold", 20)
        self.c.drawString(MARGIN, H - 28 * mm, title)
        y = H - 34 * mm
        if sub:
            self.c.setFillColor(MUTED)
            self.c.setFont("Times-Italic", 10)
            for line in sub:
                self.c.drawString(MARGIN, y, line)
                y -= 4.2 * mm
        return y - 4 * mm

    def new(self):
        if self.page:
            self.footer()
            self.c.showPage()
        self.page += 1
        self.bg()

    def wrap(self, text, font, size, maxw):
        words = text.split()
        lines, cur = [], ""
        for w in words:
            t = (cur + " " + w).strip()
            if self.c.stringWidth(t, font, size) <= maxw:
                cur = t
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        return lines

    def para(self, x, y, text, maxw, size=9, leading=12, color=None, font="Times-Roman"):
        self.c.setFillColor(color or MUTED)
        self.c.setFont(font, size)
        lines = self.wrap(text, font, size, maxw)
        for ln in lines:
            self.c.drawString(x, y, ln)
            y -= leading
        return y

    def card(self, x, y, w, h):
        self.c.setFillColor(CARD)
        self.c.roundRect(x, y, w, h, 6, fill=1, stroke=0)
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.5)
        self.c.roundRect(x, y, w, h, 6, fill=0, stroke=1)

    def kpi(self, x, y, w, h, label, value, note=""):
        self.card(x, y, w, h)
        self.c.setFillColor(GOLD)
        self.c.setFont("Times-Italic", 7.5)
        self.c.drawString(x + 8, y + h - 14, label.upper())
        self.c.setFillColor(INK)
        self.c.setFont("Times-Bold", 14)
        self.c.drawString(x + 8, y + h - 32, value)
        if note:
            self.c.setFillColor(MUTED)
            self.c.setFont("Times-Roman", 7.5)
            self.c.drawString(x + 8, y + 10, note)

    def table(self, x, y, cols, rows, colw, row_h=16, header=True):
        """cols: list of (title, align) align L or R. rows: list of lists of strings."""
        n = len(cols)
        # header bar
        tw = sum(colw)
        if header:
            self.c.setFillColor(HexColor("#1f231c"))
            self.c.rect(x, y - row_h + 4, tw, row_h, fill=1, stroke=0)
            self.c.setFillColor(GOLD)
            self.c.setFont("Times-Bold", 7.5)
            cx = x
            for i, (t, a) in enumerate(cols):
                if a == "R":
                    self.c.drawRightString(cx + colw[i] - 6, y - 6, t)
                else:
                    self.c.drawString(cx + 6, y - 6, t)
                cx += colw[i]
            y -= row_h
        self.c.setFont("Times-Roman", 8)
        for r, row in enumerate(rows):
            if r % 2 == 0:
                self.c.setFillColor(HexColor("#151814"))
                self.c.rect(x, y - row_h + 4, tw, row_h, fill=1, stroke=0)
            cx = x
            for i, cell in enumerate(row):
                a = cols[i][1]
                self.c.setFillColor(INK if i == 0 else MUTED)
                if i == 0:
                    self.c.setFont("Times-Bold" if str(cell).startswith("Total") or str(cell).startswith("EBITDA") or str(cell).startswith("Net ") else "Times-Roman", 8)
                else:
                    self.c.setFont("Times-Roman", 8)
                if a == "R":
                    self.c.setFillColor(INK)
                    self.c.drawRightString(cx + colw[i] - 6, y - 6, str(cell))
                else:
                    self.c.drawString(cx + 6, y - 6, str(cell))
                cx += colw[i]
            y -= row_h
        return y

    def save(self):
        self.footer()
        self.c.save()


def build():
    d = Deck()
    c = d.c

    # ========== COVER ==========
    d.new()
    if os.path.isfile(COVER):
        img = ImageReader(COVER)
        # cover full page
        iw, ih = img.getSize()
        scale = max(W / iw, H / ih)
        nw, nh = iw * scale, ih * scale
        c.drawImage(img, (W - nw) / 2, (H - nh) / 2, nw, nh, mask="auto")
    # dark overlay
    c.setFillColor(Color(0.04, 0.05, 0.04, alpha=0.62))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("Times-Italic", 10)
    c.drawString(MARGIN, H - 28 * mm, "CONFIDENTIAL  ·  INVESTOR DISCUSSION MATERIALS")
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.7)
    c.line(MARGIN, H - 30 * mm, MARGIN + 38 * mm, H - 30 * mm)
    c.setFillColor(INK)
    c.setFont("Times-Bold", 36)
    c.drawString(MARGIN, H - 52 * mm, "Jollof Living")
    c.setFillColor(GOLD2)
    c.setFont("Times-Italic", 16)
    c.drawString(MARGIN, H - 62 * mm, "Luxury Living, African Soul")
    c.setFillColor(INK)
    c.setFont("Times-Roman", 13)
    c.drawString(MARGIN, 58 * mm, "Three-, five- and ten-year")
    c.setFont("Times-Bold", 18)
    c.drawString(MARGIN, 49 * mm, "Financial projections")
    c.setFillColor(MUTED)
    c.setFont("Times-Roman", 9)
    c.drawString(MARGIN, 38 * mm, "Marketplace  ·  Lagos & Abuja, then West Africa")
    c.drawString(MARGIN, 33 * mm, "September 2026  ·  Figures in Nigerian Naira  ·  USD at ₦1,600")
    c.setFillColor(GOLD)
    c.setFont("Times-Italic", 8)
    c.drawString(MARGIN, 22 * mm, "Not an offer to sell securities. Forward-looking estimates only.")

    # ========== DISCLAIMER / TOC ==========
    d.new()
    y = d.header("01  /  How to read this pack", "Purpose, method and supply targets")
    y = d.para(
        MARGIN, y,
        "This memorandum translates the fee stack already encoded in the Jollof Living product — 12% host commission (hosts keep 88%), 8% guest service fee, 7.5% VAT collected and remitted, ₦15,000 cleaning pass-through, 20% security deposit held in escrow, weekly and monthly length discounts, experiences, gift cards, ₦10,000/₦10,000 referrals and an 8% affiliate commission — into a fundraising-grade three-horizon forecast.",
        W - 2 * MARGIN, 9.5, 13,
    )
    y -= 3 * mm
    y = d.para(
        MARGIN, y,
        "The seed catalogue (12 residences) and the in-product admin badge of “₦412m GMV this month” are demonstration data, not trading history. Year 1 is calendar 2027, the first full operating year after a 2026 launch. USD equivalents use a constant planning rate of ₦1,600 = US$1; they are not a CBN forecast.",
        W - 2 * MARGIN, 9.5, 13,
    )
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 12)
    c.drawString(MARGIN, y, "Supply targets used in this pack (per instruction)")
    y -= 6 * mm
    box_w = (W - 2 * MARGIN - 10 * mm) / 3
    for i, (yr, n, note) in enumerate([
        ("Year 3  ·  2029", "500", "Live, Jollof-verified homes"),
        ("Year 5  ·  2031", "2,200", "Nigeria + Accra scale"),
        ("Year 10  ·  2036", "4,500", "West African network"),
    ]):
        x = MARGIN + i * (box_w + 5 * mm)
        d.kpi(x, y - 28 * mm, box_w, 28 * mm, yr, n + " listings", note)
    y -= 38 * mm
    y = d.para(
        MARGIN, y,
        "These listing counts are more aggressive than a cautious organic path. Occupancy and ADR are held to luxury-realistic levels so GMV does not scale 1:1 with vanity supply. VAT, cleaning fees and deposits are excluded from net revenue. Conservative / base / upside are shown at each horizon; narrative uses the base case.",
        W - 2 * MARGIN, 9.5, 13,
    )
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 12)
    c.drawString(MARGIN, y, "Contents")
    y -= 7 * mm
    toc = [
        "02  Investment thesis",
        "03  Business model and unit economics",
        "04  Three-year plan (to 500 listings)",
        "05  Five-year plan (to 2,200 listings)",
        "06  Ten-year plan (to 4,500 listings)",
        "07  Scenario range, cash and use of funds",
        "08  Risks, governance and what must be true",
    ]
    for t in toc:
        c.setFillColor(GOLD)
        c.circle(MARGIN + 2, y + 2, 1.2, fill=1, stroke=0)
        c.setFillColor(MUTED)
        c.setFont("Times-Roman", 10)
        c.drawString(MARGIN + 8, y, t)
        y -= 6 * mm

    # ========== THESIS ==========
    d.new()
    y = d.header("02  /  Investment thesis", "Why this marketplace, why now")
    bullets = [
        ("Luxury, not mass.", "Jollof Living is built as the escrow-backed home for penthouses, villas and heritage stays in Lagos and Abuja — Ikoyi, VI, Lekki, Banana Island, Eko Atlantic, Maitama — not as a clone of mass Airbnb. Average daily rates in the live catalogue sit at ₦145,000–₦420,000."),
        ("Fees already in the product.", "The 12% + 8% stack (≈20% of lodging before PSP) is live in code, invoices and host dashboards. We are not inventing a take-rate in this memo."),
        ("Trust is the moat.", "KYC, in-person / video inspection, Jollof Verified badges, escrow released only after guest check-in, AI fraud flags and a 24/7 concierge are the reason a host accepts 12% and a guest pays 8%."),
        ("Naira rails, dollar guests.", "Cards, transfer, USSD, Paystack, Flutterwave, Stripe, multi-currency display (NGN/USD/GBP/EUR) and long-stay split pay match how Nigerians and the diaspora actually book."),
        ("Second act is software.", "From Year 4, host SaaS (calendar sync, dynamic pricing, channel manager) lifts blended take-rate without taxing the guest further."),
    ]
    for title, body in bullets:
        c.setFillColor(GOLD)
        c.setFont("Times-Bold", 10)
        c.drawString(MARGIN, y, title)
        y -= 5 * mm
        y = d.para(MARGIN, y, body, W - 2 * MARGIN, 9, 12)
        y -= 4.5 * mm

    y -= 2 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Base-case snapshot")
    y -= 4 * mm
    cols = [(" ", "L"), ("Year 3", "R"), ("Year 5", "R"), ("Year 10", "R")]
    colw = [52 * mm, 42 * mm, 42 * mm, 42 * mm]
    rows = [
        ["Live listings", "500", "2,200", "4,500"],
        ["Occupancy / ADR", "55%  ·  ₦215k", "60%  ·  ₦245k", "64%  ·  ₦310k"],
        ["GMV", "₦23.2bn  ·  $14.5m", "₦124.5bn  ·  $78m", "₦348bn  ·  $218m"],
        ["Net revenue", "₦4.65bn", "₦25.9bn", "₦76.0bn"],
        ["EBITDA", "₦1.60bn", "₦15.1bn", "₦31.5bn"],
        ["Net income", "₦1.12bn", "₦10.8bn", "₦22.0bn"],
        ["EBITDA margin (on net rev.)", "34%", "58%", "41%"],
    ]
    d.table(MARGIN, y, cols, rows, colw, 15)

    # ========== UNIT ECO ==========
    d.new()
    y = d.header("03  /  Unit economics", "A 3-night Instant Book at ₦185,000 ADR")
    y = d.para(
        MARGIN, y,
        "Worked example using the server-side Pricing engine (Onyx-class penthouse, no add-ons, no promo). Cleaning and VAT are pass-through. Host WHT (~5%) is a host cost, not company revenue. PSP assumed 1.5% of guest collections once gateways are live.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 5 * mm
    cols = [("Line", "L"), ("₦", "R"), ("Treatment", "L")]
    colw = [70 * mm, 40 * mm, 68 * mm]
    rows = [
        ["Lodging  3 × 185,000", "555,000", "GMV"],
        ["Cleaning fee", "15,000", "Pass-through"],
        ["Guest service fee  8%", "44,400", "Platform revenue"],
        ["VAT  7.5%", "46,080", "Remitted to FIRS"],
        ["Guest total (ex-deposit)", "660,480", "Collected"],
        ["Host commission  12%", "66,600", "Platform revenue"],
        ["Host payout  88%", "488,400", "Weekly escrow release"],
        ["Platform revenue", "111,000", "20.0% of lodging"],
        ["PSP  1.5% of guest total", "(9,907)", "Cost of net revenue"],
        ["Contribution (pre-CAC)", "~101,000", "18.2% of lodging"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14.5)
    y -= 8 * mm
    y = d.para(
        MARGIN, y,
        "Rule of thumb used in the forecasts: net take after PSP, before VAT/WHT, ≈ 17.5% of lodging GMV in Years 1–3, 18.5% by Year 5 as experiences attach, 19.5% by Year 10 with host SaaS. Experiences (lagoon cruise ₦85k, private chef from ₦55k) are modelled at a 25% platform take after operator payout. Length discounts (−12% weekly, −25% monthly) are already netted into ADR.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 7 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Revenue stack")
    y -= 5 * mm
    mix = [
        ("Host commission 12%", "Core. Defended; we do not buy supply by cutting it."),
        ("Guest service 8%", "Concierge, escrow, support, app. Transparent at checkout."),
        ("Experiences 25% take", "Chefs, cruises, spa — attach rate 8% → 32% over the decade."),
        ("Host SaaS", "From Y4, ₦8k–₦25k per listing per month for tools already in the dashboard."),
        ("Corporate", "5% of GMV in Y1 → 25% by Y10; longer stays, lower CAC, policy billing."),
    ]
    for t, b in mix:
        c.setFillColor(GOLD)
        c.setFont("Times-Bold", 9)
        c.drawString(MARGIN, y, t)
        c.setFillColor(MUTED)
        c.setFont("Times-Roman", 9)
        c.drawString(MARGIN + 52 * mm, y, b)
        y -= 5.5 * mm

    y -= 4 * mm
    y = d.para(
        MARGIN, y,
        "By Year 5, guest LTV on a loyal luxury traveller is ~₦535k versus ~₦12k CAC. Host LTV is an order of magnitude larger than ₦250–350k onboarding (photography, inspection, CSM). The constraint is verified supply quality, not paid acquisition.",
        W - 2 * MARGIN, 9, 12,
    )

    # ========== YEAR 3 ==========
    d.new()
    y = d.header(
        "04  /  Three-year plan  ·  2027–2029",
        "Prove the machine — 500 live homes",
        ["Job: Lagos–Abuja density, live payments and escrow, incident rate <0.5%, EBITDA-positive.",
         "Do not open a third country until occupancy holds above 50% in peak months."],
    )
    cols = [("", "L"), ("2027  Y1", "R"), ("2028  Y2", "R"), ("2029  Y3", "R")]
    colw = [52 * mm, 42 * mm, 42 * mm, 42 * mm]
    rows = [
        ["Ending live listings", "40", "180", "500"],
        ["Occupancy", "42%", "50%", "55%"],
        ["ADR (after length mix)", "₦185,000", "₦200,000", "₦215,000"],
        ["Nights sold", "6,130", "32,850", "100,375"],
        ["Stay GMV", "₦1.13bn", "₦6.57bn", "₦21.58bn"],
        ["Experience GMV", "₦0.05bn", "₦0.42bn", "₦1.55bn"],
        ["Total GMV", "₦1.41bn", "₦7.20bn", "₦23.15bn"],
        ["GMV (USD)", "$0.9m", "$4.5m", "$14.5m"],
        ["Net revenue", "₦0.24bn", "₦1.38bn", "₦4.65bn"],
        ["Gross profit", "₦0.20bn", "₦1.10bn", "₦3.70bn"],
        ["EBITDA", "(₦0.03bn)", "₦0.28bn", "₦1.60bn"],
        ["Net income", "(₦0.04bn)", "₦0.18bn", "₦1.12bn"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14.2)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "Year 1 remains a controlled loss: photography unit, KYC operations, PSP go-live. Year 2 turns EBITDA-positive on the original 180-home run-rate; Year 3’s jump to 500 homes is a supply push (superhost programme, professional photography, Lekki/Ikoyi density) funded by a Series A, not by cutting take-rate. People scale to ~70 FTE by Y3. Affiliate + referral credits stay inside 8% of referred GMV.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Y3 P&L (base, ₦ million)")
    y -= 4 * mm
    cols = [(" ", "L"), ("Amount", "R"), ("% net rev.", "R")]
    colw = [80 * mm, 50 * mm, 48 * mm]
    rows = [
        ["Host commission", "2,590", "56%"],
        ["Guest service fee", "1,726", "37%"],
        ["Experiences take", "388", "8%"],
        ["Other", "46", "1%"],
        ["Net revenue", "4,650", "100%"],
        ["PSP, affiliates, trust & fraud", "(950)", "20%"],
        ["Gross profit", "3,700", "80%"],
        ["People, marketing, tech, G&A", "(2,100)", "45%"],
        ["EBITDA", "1,600", "34%"],
        ["Tax (effective ~25%)", "(400)", ""],
        ["Net income", "1,120", "24%"],
    ]
    d.table(MARGIN, y, cols, rows, colw, 13.8)

    # ========== YEAR 5 ==========
    d.new()
    y = d.header(
        "05  /  Five-year plan  ·  through 2031",
        "Category brand — 2,200 live homes",
        ["Nigeria remains 75%+ of GMV. Accra is live. Host SaaS is a real line.",
         "Corporate mix 18% of GMV to flatten Detty December seasonality."],
    )
    cols = [("", "L"), ("Y3  2029", "R"), ("Y4  2030", "R"), ("Y5  2031", "R")]
    colw = [52 * mm, 42 * mm, 42 * mm, 42 * mm]
    rows = [
        ["Live listings", "500", "1,100", "2,200"],
        ["of which Accra", "0", "80", "350"],
        ["Occupancy", "55%", "58%", "60%"],
        ["ADR", "₦215,000", "₦230,000", "₦245,000"],
        ["Nights sold", "100,375", "232,870", "481,800"],
        ["Stay GMV", "₦21.6bn", "₦53.6bn", "₦118.0bn"],
        ["Experience GMV", "₦1.6bn", "₦3.6bn", "₦6.5bn"],
        ["Total GMV", "₦23.2bn", "₦57.2bn", "₦124.5bn"],
        ["GMV (USD)", "$14.5m", "$36m", "$78m"],
        ["Net revenue", "₦4.65bn", "₦11.4bn", "₦25.9bn"],
        ["Host SaaS", "—", "₦0.18bn", "₦0.40bn"],
        ["EBITDA", "₦1.60bn", "₦5.4bn", "₦15.1bn"],
        ["Net income", "₦1.12bn", "₦3.8bn", "₦10.8bn"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "2,200 homes at Year 5 is a land-grab: roughly 4× the three-year base and equivalent to a dense luxury footprint across Lagos, Abuja, Port Harcourt and Accra. Occupancy is capped at 60% so the model does not assume every new key is filled. Channel manager (Airbnb / Booking.com / VRBO sync) is used to fill shoulder nights, not to become a channel reseller. Cumulative 2027–2031 GMV ≈ ₦210bn (~US$131m); cumulative EBITDA ≈ ₦24bn.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    bw = (W - 2 * MARGIN - 8 * mm) / 2
    d.kpi(MARGIN, y - 32 * mm, bw, 32 * mm, "Y5 net revenue", "₦25.9bn", "≈ US$16.2m  ·  20.8% of GMV")
    d.kpi(MARGIN + bw + 8 * mm, y - 32 * mm, bw, 32 * mm, "Y5 EBITDA", "₦15.1bn", "58% of net revenue  ·  US$9.4m")
    y -= 40 * mm
    y = d.para(
        MARGIN, y,
        "High Y5 EBITDA margin reflects marketplace operating leverage once photography and KYC are process, not art. If listing quality slips, occupancy — not opex — is the first thing that breaks; the conservative case (next section) cuts supply growth, not fees.",
        W - 2 * MARGIN, 9, 12,
    )

    # ========== YEAR 10 ==========
    d.new()
    y = d.header(
        "06  /  Ten-year plan  ·  through 2036",
        "West African operating system — 4,500 homes",
        ["Nigeria profit engine. Ghana, Côte d’Ivoire and Kenya as growth.",
         "Fractional / securities products are excluded until licensed."],
    )
    cols = [("", "L"), ("Y5", "R"), ("Y7", "R"), ("Y10", "R")]
    colw = [52 * mm, 42 * mm, 42 * mm, 42 * mm]
    rows = [
        ["Live listings", "2,200", "3,200", "4,500"],
        ["Countries / cities", "2 / 6", "3 / 9", "4 / 12"],
        ["Occupancy", "60%", "62%", "64%"],
        ["ADR", "₦245,000", "₦275,000", "₦310,000"],
        ["Nights sold", "481,800", "724,000", "1,051,200"],
        ["Stay GMV", "₦118bn", "₦199bn", "₦326bn"],
        ["Experience GMV", "₦6.5bn", "₦13bn", "₦22bn"],
        ["Total GMV", "₦124.5bn", "₦214bn", "₦348bn"],
        ["GMV (USD)", "$78m", "$134m", "$218m"],
        ["Net revenue", "₦25.9bn", "₦44bn", "₦76.0bn"],
        ["of which SaaS / tools", "₦0.4bn", "₦1.8bn", "₦4.5bn"],
        ["EBITDA", "₦15.1bn", "₦21.5bn", "₦31.5bn"],
        ["EBITDA margin", "58%", "49%", "41%"],
        ["Net income", "₦10.8bn", "₦15.1bn", "₦22.0bn"],
        ["FTE", "120", "175", "240"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 13.6)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "Margin compresses from Y5 to Y10 as multi-country compliance, brand and concierge scale. That is intentional: we would rather hold luxury NPS than run a 60% EBITDA story on neglected markets. Cumulative 2027–2036 GMV ≈ ₦1.55tn (~US$0.97bn, undiscounted Naira-nominal). At an 18% Naira discount rate, Year-10 EBITDA of ₦31.5bn is still a substantial franchise if trust holds.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Illustrative enterprise value (not an offer)")
    y -= 4 * mm
    cols = [("", "L"), ("Y3", "R"), ("Y5", "R"), ("Y10", "R")]
    colw = [70 * mm, 36 * mm, 36 * mm, 36 * mm]
    rows = [
        ["EBITDA (₦bn)", "1.60", "15.1", "31.5"],
        ["EV at 10× EBITDA (₦bn)", "16", "151", "315"],
        ["EV (US$m)", "~10", "~94", "~197"],
        ["EV at 4× GMV (US$m)", "~58", "~311", "~870"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14)
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "Raise on Year-3 GMV quality (repeat rate, verified supply, incidents), not on Year-10 GMV. Early EV is option value on execution. Mass-market comps (3–6× GMV) overstate us if we stay luxury-narrow; profitable marketplace comps (10–18× EBITDA) are the better lens from Year 5.",
        W - 2 * MARGIN, 9, 12,
    )

    # ========== SCENARIOS / CASH ==========
    d.new()
    y = d.header("07  /  Scenarios, cash and capital", "Range, float and use of funds")
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Horizon exits")
    y -= 4 * mm
    cols = [("", "L"), ("Conservative", "R"), ("Base", "R"), ("Upside", "R")]
    colw = [48 * mm, 44 * mm, 44 * mm, 44 * mm]
    rows = [
        ["Y3 listings / GMV", "280  ·  ₦11bn", "500  ·  ₦23bn", "700  ·  ₦34bn"],
        ["Y3 EBITDA", "₦0.35bn", "₦1.60bn", "₦2.6bn"],
        ["Y5 listings / GMV", "1,100  ·  ₦55bn", "2,200  ·  ₦125bn", "3,000  ·  ₦175bn"],
        ["Y5 EBITDA", "₦4.2bn", "₦15.1bn", "₦23bn"],
        ["Y10 listings / GMV", "2,400  ·  ₦160bn", "4,500  ·  ₦348bn", "6,500  ·  ₦520bn"],
        ["Y10 EBITDA", "₦12bn", "₦31.5bn", "₦52bn"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14.5)
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Capital plan (base)")
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "2026 friends-and-family ₦180m to finish payments, KYC and the first 25 homes. 2027 seed ₦1.2bn (~US$0.75m) for the photography unit and guest CAC. 2029 Series A ₦8.0bn (~US$5.0m) to underwrite the 500-home Year-3 target and Accra. 2032 Series B ₦24bn (~US$15m) only if multi-country cash conversion lags; the base case can fund Y5–Y10 from operations after A. Escrow is guest-funded. Weekly host payouts versus capture-at-booking create 7–14 days of positive float — not spendable operating cash. Client money is segregated.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Use of Series A (illustrative)")
    y -= 4 * mm
    cols = [("Use", "L"), ("₦bn", "R"), ("Why", "L")]
    colw = [48 * mm, 28 * mm, 102 * mm]
    rows = [
        ["Verified supply", "3.2", "Inspections, photography, host CSM to 500 then 2,200"],
        ["Trust & payments", "1.1", "PSP, escrow ops, insurance float, fraud"],
        ["Demand", "1.8", "Brand, Detty December, diaspora, corporate sales"],
        ["Product & AI", "0.9", "App, locks, concierge, channel manager"],
        ["Accra launch", "0.6", "Entity, people, first 80–100 homes"],
        ["Reserve", "0.4", "18-month runway buffer"],
        ["Total", "8.0", ""],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14)
    y -= 6 * mm
    y = d.para(
        MARGIN, y,
        "Sensitivity at Year 5 base: occupancy −8 pts ≈ EBITDA −28%; ADR −10% ≈ −22%; take-rate −2 pts ≈ −18%; listings −20% ≈ −24%. Naira −30% vs USD leaves Naira P&L intact and cuts USD EBITDA 30%. Biggest lever is live verified listings × occupancy.",
        W - 2 * MARGIN, 9, 12,
    )

    # ========== RISKS ==========
    d.new()
    y = d.header("08  /  Risks, governance, milestones", "What must be true")
    risks = [
        ("Naira path", "ADR is Naira-quoted. Report and raise in both NGN and USD."),
        ("Supply quality at 500 then 2,200", "If verification slips, the brand dies. Cap monthly listings onboarded to inspection capacity."),
        ("Airbnb price war", "Defend with escrow and concierge. Do not cut the 12%."),
        ("Payments / CBN", "Escrow via licensed PSP partners; no assumption of a bank licence."),
        ("Seasonality", "Detty December can exceed 30% of annual GMV without corporate and long-stay mix."),
        ("Trust event", "One safety failure can freeze supply for a year — the conservative case."),
        ("Execution of 4,500 keys", "This is a land-grab. Governance, IFRS and a published annual trust report are non-negotiable from Year 3."),
    ]
    for t, b in risks:
        c.setFillColor(GOLD)
        c.setFont("Times-Bold", 9)
        c.drawString(MARGIN, y, t)
        y -= 4.4 * mm
        y = d.para(MARGIN, y, b, W - 2 * MARGIN, 9, 11.5)
        y -= 3.2 * mm

    y -= 2 * mm
    c.setFillColor(INK)
    c.setFont("Times-Bold", 11)
    c.drawString(MARGIN, y, "Milestones")
    y -= 5 * mm
    miles = [
        ("End Y1", "Live Paystack/Flutterwave + real escrow; ≥40 verified homes; ≥4.8★; EBITDA loss < ₦50m."),
        ("End Y3", "500 homes; occupancy ≥55%; repeat guests ≥20% of nights; EBITDA ≥ ₦1.5bn."),
        ("End Y5", "2,200 homes; Accra ≥15% of GMV; SaaS live; net take ≥18%; category brand in Lagos luxury."),
        ("Y10", "4,500 homes across four countries; still luxury-narrow; net revenue ≥ ₦70bn; independent board, IFRS, segregated client money."),
    ]
    for t, b in miles:
        c.setFillColor(GOLD)
        c.setFont("Times-Bold", 9)
        c.drawString(MARGIN, y, t)
        c.setFillColor(MUTED)
        c.setFont("Times-Roman", 9)
        d.para(MARGIN + 22 * mm, y, b, W - 2 * MARGIN - 22 * mm, 9, 11.5)
        y -= 9 * mm

    y -= 2 * mm
    y = d.para(
        MARGIN, y,
        "Method: catalogue ADR, 12%/8%/7.5%/₦15k cleaning/20% deposit/88% host payout/8% affiliate/experience prices are taken from the Jollof Living application. Listing counts in this pack are the investor targets you set. Occupancy, CAC and headcount are management assumptions for a post-launch luxury marketplace, not historicals. Tax simplified at 25% effective from first profit year.",
        W - 2 * MARGIN, 8.5, 11.5,
    )
    y -= 10 * mm
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.6)
    c.line(MARGIN, y, MARGIN + 28 * mm, y)
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Times-Italic", 12)
    c.drawString(MARGIN, y, "Luxury Living, African Soul")
    y -= 6 * mm
    c.setFillColor(MUTED)
    c.setFont("Times-Roman", 8)
    c.drawString(MARGIN, y, "Jollof Living  ·  September 2026  ·  For authorised counterparties only.")

    d.save()
    print("Wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    build()
