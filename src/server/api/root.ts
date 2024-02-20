import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { toolsRouter } from "./routers/tools";
import { paymentRouter } from "./routers/payment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  tools: toolsRouter,
  payment: paymentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
