"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminBar() {
  const router = useRouter();
  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <div className="admin__bar">
      <Link className="brand" href="/admin">
        PROTO<em style={{ color: "var(--accent)" }}>FORM</em> · admin
      </Link>
      <nav>
        <Link href="/admin">Dashboard</Link>
        <Link href="/" target="_blank">
          View site ↗
        </Link>
        <button className="btn btn--sm btn--danger" onClick={signOut}>
          Sign out
        </button>
      </nav>
    </div>
  );
}
