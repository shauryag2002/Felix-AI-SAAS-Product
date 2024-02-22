"use client";
import React, { useEffect, useState } from 'react'
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import ToolLoading from '~/app/_components/ToolLoading';
import { countAtom, limitAtom, upgradeModalAtom } from '~/state/atoms/atom';
import Image from 'next/image';
import downloadImg from '~/app/_utils/DownloadImg';
import Loading from '~/app/_components/Loading';
import { RouterOutputs } from '~/trpc/shared';
const Page = () => {
    type ChatType = RouterOutputs["user"]["page"]
    const [prompt, setPrompt] = useState<string>('')
    const { data: session, status } = useSession();
    const [chats, setChats] = useState<ChatType>([])
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useRecoilState(countAtom)
    const setUpgradeModal = useSetRecoilState<boolean>(upgradeModalAtom)
    const [link, setLink] = useState<string>('')
    const router = useRouter()

    const { data: chatsQuery, refetch } = api.user.page.useQuery({ userId: session?.user?.id ? session?.user?.id : "", pageRoute: 'linkToQR' })
    const limit = useRecoilValue<number>(limitAtom);
    const { data: countQuery, refetch: countRefetch } = api.user.getCount.useQuery({ userId: session?.user?.id ?? "" })
    const { mutate } = api.tools.linkToQR.useMutation({
        onSuccess: async (data) => {
            await refetch()
            await countRefetch()
            router.refresh()

        },
        onError: (error) => {
            console.log(error)
        },
    })
    useEffect(() => {
        setChats(chatsQuery ?? [])
        setCount(countQuery?.count ?? 0)
        setLoading(false)
    }, [chatsQuery])
    useEffect(() => {
        window.scrollTo({
            top: (document?.getElementById("chats")?.scrollHeight ?? 0) + window.innerHeight,
            behavior: 'smooth'
        });

    }, [chats, loading])
    useEffect(() => {
        if (innterval) {
            clearInterval(innterval)
        }
    }, [chats])

    const [innterval, setInnterval] = useState<NodeJS.Timeout | undefined>(undefined)
    const [clickInterval, setClickInterval] = useState<boolean>(false)
    const handleClick = async (e: undefined | React.KeyboardEvent<HTMLTextAreaElement> | React.FormEvent<HTMLFormElement>) => {
        if (e) {

            e?.preventDefault();
        }

        if (!prompt || !link) {
            return;
        }

        if (count >= limit) {
            setUpgradeModal(true)
            return;
        }
        setPrompt('')
        setLink('')
        setLoading(true)
        const newChat = await fetch("/api/linkToQR", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, link, userId: session?.user?.id ? session?.user?.id : "" }),
        })
        await countRefetch();
        setClickInterval(true)
    };

    useEffect(() => {
        if (clickInterval) {
            let inter: NodeJS.Timeout | undefined = undefined;

            const interval = async () => {
                try {
                    await refetch();
                    if (chatsQuery?.length !== chats.length) {
                        clearInterval(inter);
                        setLoading(false);
                        setClickInterval(false);
                        return;
                    }

                    await countRefetch();
                    if (countQuery?.count !== count) {
                        clearInterval(inter);
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
    function formatChatGPTResponse(response: string) {
        const text = response;

        let formattedAnswer = text.replace(/\n/g, "<br>");
        formattedAnswer = `<p>${formattedAnswer}</p>`;

        return formattedAnswer;
    }
    if (status === "loading") return <div className='h-screen w-screen'><Loading /></div>
    return (
        <div id='chats' className="chatConversation flex flex-col justify-center items-center mb-10">
            {
                (chats)?.map((chat: ChatType[number], i: number) => {
                    return <div key={i} className="max-w-[1024px] flex justify-center flex-col w-full mb-4 *:pl-[10px] items-center">
                        <div className="question bg-zinc-700 font-semibold py-3 w-full">
                            {chat.prompt}
                        </div>
                        <div className="images flex flex-col w-[300px] m-5 max-w-[1024px] items-center">
                            <Image src={chat.answer ?? ""} alt={prompt} width={300} height={300} />
                            <div className="flex justify-around gap-2 w-[300px] mt-[20px]">
                                <button className=' bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ' onClick={async () => await downloadImg(chat.answer ?? "")}>Download</button>
                            </div>
                        </div>
                    </div>
                })
            }
            {loading && <ToolLoading />}


            <div className='h-[150px]' ></div>
            <form className="input flex-col justify-between mx-[10px] fixed bottom-[0px] w-full max-w-[1024px] px-2 bg-slate-400 py-[10px]" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => await handleClick(e)} >
                <div className=' flex w-full bg-transparent text-white placeholder-white outline-none border-grey border-2'>
                    <span>Link:-</span>
                    <input className='w-full bg-transparent text-white placeholder-white outline-none border-grey border-2' placeholder='Enter Link here' type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                </div>
                <div className="flex">

                    <textarea name='prompt' value={prompt} rows={2} placeholder="Talk to AI Powered chat" className="w-full bg-transparent text-white placeholder-white outline-none border-grey border-2" onKeyDown={async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();

                            await handleClick(e);
                        }

                    }} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const input = e.target.value;
                        setPrompt(input);
                    }} />
                    <button type='submit' className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " onClick={async () => await handleClick(undefined)}>Generate</button>
                </div>
            </form>
        </div>
    )
}

export default Page