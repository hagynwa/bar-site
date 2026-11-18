"""Build the "עוד קצת ילדות" logo (option B: a crayon sun rising over a green hill, with the series'
handwriting) as clean vector SVGs: the hand-made wobble is baked into the paths and the lettering is
converted to outlines, so the files open the same in a browser, Canva, Illustrator or a print shop.

Run:  python3 brand/build_logo.py      (writes brand/logo/*.svg)
Needs: fonttools, uharfbuzz, and anim/assets/fonts/PlaypenSansHebrew.ttf
"""
import io
import math
import os
import random

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "..", "anim", "assets", "fonts", "PlaypenSansHebrew.ttf")
OUT = os.path.join(HERE, "logo")
os.makedirs(OUT, exist_ok=True)

NAVY, GREEN, LEAF, SUN, WHITE, CREAM = "#001A3F", "#699F03", "#B5D96E", "#FECC0C", "#FFFFFF", "#FBFAF3"
WORDS = "עוד קצת ילדות"
WEIGHT = 800

# ---------------------------------------------------------------- lettering to outlines
_font = TTFont(FONT)
instantiateVariableFont(_font, {"wght": WEIGHT}, inplace=True)
_buf = io.BytesIO(); _font.save(_buf); _bytes = _buf.getvalue()
_upem = _font["head"].unitsPerEm
_glyphs = _font.getGlyphSet()
_names = _font.getGlyphOrder()


def wordmark(text, size):
    """Shape `text` right to left with HarfBuzz and return (svg path d, width, ascent, descent) at `size` px."""
    face = hb.Face(_bytes); f = hb.Font(face)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); buf.direction = "rtl"
    hb.shape(f, buf, {"kern": True, "liga": True})
    k = size / _upem
    pen = SVGPathPen(_glyphs)
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = _names[info.codepoint]
        # flip y (font units point up, SVG points down), scale to px
        tp = TransformPen(pen, (k, 0, 0, -k, (x + pos.x_offset) * k, -pos.y_offset * k))
        _glyphs[name].draw(tp)
        x += pos.x_advance
    os2 = _font["OS/2"]
    return pen.getCommands(), x * k, os2.sTypoAscender * k, -os2.sTypoDescender * k


# ---------------------------------------------------------------- the icon, with a crayon hand baked in
# The hand-made wobble is low-frequency (a few slow waves round a shape), the way a child's scissors and
# crayon drift; per-point noise would read as a low-resolution polygon instead.
def smooth_path(points):
    """A closed path through `points` as quadratic curves between midpoints (no corners, no facets)."""
    n = len(points); mids = [((points[i][0] + points[(i + 1) % n][0]) / 2, (points[i][1] + points[(i + 1) % n][1]) / 2) for i in range(n)]
    d = f"M{mids[-1][0]:.2f} {mids[-1][1]:.2f}"
    for i in range(n):
        d += f" Q{points[i][0]:.2f} {points[i][1]:.2f} {mids[i][0]:.2f} {mids[i][1]:.2f}"
    return d + " Z"


def disc(cx, cy, r, seed, n=72):
    rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        rr = r + 0.45 * math.sin(3 * t + ph[0]) + 0.22 * math.sin(5 * t + ph[1]) + 0.1 * math.sin(9 * t + ph[2])
        pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
    return smooth_path(pts)


def mound(cx, half, peak, base, seed, n=40):
    """A hill: a soft dome that meets the ground at both ends, its ridge drifting a little."""
    rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(2)]
    pts = []
    for i in range(n + 1):
        u = i / n; x = cx - half + 2 * half * u
        h = peak * math.sin(math.pi * u) ** 0.75 + 1.1 * math.sin(7 * u * math.pi + ph[0]) * math.sin(math.pi * u) + 0.6 * math.sin(13 * u * math.pi + ph[1]) * math.sin(math.pi * u)
        pts.append((x, base - h))
    pts += [(cx + half, base + 0.01), (cx - half, base + 0.01)]
    return smooth_path(pts)


def ray(cx, cy, ang, r0, r1, wid, sun):
    ca, sa = math.cos(ang), math.sin(ang)
    return (f'<line x1="{cx + ca * r0:.2f}" y1="{cy + sa * r0:.2f}" x2="{cx + ca * r1:.2f}" y2="{cy + sa * r1:.2f}" '
            f'stroke="{sun}" stroke-width="{wid}" stroke-linecap="round"/>')


def icon_paths(sun=SUN, green=GREEN, leaf=LEAF):
    cx, cy, R = 80, 66, 34
    angles = [-90, -54, -126, -18, -162]
    rays = "".join(ray(cx, cy, math.radians(a), R + 10, R + 22, 7, sun) for a in angles)
    return (f'{rays}<path d="{disc(cx, cy, R, 3)}" fill="{sun}"/>'
            f'<path d="{mound(68, 66, 30, 104, 5)}" fill="{green}"/>'
            f'<path d="{mound(110, 50, 19, 104, 7)}" fill="{leaf}"/>')


ICON_W, ICON_H = 160, 110


def svg(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}">{rect}{body}</svg>\n'


def write(name, content):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(content)


# ---------------------------------------------------------------- lockups
def stacked(text_color, name, bg=None):
    """Icon above the words, centred."""
    size = 96
    d, tw, asc, desc = wordmark(WORDS, size)
    pad = 24
    icon_scale = 1.55
    iw, ih = ICON_W * icon_scale, ICON_H * icon_scale
    W = max(tw, iw) + pad * 2
    gap = 4
    H = pad + ih + gap + asc + desc + pad
    ix, iy = (W - iw) / 2, pad
    tx, ty = (W - tw) / 2, pad + ih + gap + asc
    body = (f'<g transform="translate({ix:.2f} {iy:.2f}) scale({icon_scale})">{icon_paths()}</g>'
            f'<path transform="translate({tx:.2f} {ty:.2f})" d="{d}" fill="{text_color}"/>')
    write(name, svg(W, H, body, bg))


def horizontal(text_color, name, bg=None):
    """Icon at the start of the line (the right, in Hebrew), the words to its left."""
    size = 96
    d, tw, asc, desc = wordmark(WORDS, size)
    pad = 24
    icon_scale = 1.15
    iw, ih = ICON_W * icon_scale, ICON_H * icon_scale
    gap = 22
    W = pad + tw + gap + iw + pad
    H = pad * 2 + max(ih, asc + desc)
    ix, iy = pad + tw + gap, (H - ih) / 2
    tx, ty = pad, (H - (asc + desc)) / 2 + asc
    body = (f'<g transform="translate({ix:.2f} {iy:.2f}) scale({icon_scale})">{icon_paths()}</g>'
            f'<path transform="translate({tx:.2f} {ty:.2f})" d="{d}" fill="{text_color}"/>')
    write(name, svg(W, H, body, bg))


def icon_square(name, bg):
    """The mark alone on a square: profile pictures, the corner of the videos, the site's favicon."""
    S = 512
    scale = 2.6
    iw, ih = ICON_W * scale, ICON_H * scale
    body = f'<g transform="translate({(S - iw) / 2:.2f} {(S - ih) / 2 + 20:.2f}) scale({scale})">{icon_paths()}</g>'
    write(name, svg(S, S, body, bg))


if __name__ == "__main__":
    stacked(NAVY, "logo-stacked.svg")
    stacked(WHITE, "logo-stacked-white.svg")
    horizontal(NAVY, "logo-horizontal.svg")
    horizontal(WHITE, "logo-horizontal-white.svg")
    icon_square("icon.svg", CREAM)
    write("icon-transparent.svg", svg(ICON_W, ICON_H, icon_paths()))
    print("written:", sorted(os.listdir(OUT)))


# ---------------------------------------------------------------- layers for animation (same frame as the stacked lockup)
def stacked_parts():
    """The stacked lockup split into layers that share one coordinate frame, plus the numbers the film needs
    to rebuild the parts it draws itself (the rays) and to clip the rising sun at the hills' base."""
    import json
    size, pad, icon_scale, gap = 96, 24, 1.55, 4
    d, tw, asc, desc = wordmark(WORDS, size)
    iw, ih = ICON_W * icon_scale, ICON_H * icon_scale
    W = max(tw, iw) + pad * 2; H = pad + ih + gap + asc + desc + pad
    ix, iy = (W - iw) / 2, pad
    tx, ty = (W - tw) / 2, pad + ih + gap + asc
    g = lambda inner: f'<g transform="translate({ix:.2f} {iy:.2f}) scale({icon_scale})">{inner}</g>'
    cx, cy, R = 80, 66, 34
    parts = os.path.join(OUT, "parts"); os.makedirs(parts, exist_ok=True)
    def put(name, body):
        with open(os.path.join(parts, name), "w", encoding="utf-8") as fh: fh.write(svg(W, H, body))
    put("sun.svg", g(f'<path d="{disc(cx, cy, R, 3)}" fill="{SUN}"/>'))
    put("hills.svg", g(f'<path d="{mound(68, 66, 30, 104, 5)}" fill="{GREEN}"/><path d="{mound(110, 50, 19, 104, 7)}" fill="{LEAF}"/>'))
    put("words.svg", f'<path transform="translate({tx:.2f} {ty:.2f})" d="{d}" fill="{NAVY}"/>')
    layout = {"W": W, "H": H, "ix": ix, "iy": iy, "scale": icon_scale, "sun": [cx, cy, R], "rays": {"angles": [-90, -54, -126, -18, -162], "r0": R + 10, "r1": R + 22, "width": 7},
              "hillBase": 104, "words": [tx, ty - asc, tx + tw, ty + desc]}
    with open(os.path.join(parts, "layout.json"), "w") as fh: json.dump(layout, fh, indent=1)


stacked_parts()
