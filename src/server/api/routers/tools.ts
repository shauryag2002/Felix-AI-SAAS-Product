import { object, z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { v2 } from "cloudinary"
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import Replicate, { Prediction } from "replicate";
import { User } from "@prisma/client";

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
export const toolsRouter = createTRPCRouter({
    chat: protectedProcedure
        .input(z.object({ prompt: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const prompt = input.prompt;

            const openai = new OpenAIApi(
                new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                })
            );
            const comply = await openai
                .createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                })
            const me: User | null = await ctx.db.user.findFirst({
                where: {
                    id: input.userId
                }
            })
            const user = await ctx.db.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    count: (me?.count ?? 0) + 1
                }
            });

            const GenerationToDb = await ctx.db.aI.create({
                data: {
                    userId: input.userId,
                    prompt: input.prompt,
                    answer: comply.data.choices[0]?.message?.content ?? "",
                    name: "chat"
                }
            })
            return {
                chat: GenerationToDb
            }
        }),
    imageToImage: protectedProcedure
        .input(z.object({ prompt: z.string(), imgsrc: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { prompt, imgsrc, userId } = input;
            let prediction: Prediction = await replicate.predictions.create({
                version: "ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
                input: {
                    prompt: prompt + " img",
                    num_steps: 50,
                    style_name: "Photographic (Default)",
                    input_image: imgsrc,
                    num_outputs: 1,
                    guidance_scale: 5,
                    negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
                    style_strength_ratio: 20
                }
            });
            prediction = await replicate.wait(prediction);
            const me: User | null = await ctx.db.user.findFirst({
                where: {
                    id: input.userId
                }
            })
            const user = await ctx.db.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    count: (me?.count ?? 0) + 1
                }
            });
            const GenerationToDb = await ctx.db.aI.create({
                data: {
                    userId: input.userId,
                    prompt: input.prompt,
                    answer: (prediction?.output as string[])?.[0] ?? "",
                    name: "imageToImage",
                    urls: imgsrc
                }
            })
            return {
                generate: GenerationToDb,
            };
        }),
    textToImage: protectedProcedure
        .input(z.object({ prompt: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const prompt = input.prompt;
            const openai = new OpenAIApi(
                new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                })
            );
            const comply = await openai.createImage({
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            });
            const me: User | null = await ctx.db.user.findFirst({
                where: {
                    id: input.userId
                }
            })
            const user = await ctx.db.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    count: (me?.count ?? 0) + 1
                }
            });

            const GenerationToDb = await ctx.db.aI.create({
                data: {
                    userId: input.userId,
                    prompt: input.prompt,
                    answer: comply?.data?.data[0]?.url ?? "",
                    name: "textToImage"
                }
            })
            return {
                imageLink: GenerationToDb
            }
        }),
    linkToQR: protectedProcedure
        .input(z.object({ link: z.string(), prompt: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { link, prompt } = input
            let prediction: Prediction = await replicate.predictions.create({
                version: "a8141eba8e087bd9731102f3bac606977744fe38d1c9392305fd241a874e1868",
                input: {
                    seed: 7649977189,
                    prompt: prompt,
                    sampler: "DPM++ Karras SDE",
                    strength: 0.95,
                    batch_size: 1,
                    border_size: 4,
                    guidance_scale: 12.99,
                    negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
                    qr_code_content: link,
                    num_inference_steps: 40,
                    controlnet_conditioning_scale: 1.35
                }
            });
            prediction = await replicate.wait(prediction);
            const me: User | null = await ctx.db.user.findFirst({
                where: {
                    id: input.userId
                }
            })
            const user = await ctx.db.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    count: (me?.count ?? 0) + 1
                }
            });
            const GenerationToDb = await ctx.db.aI.create({
                data: {
                    userId: input.userId,
                    prompt: input.prompt + " , Link: " + input.link,
                    answer: (prediction?.output as string[])?.[0] ?? "",
                    name: "linkToQR"
                }
            })
            return {
                generate: GenerationToDb,
            };
        }),
    textToCode: protectedProcedure
        .input(z.object({ prompt: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const prompt = input.prompt;
            const openai = new OpenAIApi(
                new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                })
            );
            const comply = await openai
                .createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `create html, css and js code fragement for ${prompt}`,
                        },
                    ],
                })
            const me: User | null = await ctx.db.user.findFirst({
                where: {
                    id: input.userId
                }
            })
            const user = await ctx.db.user.update({
                where: {
                    id: input.userId
                },
                data: {
                    count: (me?.count ?? 0) + 1
                }
            });
            const GenerationToDb = await ctx.db.aI.create({
                data: {
                    userId: input.userId,
                    prompt: input.prompt,
                    answer: comply.data.choices[0]?.message?.content ?? "",
                    name: "textToCode"
                }
            })
            return {
                generate: GenerationToDb
            }
        }),
});
