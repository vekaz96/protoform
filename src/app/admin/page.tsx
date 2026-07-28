import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import AdminBar from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Project, Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = createClient();
  const [{ data: projects }, { data: posts }] = await Promise.all([
    supabase.from("projects").select("*").order("sort", { ascending: true }),
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
  ]);

  const projList = (projects as Project[]) || [];
  const postList = (posts as Post[]) || [];

  return (
    <>
      <AdminBar />
      <main className="admin">
        <h1>Content</h1>
        <p className="admin__sub">Add and edit the projects and blog posts that appear on the site.</p>

        <section className="admin__section">
          <div className="admin__head">
            <h2>Projects · {projList.length}</h2>
            <Link className="btn btn--sm" href="/admin/projects/new">+ New project</Link>
          </div>
          <table className="atable">
            <thead>
              <tr><th></th><th>Name</th><th>Category</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {projList.map((p) => (
                <tr key={p.id}>
                  <td className="thumb">{p.image_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.image_url} alt="" />}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td><span className={`pill ${p.published ? "on" : "off"}`}>{p.published ? "live" : "draft"}</span></td>
                  <td>
                    <div className="actions">
                      <Link className="edit" href={`/admin/projects/${p.id}`}>Edit</Link>
                      <DeleteButton table="projects" id={p.id!} />
                    </div>
                  </td>
                </tr>
              ))}
              {projList.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No projects yet.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="admin__section">
          <div className="admin__head">
            <h2>Blog posts · {postList.length}</h2>
            <Link className="btn btn--sm" href="/admin/posts/new">+ New post</Link>
          </div>
          <table className="atable">
            <thead>
              <tr><th></th><th>Title</th><th>Tags</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {postList.map((p) => (
                <tr key={p.id}>
                  <td className="thumb">{p.cover_url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.cover_url} alt="" />}</td>
                  <td>{p.title}</td>
                  <td>{(p.tags || []).join(", ")}</td>
                  <td><span className={`pill ${p.published ? "on" : "off"}`}>{p.published ? "live" : "draft"}</span></td>
                  <td>
                    <div className="actions">
                      <Link className="edit" href={`/admin/posts/${p.id}`}>Edit</Link>
                      <DeleteButton table="posts" id={p.id!} />
                    </div>
                  </td>
                </tr>
              ))}
              {postList.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--muted)" }}>No posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
