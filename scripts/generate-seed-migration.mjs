/*
 * Generates supabase/migrations/*_seed_projects_and_posts.sql from src/lib/data.ts
 * Run: node scripts/generate-seed-migration.mjs
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

const projectRows = raw.map((p) => {
  const slug = slugify(p.name);
  const imageUrl = `/projects/${p.img}.jpg`;
  return `  (${sqlStr(slug)}, ${sqlStr(p.name)}, ${sqlStr(p.category)}, ${sqlStr(imageUrl)}, ARRAY[${sqlStr(imageUrl)}], ${sqlStr(p.blurb)}, ${sqlTags(p.tags)}, ${p.featured ? "true" : "false"}, true, ${p.sort ?? 0})`;
});

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

const out = join(root, "supabase/migrations/20260728151000_seed_projects_and_posts.sql");
writeFileSync(out, sql);
console.log(`✓ wrote ${out} (${raw.length} projects, ${posts.length} posts)`);
