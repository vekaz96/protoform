/*
 * Generates the seed migrations in supabase/migrations/ from src/lib/data.ts
 * Run: node scripts/generate-seed-migration.mjs
 *
 * Output is split into two files so that already-applied migrations keep their
 * checksum and `supabase db push` stays happy:
 *
 *   20260728151000_seed_projects_and_posts.sql  original catalogue + blog posts
 *   20260728160000_seed_2026_portfolio.sql      projects imported from a
 *                                               presentation board (`sheet: true`)
 *
 * Adding a new batch? Give it its own marker + output file here rather than
 * folding it into an existing one.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadSeed() {
  const src = readFileSync(join(root, "src/lib/data.ts"), "utf8");
  const block = src.slice(src.indexOf("const raw"), src.indexOf("export const SEED_PROJECTS"));
  // eslint-disable-next-line no-new-func
  const raw = Function(
    `"use strict";const raw=${block.slice(block.indexOf("["), block.lastIndexOf("]") + 1)};return raw;`
  )();
  const postsStart = src.indexOf("export const SEED_POSTS: Post[] = [");
  const postsEnd = src.indexOf("];", postsStart) + 1;
  const postsArr = src.slice(postsStart, postsEnd).replace(/^export const SEED_POSTS[^=]*=\s*/, "");
  // eslint-disable-next-line no-new-func
  const posts = Function(`"use strict";return ${postsArr};`)();
  return { raw, posts };
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlTags(tags) {
  if (!tags?.length) return "'{}'::text[]";
  return `ARRAY[${tags.map((t) => sqlStr(t)).join(", ")}]`;
}

function dollarTag(body) {
  const tag = `body_${Math.random().toString(36).slice(2, 10)}`;
  return `$${tag}$${body}$${tag}$`;
}

const { raw, posts } = loadSeed();

function projectRow(p) {
  const slug = slugify(p.name);
  const imageUrl = `/projects/${p.img}.jpg`;
  // Sheet projects carry the cropped card render plus the full project board.
  const urls = p.sheet ? [imageUrl, `/projects/sheets/${p.img}.jpg`] : [imageUrl];
  const urlArray = `ARRAY[${urls.map((u) => sqlStr(u)).join(", ")}]`;
  return `  (${sqlStr(slug)}, ${sqlStr(p.name)}, ${sqlStr(p.category)}, ${sqlStr(imageUrl)}, ${urlArray}, ${sqlStr(p.blurb)}, ${sqlTags(p.tags)}, ${p.featured ? "true" : "false"}, true, ${p.sort ?? 0})`;
}

const projectRows = raw.filter((p) => !p.sheet).map(projectRow);
const sheetRows = raw.filter((p) => p.sheet).map(projectRow);

const postRows = posts.map((p) => {
  const cover = p.cover_url ? sqlStr(p.cover_url) : "NULL";
  const created = p.created_at ? sqlStr(p.created_at) : "now()";
  return `  (${sqlStr(p.slug)}, ${sqlStr(p.title)}, ${sqlStr(p.excerpt)}, ${cover}, ${dollarTag(p.body)}, ${sqlTags(p.tags)}, ${p.published ? "true" : "false"}, ${created})`;
});

const sql = `-- Seed PROTOFORM projects + blog posts from src/lib/data.ts
-- Safe to re-run: skips rows that already exist (by slug).
-- Image URLs point at /projects/*.jpg in public/ — edit in /admin or paste any https URL.
-- Regenerate: node scripts/generate-seed-migration.mjs

INSERT INTO public.projects (slug, name, category, image_url, image_urls, blurb, tags, featured, published, sort)
VALUES
${projectRows.join(",\n")}
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.posts (slug, title, excerpt, cover_url, body, tags, published, created_at)
VALUES
${postRows.join(",\n")}
ON CONFLICT (slug) DO NOTHING;
`;

/*
 * The original seed migration has already been applied to live databases, and
 * the checked-in copy predates the image_urls column — rewriting it would change
 * its checksum and break `supabase db push` without adding a single row (every
 * INSERT is ON CONFLICT DO NOTHING). Pass --rewrite-base only when rebuilding
 * migration history from scratch.
 */
const out = join(root, "supabase/migrations/20260728151000_seed_projects_and_posts.sql");
if (process.argv.includes("--rewrite-base")) {
  writeFileSync(out, sql);
  console.log(`✓ wrote ${out} (${projectRows.length} projects, ${posts.length} posts)`);
} else {
  console.log(`· skipped ${out} (already applied — pass --rewrite-base to force)`);
}

const sheetSql = `-- PROTOFORM 2026 portfolio — projects imported from Presentation_20260727.pdf
-- Safe to re-run: skips rows that already exist (by slug).
-- Each row carries two images: the cropped card render and the full project
-- sheet (renders, views, dimensioned drawings, specs) as the second gallery
-- image. Edit either one in /admin, or paste any https URL.
-- Regenerate: node scripts/generate-seed-migration.mjs

INSERT INTO public.projects (slug, name, category, image_url, image_urls, blurb, tags, featured, published, sort)
VALUES
${sheetRows.join(",\n")}
ON CONFLICT (slug) DO NOTHING;
`;

const sheetOut = join(root, "supabase/migrations/20260728160000_seed_2026_portfolio.sql");
writeFileSync(sheetOut, sheetSql);
console.log(`✓ wrote ${sheetOut} (${sheetRows.length} projects)`);
