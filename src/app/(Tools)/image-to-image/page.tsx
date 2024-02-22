"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { api } from '~/trpc/react';
import { useSession } from 'next-auth/react';
import { countAtom } from '~/state/atoms/atom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { upgradeModalAtom, limitAtom } from '~/state/atoms/atom';
import ToolLoading from '~/app/_components/ToolLoading';
import removeBG from '~/app/_utils/RemoveBG';
import downloadImg from '~/app/_utils/DownloadImg';
import Loading from '~/app/_components/Loading';
import { RouterOutputs } from '~/trpc/shared';
import { useRouter } from 'next/navigation';
import { saveImage } from "~/app/_utils/saveImage"
const Page = () => {
    type ConversationType = RouterOutputs["user"]["page"]
    const [imgSrc, setImgSrc] = useState('');
    const [prompt, setPrompt] = useState<string>('')
    const { data: session, status } = useSession();
    const router = useRouter()
    if (status === 'unauthenticated') {
        router.push('/login')
    }
    const { data: allQuery, error, refetch } = api.user.page.useQuery({ pageRoute: "imageToImage", userId: session?.user?.id ?? "" })
    const [count, setCount] = useRecoilState(countAtom)
    const [loading, setLoading] = useState(false)
    const setUpgradeModal = useSetRecoilState(upgradeModalAtom)
    type AllQueryType = typeof allQuery;
    const [conversations, setConversations] = useState<ConversationType>([])
    const { data: countQuery, refetch: countRefetch } = api.user.getCount.useQuery({ userId: session?.user?.id ?? "" })
    const limit = useRecoilValue<number>(limitAtom);
    const [innterval, setInnterval] = useState<NodeJS.Timeout | undefined>(undefined)
    const [clickInterval, setClickInterval] = useState<boolean>(false)
    const { mutate } = api.tools.imageToImage.useMutation({
        onSuccess: async (data) => {
            setLoading(false)
            setPrompt('')
            setImgSrc('')
            await refetch()
            await countRefetch()
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const handleClick = async () => {
        if (prompt === '') return;
        if (imgSrc === '') return;
        if (count >= limit) {
            setUpgradeModal(true)
            return;
        }
        setLoading(true)
        setPrompt('')
        setImgSrc('')
        const result = await saveImage(imgSrc)
        const newChat = await fetch("/api/imageToImage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, userId: session?.user?.id ? session?.user?.id : "", imgsrc: result ?? "" }),
        })
        await countRefetch();
        setClickInterval(true)
    }
    useEffect(() => {
        if (innterval) {
            clearInterval(innterval)
        }
        if (allQuery) setConversations(allQuery);
        setCount(countQuery?.count ?? 0);
        setLoading(false);
    }, [allQuery]);
    useEffect(() => {
        window.scrollTo({
            top: (document?.getElementById("chats")?.scrollHeight ?? 0) + window.innerHeight,
            behavior: 'smooth'
        });

    }, [allQuery, loading])
    function readURL(input: HTMLInputElement) {
        if (input?.files?.[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const blahElement = document.getElementById('blah');
                if (blahElement) {
                    blahElement.setAttribute('src', e.target?.result as string);
                    blahElement.setAttribute('width', '150');
                    blahElement.setAttribute('height', '200');
                }
                setImgSrc(e.target?.result as string);
            };
            reader.readAsDataURL(input?.files[0]);
        }
    }
    function removeImage() {
        setImgSrc('');
    }
    function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        const input = document.getElementById('prompt-img') as HTMLInputElement;
        if (e?.dataTransfer?.files?.[0]) {
            input.files = e.dataTransfer.files;
            readURL(input);
        }
    }
    async function removeBGImage(url: string) {
        if (limit === 5) {

            setUpgradeModal(true)
            return;
        }
        const downloadImage = async (url1: string) => {
            const url_final: string = await removeBG(url1) ?? ""
            await downloadImg(url_final)
        }

        await downloadImage(url);
    }
    useEffect(() => {
        if (clickInterval) {
            let inter: NodeJS.Timeout | undefined = undefined;

            const interval = async () => {
                try {
                    await refetch();
                    if (allQuery?.length !== conversations.length) {
                        clearInterval(inter);
                        clearInterval(innterval);
                        setLoading(false);
                        setClickInterval(false);
                        return;
                    }

                    await countRefetch();
                    if (countQuery?.count !== count) {
                        clearInterval(inter);
                        clearInterval(innterval);
                        setLoading(false);
                        setClickInterval(false);
                        return;
                    }
                } catch (error) {
                    console.error('Error in interval:', error);
                }
                return undefined;
            };

            const intervalWrapper = () => {
                interval().then((res) => {
                    if (res) {
                        clearInterval(inter);
                    }
                }
                ).catch((err) => {
                    console.error('Error in intervalWrapper:', err);
                });
            };

            inter = setInterval(intervalWrapper, 1000);
            setInnterval(inter);
            return () => clearInterval(inter);
        }
    }, [clickInterval]);
    if (status === "loading") return <div className='h-screen w-screen'><Loading /></div>
    return (
        <div id='chats' className="flex-col items-center justify-center max-w-[1024px] m-auto">
            {conversations?.map((chat: ConversationType[number], index: number) => {
                return <div key={index} >
                    <div className="question bg-zinc-700 ">
                        <span className='pl-[10px]'>

                            {chat.prompt}
                        </span>

                        <div className=" m-4 ">
                            <Image alt={chat.prompt} height={100} width={100} className='py-2' src={chat?.urls ?? ""} />
                        </div>
                    </div>
                    <div className="images flex flex-col w-[300px] my-5 max-w-[1024px] items-center m-auto">
                        <Image src={chat?.answer ?? ""} alt={chat.prompt} width={300} height={300} priority />
                        <div className="flex justify-around gap-2 w-[300px] mt-[20px]">
                            <button type="button" className=' bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded '
                                onClick={async () => await downloadImg(chat?.answer ?? "")}
                            >Download</button>
                            <button className='pro relative bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ' onClick={async () => await removeBGImage(chat?.answer ?? "")}><span className='absolute -top-3 -right-9 rounded-3xl py-2 px-4 scale-50 bg-gradient-to-r from-purple-500 to-red-500'>PRO</span>Remove BG</button>
                        </div>
                    </div>
                </div>
            })}
            {loading && <ToolLoading />}
            <div id='end' className="box h-[150px]" />

            <div className="flex flex-col fixed z-auto bottom-[0px] w-full max-w-[1024px] px-2 bg-slate-400 py-3" >

                <div className='border-dotted border-green-950 border-4 w-full'>

                    {imgSrc &&
                        <div className="relative  flex justify-center w-[300px] items-center m-auto">
                            <div className="absolute top-1 right-4 text-slate-700  bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded hover:text-white" onClick={removeImage}>X</div>
                            <Image id="blah" alt="your image" height={300} width={300} src={imgSrc} />
                        </div>
                    }
                    <label htmlFor="prompt-img" onDrop={(e) => handleDrop(e)}>
                        {!imgSrc && <div className="text-black font-semibold  py-4">Drop Your Image here</div>}
                    </label>
                </div>
                <input className='text-center hidden' type="file" name="prompt-img" id="prompt-img" onChange={(e) => readURL(e.target as HTMLInputElement)} />
                <div className="input flex sm:flex-row flex-col justify-between  ">
                    <input type='text' value={prompt} placeholder="Talk to AI Powered chat" className="w-full h-[40px] bg-transparent text-white placeholder-white outline-none border-grey border-2" onKeyDown={async (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();

                            await handleClick();
                        }

                    }} onChange={(e) => setPrompt(e.target.value)} />
                    <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " onClick={handleClick}>Generate</button>
                </div>
            </div>
        </div >
    )
}

export default Page