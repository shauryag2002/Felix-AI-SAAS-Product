import { NextResponse } from 'next/server';
import Replicate, { Prediction } from 'replicate';
import { type User } from '@prisma/client';
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
import { db } from '~/server/db';
interface RequestTypes {
    prompt?: string;
    imgsrc: string;
    userId: string;
}

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const request: RequestTypes = await (req.json() as Promise<RequestTypes>);
            void replicate.run(
                "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
                {
                    input: {
                        prompt: request.prompt + " img",
                        num_steps: 50,
                        style_name: "Photographic (Default)",
                        input_image: request.imgsrc,
                        num_outputs: 1,
                        guidance_scale: 5,
                        negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
                        style_strength_ratio: 20
                    }
                }
            ).then(async (prediction) => {
                const me: User | null = await db.user.findFirst({
                    where: {
                        id: request.userId
                    }
                })
                const user = await db.user.update({
                    where: {
                        id: request.userId
                    },
                    data: {
                        count: (me?.count ?? 0) + 1
                    }
                });
                const GenerationToDb = await db.aI.create({
                    data: {
                        userId: request.userId,
                        prompt: request?.prompt ?? " ",
                        answer: (prediction as string[])?.[0] ?? "",
                        name: "imageToImage",
                        urls: request.imgsrc
                    }
                })
                return NextResponse.json({
                    generate: GenerationToDb,
                });
            })
            return NextResponse.json({ status: "loading" });
        } catch (error) {
            return NextResponse.json({ error: 'Internal Server Error' });
        }
    } else {
        return NextResponse.json({ message: 'Method Not Allowed' });
    }
}