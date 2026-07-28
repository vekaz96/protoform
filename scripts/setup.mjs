/*
 * One-time setup: seeds the database and Storage from the built-in data.
 *
 *   1) Run supabase/schema.sql in the Supabase SQL Editor first.
 *   2) Fill .env.local with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 *      and SUPABASE_SERVICE_ROLE_KEY.
 *   3) node scripts/setup.mjs [admin-email] [admin-password]
 *
 * It will:
 *   - create the admin auth user (email confirmed)
 *   - upload the 37 project images from public/projects to the "media" bucket
 *   - insert the 37 projects (pointing image_url at the uploaded copies)
 *   - insert the seed blog posts
 * Re-running upserts by slug, so it's safe.
 */
import ws from "ws"; // Node < 22 has no global WebSocket, which supabase-js needs
globalThis.WebSocket ||= ws;
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// tiny .env.local reader (no dependency)
function loadEnv() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE || URL.includes("YOUR-PROJECT")) {
  console.error("✗ Fill NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.");
  process.exit(1);
}

const email = process.argv[2] || "admin@protoform.local";
const password = process.argv[3] || "changeme-" + Math.random().toString(36).slice(2, 10);

const supabase = createClient(URL, SERVICE, { auth: { persistSession: false } });

// load the seed straight from the TS source (regex — avoids a TS build step)
function loadSeed() {
  const src = readFileSync(join(root, "src/lib/data.ts"), "utf8");
  const block = src.slice(src.indexOf("const raw"), src.indexOf("export const SEED_PROJECTS"));
  // eslint-disable-next-line no-new-func
  const arr = Function(`"use strict";const raw=${block.slice(block.indexOf("["), block.lastIndexOf("]") + 1)};return raw;`)();
  return arr;
}
const slugify = (s) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  console.log("→ Supabase:", URL);

  // 1) admin user
  const { data: created, error: userErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (userErr && !/already/i.test(userErr.message)) throw userErr;
  console.log(userErr ? `• admin user already exists (${email})` : `✓ admin user created: ${email}`);
  if (!userErr) console.log(`  password: ${password}   ← save this`);

  // 2) ensure the public "media" bucket exists (schema.sql also creates it)
  {
    const { error } = await supabase.storage.createBucket("media", { public: true });
    if (error && !/already exists|resource already/i.test(error.message)) {
      console.warn("  ! createBucket:", error.message);
    } else {
      console.log("✓ storage bucket 'media' ready");
    }
  }

  // 3) images → Storage
  const raw = loadSeed();
  const map = {};
  for (const p of raw) {
    const file = join(root, "public/projects", `${p.img}.jpg`);
    if (!existsSync(file)) {
      console.warn(`  ! missing ${p.img}.jpg — leaving /projects path`);
      map[p.img] = `/projects/${p.img}.jpg`;
      continue;
    }
    const bytes = readFileSync(file);
    const key = `projects/${p.img}.jpg`;
    const { error } = await supabase.storage.from("media").upload(key, bytes, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) throw error;
    map[p.img] = supabase.storage.from("media").getPublicUrl(key).data.publicUrl;
  }
  console.log(`✓ uploaded ${Object.keys(map).length} images to Storage`);

  // 3) projects
  const rows = raw.map((p) => ({
    slug: slugify(p.name),
    name: p.name,
    category: p.category,
    image_url: map[p.img],
    blurb: p.blurb,
    tags: p.tags,
    featured: !!p.featured,
    published: true,
    sort: p.sort ?? 0,
  }));
  const { error: projErr } = await supabase.from("projects").upsert(rows, { onConflict: "slug" });
  if (projErr) throw projErr;
  console.log(`✓ upserted ${rows.length} projects`);

  // 4) seed posts (pull cover images too)
  const posts = [
    {
      slug: "welcome-to-the-protoform-journal",
      title: "Welcome to the PROTOFORM journal",
      excerpt:
        "Notes from the workshop — how we take a sketch, a scan or an old 2D drawing and turn it into a real, manufacturable part.",
      cover_url: map["bom"] || "/projects/bom.jpg",
      tags: ["Studio", "Process"],
      published: true,
      body:
        "## From idea to physical part\n\nEvery project starts the same way: a conversation about what the part has to **do**. From there we build precise, editable CAD geometry, prove it with the right calculations, and put a real prototype in your hands.\n\n- Detailed 3D design + engineering\n- Design for manufacturing\n- Complete bill of materials\n- Calculations & simulations\n- Print-ready models with drawings\n\nThis journal is where we'll share build notes, material choices and the odd war story from the bench.",
    },
    {
      slug: "why-pet-g-for-replacement-parts",
      title: "Why we reach for PET-G on replacement parts",
      excerpt:
        "When a part can't be bought anymore, PET-G is often the sweet spot between strength, temperature tolerance and printability.",
      cover_url: map["petg"] || "/projects/petg.jpg",
      tags: ["Materials", "3D Printing"],
      published: true,
      body:
        "## The replacement-part problem\n\nDiscontinued parts are everywhere — a bracket, a clip, a sprocket that no supplier stocks any more. Reverse-engineering them and printing in **PET-G** gives a tough, slightly flexible part that survives real use.\n\nWe've printed everything from factory sprockets to GoPro tank mounts at 100% infill this way.",
    },
  ];
  const { error: postErr } = await supabase.from("posts").upsert(posts, { onConflict: "slug" });
  if (postErr) throw postErr;
  console.log(`✓ upserted ${posts.length} blog posts`);

  console.log("\n✅ Done. Restart `pnpm dev` and the site now reads from Supabase.");
  console.log(`   Admin login: ${email}`);
}

main().catch((e) => {
  console.error("✗ setup failed:", e.message || e);
  process.exit(1);
});
