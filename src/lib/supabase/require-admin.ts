import { redirect } from "next/navigation";
import { createClient, hasSupabase } from "./server";

/** Server helper: returns the signed-in user, or redirects to the login page. */
export async function requireAdmin() {
  if (!hasSupabase()) redirect("/admin/login");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
