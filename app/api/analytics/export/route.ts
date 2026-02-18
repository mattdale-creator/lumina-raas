import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// PRD 10: CSV export of all outcomes
export async function GET() {
  const { data } = await supabaseAdmin
    .from("outcomes")
    .select("id, title, status, amount_cents, created_at, delivered_at, verified_at")
    .order("created_at", { ascending: false });

  const rows = data || [];
  const csv =
    "id,title,status,amount_aud,created_at,delivered_at,verified_at\n" +
    rows
      .map(
        (o) =>
          `${o.id},"${(o.title || "").replace(/"/g, '""')}",${o.status},${((o.amount_cents || 0) / 100).toFixed(2)},${o.created_at},${o.delivered_at || ""},${o.verified_at || ""}`
      )
      .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="raas-outcomes.csv"',
    },
  });
}
