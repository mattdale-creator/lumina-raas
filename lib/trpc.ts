import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase";

// Context creation for each request
export async function createContext() {
  const { userId } = await auth();
  let dbUser = null;

  if (userId) {
    const { data } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("auth_id", userId)
      .single();
    dbUser = data;
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
