import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc";
import { supabaseAdmin } from "@/lib/supabase";
import { logRaaS } from "@/lib/logger";

export const outcomeRouter = router({
  // Create a new RaaS outcome
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        prdId: z.string().optional(),
        successCriteria: z.string().optional(),
        amountCents: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdmin
        .from("outcomes")
        .insert({
          user_id: ctx.dbUser.id,
          title: input.title,
          description: input.description || null,
          prd_id: input.prdId || null,
          success_criteria: input.successCriteria || null,
          amount_cents: input.amountCents || 0,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      logRaaS("outcome_created", { outcomeId: data.id }, ctx.userId);
      return { outcomeId: data.id, status: "pending" };
    }),

  // Get all outcomes for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabaseAdmin
      .from("outcomes")
      .select("*")
      .eq("user_id", ctx.dbUser.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }),

  // Get a single outcome by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdmin
        .from("outcomes")
        .select("*")
        .eq("id", input.id)
        .eq("user_id", ctx.dbUser.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // Verify an outcome (marks as verified, triggers payment if applicable)
  verify: protectedProcedure
    .input(z.object({ outcomeId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdmin
        .from("outcomes")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", input.outcomeId)
        .eq("user_id", ctx.dbUser.id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // If there's an amount, trigger payment
      if (data.amount_cents > 0) {
        await supabaseAdmin
          .from("outcomes")
          .update({ payment_triggered: true })
          .eq("id", input.outcomeId);
      }

      logRaaS("outcome_verified", { outcomeId: input.outcomeId }, ctx.userId);
      return { success: true, paymentRequired: data.amount_cents > 0 };
    }),

  // Update outcome status
  updateStatus: protectedProcedure
    .input(
      z.object({
        outcomeId: z.string().uuid(),
        status: z.enum([
          "pending",
          "in_progress",
          "delivered",
          "verified",
          "paid",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updates: Record<string, unknown> = { status: input.status };
      if (input.status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      }
      if (input.status === "verified") {
        updates.verified_at = new Date().toISOString();
      }

      const { error } = await supabaseAdmin
        .from("outcomes")
        .update(updates)
        .eq("id", input.outcomeId)
        .eq("user_id", ctx.dbUser.id);

      if (error) throw new Error(error.message);
      logRaaS("outcome_status_updated", {
        outcomeId: input.outcomeId,
        status: input.status,
      });
      return { success: true };
    }),
});
