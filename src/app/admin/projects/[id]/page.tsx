import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import AdminBar from "@/components/admin/AdminBar";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProject({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!data) notFound();
  return (
    <>
      <AdminBar />
      <main className="admin">
        <h1>Edit project</h1>
        <p className="admin__sub">{(data as Project).name}</p>
        <ProjectForm initial={data as Project} />
      </main>
    </>
  );
}
