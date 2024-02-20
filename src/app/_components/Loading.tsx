import React from 'react'
import "./Loading.css"
import { ReactTyped } from 'react-typed'
const Loading = () => {

    return (
        <>
            <span className="loader bg-slate-700"><span className="loader-inner">
            </span>
                <ReactTyped
                    strings={[
                        "Loading...",
                        "Please wait",
                        "This may take a while",
                        "Almost there",
                        "Just a few more seconds"
                    ]}
                    typeSpeed={50}
                    backSpeed={60}
                    loop
                    className="text-slate-700"
                />
            </span>
        </>
    )
}

export default Loading