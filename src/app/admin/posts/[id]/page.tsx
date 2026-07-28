import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import AdminBar from "@/components/admin/AdminBar";
import PostForm from "@/components/admin/PostForm";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", params.id).single();
  if (!data) notFound();
  return (
    <>
      <AdminBar />
      <main className="admin">
        <h1>Edit post</h1>
        <p className="admin__sub">{(data as Post).title}</p>
        <PostForm initial={data as Post} />
      </main>
    </>
  );
}
