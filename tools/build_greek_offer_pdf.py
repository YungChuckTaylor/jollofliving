#!/usr/bin/env python3
"""Helikon Consortium — one/two-page final offer letter (no Jollof branding)."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, black, white
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "Helikon-Consortium-Offer-Jollof-Living.pdf")
FONTDIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("Body", os.path.join(FONTDIR, "DejaVuSerif.ttf")))
pdfmetrics.registerFont(TTFont("Body-Bold", os.path.join(FONTDIR, "DejaVuSerif-Bold.ttf")))

W, H = A4
INK = HexColor("#111111")
MUTED = HexColor("#444444")
RULE = HexColor("#222222")
M = 22 * mm


def wrap(c, text, font, size, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if c.stringWidth(t, font, size) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def para(c, x, y, text, maxw, size=10, leading=13.5, font="Body", color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    for ln in wrap(c, text, font, size, maxw):
        c.drawString(x, y, ln)
        y -= leading
    return y


def build():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    c = canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("Helikon Consortium — Final Offer")
    c.setAuthor("Helikon Consortium")
    c.setFillColor(white)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    y = H - 22 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 13)
    c.drawString(M, y, "HELIKON CONSORTIUM")
    c.setFont("Body", 8.5)
    c.setFillColor(MUTED)
    c.drawRightString(W - M, y, "Athens, Hellenic Republic")
    y -= 4 * mm
    c.setStrokeColor(RULE)
    c.setLineWidth(0.8)
    c.line(M, y, W - M, y)
    y -= 8 * mm
    c.setFillColor(MUTED)
    c.setFont("Body", 9)
    c.drawString(M, y, "12 Leoforos Vasilissis Sofias, 106 71 Athens")
    c.drawRightString(W - M, y, "16 September 2026")
    y -= 12 * mm

    c.setFillColor(INK)
    c.setFont("Body-Bold", 10)
    c.drawString(M, y, "PRIVATE & CONFIDENTIAL")
    y -= 8 * mm
    c.setFont("Body", 10)
    c.drawString(M, y, "Mr Chinwike Ogbunugafor and Co.")
    y -= 4.5 * mm
    c.setFillColor(MUTED)
    c.drawString(M, y, "100% owners of the company")
    y -= 10 * mm

    c.setFillColor(INK)
    c.setFont("Body", 10)
    c.drawString(M, y, "Dear Mr Ogbunugafor,")
    y -= 8 * mm

    mw = W - 2 * M
    y = para(
        c, M, y,
        "Following our meetings, Helikon Consortium hereby offers to buy ninety per cent (90%) of the entire issued share capital of the company from you and your co-owners.",
        mw,
    )
    y -= 4 * mm
    y = para(
        c, M, y,
        "Price: ₦2.88 billion (US$1.80 million), being eighteen per cent (18%) of the Year-3 enterprise value of ₦16 billion in the financial projections we reviewed. Cash at closing, in USD or NGN. You retain ten per cent (10%) as ordinary shares. No earn-out, no further cash.",
        mw,
    )
    y -= 4 * mm
    y = para(
        c, M, y,
        "Mr Chinwike Ogbunugafor will serve as Chief Technology Officer for eighteen (18) months from closing at ₦500,000 per month. No bonus. No additional equity.",
        mw,
    )
    y -= 4 * mm
    y = para(
        c, M, y,
        "This offer is final and absolute. It will not be negotiated further. A counter-proposal is a rejection. Accept by signing below and returning this letter by 17:00 WAT on 30 September 2026, failing which the offer lapses. Closing by 31 October 2026. Nigerian law; Lagos courts. We have the funds; there is no financing condition.",
        mw,
    )
    y -= 10 * mm
    c.setFont("Body", 10)
    c.setFillColor(INK)
    c.drawString(M, y, "Yours faithfully,")
    y -= 14 * mm
    c.setFont("Body-Bold", 10)
    c.drawString(M, y, "Helikon Consortium")
    y -= 4.5 * mm
    c.setFont("Body", 8.5)
    c.setFillColor(MUTED)
    c.drawString(M, y, "Authorised signatories")

    y -= 16 * mm
    c.setStrokeColor(RULE)
    c.setLineWidth(0.4)
    c.line(M, y, W - M, y)
    y -= 8 * mm
    c.setFillColor(INK)
    c.setFont("Body-Bold", 10)
    c.drawString(M, y, "ACCEPTANCE")
    y -= 6 * mm
    y = para(
        c, M, y,
        "We, being the 100% owners, accept Helikon Consortium’s offer of 16 September 2026 to purchase 90% of the company for ₦2.88 billion (US$1.80 million), we retaining 10%, with Mr Chinwike Ogbunugafor as CTO for 18 months at ₦500,000 per month. We acknowledge the offer is final and will not be negotiated further.",
        mw, 9, 12.5,
    )
    y -= 12 * mm
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    for i, lab in enumerate(["Mr Chinwike Ogbunugafor", "Co-owner", "Co-owner"]):
        x = M + i * 58 * mm
        c.line(x, y, x + 50 * mm, y)
        c.setFillColor(MUTED)
        c.setFont("Body", 7.5)
        c.drawString(x, y - 4.5 * mm, lab + "  ·  date")

    c.setFillColor(MUTED)
    c.setFont("Body", 7.5)
    c.drawString(M, 14 * mm, "Page 1 of 1")
    c.drawRightString(W - M, 14 * mm, "Helikon Consortium  ·  Final offer  ·  16 September 2026")

    c.save()
    print("Wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    build()
