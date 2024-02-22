import { NextResponse } from 'next/server';
import Replicate, { Prediction } from 'replicate';
import { type User } from '@prisma/client';
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
import { db } from '~/server/db';
interface RequestTypes {
    prompt?: string;
    link: string;
    userId: string;
}
export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const request: RequestTypes = await (req.json() as Promise<RequestTypes>);

            void replicate.run(
                "zylim0702/qr_code_controlnet:628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557",
                {
                    input: {
                        eta: 0,
                        url: request.link,
                        prompt: request.prompt,
                        scheduler: "DDIM",
                        guess_mode: false,
                        num_outputs: 1,
                        guidance_scale: 9,
                        negative_prompt: "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
                        image_resolution: 768,
                        num_inference_steps: 20,
                        disable_safety_check: false,
                        qr_conditioning_scale: 1.3
                    }
                }
            ).then(async (prediction) => {
                console.log(prediction)
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
                        prompt: request.prompt + " , Link: " + request.link,
                        answer: (prediction as string[])?.[0] ?? "",
                        name: "linkToQR"
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