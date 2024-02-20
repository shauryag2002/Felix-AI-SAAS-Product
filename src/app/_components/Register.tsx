"use client";
import Link from "next/link"
import React, { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { RouterOutputs } from "~/trpc/shared";
const Register = () => {
    const router = useRouter();
    const [error, setError] = useState<string>('')
    type RegisterType = RouterOutputs["user"]["register"]
    const { mutate } = api.user.register.useMutation({
        onSuccess: (data: RegisterType) => {
            router.refresh();
            if ("error" in data && data?.error) {
                setError(data?.error)
            }
            else {

                router.push("/login")
            }
        },
        onError: (error) => {
            console.log(error)
        }
    });
    return (
        <section className=" bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen">
                <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-white">

                    Felix
                </Link>
                <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">
                            Sign up to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            mutate({
                                name: formData.get('name')?.toString() ?? '',
                                email: formData.get('email')?.toString() ?? '',
                                password: formData.get('password')?.toString() ?? ''
                            });
                        }}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Your Name</label>
                                <input type="text" name="name" id="name" className=" border  sm:text-sm rounded-lg focus:border-darky-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 " placeholder="Mukesh" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                <input type="email" required name="email" id="email" className=" border  sm:text-sm rounded-lg focus:border-darky-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 " placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium  text-white">Password</label>
                                <input type="password" required name="password" id="password" placeholder="••••••••" className=" border  sm:text-sm rounded-lg   block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#8a2be2] hover:bg-darky-700 focus:ring-darky-800">Sign in</button>
                            {error && <p className="text-red-500 bg-[#cda2a2] border rounded-md my-4 py-2 px-1">{error}</p>}
                            <p className="text-sm font-light text-gray-400">
                                Have an account? <Link href="/login" className="font-medium hover:underline text-grey-100">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register