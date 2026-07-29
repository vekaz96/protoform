"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/data";
import type { Post } from "@/lib/types";
import ImageField from "./ImageField";

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
  const [aiBusy, setAiBusy] = useState(false);

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((s) => ({ ...s, [k]: v }));
  const onTitle = (title: string) =>
    setP((s) => ({ ...s, title, slug: s.slug && editing ? s.slug : slugify(title) }));

  const uploadCover = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const key = `posts/${p.slug || slugify(p.title) || Date.now()}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(key, file, { upsert: true });
    if (error) throw new Error(error.message);
    const url = supabase.storage.from("media").getPublicUrl(key).data.publicUrl;
    set("cover_url", url);
    return url;
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

  const improveExcerpt = async () => {
    if (!p.title.trim()) {
      setMsg("Add a post title first.");
      return;
    }
    setAiBusy(true);
    setMsg("Improving excerpt with AI…");
    try {
      const resp = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "post",
          title: p.title,
          tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
          current: p.excerpt,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || "Failed to improve excerpt.");
      }
      set("excerpt", data.text);
      setMsg("Excerpt improved ✓");
    } catch (e) {
      setMsg("AI failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <form className="aform" onSubmit={save}>
      <div className="row">
        <div><label>Title</label><input value={p.title} onChange={(e) => onTitle(e.target.value)} required /></div>
        <div><label>Slug</label><input value={p.slug} onChange={(e) => set("slug", e.target.value)} /></div>
      </div>
      <div>
        <div className="aform__labelrow">
          <label>Excerpt</label>
          <button className="btn btn--ghost btn--sm" type="button" onClick={improveExcerpt} disabled={aiBusy}>
            {aiBusy ? "Improving…" : "Improve with AI"}
          </button>
        </div>
        <textarea style={{ minHeight: 70 }} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>

      <ImageField
        label="Cover image"
        value={p.cover_url ?? ""}
        onChange={(url) => set("cover_url", url)}
        onUpload={uploadCover}
        onStatus={setMsg}
      />

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
