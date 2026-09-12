#!/usr/bin/env python3
"""Jollof Living — confidential acquisition proposal PDF."""
import importlib.util
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color, HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INV = os.path.join(ROOT, "tools", "build_investor_pdf.py")
OUT = os.path.join(ROOT, "docs", "Jollof-Living-Acquisition-Proposal.pdf")
COVER = os.path.join(ROOT, "docs", "investor-cover.jpg")

spec = importlib.util.spec_from_file_location("jl_inv", INV)
inv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inv)

W, H = A4
GOLD, GOLD2, INK, MUTED, DARK, CARD, LINE = (
    inv.GOLD, inv.GOLD2, inv.INK, inv.MUTED, inv.DARK, inv.CARD, inv.LINE
)
MARGIN = inv.MARGIN


class Deck(inv.Deck):
    def __init__(self):
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        self.c = canvas.Canvas(OUT, pagesize=A4)
        self.c.setTitle("Jollof Living — Confidential Acquisition Proposal")
        self.c.setAuthor("Jollof Living")
        self.c.setSubject("Proposal to acquire 90% of Jollof Living at 50% of Year-5 worth; founders retain 10%")
        self.page = 0

    def footer(self, last=False):
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.4)
        self.c.line(MARGIN, 12 * mm, W - MARGIN, 12 * mm)
        self.c.setFillColor(MUTED)
        self.c.setFont("Body-Italic", 7.5)
        self.c.drawString(
            MARGIN, 7.5 * mm,
            "Jollof Living  ·  Confidential  ·  Acquisition proposal  ·  September 2026",
        )
        self.c.setFont("Body", 7.5)
        self.c.drawRightString(W - MARGIN, 7.5 * mm, str(self.page))


def build():
    d = Deck()
    c = d.c

    # COVER
    d.new()
    if os.path.isfile(COVER):
        img = ImageReader(COVER)
        iw, ih = img.getSize()
        scale = max(W / iw, H / ih)
        nw, nh = iw * scale, ih * scale
        c.drawImage(img, (W - nw) / 2, (H - nh) / 2, nw, nh, mask="auto")
    c.setFillColor(Color(0.04, 0.05, 0.04, alpha=0.64))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("Body-Italic", 10)
    c.drawString(MARGIN, H - 28 * mm, "CONFIDENTIAL  ·  ACQUISITION PROPOSAL")
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.7)
    c.line(MARGIN, H - 30 * mm, MARGIN + 42 * mm, H - 30 * mm)
    c.setFillColor(INK)
    c.setFont("Body-Bold", 36)
    c.drawString(MARGIN, H - 52 * mm, "Jollof Living")
    c.setFillColor(GOLD2)
    c.setFont("Body-Italic", 16)
    c.drawString(MARGIN, H - 62 * mm, "Luxury Living, African Soul")
    c.setFillColor(INK)
    c.setFont("Body", 13)
    c.drawString(MARGIN, 62 * mm, "Proposal for the acquisition of")
    c.setFont("Body-Bold", 18)
    c.drawString(MARGIN, 53 * mm, "90% of the company")
    c.setFillColor(MUTED)
    c.setFont("Body", 9.5)
    c.drawString(MARGIN, 42 * mm, "Cash consideration equal to 50% of Year-5 worth  ·  Founders retain 10%")
    c.drawString(MARGIN, 37 * mm, "September 2026  ·  Naira figures  ·  USD at ₦1,600  ·  Anchored to the investor projections")
    c.setFillColor(GOLD)
    c.setFont("Body-Italic", 8)
    c.drawString(MARGIN, 22 * mm, "Not an offer to sell securities. Subject to due diligence, SPA and board approval.")

    # 01 ASK
    d.new()
    y = d.header(
        "01  /  The ask",
        "Deal at a glance",
        ["Anchored to the base-case Year-5 enterprise value in the September 2026 projections pack."],
    )
    y = d.para(
        MARGIN, y,
        "Jollof Living invites a single strategic or financial buyer to acquire a controlling interest now, priced as a deliberate discount to the platform the buyer would otherwise have to build by 2031. The headline Year-5 worth is 10× Year-5 EBITDA on the management case: ₦15.1bn × 10 = ₦151bn (≈ US$94m). This proposal asks for half of that worth in cash at closing, while the founding shareholders retain a 10% fully diluted stake that rides with the buyer to Year 5 and beyond.",
        W - 2 * MARGIN, 9.5, 13,
    )
    y -= 6 * mm
    bw = (W - 2 * MARGIN - 10 * mm) / 3
    d.kpi(MARGIN, y - 32 * mm, bw, 32 * mm, "Year-5 worth (base)", "₦151bn", "US$94m  ·  10× Y5 EBITDA")
    d.kpi(MARGIN + bw + 5 * mm, y - 32 * mm, bw, 32 * mm, "Cash at close  (50%)", "₦75.5bn", "US$47.2m  ·  for 90% of equity")
    d.kpi(MARGIN + 2 * (bw + 5 * mm), y - 32 * mm, bw, 32 * mm, "Founders retain", "10%", "Fully diluted  ·  no preference")
    y -= 42 * mm

    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "Implied pricing")
    y -= 4 * mm
    cols = [("", "L"), ("₦", "R"), ("US$", "R")]
    colw = [90 * mm, 45 * mm, 43 * mm]
    rows = [
        ["Year-5 EV (10× ₦15.1bn EBITDA)", "151bn", "$94.4m"],
        ["Cash consideration (50% of Y5 EV)", "75.5bn", "$47.2m"],
        ["Equity acquired by buyer", "90%", "90%"],
        ["Implied 100% equity value at close", "83.9bn", "$52.4m"],
        ["Founders’ 10% at close (mark)", "8.4bn", "$5.2m"],
        ["Founders’ 10% if Y5 EV is delivered", "15.1bn", "$9.4m"],
        ["Founders’ total if Y5 hits (cash + roll)", "90.6bn", "$56.6m"],
        ["Buyer’s 90% if Y5 hits", "136bn", "$85.0m"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14)
    y -= 6 * mm
    y = d.para(
        MARGIN, y,
        "In words: the buyer pays US$47.2m today for 90% of a luxury Nigerian short-stay marketplace, implying a US$52.4m company today — about 0.56× the Year-5 target EV. If the plan is delivered, that 90% is worth ~US$85m in 2031, a ~1.8× cash-on-cash on the equity stub before dividends or take-private optionality. The 4× GMV lens (Y5 GMV US$78m → EV ~US$311m) is shown later as a ceiling, not the ask.",
        W - 2 * MARGIN, 9, 12,
    )

    # 02 STRUCTURE
    d.new()
    y = d.header("02  /  Structure", "How the 90 / 10 split works")
    points = [
        ("Share purchase, not an asset sale.", "Buyer acquires 90% of the issued share capital of the operating company (and any HoldCo) for cash. IP, brand, codebase, domain, customer contracts and escrow arrangements transfer with the shares."),
        ("Cash is 50% of Year-5 worth.", "₦75.5bn / US$47.2m, payable 90% at closing and 10% at 12 months subject only to customary leakage (no EBITDA earn-out). We are not asking the buyer to underwrite the full Year-5 plan in cash."),
        ("Founders retain 10%, pari passu.", "Ordinary shares, no preference, tag and drag, pro-rata on a sale. Lock-up 36 months except for a permitted 2% liquidity window after Year 2. Two board seats for the buyer, one for founders, one independent."),
        ("Management stay.", "Founders and named operators enter 3-year employment / consulting agreements with non-compete in luxury short-stay in Nigeria, Ghana, Côte d’Ivoire and Kenya. Acceleration of the rolled 10% only on change of control."),
        ("Currency.", "Consideration may be paid in USD or NGN at the CBN/IE window rate on the locked date. The ₦1,600 planning rate is for this memo only."),
        ("Exclusivity.", "45 days from countersignature of a term sheet, extendable 15 days if SPA is in advanced draft. Break fee 1.5% of cash consideration if buyer walks without a MAC."),
    ]
    for t, b in points:
        c.setFillColor(GOLD)
        c.setFont("Body-Bold", 9.5)
        c.drawString(MARGIN, y, t)
        y -= 4.6 * mm
        y = d.para(MARGIN, y, b, W - 2 * MARGIN, 9, 12)
        y -= 3.8 * mm

    y -= 2 * mm
    y = d.para(
        MARGIN, y,
        "Conditions: confirmatory legal, tax, IP and product due diligence; live payments/escrow going live or a funded plan to do so within 90 days of close; no undisclosed related-party debt; ordinary CAMA and (if triggered) FCCPC merger notification. This document is a proposal, not a prospectus.",
        W - 2 * MARGIN, 9, 12,
    )

    # 03 VALUE BRIDGE
    d.new()
    y = d.header(
        "03  /  Value bridge",
        "From the projections pack to this price",
        ["Same supply targets: 500 homes in Y3, 2,200 in Y5, 4,500 in Y10."],
    )
    cols = [("", "L"), ("Y3  2029", "R"), ("Y5  2031", "R"), ("Y10  2036", "R")]
    colw = [52 * mm, 42 * mm, 42 * mm, 42 * mm]
    rows = [
        ["Live listings", "500", "2,200", "4,500"],
        ["GMV", "₦23.2bn", "₦124.5bn", "₦348bn"],
        ["Net revenue", "₦4.65bn", "₦25.9bn", "₦76.0bn"],
        ["EBITDA", "₦1.60bn", "₦15.1bn", "₦31.5bn"],
        ["EV at 10× EBITDA", "₦16bn", "₦151bn", "₦315bn"],
        ["EV (US$m)", "~$10m", "~$94m", "~$197m"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14.5)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "The ask uses only the Year-5 column, and only the 10× EBITDA method — the same method the projections pack described as the better lens once the marketplace is profitable. We do not price this deal off Year-10 GMV, off 4× GMV, or off Transcorp’s hotel multiple. Those belong in the comps chapter as context.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 5 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "Why 50% of Year-5 — not 100%, not a seed round")
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "Paying 100% of Year-5 EV today would ask the buyer to fund execution risk in cash. Paying a typical seed/Series A valuation would ignore that the product, fee stack (12% host / 8% guest), brand and codebase already exist. Fifty percent of the 2031 worth, for 90% of the equity, splits the execution risk: the buyer owns the upside above US$52m; the founders stay aligned through a 10% roll that is only valuable if Year-5 is delivered.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "On a conservative Year-5 (₦4.2bn EBITDA → ₦42bn EV), 50% would be ₦21bn (~US$13m) for 90%. We are not offering that price. The proposal is the management case. If diligence cannot support 2,200 verified homes and 60% occupancy, the parties can re-cut along the conservative column — that is a negotiation, not this paper.",
        W - 2 * MARGIN, 9, 12,
    )

    # 04 COMPS
    d.new()
    y = d.header(
        "04  /  Comparative analysis",
        "Mostly Nigerian-owned hospitality & travel",
        ["Public marks where they exist. Private marks are last-round or informed estimates, not offers."],
    )
    y = d.para(
        MARGIN, y,
        "There is no listed luxury short-stay marketplace in Nigeria. Comps therefore split into (A) Nigerian-owned hotel owner-operators, which own bricks and trade at asset multiples, and (B) Nigerian-owned digital travel / lodging platforms, which are closer in model but thinner in public data. Airbnb and Booking.com set guest behaviour but are not Nigerian-owned and are omitted from the value table.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 5 * mm
    cols = [("Company", "L"), ("Model", "L"), ("Ownership", "L"), ("Current mark", "R")]
    colw = [38 * mm, 48 * mm, 42 * mm, 50 * mm]
    rows = [
        ["Transcorp Hotels", "Owned hotels + Aura OTAs", "NGX:TRANSCOHOT", "₦2.29tn  ·  ~$1.4bn"],
        ["Ikeja Hotel Plc", "Owned hotels (Sheraton etc.)", "NGX listed, Nigerian", "Assets ₦82bn (H1’26)"],
        ["Hotels.ng", "Hotel + short-let OTA", "Nigerian, VC-backed", "Raised ~$11.7m  ·  last rumoured ~$4–15m"],
        ["Wakanow", "OTA (flights, hotels)", "Nigerian, 2008", "Reported $40m raised"],
        ["Travelbeta", "OTA (flights-led)", "Nigerian", "$2m seed (2015)"],
        ["NestFlow", "Hotel ops software", "Nigerian, bootstrapped", "₦14m early contracts (2026)"],
        ["Jollof Living (this ask)", "Luxury short-stay marketplace", "Nigerian, product live", "Implied $52m at close"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 13.5)
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "How to read the table")
    y -= 5 * mm
    notes = [
        "Transcorp Hotels is the cleanest Nigerian public mark: market cap ₦2.29 trillion as of 11 June 2026, TTM revenue ~₦99bn, P/E ~102. It is an owner of Hilton Abuja and Calabar plus the Aura booking layer — not a zero-inventory marketplace. Its EV is 15×+ Jollof’s Year-5 EV and ~24× this proposal’s implied close value. It shows what Nigerian capital will pay for trusted hospitality cash flows, not what a 2,200-key marketplace should trade at today.",
        "Ikeja Hotel Plc is the other listed Nigerian hotel name. Combined with Transcorp it posted ₦14.6bn PAT in H1 2026 on >₦57bn turnover. Again, rooms on the balance sheet. Jollof’s Year-5 EBITDA (₦15.1bn) is in the same order of magnitude as Transcorp’s H1 PAT run-rate — with no hotels owned.",
        "Hotels.ng (Mark Essien) is the closest Nigerian-owned digital lodging brand: 13,000+ hotels and short-lets, Spark / EchoVC / Omidyar capital, ~$11.7m raised. Historical commentary put it near $4m; later funding implies a higher but still sub-$50m private mark. It is mass and hotel-led. Jollof is luxury, escrow-led, and fee-rich (20% of lodging vs a typical OTA 10–15%).",
        "Wakanow is Nigeria’s scaled OTA (flights-heavy). Third-party databases cite ~$40m raised and wide revenue bands; treat those as unverified. It competes for the travel session, not for verified Ikoyi penthouses.",
        "Travelbeta’s $2m Nigerian seed (2015) is a reminder that OTAs in this market have historically been financed as SMEs, not as category marketplaces.",
        "Lagos short-let GMV itself is large: Edala’s 2025 report put the Lagos market near ₦281–286bn, with Island ADR high enough that a 2,200-home luxury slice is plausible without inventing demand. Jollof does not need to win mass mainland supply.",
    ]
    for n in notes:
        y = d.para(MARGIN, y, n, W - 2 * MARGIN, 8.2, 11)
        y -= 2.8 * mm

    # 05 COMPS 2 - positioning
    d.new()
    y = d.header("05  /  Positioning vs comps", "Why this is not Transcorp, and not Hotels.ng")
    cols = [("", "L"), ("Transcorp Hotels", "L"), ("Hotels.ng / OTAs", "L"), ("Jollof Living", "L")]
    colw = [32 * mm, 50 * mm, 50 * mm, 46 * mm]
    rows = [
        ["Inventory", "Owned keys", "Aggregated hotels", "Verified private homes"],
        ["Capex", "Heavy (buildings)", "Light", "Light (photo, KYC)"],
        ["Take / margin", "Hotel GOP", "OTA commission", "12% + 8% coded"],
        ["Trust mechanic", "Brand + staff", "Reviews", "Escrow + KYC + inspect"],
        ["ADR band", "5-star hotel", "Budget → mid", "₦145k–₦420k+"],
        ["Guest", "Corporate + leisure", "Mass domestic", "Luxury + diaspora"],
        ["Capital intensity", "Very high", "Medium", "Low"],
        ["Public mark", "~$1.4bn", "Private, <$50m e", "Ask implies $52m"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14.2)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "The acquisition logic is a gap in the Nigerian-owned stack. Transcorp and Ikeja Hotel capture branded rooms. Hotels.ng and Wakanow capture mass search. Nobody Nigerian-owned owns the escrow-backed luxury home — the product Airbnb runs globally and local operators run as WhatsApp. That gap is what US$47.2m is buying: brand, codebase, fee stack, and the right to put 2,200 verified homes on it by 2031 without building a Hilton.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 5 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "Multiple check")
    y -= 4 * mm
    cols = [("Lens", "L"), ("Comp", "L"), ("On Jollof Y5", "R"), ("This ask", "R")]
    colw = [40 * mm, 55 * mm, 42 * mm, 41 * mm]
    rows = [
        ["10× EBITDA", "Profitable marketplace", "₦151bn / $94m", "50% → $47m cash"],
        ["Asset-light vs hotel P/E", "Transcorp ~102× earnings", "Not used", "Would be absurd"],
        ["4× GMV", "Growth marketplace", "$311m", "Ceiling, not the ask"],
        ["Last Nigerian OTA round", "Hotels.ng / Travelbeta", "n.m.", "Ask is 3–10× those marks"],
        ["Implied close P / Y5 sales", "Net rev ₦25.9bn", "3.2× Y5 net rev at close EV", "Discounted for risk"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14)
    y -= 6 * mm
    y = d.para(
        MARGIN, y,
        "Sources for marks: Transcorp market cap, StockAnalysis / NGX as of 11 June 2026 and Nairametrics 17 March 2026 (₦2tn+); Transcorp and Ikeja Hotel H1 2026, BusinessDay 27 July 2026; Hotels.ng raise ~$11.7m PitchBook; Wakanow funding databases (treat as unverified); Travelbeta $2m seed, Techpoint 2015; Lagos short-let ₦281–286bn, Edala / BusinessDay March 2026. Jollof figures are from the companion projections PDF, not audited statements.",
        W - 2 * MARGIN, 8, 11,
    )

    # 06 BUYER RATIONALE
    d.new()
    y = d.header("06  /  Why a buyer acts", "Strategic fits")
    fits = [
        ("Nigerian hotel group (Transcorp, Ikeja Hotel, independent groups).", "Add a zero-inventory luxury channel without another tower. Aura-class OTA plus Jollof’s escrow homes is a full funnel. The cash ask is ~3% of Transcorp’s market cap."),
        ("Nigerian OTA (Hotels.ng, Wakanow, Travelbeta).", "Move up-ADR. Mass hotel inventory does not monetise Ikoyi villas well. Buying Jollof is cheaper than convincing luxury hosts that an OTA will hold funds in escrow."),
        ("Bank / PSP / fintech.", "Escrow, split pay, multi-currency and gift cards are already in the product. A payments owner turns float and acquiring into the P&L."),
        ("Family office / diaspora capital.", "Hard-currency guest mix, Naira cost base, asset-light. The 10% founder roll keeps operators who know Lekki."),
        ("Regional strategic (Ghana, Kenya).", "The Year-5 Accra line and Year-10 four-country map are the expansion thesis. Buying now is buying the Nigerian density required before Accra works."),
    ]
    for t, b in fits:
        c.setFillColor(GOLD)
        c.setFont("Body-Bold", 9.5)
        c.drawString(MARGIN, y, t)
        y -= 4.6 * mm
        y = d.para(MARGIN, y, b, W - 2 * MARGIN, 9, 12)
        y -= 3.6 * mm
    y -= 2 * mm
    y = d.para(
        MARGIN, y,
        "What we will not do in this process: a slow minority round that reprices later; a brand licence without equity; or a fire-sale of the codebase without the operators. The 10% retain is the price of keeping the people who can hit 2,200 homes.",
        W - 2 * MARGIN, 9, 12,
    )

    # 07 PROCESS
    d.new()
    y = d.header("07  /  Process and next steps", "From this paper to an SPA")
    cols = [("Week", "L"), ("Action", "L")]
    colw = [28 * mm, 150 * mm]
    rows = [
        ["0", "Term sheet on the 90/10, ₦75.5bn / US$47.2m cash structure"],
        ["1–2", "Exclusivity; data room (code, cap table, IP, contracts, projections model)"],
        ["3–5", "Confirmatory diligence (legal, tax, product, payments, FCCPC if needed)"],
        ["6–7", "SPA / SHA (board, reserved matters, lock-up, non-compete)"],
        ["8", "Closing: 90% cash; 10% holdback; share transfer; announcements"],
        ["+12 mo", "Holdback release; first locked founder liquidity window (2%) if agreed"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 15)
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "What is in the data room")
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "Full PHP/MySQL codebase and HostGator deployment; fee engine (Pricing.php); user, booking, escrow and audit schemas; the September 2026 projections and this proposal; cap table; trademarks and domain; material host/guest contracts if any; insurance and KYC process notes. Demo GMV in the admin UI is labelled as demonstration data and will not be represented as trailing revenue.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "Walk-away and MAC")
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "Material adverse change: loss of core IP, undisclosed tax or CBN enforcement that blocks escrow, or a trust incident that makes the brand unusable. Missed listing targets between signing and close are not a MAC — the buyer is underwriting the plan. If the buyer terminates without MAC after exclusivity, 1.5% of cash consideration is payable to the company for process cost.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "The sentence we want signed")
    y -= 6 * mm
    y = d.para(
        MARGIN, y,
        "Buyer acquires 90% of Jollof Living for cash equal to 50% of the management-case Year-5 enterprise value (₦75.5bn / US$47.2m at ₦1,600), and founding shareholders retain 10% fully diluted ordinary equity, locked 36 months, with two buyer directors, one founder director, and one independent.",
        W - 2 * MARGIN, 10, 13.5, INK, "Body-Bold",
    )
    y -= 10 * mm
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.6)
    c.line(MARGIN, y, MARGIN + 28 * mm, y)
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Body-Italic", 12)
    c.drawString(MARGIN, y, "Luxury Living, African Soul")
    y -= 6 * mm
    c.setFillColor(MUTED)
    c.setFont("Body", 8)
    c.drawString(MARGIN, y, "Jollof Living  ·  September 2026  ·  For the named counterparty and its advisers only.")
    y -= 4.5 * mm
    c.drawString(MARGIN, y, "Companion paper: Jollof-Living-Investor-Financial-Projections.pdf")

    d.save()
    print("Wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    build()
