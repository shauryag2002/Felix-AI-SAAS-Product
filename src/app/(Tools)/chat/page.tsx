"use client";
import React, { useEffect, useState } from 'react'
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import ToolLoading from '~/app/_components/ToolLoading';
import { countAtom, limitAtom, upgradeModalAtom } from '~/state/atoms/atom';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import { useRecoilValue } from 'recoil';
import { type RouterOutputs } from '~/trpc/shared';
import Loading from '~/app/_components/Loading';
const Page = () => {
    type Chat = RouterOutputs["user"]["page"]
    const [prompt, setPrompt] = useState<string>('')
    const { data: session, status } = useSession();
    const [chats, setChats] = useState<Chat | []>([])
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useRecoilState(countAtom)
    const setUpgradeModal = useSetRecoilState<boolean>(upgradeModalAtom)
    const [last, setLast] = useState(false)
    const router = useRouter()

    if (status === 'unauthenticated') {
        router.push('/login')
    }
    const { data: chatsQuery, refetch } = api.user.page.useQuery({ userId: session?.user?.id ? session?.user?.id : "", pageRoute: 'chat' })
    const { data: countQuery, refetch: countRefetch } = api.user.getCount.useQuery({ userId: session?.user?.id ?? "" })
    const limit = useRecoilValue<number>(limitAtom);
    const { mutate } = api.tools.chat.useMutation({
        onSuccess: async (data) => {
            setLast(true)
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

    }, [chats, loading,])
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        setLast(false)
        e.preventDefault();

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
    function formatChatGPTResponse(response: string, i: number) {
        const text = response;

        let formattedAnswer = text.replace(/\n/g, "<br>");
        formattedAnswer = `<p>${formattedAnswer}</p>`;
        return <div key={i} dangerouslySetInnerHTML={{ __html: formattedAnswer }}></div>;
    }
    const languageMap = {
        '```html': 'htmlmixed',
        '```css': 'css',
        '```javascript': 'javascript',
    };

    const parseResponse = (response: string) => {
        const parts: string[] = response.split('```');
        const elements = [];
        for (let i = 0; i < parts.length; i++) {
            const part: string = parts[i] ?? '';
            if (i % 2 === 0) {
                elements.push(formatChatGPTResponse(part, i));
            } else {
                const language: string = part.split('\n')[0]?.trim() ?? '';
                const code = part.replace(language, '').trim();
                const languageMode: string = languageMap[`\`\`\`${language}` as keyof typeof languageMap];
                if (languageMode) {
                    elements.push(
                        <CodeMirror
                            key={i}
                            value={code}
                            theme={githubDark}
                        />
                    );
                }
            }
        }
        return elements;
    };
    if (status === "loading") return <div className='h-screen w-screen'><Loading /></div>
    return (
        <div id='chats' className="chatConversation flex flex-col justify-center items-center mb-10">
            {
                (chats)?.map((chat: Chat[number], i: number) => {
                    return <div key={i} className="max-w-[1024px] flex justify-center flex-col w-full mb-4 *:pl-[10px]">
                        <div className="question bg-zinc-700 font-semibold py-3">
                            {chat.prompt}
                        </div>
                        <div className={" bg-slate-600 py-2"} key={i}>
                            {
                                parseResponse(chat?.answer ?? '')
                            }
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

                }} onChange={(e) => {
                    const input = e.target.value;
                    setPrompt(input);
                }} />
                <button type='submit' className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">Generate</button>
            </form>
        </div>
    )
}

export default Page