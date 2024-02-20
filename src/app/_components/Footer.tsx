"use client"
import Link from 'next/link'

const Footer = () => {
    const visitGithub = () => {
        window.location.href = "https://github.com/shauryag2002";
    };
    const visitTwitter = () => {
        window.location.href =
            "https://twitter.com/i/flow/login?redirect_after_login=%2FShauryag_2002";
    };
    return (
        <div className="footer bg-slate-900">
            <div className="topFooter">
                <div className="social grid grid-cols-2 gap-2 place-items-center">
                    <Link className="astyle block" href={"/about"}>
                        About Us
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/shauryagupta6/"
                        className="linkedin astyle cursor"
                    >
                        LinkedIn
                    </Link>
                    <div className="github astyle cursor-pointer" onClick={visitGithub}>
                        Github
                    </div>
                    <div className="twitter astyle cursor-pointer" onClick={visitTwitter}>
                        Twitter
                    </div>
                </div>
            </div>
            <div
                className="mail astyle cursor text-center cursor-pointer py-2 "
                onClick={() =>
                    (window.location.href = "mailto:guptashaurya2002@gmail.com")
                }
            >
                Mail Us : guptashaurya2002@gmail.com
            </div>
        </div>
    )
}

export default Footer