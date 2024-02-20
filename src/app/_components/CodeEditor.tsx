import React, { useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { ImHtmlFive } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { IoLogoJavascript } from "react-icons/io";
import { FiMinimize2 } from "react-icons/fi";
import { FiMaximize } from "react-icons/fi";
import { MdOutlineContentCopy } from "react-icons/md";

interface EditorProps {
    displayName: string;
    language: string;
    code: string;
    handleChange: (value: string) => void;
}
function Editor(props: EditorProps) {
    const { displayName, language, code, handleChange } = props;
    const [minimize, setMinimize] = useState(false);
    const onChange = React.useCallback((value: string) => {
        handleChange(value);
    }, []);
    const lang = (language === "html" && html()) || (language === "css" && css()) || (language === "js" && javascript());

    const handleCopyCode = async () => {
        if (code) {
            await navigator.clipboard.writeText(code);
        }
    };

    return (
        <div className={`${minimize ? "w-2/12" : "w-full"}`}>
            <div className="flex justify-between gap-4 px-2">
                <div className="flex gap-2">
                    {language === "html" && <ImHtmlFive size={20} />}
                    {language === "css" && <DiCss3 size={20} />}
                    {language === "js" && <IoLogoJavascript size={20} />}
                    {displayName}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleCopyCode} className="hover:text-[#5e5e5e]">
                        <MdOutlineContentCopy size={20} />
                    </button>
                    <button className="hidden lg:flex"
                        onClick={() => {
                            setMinimize(!minimize);
                        }}
                    >
                        {minimize === true ? <FiMaximize /> : <FiMinimize2 />}
                    </button>
                </div>
            </div>
            {lang ?
                <CodeMirror
                    value={code}
                    height="350px"
                    theme={githubDark}
                    extensions={[lang, EditorView.lineWrapping]}
                    onChange={onChange}
                />
                :
                <CodeMirror
                    value={code}
                    height="350px"
                    theme={githubDark}
                    onChange={onChange}
                />
            }
        </div>
    );
}
export default Editor;