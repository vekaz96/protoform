"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/data";
import type { Post } from "@/lib/types";

const EMPTY: Post = {
  slug: "", title: "", excerpt: "", cover_url: "", body: "", tags: [], published: false,
};

export default function PostForm({ initial }: { initial?: Post }) {
  const router = useRouter();
  const supabase = createClient();
  const editing = !!initial?.id;
  const [p, setP] = useState<Post>(initial ?? EMPTY);
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((s) => ({ ...s, [k]: v }));
  const onTitle = (title: string) =>
    setP((s) => ({ ...s, title, slug: s.slug && editing ? s.slug : slugify(title) }));

  const upload = async (file: File) => {
    setMsg("Uploading cover…");
    const ext = file.name.split(".").pop() || "jpg";
    const key = `posts/${p.slug || slugify(p.title) || Date.now()}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(key, file, { upsert: true });
    if (error) { setMsg("Upload failed: " + error.message); return; }
    set("cover_url", supabase.storage.from("media").getPublicUrl(key).data.publicUrl);
    setMsg("Cover uploaded ✓");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const row = {
      ...p,
      slug: p.slug || slugify(p.title),
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      cover_url: p.cover_url || null,
    };
    const { error } = editing
      ? await supabase.from("posts").update(row).eq("id", initial!.id!)
      : await supabase.from("posts").insert(row);
    setBusy(false);
    if (error) { setMsg("Save failed: " + error.message); return; }
    router.push("/admin");
    router.refresh();
  };

  return (
    <form className="aform" onSubmit={save}>
      <div className="row">
        <div><label>Title</label><input value={p.title} onChange={(e) => onTitle(e.target.value)} required /></div>
        <div><label>Slug</label><input value={p.slug} onChange={(e) => set("slug", e.target.value)} /></div>
      </div>
      <div><label>Excerpt</label><textarea style={{ minHeight: 70 }} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></div>

      <div>
        <label>Cover image</label>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {p.cover_url && /* eslint-disable-next-line @next/next/no-img-element */ <img className="imgprev" src={p.cover_url} alt="" />}
          <div style={{ flex: 1, minWidth: 220 }}>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <input style={{ marginTop: ".6rem" }} placeholder="…or paste an image URL" value={p.cover_url ?? ""} onChange={(e) => set("cover_url", e.target.value)} />
          </div>
        </div>
      </div>

      <div><label>Body (Markdown)</label><textarea value={p.body} onChange={(e) => set("body", e.target.value)} placeholder="## Heading&#10;&#10;Write your post in **markdown**…" /></div>
      <div><label>Tags (comma separated)</label><input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Materials, 3D Printing" /></div>

      <label className="check"><input type="checkbox" checked={!!p.published} onChange={(e) => set("published", e.target.checked)} /> Published (visible on site)</label>

      <div className="aform__actions">
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create post"}</button>
        <button className="btn btn--ghost" type="button" onClick={() => router.push("/admin")}>Cancel</button>
        {msg && <span className={`amsg ${msg.includes("failed") ? "err" : "ok"}`}>{msg}</span>}
      </div>
    </form>
  );
}
