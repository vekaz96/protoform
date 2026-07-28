"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteButton({ table, id }: { table: "projects" | "posts"; id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const del = async () => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    const { error } = await createClient().from(table).delete().eq("id", id);
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  };

  return (
    <button className="btn btn--sm btn--danger" onClick={del} disabled={busy}>
      {busy ? "…" : "Delete"}
    </button>
  );
}
