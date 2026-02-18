import { z } from "zod";
import { router, adminProcedure } from "@/lib/trpc";
import { supabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/lib/logger";

export const adminRouter = router({
  // Get all users
  getAllUsers: adminProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  }),

  // Get all outcomes (admin view)
  getAllOutcomes: adminProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("outcomes")
      .select("*, users(email, full_name)")
      .order("created_at", { ascending: false });
    return data || [];
  }),

  // Bulk verify outcomes
  bulkVerifyOutcomes: adminProcedure
    .input(z.object({ outcomeIds: z.array(z.string().uuid()) }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await supabaseAdmin
        .from("outcomes")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .in("id", input.outcomeIds);

      if (error) throw new Error(error.message);

      await logAudit(
        "bulk_verify_outcomes",
        ctx.userId,
        "outcomes",
        input.outcomeIds.join(","),
        { count: input.outcomeIds.length }
      );

      return { success: true, count: input.outcomeIds.length };
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(["user", "paid_user", "admin"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await supabaseAdmin
        .from("users")
        .update({ role: input.role })
        .eq("id", input.userId);

      if (error) throw new Error(error.message);

      await logAudit("update_user_role", ctx.userId, "user", input.userId, {
        newRole: input.role,
      });

      return { success: true };
    }),

  // Get all Aether leads
  getAllLeads: adminProcedure.query(async () => {
    const { data } = await supabaseAdmin
      .from("aether_leads")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  }),

  // Get audit logs
  getAuditLogs: adminProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const { data } = await supabaseAdmin
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(input?.limit || 100);
      return data || [];
    }),

  // Get dashboard stats
  getStats: adminProcedure.query(async () => {
    const [users, outcomes, leads] = await Promise.all([
      supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("outcomes").select("id, status, amount_cents"),
      supabaseAdmin
        .from("aether_leads")
        .select("id", { count: "exact", head: true }),
    ]);

    const outcomeData = outcomes.data || [];
    const totalRevenue = outcomeData
      .filter((o) => o.status === "paid")
      .reduce((acc, o) => acc + (o.amount_cents || 0), 0);

    return {
      totalUsers: users.count || 0,
      totalOutcomes: outcomeData.length,
      verifiedOutcomes: outcomeData.filter((o) => o.status === "verified")
        .length,
      paidOutcomes: outcomeData.filter((o) => o.status === "paid").length,
      totalRevenueCents: totalRevenue,
      totalLeads: leads.count || 0,
    };
  }),
});
