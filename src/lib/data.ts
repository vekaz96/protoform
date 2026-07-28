import type { Project, Post } from "./types";

/** slugify a project/post name */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Seed = Omit<Project, "slug" | "image_url"> & { img: string };

const raw: Seed[] = [
  // ---------- Mechanical & Industrial Engineering ----------
  { name: "Centrifugal Pump", category: "mechanical", img: "pump", featured: true, sort: 1,
    blurb: "Pumps from 1.5 kW up to 132 kW — each fully engineered and now in production in the Middle East.",
    tags: ["CAD", "Drawings", "Industrial"] },
  { name: "Butterfly Valve", category: "mechanical", img: "valve", sort: 2,
    blurb: "Over 150 DWG drawings rebuilt as fully parametric 3D models with tolerances for PELICAN WORLDWIDE (NL).",
    tags: ["Autodesk Inventor", "Parametric"] },
  { name: "Crane Pipe Connections", category: "mechanical", img: "crane", sort: 3,
    blurb: "3D + 2D assemblies of LUG, PIPE, BUMP and BAYONET joints in 90° and 360° positions.",
    tags: ["Assembly", "Piping"] },
  { name: "Foam Dispenser", category: "mechanical", img: "foam", featured: true, sort: 4,
    blurb: "Complex multi-part assembly — adapter, seal, housing, washer and nut around a bent internal air-hose.",
    tags: ["Assembly", "Simulation"] },
  { name: "Two-Component Glue Mixer", category: "mechanical", img: "mixer", sort: 5,
    blurb: "Helical static mixer inside a housing, geometry tuned so two components blend fully in a single pass.",
    tags: ["CAD", "Flow"] },
  { name: "Pump Housing — Clamp", category: "mechanical", img: "clamp", sort: 6,
    blurb: "Print-ready pump-housing clamp delivered with fully dimensioned technical drawings.",
    tags: ["Print-ready", "Drawings"] },
  { name: "Ice Fishing Stand", category: "mechanical", img: "icefishing", sort: 7,
    blurb: "Complete 3D assembly of an ice-fishing stand with 2D general-dimension drawings.",
    tags: ["Assembly", "Product"] },
  { name: "Pergola Extrusion Kit", category: "mechanical", img: "pergola", sort: 8,
    blurb: "Pergola profiles with an internal aluminium reinforcement — four section variants.",
    tags: ["Extrusion", "Architecture"] },
  { name: "CNC Production Part", category: "mechanical", img: "cncpart", sort: 9,
    blurb: "Curved CNC part modelled from a 2D drawing and prepared for machining.",
    tags: ["CNC", "DFM"] },
  { name: "6061 Aluminium Bracket", category: "mechanical", img: "alu6061", sort: 10,
    blurb: "Motorsport bracket engineered for CNC machining from 6061 aluminium.",
    tags: ["CNC", "Automotive"] },
  { name: "DIY CNC Router Parts", category: "mechanical", img: "cncrouter", sort: 11,
    blurb: "Machined on a self-built, 3D-printed CNC router in 18 mm beech.",
    tags: ["CNC", "Woodwork"] },
  { name: "Massage Roller", category: "mechanical", img: "massager", sort: 12,
    blurb: "Foam-roller assembly with movable pins; hole and rod tolerances tuned for smooth motion.",
    tags: ["Assembly", "Consumer"] },
  { name: "T-Part", category: "mechanical", img: "tpart", sort: 13,
    blurb: "Print-ready component supplied with complete section-view documentation.",
    tags: ["Print-ready", "Docs"] },

  // ---------- Product Design & 3D Modeling ----------
  { name: "The Back Dragon", category: "product", img: "backdragon", featured: true, sort: 14,
    blurb: "Flagship back-massage product — one end heats a ceramic ball to 100 °C, the other cools, all without melting the plastic. Shown at lectures in the USA.",
    tags: ["Product Design", "Prototype"] },
  { name: "Toothbrush", category: "product", img: "toothbrush", sort: 15,
    blurb: "Two-tone toothbrush prototype modelled and prepared for 3D printing.",
    tags: ["Product Design", "Consumer"] },
  { name: "Razer Naga Mouse", category: "product", img: "mouse", featured: true, sort: 16,
    blurb: "An existing gaming mouse reverse-measured part-by-part and rebuilt in SolidWorks.",
    tags: ["Reverse Eng.", "SolidWorks"] },
  { name: "Car Seat", category: "product", img: "carseat", sort: 17,
    blurb: "Automotive seat cushion modelled directly from a 3D scan file.",
    tags: ["Scan-to-CAD", "Automotive"] },
  { name: "Sophia Shelf", category: "product", img: "shelf", sort: 18,
    blurb: "Self-adjusting minimalist shelf for architecture studio Saana — buyers choose their own dimensions.",
    tags: ["Furniture", "Product Design"] },
  { name: "Trash Bin", category: "product", img: "trashbin", sort: 19,
    blurb: "A workshop sketch refined into a full technical assembly and finished renders.",
    tags: ["Sheet Metal", "Product"] },
  { name: "iPhone Case", category: "product", img: "iphonecase", sort: 20,
    blurb: "Perforated protective case modelled with full dimensioning.",
    tags: ["Product Design", "Consumer"] },
  { name: "Wheel Rim", category: "product", img: "rim", featured: true, sort: 21,
    blurb: "Modern wheel-model prototypes for a rim manufacturer, prototyped and 3D printed.",
    tags: ["Automotive", "Prototype"] },
  { name: "Plastic Bouquet", category: "product", img: "bouquet", sort: 22,
    blurb: "Decorative tulip-bouquet vase modelled and rendered for production.",
    tags: ["Product Design", "Consumer"] },
  { name: "Fishing Bait", category: "product", img: "fishingbait", sort: 23,
    blurb: "Designed and prototyped for a Danish company — now their best-selling bait.",
    tags: ["Product Design", "Prototype"] },
  { name: "Children's Toy Car", category: "product", img: "toycar", sort: 24,
    blurb: "Pull-back toy car with a full internal gear-train, designed and printed.",
    tags: ["Mechanism", "Toy"] },
  { name: "Benda Pals Toy", category: "product", img: "bendapals", sort: 25,
    blurb: "Poseable creature toy with head, limbs and wings modelled separately for printing.",
    tags: ["Toy", "Print-ready"] },
  { name: "Front Man Mask", category: "product", img: "frontman", sort: 26,
    blurb: "Low-poly character mask, modelled and 3D printed.",
    tags: ["Cosplay", "Print"] },
  { name: "Alfa Romeo Grille", category: "product", img: "alfagrill", sort: 27,
    blurb: "A 40 × 35 cm front honeycomb grille for Alfa Romeo.",
    tags: ["Automotive", "Print"] },
  { name: "Rain Barrel", category: "product", img: "rainbarrel", sort: 28,
    blurb: "From a customer photo and sketch to a finished rain-barrel with a matching step stool.",
    tags: ["Concept-to-Part", "Product"] },
  { name: "Cooling Station", category: "product", img: "coolingstation", sort: 29,
    blurb: "200 mm-fan cooling station split into two printable pieces to cut cost and support.",
    tags: ["Product Design", "DFM"] },

  // ---------- 3D Printing & Reverse Engineering ----------
  { name: "PET-G Replacement Parts", category: "printing", img: "petg", sort: 30,
    blurb: "Reverse-engineered replacement parts you can't buy anywhere, printed in PET-G.",
    tags: ["Reverse Eng.", "PET-G"] },
  { name: "Taipei 101", category: "printing", img: "taipei", featured: true, sort: 31,
    blurb: "Architectural scale model, modelled and 3D printed as a single piece.",
    tags: ["Scale Model", "Print"] },
  { name: "Reverse-Engineered Impeller", category: "printing", img: "impeller", featured: true, sort: 32,
    blurb: "Machine impeller rebuilt and printed with 5 walls at 100 % infill (250 g).",
    tags: ["Reverse Eng.", "Heavy-duty"] },
  { name: "PET-G Galaxy Sprocket", category: "printing", img: "petggear", sort: 33,
    blurb: "Factory machine sprocket 3D printed in PET-G for multi-purpose production.",
    tags: ["PET-G", "Spare Part"] },
  { name: "Biathlon Rifle Sight Part", category: "printing", img: "biathlon", sort: 34,
    blurb: "3D-printed sight component — 25 g vs 250 g makes a big difference over half a metre.",
    tags: ["Print", "Lightweight"] },
  { name: "Textured Bowls", category: "printing", img: "bowls", sort: 35,
    blurb: "Decorative faceted bowl printed to a salon's exact specification.",
    tags: ["Print", "Decorative"] },
  { name: "Devotional Statues", category: "printing", img: "statues", sort: 36,
    blurb: "Madonna statues printed at 20, 30 and 50 cm.",
    tags: ["Print", "Sculpture"] },
  { name: "GoPro Tank Mount", category: "printing", img: "gopro", sort: 37,
    blurb: "GoPro mount for a motorcycle tank, printed in PET-G at 100 % infill.",
    tags: ["PET-G", "Automotive"] },
];

export const SEED_PROJECTS: Project[] = raw.map((p) => {
  const { img, ...rest } = p;
  return { ...rest, slug: slugify(p.name), image_url: `/projects/${img}.jpg` };
});

export const SEED_POSTS: Post[] = [
  {
    slug: "welcome-to-the-protoform-journal",
    title: "Welcome to the PROTOFORM journal",
    excerpt:
      "Notes from the workshop — how we take a sketch, a scan or an old 2D drawing and turn it into a real, manufacturable part.",
    cover_url: "/projects/bom.jpg",
    tags: ["Studio", "Process"],
    published: true,
    created_at: "2026-07-01T09:00:00Z",
    body:
      "## From idea to physical part\n\nEvery project starts the same way: a conversation about what the part has to **do**. From there we build precise, editable CAD geometry, prove it with the right calculations, and put a real prototype in your hands.\n\n- Detailed 3D design + engineering\n- Design for manufacturing\n- Complete bill of materials\n- Calculations & simulations\n- Print-ready models with drawings\n\nThis journal is where we'll share build notes, material choices and the odd war story from the bench.",
  },
  {
    slug: "why-pet-g-for-replacement-parts",
    title: "Why we reach for PET-G on replacement parts",
    excerpt:
      "When a part can't be bought anymore, PET-G is often the sweet spot between strength, temperature tolerance and printability.",
    cover_url: "/projects/petg.jpg",
    tags: ["Materials", "3D Printing"],
    published: true,
    created_at: "2026-07-10T09:00:00Z",
    body:
      "## The replacement-part problem\n\nDiscontinued parts are everywhere — a bracket, a clip, a sprocket that no supplier stocks any more. Reverse-engineering them and printing in **PET-G** gives a tough, slightly flexible part that survives real use.\n\nWe've printed everything from factory sprockets to GoPro tank mounts at 100% infill this way.",
  },
];
