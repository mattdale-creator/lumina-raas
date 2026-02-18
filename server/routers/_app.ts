import { router } from "@/lib/trpc";
import { outcomeRouter } from "./outcome";
import { adminRouter } from "./admin";
import { analyticsRouter } from "./analytics";

export const appRouter = router({
  outcome: outcomeRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
