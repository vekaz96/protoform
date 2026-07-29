# Portfolio PDF import

Turns a portfolio PDF into seed entries + images. Needs `pdftotext` /
`pdfimages` (poppler) and Pillow.

Two shapes of source PDF, two scripts:

| Source | Layout | Script |
| --- | --- | --- |
| `Project Portfolio_23.07.2026.pdf` | real text + separate embedded images | `extract.py` → `publish.py` |
| `3D modeling & prototype development services.pdf` | each page one flattened slide | `rebuild.py` |

Everything below describes the first shape; jump to
[Flattened slides](#flattened-slides) for the second.

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

## Flattened slides

`rebuild.py` handles a deck where every page is a single flattened raster with
the text baked in — nothing can be pulled out cleanly, so the card image has to
be cropped. It produced the re-extraction of the original 37 catalogue projects,
whose images had been cropped from a low-res render (600×560, 800×780) when the
masters are 6000×3375.

```bash
python3 rebuild.py                 # all projects
python3 rebuild.py pump valve      # just these
```

Per project it writes `<img>-0.jpg` (cropped hero, ~1600px) and `<img>-N.jpg`
(each slide, 2000px) into `cards/`, then `publish.py`-style copying puts them in
`public/projects/portfolio/`.

- `PAGES` in `rebuild.py` maps each project to its slide pages.
- `catalogue-cover.json` picks a non-default cover page.
- `catalogue-boxes.json` overrides the crop, as `[left, top, right, bottom]`
  fractions of the slide.

Finding a crop box, in order of reliability:

1. `python3 sat.py <name>:<page>` — scores cells by colour saturation. Technical
   drawings are grey and renders are not, so this isolates the subject cleanly.
   This is the one to reach for.
2. The automatic midtone detector inside `rebuild.py` (text and line art are
   near-binary, renders are full of midtones). Good, but it merges a render with
   an adjacent drawing when they touch.
3. Reading coordinates off a gridded preview. Deceptively hard — estimating
   fractions by eye across a multi-cell contact sheet produced several wrong
   boxes that had to be redone. Use it only to sanity-check a box, not to derive
   one.

Seed entries get `gallery: n` plus `existing: true`, which routes them into the
UPDATE migration (`20260729110000_fix_catalogue_images.sql`) instead of an
INSERT — those slugs are already in the database, so an INSERT would hit
`ON CONFLICT DO NOTHING` and change nothing.
