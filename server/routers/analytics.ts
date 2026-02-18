import { router, protectedProcedure, adminProcedure } from "@/lib/trpc";
import { supabaseAdmin } from "@/lib/supabase";

export const analyticsRouter = router({
  // Get outcome metrics for current user
  getMyMetrics: protectedProcedure.query(async ({ ctx }) => {
    const { data: outcomes } = await supabaseAdmin
      .from("outcomes")
      .select("*")
      .eq("user_id", ctx.dbUser.id);

    const total = outcomes?.length || 0;
    const delivered = outcomes?.filter((o) => o.status === "delivered").length || 0;
    const verified = outcomes?.filter((o) => o.status === "verified").length || 0;
    const paid = outcomes?.filter((o) => o.status === "paid").length || 0;

    return { total, delivered, verified, paid };
  }),

  // Admin: Get all RaaS metrics
  getAllMetrics: adminProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("raas_metrics")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(200);
    return data || [];
  }),

  // Admin: Get Aether campaign metrics
  getAetherMetrics: adminProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("aether_campaign_metrics")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  }),

  // Admin: Get outcome delivery stats for charts
  getDeliveryStats: adminProcedure.query(async () => {
    const { data: outcomes } = await supabaseAdmin
      .from("outcomes")
      .select("id, title, status, created_at, delivered_at, verified_at, amount_cents")
      .order("created_at", { ascending: false })
      .limit(50);

    return (outcomes || []).map((o) => {
      const created = new Date(o.created_at).getTime();
      const delivered = o.delivered_at ? new Date(o.delivered_at).getTime() : null;
      const deliveryMinutes = delivered
        ? Math.round((delivered - created) / 60000)
        : null;

      return {
        id: o.id,
        title: o.title,
        status: o.status,
        deliveryMinutes,
        amountCents: o.amount_cents,
        date: new Date(o.created_at).toLocaleDateString(),
      };
    });
  }),

  // Export outcomes as JSON (CSV is done via dedicated endpoint)
  exportOutcomes: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await supabaseAdmin
      .from("outcomes")
      .select("*")
      .eq("user_id", ctx.dbUser.id)
      .order("created_at", { ascending: false });
    return data || [];
  }),
});
