import "server-only";
import { createClient, hasSupabase } from "./supabase/server";
import { SEED_PROJECTS, SEED_POSTS } from "./data";
import type { Project, Post } from "./types";

/*
 * Data access with graceful fallback.
 * Before Supabase env vars are set (or if a query fails during setup), the site
 * serves the built-in seed so it always renders. Once the database is connected
 * and populated, everything reads from Supabase automatically.
 */

export async function getProjects(): Promise<Project[]> {
  if (!hasSupabase()) return SEED_PROJECTS;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort", { ascending: true });
    if (error || !data || data.length === 0) return SEED_PROJECTS;
    return data as Project[];
  } catch {
    return SEED_PROJECTS;
  }
}

export async function getFeaturedProjects(limit = 7): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  if (!hasSupabase()) return SEED_POSTS;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error || !data) return SEED_POSTS;
    return data as Post[];
  } catch {
    return SEED_POSTS;
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
