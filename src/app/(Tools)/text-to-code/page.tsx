"use client"
import { useState, useEffect } from "react";
import { ImHtmlFive } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { IoLogoJavascript } from "react-icons/io";
import CodeEditor from '../../_components/CodeEditor'
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { countAtom, limitAtom, upgradeModalAtom } from "~/state/atoms/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Loading from "~/app/_components/Loading";
const Page = () => {
    const [html, setHtml] = useState('')
    const [activeCode, setActiveCode] = useState("html");
    const [srcDoc, setSrcDoc] = useState("")
    const [css, setCss] = useState('')
    const [javascript, setJavascript] = useState('')
    const [prompt, setPrompt] = useState('')
    const { data: session, status } = useSession()
    const [count, setCount] = useRecoilState(countAtom)
    const setUpgradeModal = useSetRecoilState<boolean>(upgradeModalAtom)
    const limit = useRecoilValue<number>(limitAtom);
    const removeJS = (inputStr: string) => {
        if (inputStr.startsWith("javascript")) {
            return inputStr.substring(10);
        } else if (inputStr.startsWith("js")) {
            return inputStr.substring(2);
        } else {
            return inputStr;
        }
    };
    const { data: me, refetch } = api.user.me.useQuery({ userId: session?.user?.id ? session?.user?.id : "" })
    const { data: countQuery, refetch: countRefetch } = api.user.getCount.useQuery({ userId: session?.user?.id ?? "" })

    const { mutate } = api.tools.textToCode.useMutation({
        onSuccess: async (data) => {
            const codeArr: string[] = data?.generate?.answer?.split("```") ?? []
            setHtml(codeArr.length >= 1 ? codeArr[1]?.substring(4) ?? '' : '')
            setCss(codeArr.length >= 3 ? codeArr[3]?.substring(3) ?? '' : '')
            const jsCode = removeJS(codeArr[5] ?? '')
            setJavascript(jsCode)
            await refetch()
            await countRefetch()
        },
        onError: (err) => {
            console.log(err)
        }
    })
    useEffect(() => {

        setCount(countQuery?.count ?? 0)
    }, [me])
    useEffect(() => {
        setTimeout(() => {
            setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${javascript}</script>
      </html>`);
        }, 250);
    }, [html, css, javascript]);

    if (status === "loading") return <div className='h-screen w-screen'><Loading /></div>
    return (
        <>
            <div className="py-2 sm:py-3 bg-[#62CDFF] mb-2 px-4 sm:px-10 text-[#144272]">
                <div className="flex gap-2 sm:gap-4 lg:w-2/3 md:w-10/12 mx-auto justify-between">
                    <span className="text-base sm:text-lg font-semibold whitespace-nowrap">
                        AI Prompt :{" "}
                    </span>
                    <input
                        type="text"
                        className="text-sm sm:text-base border-2 border-[#2C74B3] rounded-md pl-2 w-full"
                        placeholder="Describe the element."
                        value={prompt}
                        onChange={(e) => { setPrompt(e.target.value) }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (count >= limit) {
                                    setUpgradeModal(true)
                                    return;
                                }
                                mutate({ prompt, userId: session?.user?.id ? session?.user?.id : "" })
                            }
                        }}
                    />
                    <button
                        className={`text-[#ffffff] bg-[#2C74B3] px-4 py-1 rounded-full font-semibold hover:bg-[#205295] flex gap-2 `}
                        onClick={() => {
                            if (count >= limit) {
                                setUpgradeModal(true)
                                return;
                            }
                            mutate({ prompt, userId: session?.user?.id ? session?.user?.id : "" })
                        }}
                    >
                        <span>Search</span>
                    </button>
                </div>
            </div>
            <div className="hidden w-full lg:flex flex-row justify-around text-base gap-2">
                <CodeEditor
                    displayName="HTML"
                    language="html"
                    code={html}
                    handleChange={setHtml}
                />
                <CodeEditor
                    displayName="CSS"
                    language="css"
                    code={css}
                    handleChange={setCss}
                />
                <CodeEditor
                    displayName="JavaScript"
                    language="js"
                    code={javascript}
                    handleChange={setJavascript}
                />
            </div>
            <div className="lg:hidden w-full flex flex-row px-2 sm:px-10 gap-2 text-base">
                <div className="py-4 flex flex-col gap-2">
                    <button
                        className={`${activeCode === "html" && "text-white bg-[#2C74B3]"
                            } px-2 py-2 rounded-md`}
                        onClick={() => {
                            setActiveCode("html");
                        }}
                    >
                        <ImHtmlFive size={23} />
                    </button>
                    <button
                        className={`${activeCode === "css" && "text-white bg-[#2C74B3]"
                            } px-2 py-2 rounded-md`}
                        onClick={() => {
                            setActiveCode("css");
                        }}
                    >
                        <DiCss3 size={26} />
                    </button>
                    <button
                        className={`${activeCode === "js" && "text-white bg-[#2C74B3]"
                            } px-2 py-2 rounded-md`}
                        onClick={() => {
                            setActiveCode("js");
                        }}
                    >
                        <IoLogoJavascript size={22} />
                    </button>
                </div>
                <div className="w-full">
                    {activeCode === "html" && (
                        <CodeEditor
                            displayName="HTML"
                            language="html"
                            code={html}
                            handleChange={setHtml}
                        />
                    )}
                    {activeCode === "css" && (
                        <CodeEditor
                            displayName="CSS"
                            language="css"
                            code={css}
                            handleChange={setCss}
                        />
                    )}
                    {activeCode === "js" && (
                        <CodeEditor
                            displayName="JavaScript"
                            language="js"
                            code={javascript}
                            handleChange={setJavascript}
                        />
                    )}
                </div>
            </div>
            <div className="pt-3 p-3 h-[40%]">
                <iframe
                    id="output"
                    srcDoc={srcDoc}
                    title="output"
                    sandbox="allow-scripts"
                    className="bg-white"
                    width="100%"
                    height="100%"
                />
            </div>
        </>
    );
}

export default Page

