import { requireAdmin } from "@/lib/supabase/require-admin";
import AdminBar from "@/components/admin/AdminBar";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProject() {
  await requireAdmin();
  return (
    <>
      <AdminBar />
      <main className="admin">
        <h1>New project</h1>
        <p className="admin__sub">Add a project to the portfolio.</p>
        <ProjectForm />
      </main>
    </>
  );
}
