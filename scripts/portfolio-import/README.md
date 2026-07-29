# Portfolio PDF import

Turns a client portfolio PDF into seed entries + images. Used for
`Project Portfolio_23.07.2026.pdf` (33 projects, 218 images).

Needs `pdftotext` / `pdfimages` (poppler) and Pillow.

## 1. Extract

```bash
python3 extract.py     # writes manifest.json + img/
```

The PDF keeps real text and separate embedded rasters, so images come out clean
— nothing has to be cropped. Layout per project is one title page, a
description page, then image pages until the next title, so `extract.py` finds
every page starting with "Project Description", treats the page before it as the
title, and takes all images in that range as the gallery. Rasters under
300×200 are skipped (logos and decorative slivers).

> A different PDF may flatten each slide into a single image with the text baked
> in — that needs the crop-and-score approach instead. See
> `prototype3d-website/tools/README.md`.

## 2. Review the covers

```bash
python3 sheet.py covers.jpg              # first image of every project
python3 sheet.py one.jpg <slug> <slug>   # full gallery for named projects
```

Look for projects whose first image is a weak thumbnail — long thin parts
photographed end-on are the usual offenders. Add those to `COVER` in
`publish.py` with the index of a better shot.

## 3. Publish

```bash
python3 publish.py     # copies to public/projects/portfolio/<slug>-N.jpg
```

Files are written in gallery order with the cover at `-0`, so a seed entry only
needs a count. `SLUG` in `publish.py` shortens a few unwieldy title-derived
slugs.

## 4. Seed + migration

Add an entry per project to `raw` in `src/lib/data.ts` using `gallery: n`:

```ts
{ name: "Bottle Closure Assembly", category: "product", img: "bottle-cap",
  gallery: 14, sort: 99, blurb: "…", tags: ["Revision", "Tolerances"] },
```

Then regenerate. `img` is the file prefix; the DB slug comes from `name`.

```bash
node ../generate-seed-migration.mjs
```

That writes `supabase/migrations/20260729090000_seed_client_portfolio.sql`.
Apply with `supabase db push`, or paste it into the Supabase SQL Editor.
