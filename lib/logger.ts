// Structured RaaS event logger (PRD 12)
// Logs to console in dev; integrates with Sentry in production

export function logRaaS(
  event: string,
  details: Record<string, unknown> = {},
  userId?: string
) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    userId: userId || "system",
    ...details,
  };

  if (process.env.NODE_ENV === "production") {
    // In production, use structured JSON logging
    console.log(JSON.stringify(entry));
  } else {
    console.log(`[RaaS] ${event}`, entry);
  }
}

export async function logAudit(
  action: string,
  performedBy: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  // Log locally
  logRaaS("audit", { action, performedBy, targetType, targetId, ...details });

  // Also write to Supabase audit_logs table via API
  try {
    const { supabaseAdmin } = await import("./supabase");
    await supabaseAdmin.from("audit_logs").insert({
      action,
      performed_by: performedBy,
      target_type: targetType,
      target_id: targetId,
      details: details || {},
    });
  } catch (error) {
    console.error("[Audit Log Error]", error);
  }
}
