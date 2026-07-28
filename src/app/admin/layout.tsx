import { hasSupabase } from "@/lib/supabase/server";

export const metadata = { title: "Admin — PROTOFORM" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabase()) {
    return (
      <div className="loginwrap">
        <div className="loginbox">
          <h1>Admin</h1>
          <p className="amsg err">Supabase isn&apos;t connected yet.</p>
          <p style={{ color: "var(--muted)", marginTop: ".8rem", fontSize: ".92rem", lineHeight: 1.6 }}>
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            and <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code>, run{" "}
            <code>supabase/schema.sql</code> and <code>node scripts/setup.mjs</code>, then restart the
            dev server.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
