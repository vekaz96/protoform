-- Seed PROTOFORM projects + blog posts from src/lib/data.ts
-- Safe to re-run: skips rows that already exist (by slug).
-- Image URLs point at /projects/*.jpg in public/ — edit in /admin or paste any https URL.
-- Regenerate: node scripts/generate-seed-migration.mjs

INSERT INTO public.projects (slug, name, category, image_url, blurb, tags, featured, published, sort)
VALUES
  ('centrifugal-pump', 'Centrifugal Pump', 'mechanical', '/projects/pump.jpg', 'Pumps from 1.5 kW up to 132 kW — each fully engineered and now in production in the Middle East.', ARRAY['CAD', 'Drawings', 'Industrial'], true, true, 1),
  ('butterfly-valve', 'Butterfly Valve', 'mechanical', '/projects/valve.jpg', 'Over 150 DWG drawings rebuilt as fully parametric 3D models with tolerances for PELICAN WORLDWIDE (NL).', ARRAY['Autodesk Inventor', 'Parametric'], false, true, 2),
  ('crane-pipe-connections', 'Crane Pipe Connections', 'mechanical', '/projects/crane.jpg', '3D + 2D assemblies of LUG, PIPE, BUMP and BAYONET joints in 90° and 360° positions.', ARRAY['Assembly', 'Piping'], false, true, 3),
  ('foam-dispenser', 'Foam Dispenser', 'mechanical', '/projects/foam.jpg', 'Complex multi-part assembly — adapter, seal, housing, washer and nut around a bent internal air-hose.', ARRAY['Assembly', 'Simulation'], true, true, 4),
  ('two-component-glue-mixer', 'Two-Component Glue Mixer', 'mechanical', '/projects/mixer.jpg', 'Helical static mixer inside a housing, geometry tuned so two components blend fully in a single pass.', ARRAY['CAD', 'Flow'], false, true, 5),
  ('pump-housing-clamp', 'Pump Housing — Clamp', 'mechanical', '/projects/clamp.jpg', 'Print-ready pump-housing clamp delivered with fully dimensioned technical drawings.', ARRAY['Print-ready', 'Drawings'], false, true, 6),
  ('ice-fishing-stand', 'Ice Fishing Stand', 'mechanical', '/projects/icefishing.jpg', 'Complete 3D assembly of an ice-fishing stand with 2D general-dimension drawings.', ARRAY['Assembly', 'Product'], false, true, 7),
  ('pergola-extrusion-kit', 'Pergola Extrusion Kit', 'mechanical', '/projects/pergola.jpg', 'Pergola profiles with an internal aluminium reinforcement — four section variants.', ARRAY['Extrusion', 'Architecture'], false, true, 8),
  ('cnc-production-part', 'CNC Production Part', 'mechanical', '/projects/cncpart.jpg', 'Curved CNC part modelled from a 2D drawing and prepared for machining.', ARRAY['CNC', 'DFM'], false, true, 9),
  ('6061-aluminium-bracket', '6061 Aluminium Bracket', 'mechanical', '/projects/alu6061.jpg', 'Motorsport bracket engineered for CNC machining from 6061 aluminium.', ARRAY['CNC', 'Automotive'], false, true, 10),
  ('diy-cnc-router-parts', 'DIY CNC Router Parts', 'mechanical', '/projects/cncrouter.jpg', 'Machined on a self-built, 3D-printed CNC router in 18 mm beech.', ARRAY['CNC', 'Woodwork'], false, true, 11),
  ('massage-roller', 'Massage Roller', 'mechanical', '/projects/massager.jpg', 'Foam-roller assembly with movable pins; hole and rod tolerances tuned for smooth motion.', ARRAY['Assembly', 'Consumer'], false, true, 12),
  ('t-part', 'T-Part', 'mechanical', '/projects/tpart.jpg', 'Print-ready component supplied with complete section-view documentation.', ARRAY['Print-ready', 'Docs'], false, true, 13),
  ('the-back-dragon', 'The Back Dragon', 'product', '/projects/backdragon.jpg', 'Flagship back-massage product — one end heats a ceramic ball to 100 °C, the other cools, all without melting the plastic. Shown at lectures in the USA.', ARRAY['Product Design', 'Prototype'], true, true, 14),
  ('toothbrush', 'Toothbrush', 'product', '/projects/toothbrush.jpg', 'Two-tone toothbrush prototype modelled and prepared for 3D printing.', ARRAY['Product Design', 'Consumer'], false, true, 15),
  ('razer-naga-mouse', 'Razer Naga Mouse', 'product', '/projects/mouse.jpg', 'An existing gaming mouse reverse-measured part-by-part and rebuilt in SolidWorks.', ARRAY['Reverse Eng.', 'SolidWorks'], true, true, 16),
  ('car-seat', 'Car Seat', 'product', '/projects/carseat.jpg', 'Automotive seat cushion modelled directly from a 3D scan file.', ARRAY['Scan-to-CAD', 'Automotive'], false, true, 17),
  ('sophia-shelf', 'Sophia Shelf', 'product', '/projects/shelf.jpg', 'Self-adjusting minimalist shelf for architecture studio Saana — buyers choose their own dimensions.', ARRAY['Furniture', 'Product Design'], false, true, 18),
  ('trash-bin', 'Trash Bin', 'product', '/projects/trashbin.jpg', 'A workshop sketch refined into a full technical assembly and finished renders.', ARRAY['Sheet Metal', 'Product'], false, true, 19),
  ('iphone-case', 'iPhone Case', 'product', '/projects/iphonecase.jpg', 'Perforated protective case modelled with full dimensioning.', ARRAY['Product Design', 'Consumer'], false, true, 20),
  ('wheel-rim', 'Wheel Rim', 'product', '/projects/rim.jpg', 'Modern wheel-model prototypes for a rim manufacturer, prototyped and 3D printed.', ARRAY['Automotive', 'Prototype'], true, true, 21),
  ('plastic-bouquet', 'Plastic Bouquet', 'product', '/projects/bouquet.jpg', 'Decorative tulip-bouquet vase modelled and rendered for production.', ARRAY['Product Design', 'Consumer'], false, true, 22),
  ('fishing-bait', 'Fishing Bait', 'product', '/projects/fishingbait.jpg', 'Designed and prototyped for a Danish company — now their best-selling bait.', ARRAY['Product Design', 'Prototype'], false, true, 23),
  ('children-s-toy-car', 'Children''s Toy Car', 'product', '/projects/toycar.jpg', 'Pull-back toy car with a full internal gear-train, designed and printed.', ARRAY['Mechanism', 'Toy'], false, true, 24),
  ('benda-pals-toy', 'Benda Pals Toy', 'product', '/projects/bendapals.jpg', 'Poseable creature toy with head, limbs and wings modelled separately for printing.', ARRAY['Toy', 'Print-ready'], false, true, 25),
  ('front-man-mask', 'Front Man Mask', 'product', '/projects/frontman.jpg', 'Low-poly character mask, modelled and 3D printed.', ARRAY['Cosplay', 'Print'], false, true, 26),
  ('alfa-romeo-grille', 'Alfa Romeo Grille', 'product', '/projects/alfagrill.jpg', 'A 40 × 35 cm front honeycomb grille for Alfa Romeo.', ARRAY['Automotive', 'Print'], false, true, 27),
  ('rain-barrel', 'Rain Barrel', 'product', '/projects/rainbarrel.jpg', 'From a customer photo and sketch to a finished rain-barrel with a matching step stool.', ARRAY['Concept-to-Part', 'Product'], false, true, 28),
  ('cooling-station', 'Cooling Station', 'product', '/projects/coolingstation.jpg', '200 mm-fan cooling station split into two printable pieces to cut cost and support.', ARRAY['Product Design', 'DFM'], false, true, 29),
  ('pet-g-replacement-parts', 'PET-G Replacement Parts', 'printing', '/projects/petg.jpg', 'Reverse-engineered replacement parts you can''t buy anywhere, printed in PET-G.', ARRAY['Reverse Eng.', 'PET-G'], false, true, 30),
  ('taipei-101', 'Taipei 101', 'printing', '/projects/taipei.jpg', 'Architectural scale model, modelled and 3D printed as a single piece.', ARRAY['Scale Model', 'Print'], true, true, 31),
  ('reverse-engineered-impeller', 'Reverse-Engineered Impeller', 'printing', '/projects/impeller.jpg', 'Machine impeller rebuilt and printed with 5 walls at 100 % infill (250 g).', ARRAY['Reverse Eng.', 'Heavy-duty'], true, true, 32),
  ('pet-g-galaxy-sprocket', 'PET-G Galaxy Sprocket', 'printing', '/projects/petggear.jpg', 'Factory machine sprocket 3D printed in PET-G for multi-purpose production.', ARRAY['PET-G', 'Spare Part'], false, true, 33),
  ('biathlon-rifle-sight-part', 'Biathlon Rifle Sight Part', 'printing', '/projects/biathlon.jpg', '3D-printed sight component — 25 g vs 250 g makes a big difference over half a metre.', ARRAY['Print', 'Lightweight'], false, true, 34),
  ('textured-bowls', 'Textured Bowls', 'printing', '/projects/bowls.jpg', 'Decorative faceted bowl printed to a salon''s exact specification.', ARRAY['Print', 'Decorative'], false, true, 35),
  ('devotional-statues', 'Devotional Statues', 'printing', '/projects/statues.jpg', 'Madonna statues printed at 20, 30 and 50 cm.', ARRAY['Print', 'Sculpture'], false, true, 36),
  ('gopro-tank-mount', 'GoPro Tank Mount', 'printing', '/projects/gopro.jpg', 'GoPro mount for a motorcycle tank, printed in PET-G at 100 % infill.', ARRAY['PET-G', 'Automotive'], false, true, 37)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (slug, title, excerpt, cover_url, body, tags, published, created_at)
VALUES
  ('welcome-to-the-protoform-journal', 'Welcome to the PROTOFORM journal', 'Notes from the workshop — how we take a sketch, a scan or an old 2D drawing and turn it into a real, manufacturable part.', '/projects/bom.jpg', $body_7znqf8i9$## From idea to physical part

Every project starts the same way: a conversation about what the part has to **do**. From there we build precise, editable CAD geometry, prove it with the right calculations, and put a real prototype in your hands.

- Detailed 3D design + engineering
- Design for manufacturing
- Complete bill of materials
- Calculations & simulations
- Print-ready models with drawings

This journal is where we'll share build notes, material choices and the odd war story from the bench.$body_7znqf8i9$, ARRAY['Studio', 'Process'], true, '2026-07-01T09:00:00Z'),
  ('why-pet-g-for-replacement-parts', 'Why we reach for PET-G on replacement parts', 'When a part can''t be bought anymore, PET-G is often the sweet spot between strength, temperature tolerance and printability.', '/projects/petg.jpg', $body_dgezqiwr$## The replacement-part problem

Discontinued parts are everywhere — a bracket, a clip, a sprocket that no supplier stocks any more. Reverse-engineering them and printing in **PET-G** gives a tough, slightly flexible part that survives real use.

We've printed everything from factory sprockets to GoPro tank mounts at 100% infill this way.$body_dgezqiwr$, ARRAY['Materials', '3D Printing'], true, '2026-07-10T09:00:00Z')
ON CONFLICT (slug) DO NOTHING;
