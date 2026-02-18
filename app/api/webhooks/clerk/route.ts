import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logRaaS } from "@/lib/logger";

// Clerk webhook – syncs users to Supabase (PRD 5)
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const email =
        data.email_addresses?.[0]?.email_address || "unknown@email.com";
      const fullName =
        `${data.first_name || ""} ${data.last_name || ""}`.trim() || email;

      await supabaseAdmin.from("users").upsert(
        {
          auth_id: data.id,
          email,
          full_name: fullName,
          role: (data.private_metadata?.role as string) || "user",
        },
        { onConflict: "auth_id" }
      );

      // Also create default notification preferences
      if (type === "user.created") {
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("auth_id", data.id)
          .single();

        if (user) {
          await supabaseAdmin
            .from("notification_preferences")
            .upsert({ user_id: user.id }, { onConflict: "user_id" });
        }
      }

      logRaaS("user_synced", { authId: data.id, type });
    }

    if (type === "user.deleted") {
      await supabaseAdmin.from("users").delete().eq("auth_id", data.id);
      logRaaS("user_deleted", { authId: data.id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Clerk Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
