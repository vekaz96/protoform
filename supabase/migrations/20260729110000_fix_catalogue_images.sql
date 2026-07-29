-- PROTOFORM catalogue images re-extracted from
-- "3D modeling & prototype development services.pdf"
--
-- The original catalogue images were cropped from a low-resolution render of
-- that deck (600x560, 800x780). Every page of the source is a flattened
-- 6000x3375 slide, so these are re-cropped from the full-resolution masters:
-- a ~1600px cover plus each of the project's slides at 2000px.
--
-- Rows already exist, so this is an UPDATE keyed on slug — an INSERT would hit
-- ON CONFLICT DO NOTHING and change nothing. Only the images are touched; name,
-- category, blurb, tags, featured, published and sort are left alone, so any
-- edits made in /admin survive.
-- Safe to re-run. Regenerate: node scripts/generate-seed-migration.mjs

UPDATE public.projects AS p
SET image_url = v.image_url, image_urls = v.image_urls
FROM (VALUES
  ('centrifugal-pump', '/projects/portfolio/pump-0.jpg', ARRAY['/projects/portfolio/pump-0.jpg', '/projects/portfolio/pump-1.jpg']),
  ('butterfly-valve', '/projects/portfolio/valve-0.jpg', ARRAY['/projects/portfolio/valve-0.jpg', '/projects/portfolio/valve-1.jpg']),
  ('crane-pipe-connections', '/projects/portfolio/crane-0.jpg', ARRAY['/projects/portfolio/crane-0.jpg', '/projects/portfolio/crane-1.jpg']),
  ('foam-dispenser', '/projects/portfolio/foam-0.jpg', ARRAY['/projects/portfolio/foam-0.jpg', '/projects/portfolio/foam-1.jpg', '/projects/portfolio/foam-2.jpg', '/projects/portfolio/foam-3.jpg', '/projects/portfolio/foam-4.jpg']),
  ('two-component-glue-mixer', '/projects/portfolio/mixer-0.jpg', ARRAY['/projects/portfolio/mixer-0.jpg', '/projects/portfolio/mixer-1.jpg']),
  ('pump-housing-clamp', '/projects/portfolio/clamp-0.jpg', ARRAY['/projects/portfolio/clamp-0.jpg', '/projects/portfolio/clamp-1.jpg']),
  ('ice-fishing-stand', '/projects/portfolio/icefishing-0.jpg', ARRAY['/projects/portfolio/icefishing-0.jpg', '/projects/portfolio/icefishing-1.jpg']),
  ('pergola-extrusion-kit', '/projects/portfolio/pergola-0.jpg', ARRAY['/projects/portfolio/pergola-0.jpg', '/projects/portfolio/pergola-1.jpg']),
  ('cnc-production-part', '/projects/portfolio/cncpart-0.jpg', ARRAY['/projects/portfolio/cncpart-0.jpg', '/projects/portfolio/cncpart-1.jpg']),
  ('6061-aluminium-bracket', '/projects/portfolio/alu6061-0.jpg', ARRAY['/projects/portfolio/alu6061-0.jpg', '/projects/portfolio/alu6061-1.jpg']),
  ('diy-cnc-router-parts', '/projects/portfolio/cncrouter-0.jpg', ARRAY['/projects/portfolio/cncrouter-0.jpg', '/projects/portfolio/cncrouter-1.jpg']),
  ('massage-roller', '/projects/portfolio/massager-0.jpg', ARRAY['/projects/portfolio/massager-0.jpg', '/projects/portfolio/massager-1.jpg', '/projects/portfolio/massager-2.jpg', '/projects/portfolio/massager-3.jpg']),
  ('t-part', '/projects/portfolio/tpart-0.jpg', ARRAY['/projects/portfolio/tpart-0.jpg', '/projects/portfolio/tpart-1.jpg']),
  ('the-back-dragon', '/projects/portfolio/backdragon-0.jpg', ARRAY['/projects/portfolio/backdragon-0.jpg', '/projects/portfolio/backdragon-1.jpg', '/projects/portfolio/backdragon-2.jpg']),
  ('toothbrush', '/projects/portfolio/toothbrush-0.jpg', ARRAY['/projects/portfolio/toothbrush-0.jpg', '/projects/portfolio/toothbrush-1.jpg']),
  ('razer-naga-mouse', '/projects/portfolio/mouse-0.jpg', ARRAY['/projects/portfolio/mouse-0.jpg', '/projects/portfolio/mouse-1.jpg']),
  ('car-seat', '/projects/portfolio/carseat-0.jpg', ARRAY['/projects/portfolio/carseat-0.jpg', '/projects/portfolio/carseat-1.jpg']),
  ('sophia-shelf', '/projects/portfolio/shelf-0.jpg', ARRAY['/projects/portfolio/shelf-0.jpg', '/projects/portfolio/shelf-1.jpg']),
  ('trash-bin', '/projects/portfolio/trashbin-0.jpg', ARRAY['/projects/portfolio/trashbin-0.jpg', '/projects/portfolio/trashbin-1.jpg', '/projects/portfolio/trashbin-2.jpg']),
  ('iphone-case', '/projects/portfolio/iphonecase-0.jpg', ARRAY['/projects/portfolio/iphonecase-0.jpg', '/projects/portfolio/iphonecase-1.jpg']),
  ('wheel-rim', '/projects/portfolio/rim-0.jpg', ARRAY['/projects/portfolio/rim-0.jpg', '/projects/portfolio/rim-1.jpg']),
  ('plastic-bouquet', '/projects/portfolio/bouquet-0.jpg', ARRAY['/projects/portfolio/bouquet-0.jpg', '/projects/portfolio/bouquet-1.jpg', '/projects/portfolio/bouquet-2.jpg']),
  ('fishing-bait', '/projects/portfolio/fishingbait-0.jpg', ARRAY['/projects/portfolio/fishingbait-0.jpg', '/projects/portfolio/fishingbait-1.jpg']),
  ('children-s-toy-car', '/projects/portfolio/toycar-0.jpg', ARRAY['/projects/portfolio/toycar-0.jpg', '/projects/portfolio/toycar-1.jpg', '/projects/portfolio/toycar-2.jpg']),
  ('benda-pals-toy', '/projects/portfolio/bendapals-0.jpg', ARRAY['/projects/portfolio/bendapals-0.jpg', '/projects/portfolio/bendapals-1.jpg']),
  ('front-man-mask', '/projects/portfolio/frontman-0.jpg', ARRAY['/projects/portfolio/frontman-0.jpg', '/projects/portfolio/frontman-1.jpg']),
  ('alfa-romeo-grille', '/projects/portfolio/alfagrill-0.jpg', ARRAY['/projects/portfolio/alfagrill-0.jpg', '/projects/portfolio/alfagrill-1.jpg']),
  ('rain-barrel', '/projects/portfolio/rainbarrel-0.jpg', ARRAY['/projects/portfolio/rainbarrel-0.jpg', '/projects/portfolio/rainbarrel-1.jpg']),
  ('cooling-station', '/projects/portfolio/coolingstation-0.jpg', ARRAY['/projects/portfolio/coolingstation-0.jpg', '/projects/portfolio/coolingstation-1.jpg']),
  ('pet-g-replacement-parts', '/projects/portfolio/petg-0.jpg', ARRAY['/projects/portfolio/petg-0.jpg', '/projects/portfolio/petg-1.jpg']),
  ('taipei-101', '/projects/portfolio/taipei-0.jpg', ARRAY['/projects/portfolio/taipei-0.jpg', '/projects/portfolio/taipei-1.jpg']),
  ('reverse-engineered-impeller', '/projects/portfolio/impeller-0.jpg', ARRAY['/projects/portfolio/impeller-0.jpg', '/projects/portfolio/impeller-1.jpg']),
  ('pet-g-galaxy-sprocket', '/projects/portfolio/petggear-0.jpg', ARRAY['/projects/portfolio/petggear-0.jpg', '/projects/portfolio/petggear-1.jpg']),
  ('biathlon-rifle-sight-part', '/projects/portfolio/biathlon-0.jpg', ARRAY['/projects/portfolio/biathlon-0.jpg', '/projects/portfolio/biathlon-1.jpg']),
  ('textured-bowls', '/projects/portfolio/bowls-0.jpg', ARRAY['/projects/portfolio/bowls-0.jpg', '/projects/portfolio/bowls-1.jpg']),
  ('devotional-statues', '/projects/portfolio/statues-0.jpg', ARRAY['/projects/portfolio/statues-0.jpg', '/projects/portfolio/statues-1.jpg']),
  ('gopro-tank-mount', '/projects/portfolio/gopro-0.jpg', ARRAY['/projects/portfolio/gopro-0.jpg', '/projects/portfolio/gopro-1.jpg'])
) AS v(slug, image_url, image_urls)
WHERE p.slug = v.slug;
