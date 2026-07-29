"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/data";
import type { Project } from "@/lib/types";
import { projectImages } from "@/lib/project-images";
import ImageListField from "./ImageListField";

const EMPTY: Project = {
  slug: "", name: "", category: "mechanical", image_url: "",
  image_urls: [], blurb: "", tags: [], featured: false, published: true, sort: 0,
};

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const supabase = createClient();
  const editing = !!initial?.id;
  const [p, setP] = useState<Project>(initial ?? EMPTY);
  const [imageUrls, setImageUrls] = useState<string[]>(() => projectImages(initial ?? EMPTY));
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((s) => ({ ...s, [k]: v }));

  const onName = (name: string) => {
    setP((s) => ({ ...s, name, slug: s.slug && editing ? s.slug : slugify(name) }));
  };

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const key = `projects/${p.slug || slugify(p.name) || Date.now()}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(key, file, { upsert: true });
    if (error) throw new Error(error.message);
    return supabase.storage.from("media").getPublicUrl(key).data.publicUrl;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const urls = imageUrls.map((u) => u.trim()).filter(Boolean);
    const row = {
      ...p,
      slug: p.slug || slugify(p.name),
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      sort: Number(p.sort) || 0,
      image_urls: urls,
      image_url: urls[0] ?? "",
    };
    const { error } = editing
      ? await supabase.from("projects").update(row).eq("id", initial!.id!)
      : await supabase.from("projects").insert(row);
    setBusy(false);
    if (error) { setMsg("Save failed: " + error.message); return; }
    router.push("/admin");
    router.refresh();
  };

  const improveBlurb = async () => {
    if (!p.name.trim()) {
      setMsg("Add a project name first.");
      return;
    }
    setAiBusy(true);
    setMsg("Improving blurb with AI…");
    try {
      const resp = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "project",
          name: p.name,
          category: p.category,
          tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
          current: p.blurb,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || "Failed to improve blurb.");
      }
      set("blurb", data.text);
      setMsg("Blurb improved ✓");
    } catch (e) {
      setMsg("AI failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <form className="aform" onSubmit={save}>
      <div className="row">
        <div><label>Name</label><input value={p.name} onChange={(e) => onName(e.target.value)} required /></div>
        <div><label>Slug</label><input value={p.slug} onChange={(e) => set("slug", e.target.value)} /></div>
      </div>
      <div className="row">
        <div>
          <label>Category</label>
          <select value={p.category} onChange={(e) => set("category", e.target.value as Project["category"])}>
            <option value="mechanical">Mechanical &amp; Industrial</option>
            <option value="product">Product Design &amp; 3D Modeling</option>
            <option value="printing">3D Printing &amp; Reverse Engineering</option>
          </select>
        </div>
        <div><label>Sort order</label><input type="number" value={p.sort ?? 0} onChange={(e) => set("sort", Number(e.target.value))} /></div>
      </div>

      <ImageListField
        label="Images"
        urls={imageUrls}
        onChange={setImageUrls}
        onUpload={uploadImage}
        onStatus={setMsg}
      />

      <div>
        <div className="aform__labelrow">
          <label>Blurb</label>
          <button className="btn btn--ghost btn--sm" type="button" onClick={improveBlurb} disabled={aiBusy}>
            {aiBusy ? "Improving…" : "Improve with AI"}
          </button>
        </div>
        <textarea style={{ minHeight: 90 }} value={p.blurb} onChange={(e) => set("blurb", e.target.value)} />
      </div>
      <div><label>Tags (comma separated)</label><input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="CAD, Drawings, Industrial" /></div>

      <div className="row">
        <label className="check"><input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label>
        <label className="check"><input type="checkbox" checked={!!p.published} onChange={(e) => set("published", e.target.checked)} /> Published (visible on site)</label>
      </div>

      <div className="aform__actions">
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create project"}</button>
        <button className="btn btn--ghost" type="button" onClick={() => router.push("/admin")}>Cancel</button>
        {msg && <span className={`amsg ${msg.includes("failed") ? "err" : "ok"}`}>{msg}</span>}
      </div>
    </form>
  );
}
