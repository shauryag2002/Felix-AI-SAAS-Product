import { z } from "zod";
import { hash } from "bcryptjs";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    register: publicProcedure
        .input(z.object({ name: z.string(), password: z.string(), email: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { name, password, email } = input;
            try {
                const existingUser = await ctx.db.user.findFirst({
                    where: {
                        email
                    }
                });
                if (existingUser) {
                    return { error: "Email is already in use" };
                }
                const hashedPassword = await hash(password, 10);
                const user = await ctx.db.user.create({
                    data: {
                        name,
                        password: hashedPassword,
                        email
                    }
                });
                return user;
            }
            catch (e) {
                console.log(e);
            }
            return { error: "Email is already in use" };
        }),
    page: protectedProcedure
        .input(z.object({ pageRoute: z.string(), userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { userId, pageRoute } = input;
            try {
                const user = await ctx.db.user.findFirst({
                    where: {
                        id: userId
                    }
                })
                const info = await ctx.db.aI.findMany({
                    where: {
                        userId,
                        name: pageRoute
                    },
                    select: {
                        Images: true,
                        answer: true,
                        prompt: true,
                        name: true,

                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                })
                return info;
            }
            catch (e) {
                console.log(e);
            }
            return [];
        }),
    update: protectedProcedure
        .input(z.object({ name: z.string().optional(), email: z.string().optional(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { name, email, userId } = input;
            try {
                if (name) {

                    const user = await ctx.db.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            name
                        }
                    });
                    return user;
                }
                else {
                    const user = await ctx.db.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            email
                        }
                    });
                    return user;

                }
                return null;
            }
            catch (e) {
                console.log(e);
            }
            return { error: "Email is already in use" };
        }),
    me: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!input.userId) {
                return { error: "userId is required" }
            }
            const { userId } = input;
            try {
                const user = await ctx.db.user.findFirst({
                    where: {
                        id: userId
                    }, select: {
                        Order: true,
                        name: true,
                        email: true,
                        id: true,
                        count: true
                    }
                });
                return user;
            }
            catch (e) {
                console.log(e);
            }
            return { error: "Email is already in use" };
        }),
    getCount: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {

            const { userId } = input;
            try {
                const user = await ctx.db.user.findFirst({
                    where: {
                        id: userId
                    }, select: {
                        count: true
                    }
                });
                return user ?? { count: 0 };
            }
            catch (e) {
                console.log(e);
            }
            return { count: 0 };
        }),
});
