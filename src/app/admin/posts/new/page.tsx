import { requireAdmin } from "@/lib/supabase/require-admin";
import AdminBar from "@/components/admin/AdminBar";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  await requireAdmin();
  return (
    <>
      <AdminBar />
      <main className="admin">
        <h1>New post</h1>
        <p className="admin__sub">Write a blog post in markdown.</p>
        <PostForm />
      </main>
    </>
  );
}
