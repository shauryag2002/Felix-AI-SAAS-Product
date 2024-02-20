"use client";
import { signIn } from "next-auth/react";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaGoogle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
const Login = () => {
    const router = useRouter();
    const { data: session, status } = useSession()

    if (status === "authenticated") {
        router?.push("/")
    }
    if (status === "loading") return <div className='h-screen w-screen'><Loading /></div>
    return (
        <section className=" bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen">
                <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-white">

                    Felix
                </Link>
                <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget)
                            try {

                                await signIn("credentials", {
                                    email: formData.get("email")?.toString(),
                                    password: formData.get("password")?.toString(),
                                    callbackUrl: "/",
                                },
                                )
                            } catch (err) {
                                console.log(err)
                            }
                        }}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                <input required type="email" name="email" id="email" className=" border  sm:text-sm rounded-lg focus:border-darky-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 " placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium  text-white">Password</label>
                                <input required type="password" name="password" id="password" placeholder="••••••••" className=" border  sm:text-sm rounded-lg   block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border rounded focus:ring-3  bg-gray-700 border-gray-600 focus:ring-darky-600 ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-300">Remember me</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center  bg-[#8a2be2] hover:bg-darky-700 focus:ring-darky-800">Sign in</button>
                            <p className="text-sm font-light text-gray-400">
                                Don’t have an account yet? <Link href="/register" className="font-medium hover:underline text-grey-100">Register</Link>
                            </p>
                        </form>
                        <div className="flex items-center justify-center">
                            <button className="flex  justify-center gap-4 items-baseline w-full px-4 py-2 text-sm font-medium bg-[#e9f1ff] text-[#4285f4] rounded-lg shadow-md" onClick={async () => {
                                await signIn("google", {
                                    callbackUrl: "/"
                                })
                            }}>
                                <FaGoogle />
                                {" "}
                                <span className="bg-[#e9f1ff] text-[#4285f4]">

                                    Sign in with Google
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login