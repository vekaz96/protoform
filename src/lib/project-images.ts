import type { Project } from "./types";

/** All image URLs for a project (gallery), normalized from DB or legacy image_url. */
export function projectImages(p: Project): string[] {
  if (p.image_urls?.length) return p.image_urls.filter(Boolean);
  if (p.image_url) return [p.image_url];
  return [];
}

/** Cover / thumbnail — first gallery image. */
export function projectCover(p: Project): string {
  return projectImages(p)[0] ?? "";
}

/** Normalize a row from Supabase so image_url and image_urls stay in sync. */
export function normalizeProject(row: Project): Project {
  const urls = row.image_urls?.filter(Boolean) ?? [];
  if (urls.length) {
    return { ...row, image_urls: urls, image_url: urls[0] };
  }
  if (row.image_url) {
    return { ...row, image_urls: [row.image_url] };
  }
  return { ...row, image_urls: [], image_url: "" };
}
