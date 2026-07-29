"""Build a per-project manifest (title, description, images) from the portfolio PDF.

Unlike the first presentation, this PDF keeps real text and separate embedded
rasters, so images come out clean — no cropping needed. Layout per project:
one title page, a description page, then image pages until the next title.
"""
import json, os, re, subprocess, sys
from PIL import Image

PDF = "/Users/vekazhadzic/Downloads/Project Portfolio_23.07.2026.pdf"
NPAGES = 132
OUT = os.path.dirname(os.path.abspath(__file__))


def page_text(p):
    return subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), "-layout", PDF, "-"],
                          capture_output=True, text=True).stdout


def slugify(s):
    s = s.lower().replace("&", "and")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


texts = {p: page_text(p) for p in range(1, NPAGES + 1)}

# a project starts on the page immediately before a "Project Description" page
desc_pages = [p for p in range(2, NPAGES + 1)
              if texts[p].strip().startswith("Project Description")]
starts = [p - 1 for p in desc_pages]

projects = []
for i, s in enumerate(starts):
    end = starts[i + 1] - 1 if i + 1 < len(starts) else NPAGES
    title = " ".join(texts[s].split())
    body = "\n".join(texts[p] for p in range(s + 1, end + 1))
    body = body.replace("Project Description", " ", 1)
    body = re.sub(r"\s+", " ", body).strip()
    projects.append({"title": title, "slug": slugify(title),
                     "pages": [s, end], "desc": body})

# extract images per project, keeping page order
imgdir = os.path.join(OUT, "img")
os.makedirs(imgdir, exist_ok=True)
for pr in projects:
    s, e = pr["pages"]
    files = []
    for p in range(s, e + 1):
        tmp = os.path.join(OUT, "_tmp")
        os.makedirs(tmp, exist_ok=True)
        subprocess.run(["pdfimages", "-f", str(p), "-l", str(p), "-j", PDF,
                        os.path.join(tmp, "i")], capture_output=True)
        for f in sorted(os.listdir(tmp)):
            src = os.path.join(tmp, f)
            try:
                im = Image.open(src)
            except Exception:
                os.remove(src); continue
            # skip decorative slivers and logos
            if im.width < 300 or im.height < 200:
                os.remove(src); continue
            n = len(files)
            dst = os.path.join(imgdir, f'{pr["slug"]}-{n}.jpg')
            im.convert("RGB").save(dst, quality=88, optimize=True)
            files.append({"file": os.path.basename(dst), "page": p,
                          "size": [im.width, im.height]})
            os.remove(src)
        for f in os.listdir(tmp):
            os.remove(os.path.join(tmp, f))
    pr["images"] = files

json.dump(projects, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
print(f"{len(projects)} projects, {sum(len(p['images']) for p in projects)} images")
for p in projects:
    print(f'  {p["slug"]:38s} p{p["pages"][0]:>3}-{p["pages"][1]:<3} {len(p["images"])} imgs')
