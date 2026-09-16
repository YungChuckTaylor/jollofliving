#!/usr/bin/env python3
"""Helikon Consortium — final offer to acquire Jollof Living."""
import importlib.util
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color
from reportlab.lib.utils import ImageReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INV = os.path.join(ROOT, "tools", "build_investor_pdf.py")
OUT = os.path.join(ROOT, "docs", "Helikon-Consortium-Offer-Jollof-Living.pdf")
COVER = os.path.join(ROOT, "docs", "investor-cover.jpg")

spec = importlib.util.spec_from_file_location("jl_inv", INV)
inv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inv)

W, H = A4
GOLD, GOLD2, INK, MUTED, LINE = inv.GOLD, inv.GOLD2, inv.INK, inv.MUTED, inv.LINE
MARGIN = inv.MARGIN


class Deck(inv.Deck):
    def __init__(self):
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4 as _A4
        self.c = canvas.Canvas(OUT, pagesize=_A4)
        self.c.setTitle("Helikon Consortium — Final Offer to Acquire Jollof Living")
        self.c.setAuthor("Helikon Consortium, Athens")
        self.c.setSubject("Final and non-negotiable offer for 90% of Jollof Living")
        self.page = 0

    def footer(self, last=False):
        self.c.setStrokeColor(LINE)
        self.c.setLineWidth(0.4)
        self.c.line(MARGIN, 12 * mm, W - MARGIN, 12 * mm)
        self.c.setFillColor(MUTED)
        self.c.setFont("Body-Italic", 7.5)
        self.c.drawString(
            MARGIN, 7.5 * mm,
            "Helikon Consortium, Athens  ·  Final offer  ·  Strictly confidential  ·  16 September 2026",
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
    c.setFillColor(Color(0.04, 0.05, 0.04, alpha=0.66))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.setFont("Body-Italic", 10)
    c.drawString(MARGIN, H - 26 * mm, "HELIKON CONSORTIUM  ·  ATHENS, HELLENIC REPUBLIC")
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.7)
    c.line(MARGIN, H - 28 * mm, MARGIN + 52 * mm, H - 28 * mm)
    c.setFillColor(INK)
    c.setFont("Body-Bold", 28)
    c.drawString(MARGIN, H - 48 * mm, "Final offer")
    c.setFont("Body", 14)
    c.drawString(MARGIN, H - 58 * mm, "to purchase 90% of Jollof Living")
    c.setFillColor(GOLD2)
    c.setFont("Body-Italic", 12)
    c.drawString(MARGIN, H - 68 * mm, "Addressed to Mr Chinwike Ogbunugafor and Co.")
    c.setFillColor(INK)
    c.setFont("Body-Bold", 16)
    c.drawString(MARGIN, 58 * mm, "₦2.88 billion  ·  US$1.80 million")
    c.setFillColor(MUTED)
    c.setFont("Body", 9)
    c.drawString(MARGIN, 50 * mm, "18% of the Year-3 enterprise value  ·  Vendors retain 10%")
    c.drawString(MARGIN, 45 * mm, "Mr Ogbunugafor to serve as CTO for 18 months at ₦500,000 per month")
    c.setFillColor(GOLD)
    c.setFont("Body-Italic", 8)
    c.drawString(MARGIN, 28 * mm, "This offer is final and absolute. It will not be negotiated further.")
    c.setFillColor(MUTED)
    c.setFont("Body", 8)
    c.drawString(MARGIN, 22 * mm, "16 September 2026  ·  Open for acceptance until 17:00 WAT on 30 September 2026")

    # LETTER
    d.new()
    y = d.header("01  /  Formal offer letter", "From Athens to Lagos")
    c.setFillColor(MUTED)
    c.setFont("Body", 8.5)
    for line in [
        "Helikon Consortium",
        "c/o 12 Leoforos Vasilissis Sofias, 106 71 Athens, Hellenic Republic",
        "16 September 2026",
        "",
        "Private & confidential — for addressees and their counsel only",
    ]:
        c.drawString(MARGIN, y, line)
        y -= 4.1 * mm
    y -= 2 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 9)
    c.drawString(MARGIN, y, "Mr Chinwike Ogbunugafor and Co.")
    y -= 4.2 * mm
    c.setFont("Body", 9)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, y, "The 100% legal and beneficial owners of Jollof Living")
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 10)
    c.drawString(MARGIN, y, "Dear Mr Ogbunugafor and colleagues,")
    y -= 6 * mm
    paras = [
        "Following our series of meetings, Helikon Consortium — a special-purpose group of Greek family offices and hospitality investors acting jointly and severally for this purpose — hereby makes a final and absolute offer to acquire ninety per cent (90%) of the entire issued share capital of Jollof Living (and any holding company through which you hold it).",
        "You have represented that you, together, own one hundred per cent (100%) of the company. This offer is made in reliance on that representation.",
        "The cash consideration is eighteen per cent (18%) of the Year-3 enterprise value set out in the Jollof Living investor financial projections dated September 2026, which we have reviewed in full. That Year-3 worth is ₦16 billion (ten times Year-3 EBITDA of ₦1.60 billion), or approximately US$10 million at the pack’s planning rate of ₦1,600 = US$1. Eighteen per cent of that figure is ₦2.88 billion (US$1.80 million).",
        "That cash buys 90% of the company. You and your co-owners will retain a ten per cent (10%) fully diluted ordinary stake. Mr Chinwike Ogbunugafor will remain as Chief Technology Officer for eighteen (18) months from closing, at a monthly salary of ₦500,000 (five hundred thousand Naira).",
        "This is our last word. We will not increase the price, alter the percentage, extend the CTO term, or reopen any commercial term discussed in our meetings. A counter-offer will be treated as a rejection. If this letter is not accepted in writing, in the form of the acceptance block in section 05, by 17:00 West Africa Time on 30 September 2026, it lapses automatically and is withdrawn without further notice.",
    ]
    for p in paras:
        y = d.para(MARGIN, y, p, W - 2 * MARGIN, 9, 12.2)
        y -= 3.5 * mm
    c.setFillColor(INK)
    c.setFont("Body-Italic", 9)
    c.drawString(MARGIN, y, "Yours faithfully,")
    y -= 8 * mm
    c.setFont("Body-Bold", 10)
    c.drawString(MARGIN, y, "For and on behalf of Helikon Consortium")
    y -= 5 * mm
    c.setFillColor(MUTED)
    c.setFont("Body", 8.5)
    c.drawString(MARGIN, y, "Authorised signatories  ·  Athens")

    # TERMS
    d.new()
    y = d.header("02  /  Operative terms", "Non-negotiable")
    cols = [("Item", "L"), ("Term  —  not open to discussion", "L")]
    colw = [42 * mm, 136 * mm]
    rows = [
        ["Buyer", "Helikon Consortium (Athens), or a Greek SPV nominated on 5 days’ notice"],
        ["Sellers", "Mr Chinwike Ogbunugafor and Co., as 100% owners"],
        ["Asset", "90% of all issued shares in Jollof Living and any HoldCo"],
        ["Retained stake", "10% ordinary, fully diluted, pari passu, no preference"],
        ["Year-3 EV (base)", "₦16.0 billion  ·  US$10.0 million  (10 × ₦1.60bn EBITDA)"],
        ["Consideration", "18% of Year-3 EV  =  ₦2.88 billion  ·  US$1.80 million"],
        ["For", "90% of equity (implied 100% mark at close: ₦3.20bn  ·  US$2.00m)"],
        ["Payment", "100% cash at closing; USD or NGN at the IE-window rate on closing date"],
        ["Holdback", "None. No earn-out. No price adjustment except leakage and debt"],
        ["CTO", "Mr Ogbunugafor, 18 months from closing"],
        ["CTO salary", "₦500,000 per month, paid in arrears, no bonus, no equity grant"],
        ["CTO total", "₦9,000,000 over 18 months  (≈ US$5,625 at ₦1,600)"],
        ["Lock-up (10%)", "24 months; tag and drag with the Consortium"],
        ["Non-compete", "Mr Ogbunugafor: 18 months, luxury short-stay, NG / GH / CI / KE"],
        ["Governing law", "Laws of the Federal Republic of Nigeria; Lagos courts"],
        ["Character", "FINAL AND ABSOLUTE  ·  WILL NOT BE NEGOTIATED FURTHER"],
        ["Lapse", "17:00 WAT, 30 September 2026, if not accepted in the prescribed form"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 13.2)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "Cash is for the shares only. The CTO salary is an employment cost of the company after closing, not additional purchase price. Escrow balances, guest deposits and host payables are client money and are neither cash in the business nor part of consideration. Net debt and leakage (unauthorised distributions between the date of this letter and closing) reduce the cash dollar-for-dollar. There is no other adjustment.",
        W - 2 * MARGIN, 9, 12,
    )

    # VALUATION
    d.new()
    y = d.header(
        "03  /  How ₦2.88 billion is derived",
        "Eighteen per cent of the Year-3 valuation",
        ["Taken exclusively from the Jollof Living investor projections, management case."],
    )
    cols = [("", "L"), ("₦", "R"), ("US$ (₦1,600)", "R")]
    colw = [90 * mm, 45 * mm, 43 * mm]
    rows = [
        ["Year-3 EBITDA (base case)", "1.60 billion", "$1.00m"],
        ["Year-3 EV at 10× EBITDA", "16.00 billion", "$10.00m"],
        ["This offer: 18% of Year-3 EV", "2.88 billion", "$1.80m"],
        ["Equity acquired", "90%", "90%"],
        ["Implied 100% equity value at close", "3.20 billion", "$2.00m"],
        ["Vendors’ retained 10% at close (mark)", "0.32 billion", "$0.20m"],
        ["Vendors’ 10% if Year-3 EV is delivered", "1.60 billion", "$1.00m"],
        ["CTO compensation (18 × ₦500,000)", "9.00 million", "$5,625"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 14.5)
    y -= 7 * mm
    y = d.para(
        MARGIN, y,
        "We have also read your Year-5 and Year-10 columns (₦151 billion and ₦315 billion at 10× EBITDA) and the vendors’ prior discussion paper that sought 50% of Year-5 worth for 90%. Those numbers are not this offer. Helikon prices only what a Greek consortium will pay, in cash, for a pre-scale Nigerian luxury marketplace before payments, KYC operations and 500 verified homes are proven. Eighteen per cent of the three-year mark is that price. It will not be moved toward the five-year figure.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "If Year-3 is delivered, the Consortium’s 90% would be worth ₦14.4 billion against ₦2.88 billion paid — that upside is why we buy. If it is not delivered, we will have paid 18% of a plan, not of a result. That allocation of risk is accepted by us and is not a basis for you to reopen the price.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "What we are buying")
    y -= 5 * mm
    y = d.para(
        MARGIN, y,
        "Brand, domain, codebase, fee stack (12% host commission, 8% guest service), catalogue, trademarks, customer and host relationships, and the right to appoint the board (two Consortium directors, one vendor director for so long as the 10% is held, one independent). We are not buying hotels. We are not assuming vendor personal debt. We are not funding an earn-out.",
        W - 2 * MARGIN, 9, 12,
    )

    # CTO + CONDITIONS
    d.new()
    y = d.header("04  /  CTO appointment and conditions", "Mr Ogbunugafor")
    y = d.para(
        MARGIN, y,
        "It is a condition of this offer, and of closing, that Mr Chinwike Ogbunugafor enters an employment agreement as Chief Technology Officer of Jollof Living on the following terms, which are complete:",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 4 * mm
    cols = [(" ", "L"), (" ", "L")]
    colw = [48 * mm, 130 * mm]
    rows = [
        ["Office", "Chief Technology Officer, reporting to the Consortium-appointed CEO / board"],
        ["Term", "Eighteen (18) months from the closing date, then at-will"],
        ["Salary", "₦500,000 (five hundred thousand Naira) per month, in arrears"],
        ["Currency", "NGN only"],
        ["Bonus / options", "None"],
        ["Duties", "Platform integrity, payments go-live, security, knowledge transfer"],
        ["Time", "Full time; Lagos or such place as the board directs"],
        ["Termination", "For cause: immediate, no severance. Without cause: one month"],
        ["IP", "All work product assigned to the company"],
        ["Non-solicit", "18 months, employees, hosts and contracted suppliers"],
    ]
    y = d.table(MARGIN, y, cols, rows, colw, 13.5)
    y -= 7 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 11)
    c.drawString(MARGIN, y, "Conditions to closing (exhaustive)")
    y -= 5 * mm
    conds = [
        "Written acceptance of this letter, unamended, by all persons who together own 100%.",
        "Ordinary due diligence confirming title to the shares, the IP and the brand; no surprise debt.",
        "Warranty that the September 2026 projections’ demo GMV is not represented as trailing revenue.",
        "Mr Ogbunugafor’s signed CTO contract in the form summarised above.",
        "CAMA filings and, if triggered, a filing with the Federal Competition and Consumer Protection Commission — we will not wait on a Phase II review; if FCCPC requires Phase II, this offer lapses unless we elect in writing to proceed.",
        "Closing on or before 31 October 2026. Time is of the essence.",
    ]
    for i, t in enumerate(conds, 1):
        c.setFillColor(GOLD)
        c.setFont("Body-Bold", 8)
        c.drawString(MARGIN, y, f"{i:02d}")
        y = d.para(MARGIN + 10 * mm, y, t, W - 2 * MARGIN - 10 * mm, 8.5, 11.5)
        y -= 2.8 * mm
    y -= 3 * mm
    y = d.para(
        MARGIN, y,
        "No other condition. In particular, there is no financing condition. Helikon Consortium has the funds.",
        W - 2 * MARGIN, 9, 12,
    )

    # ACCEPTANCE
    d.new()
    y = d.header("05  /  Acceptance", "The only form we will recognise")
    y = d.para(
        MARGIN, y,
        "To accept, the sellers must sign below without amendment, scan or courier the signed page to Helikon Consortium at the Athens address on the letter, and email a copy to the address we have used in our meetings, by 17:00 WAT on 30 September 2026. Anything else — a marked-up SPA, a “yes, but”, a request for ₦2.89 billion — is a rejection.",
        W - 2 * MARGIN, 9, 12,
    )
    y -= 6 * mm
    c.setFillColor(INK)
    c.setFont("Body-Italic", 9.5)
    y = d.para(
        MARGIN, y,
        "“We, being the 100% owners of Jollof Living, accept Helikon Consortium’s offer dated 16 September 2026 to purchase 90% of the company for ₦2.88 billion (US$1.80 million), being 18% of the Year-3 enterprise value, we retaining 10%, and Mr Chinwike Ogbunugafor serving as CTO for 18 months at ₦500,000 per month. We acknowledge that the offer is final and absolute and will not be negotiated further.”",
        W - 2 * MARGIN, 9.5, 13, INK, "Body-Italic",
    )
    y -= 10 * mm
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    for label in [
        "Signed for the sellers  ·  Mr Chinwike Ogbunugafor",
        "Signed for the sellers  ·  Co-owner",
        "Signed for the sellers  ·  Co-owner (if any)",
    ]:
        c.setFillColor(MUTED)
        c.setFont("Body", 8)
        c.drawString(MARGIN, y, label)
        y -= 7 * mm
        c.setStrokeColor(GOLD)
        c.line(MARGIN, y, MARGIN + 90 * mm, y)
        c.setFillColor(MUTED)
        c.setFont("Body", 7.5)
        c.drawString(MARGIN, y - 4.5 * mm, "Name  ·  signature  ·  date")
        y -= 14 * mm

    y -= 2 * mm
    c.setFillColor(GOLD)
    c.setFont("Body-Bold", 9)
    c.drawString(MARGIN, y, "HELIKON CONSORTIUM  ·  THIS OFFER WILL NOT BE NEGOTIATED FURTHER")
    y -= 8 * mm
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.6)
    c.line(MARGIN, y, MARGIN + 28 * mm, y)
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Body-Italic", 11)
    c.drawString(MARGIN, y, "Athens, 16 September 2026")
    y -= 5 * mm
    c.setFillColor(MUTED)
    c.setFont("Body", 8)
    c.drawString(MARGIN, y, "Companion papers reviewed: Jollof-Living-Investor-Financial-Projections.pdf")

    d.save()
    print("Wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    build()
