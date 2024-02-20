"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { countAtom, isSubscribeAtom, limitAtom, upgradeModalAtom } from '~/state/atoms/atom'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { RouterOutputs } from '~/trpc/shared'
const Page = () => {
    type User = RouterOutputs["user"]["me"]
    const count = useRecoilValue(countAtom)
    const { data: session, status } = useSession()
    const setUpgradeModal = useSetRecoilState(upgradeModalAtom)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const { data: user, refetch } = api.user.me.useQuery<User>({ userId: session?.user.id ?? "" })
    const router = useRouter()
    const [error, setError] = useState("")
    const limit = useRecoilValue<number>(limitAtom);
    const isSubscribe = useRecoilValue<boolean>(isSubscribeAtom);
    const { mutate } = api.user.update.useMutation({
        onSuccess: async (data: RouterOutputs["user"]["update"]) => {
            router.refresh();
            await refetch()
            if (data && "error" in data && data?.error) {
                setError(data.error)
            }
        },
        onError: (error) => {
            console.log(error)
        }
    })
    useEffect(() => {
        if (user) {

            if ("name" in user) {
                setName(user?.name ?? "");
            }
            if ("email" in user) {
                setEmail(user?.email ?? "");
            }
        }
    }, [])
    return (
        <div className="p-4 px-[60px] w-full">
            <h1 className="text-6xl my-3 m-auto">Welcome Back to Felix</h1>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Dashboard</h2>
            <div className={`w-[100%] mx-4 flex flex-col pr-4`}>
                <div className="text-black">
                    {count}/{limit}
                </div>
                <div className="w-full">
                    <input type="range" readOnly={true}
                        value={count}
                        max={5} color='red' className='bg-gradient-to-r from-purple-500 to-red-500 w-full' />
                </div>
                {isSubscribe ? <button className='w-full px-2 py-3 bg-gradient-to-r from-purple-500 to-red-500 hover:from-indigo-500 hover:to-red-500 rounded'>Enjoy</button> : <button className='w-full px-2 py-3 bg-gradient-to-r from-purple-500 to-red-500 hover:from-indigo-500 hover:to-red-500 rounded' onClick={() => {
                    setUpgradeModal(true)
                }}>Upgrade</button>}
            </div>
            <div className="text-lg font-semibold mb-2 my-5">Name: {name}
                <div className="">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border w-full border-gray-300 bg-slate-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    <button className=' bg-blue-500 text-white px-4 py-2 rounded mt-4' onClick={() => {
                        if (name === "") {
                            setError("Name cannot be empty")
                            return
                        }
                        mutate({ name, userId: session?.user.id ?? "" })
                        setName("")
                    }}>UPDATE NAME</button>
                </div>
            </div>
            <div className="text-lg font-semibold mb-2 my-5">Email: {email}
                <div className="">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='border w-full border-gray-300 bg-slate-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' />
                    <button className=' bg-blue-500 text-white px-4 py-2 rounded mt-4' onClick={
                        () => {
                            if (email === "") {
                                setError("Email cannot be empty")
                                return
                            }
                            mutate({ email, userId: session?.user.id ?? "" })
                            setEmail("")
                        }
                    }>UPDATE EMAIL</button>
                </div>
                {error && <p className="text-red-500 bg-[#cda2a2] border rounded-md my-4 py-2 px-1">{error}</p>}
            </div>
        </div>
    )
}

export default Page