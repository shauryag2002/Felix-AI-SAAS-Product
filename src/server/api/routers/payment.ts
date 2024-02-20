import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Razorpay from "razorpay";
import crypto from 'crypto';

const secret_key = '1234567890'
export const paymentRouter = createTRPCRouter({
  createOrder: protectedProcedure.
    input(z.object({
      name: z.string(), amount: z.number(), currency: z.string(),
      receipt: z.string(), userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { amount, currency, name, receipt, userId } = input
      const payment = await ctx.db.order.create({
        data: {
          name, amount, currency, receipt, userId
        }
      })
      return payment
    }),
});
