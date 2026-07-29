"""Re-extract the original 37 catalogue projects at full resolution.

Every page of this deck is one flattened 6000x3375 slide, so the card image has
to be cropped out — same approach as the first presentation, but the master is
~4x larger in each dimension, which is the whole point: the images currently on
the site were cropped from a low-res render (600x560, 800x780).

Per project we produce:
  <img>-0.jpg   cropped hero, ~1600px wide
  <img>-N.jpg   each full slide, 2000px wide
"""
import json, os, subprocess, sys
from collections import deque
from PIL import Image, ImageFilter

PDF = "/Users/vekazhadzic/Desktop/3D modeling & prototype development services.pdf"
OUT = os.path.dirname(os.path.abspath(__file__))
CARDS = os.path.join(OUT, "cards")
DETECT_W = 1500          # detector works on a downscaled copy, box maps back
CELL = 16
LO, HI = 55, 232
CELL_T = 0.42
ASPECT = 4 / 3
PAD = 0.05

# project image prefix -> slide pages (first page is the cover unless COVER says otherwise)
PAGES = {
    "pump": [8], "shelf": [10], "backdragon": [11, 12], "toothbrush": [13],
    "tpart": [15], "crane": [16], "valve": [20], "icefishing": [21],
    "clamp": [25], "pergola": [26], "fishingbait": [27],
    "foam": [28, 29, 30, 31], "mixer": [32], "trashbin": [33, 34],
    "rim": [35], "carseat": [36], "mouse": [38], "toycar": [41, 42],
    "bendapals": [45], "iphonecase": [51], "cncpart": [54],
    "bouquet": [55, 56], "massager": [58, 59, 60], "rainbarrel": [61],
    "impeller": [63], "petggear": [64], "coolingstation": [65],
    "biathlon": [66], "cncrouter": [67], "alfagrill": [68], "bowls": [69],
    "petg": [70], "alu6061": [71], "gopro": [72], "statues": [75],
    "frontman": [78], "taipei": [79],
}
COVER = json.load(open(os.path.join(OUT, "catalogue-cover.json"))) if os.path.exists(
    os.path.join(OUT, "catalogue-cover.json")) else {}
BOXES = json.load(open(os.path.join(OUT, "catalogue-boxes.json"))) if os.path.exists(
    os.path.join(OUT, "catalogue-boxes.json")) else {}


def page_master(p):
    """The full 6000x3375 raster for a page (largest image object on it)."""
    tmp = os.path.join(OUT, "_pg")
    os.makedirs(tmp, exist_ok=True)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    subprocess.run(["pdfimages", "-f", str(p), "-l", str(p), "-png", PDF,
                    os.path.join(tmp, "i")], capture_output=True)
    files = sorted(os.listdir(tmp), key=lambda f: -os.path.getsize(os.path.join(tmp, f)))
    return Image.open(os.path.join(tmp, files[0])).convert("RGB")


def cell_grid(im):
    g = im.convert("L")
    mid = g.point(lambda v: 255 if LO <= v <= HI else 0)
    gw, gh = im.width // CELL, im.height // CELL
    small = mid.resize((gw, gh), Image.BOX)
    small = small.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    px = small.load()
    return [[px[x, y] >= CELL_T * 255 for x in range(gw)] for y in range(gh)], gw, gh


def largest_blob(grid, gw, gh):
    seen = [[False] * gw for _ in range(gh)]
    best = None
    for y0 in range(gh):
        for x0 in range(gw):
            if not grid[y0][x0] or seen[y0][x0]:
                continue
            q, cells = deque([(x0, y0)]), []
            seen[y0][x0] = True
            while q:
                x, y = q.popleft()
                cells.append((x, y))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1),
                               (1, 1), (1, -1), (-1, 1), (-1, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < gw and 0 <= ny < gh and grid[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = True
                        q.append((nx, ny))
            if best is None or len(cells) > len(best):
                best = cells
    return best


def hero_box(master, name):
    """Return the hero crop box in master pixels, as fractions."""
    if name in BOXES:
        return BOXES[name]
    small = master.copy()
    small.thumbnail((DETECT_W, DETECT_W), Image.LANCZOS)
    grid, gw, gh = cell_grid(small)
    blob = largest_blob(grid, gw, gh)
    if not blob:
        return [0, 0, 1, 1]
    xs = [c[0] for c in blob]
    ys = [c[1] for c in blob]
    l, r = min(xs) * CELL, (max(xs) + 1) * CELL
    t, b = min(ys) * CELL, (max(ys) + 1) * CELL
    pw, ph = (r - l) * PAD, (b - t) * PAD
    return [max(0, (l - pw) / small.width), max(0, (t - ph) / small.height),
            min(1, (r + pw) / small.width), min(1, (b + ph) / small.height)]


def letterbox(crop, margin=0.04):
    px = crop.load()
    w, h = crop.size
    step = max(1, w // 200)
    edge = ([px[x, 0] for x in range(0, w, step)] + [px[x, h - 1] for x in range(0, w, step)] +
            [px[0, y] for y in range(0, h, step)] + [px[w - 1, y] for y in range(0, h, step)])
    fill = tuple(sorted(c[i] for c in edge)[len(edge) // 2] for i in range(3))
    cw, ch = (w, int(w / ASPECT)) if w / h > ASPECT else (int(h * ASPECT), h)
    cw, ch = int(cw * (1 + margin * 2)), int(ch * (1 + margin * 2))
    canvas = Image.new("RGB", (cw, ch), fill)
    canvas.paste(crop, ((cw - w) // 2, (ch - h) // 2))
    return canvas


def main():
    os.makedirs(CARDS, exist_ok=True)
    only = sys.argv[1:]
    boxes, counts = {}, {}
    for name, pages in PAGES.items():
        if only and name not in only:
            continue
        cover_page = COVER.get(name, pages[0])
        masters = {}
        for n, p in enumerate(pages):
            m = page_master(p)
            slide = m.copy()
            slide.thumbnail((2000, 2000), Image.LANCZOS)
            slide.save(f"{CARDS}/{name}-{n + 1}.jpg", quality=84, optimize=True)
            if p == cover_page:
                masters[p] = m
        m = masters.get(cover_page) or page_master(cover_page)
        box = hero_box(m, name)
        boxes[name] = [round(v, 4) for v in box]
        W, H = m.size
        crop = m.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
        card = letterbox(crop)
        card.thumbnail((1600, 1600), Image.LANCZOS)
        card.save(f"{CARDS}/{name}-0.jpg", quality=88, optimize=True)
        counts[name] = len(pages) + 1
        print(f"  {name:16s} p{cover_page:<3} {card.size[0]}x{card.size[1]}  {counts[name]} imgs")
    if not only:
        json.dump(boxes, open(os.path.join(OUT, "boxes.auto.json"), "w"), indent=1)
        json.dump(counts, open(os.path.join(OUT, "counts.json"), "w"), indent=1)
    print(f"{len(counts)} projects")


if __name__ == "__main__":
    main()
