"""Copy the extracted galleries into protoform/public/projects/portfolio/.

Files land as <slug>-0.jpg ... <slug>-N.jpg in gallery order, so the seed only
has to carry a count. COVER moves a better hero shot to index 0 where the
first image on the page is a weak thumbnail (thin vertical parts).
"""
import json, os, shutil
DEST = "/Users/vekazhadzic/Desktop/protoform/public/projects/portfolio"
COVER = {"gears-and-teeth": 1, "tuff-stix-xs": 1}
SLUG = {  # display slug for the site (title-derived slugs that are too long/odd)
    "an-under-desk-storage-assembly-for-portable-electronic-devices": "under-desk-storage",
    "sun-and-it-s-rays-door-number-no-333": "door-number-333",
    "steam-and-exhaust-distribution-manifold": "steam-exhaust-manifold",
}
os.makedirs(DEST, exist_ok=True)
out = []
for p in json.load(open("manifest.json")):
    slug = SLUG.get(p["slug"], p["slug"])
    files = [i["file"] for i in p["images"]]
    c = COVER.get(p["slug"])
    if c:
        files.insert(0, files.pop(c))
    for n, f in enumerate(files):
        shutil.copy(f"img/{f}", f"{DEST}/{slug}-{n}.jpg")
    out.append({"slug": slug, "title": p["title"], "gallery": len(files)})
json.dump(out, open("published.json", "w"), indent=1)
print(f'{len(out)} projects, {sum(o["gallery"] for o in out)} images -> {DEST}')
