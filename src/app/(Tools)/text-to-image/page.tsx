"use client";
import React, { useEffect, useState } from 'react'
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import ToolLoading from '~/app/_components/ToolLoading';
import { countAtom, limitAtom, upgradeModalAtom } from '~/state/atoms/atom';
import Image from 'next/image';
import downloadImg from '~/app/_utils/DownloadImg';
import removeBG from '~/app/_utils/RemoveBG';
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
    const limit = useRecoilValue<number>(limitAtom);
    const router = useRouter()

    const { data: chatsQuery, refetch } = api.user.page.useQuery({ userId: session?.user?.id ? session?.user?.id : "", pageRoute: 'textToImage' })
    const { data: countQuery, refetch: countRefetch } = api.user.getCount.useQuery({ userId: session?.user?.id ?? "" })

    const { mutate } = api.tools.textToImage.useMutation({
        onSuccess: async (data) => {
            await countRefetch()
            await refetch()
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
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement> | undefined) => {
        if (e) {

            e.preventDefault();
        }

        if (!prompt) {
            return;
        }
        if (count >= limit) {
            setUpgradeModal(true)
            return;
        }
        mutate({ prompt, userId: session?.user?.id ? session?.user?.id : "" });
        setPrompt('')
        setLoading(true)
    };
    function formatChatGPTResponse(response: string) {
        const text = response;

        let formattedAnswer = text.replace(/\n/g, "<br>");
        formattedAnswer = `<p>${formattedAnswer}</p>`;

        return formattedAnswer;
    }
    async function removeBGImage(url: string) {

        if (limit === 5) {

            setUpgradeModal(true)
            return;
        }
        const downloadImage = async (url1: string) => {
            const url_final: string | void = await removeBG(url1 ?? '') ?? ""
            await downloadImg(url_final ?? "")
        }

        await downloadImage(url);
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
                                <button className='pro relative bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ' onClick={async () => await removeBGImage(chat.answer ?? "")}><span className='absolute -top-3 -right-9 rounded-3xl py-2 px-4 scale-50 bg-gradient-to-r from-purple-500 to-red-500'>PRO</span>Remove BG</button>
                            </div>
                        </div>
                    </div>
                })
            }
            {loading && <ToolLoading />}

            <div className='h-[70px]'></div>
            <form className="input flex justify-between mx-[10px] fixed bottom-[0px] w-full max-w-[1024px] px-2 bg-slate-400 py-[10px]" onSubmit={handleFormSubmit} >
                <textarea name='prompt' value={prompt} rows={2} placeholder="Talk to AI Powered chat" className="w-full bg-transparent text-white placeholder-white outline-none border-grey border-2" onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();

                        handleFormSubmit(e);
                        e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true }));
                    }

                }} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const input = e.target.value;
                    setPrompt(input);
                }} />
                <button type='submit' className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " onClick={() => handleFormSubmit(undefined)}>Generate</button>
            </form>
        </div>
    )
}

export default Page