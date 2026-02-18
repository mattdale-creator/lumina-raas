import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase";

// Context creation for each request
// Self-healing: auto-creates Supabase user if they exist in Clerk but not in DB
export async function createContext() {
  const { userId } = await auth();
  let dbUser = null;

  if (userId) {
    // Try to find user in Supabase
    const { data } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .single();
    dbUser = data;

    // If not found, auto-create from Clerk data
    if (!dbUser) {
      try {
        const clerkUser = await currentUser();
        if (clerkUser) {
          const email = clerkUser.emailAddresses?.[0]?.emailAddress || "unknown@email.com";
          const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email;

          const { data: newUser } = await supabaseAdmin
            .from("users")
            .upsert(
              {
                auth_id: userId,
                email,
                full_name: fullName,
                role: "user",
              },
              { onConflict: "auth_id" }
            )
            .select()
            .single();

          dbUser = newUser;

          // Also create default notification preferences
          if (newUser) {
            await supabaseAdmin
              .from("notification_preferences")
              .upsert({ user_id: newUser.id }, { onConflict: "user_id" })
              .select();
          }
        }
      } catch (e) {
        console.error("[Auto-create user error]", e);
      }
    }
  }

  return { userId, dbUser };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure – requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.dbUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      dbUser: ctx.dbUser as NonNullable<typeof ctx.dbUser>,
    },
  });
});

// Admin procedure – requires admin role
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId || !ctx.dbUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.dbUser.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      dbUser: ctx.dbUser as NonNullable<typeof ctx.dbUser>,
    },
  });
});
