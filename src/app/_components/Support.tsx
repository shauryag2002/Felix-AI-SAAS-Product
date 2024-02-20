"use client"

import "~/styles/globals.css";
import { useSetRecoilState } from "recoil";
import SideBar from "~/app/_components/SideBar";
import { countAtom, isSubscribeAtom, limitAtom, openAtom, upgradeModalAtom } from "~/state/atoms/atom";
import { useRecoilState } from "recoil";
import { usePathname } from "next/navigation";
import Pricing from "~/app/_components/Pricing";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { type RouterOutputs } from "~/trpc/shared";
import { useEffect, useState } from "react";
export default function Support({ children }: { children: React.ReactNode }) {
    type User = RouterOutputs["user"]["me"]
    const { data: session, status } = useSession()
    const [open, setOpen] = useRecoilState<boolean>(openAtom);
    const [upgradeModal, setUpgradeModal] = useRecoilState<boolean>(upgradeModalAtom);
    const setIsSubscribe = useSetRecoilState<boolean>(isSubscribeAtom);
    const { data: me, error } = api.user.me.useQuery({ userId: session?.user?.id ?? " " })
    const { data: countQuery, refetch: countRefetch } = api.user.getCount.useQuery({ userId: session?.user?.id ?? "" })
    const [user, setUser] = useState<User | undefined>()
    const [limit, setLimit] = useRecoilState<number>(limitAtom);
    const setCount = useSetRecoilState<number>(countAtom);
    useEffect(() => {
        setUser(me)
        setCount(countQuery?.count ?? 0)
    }, [me, countQuery])
    if (user && 'Order' in user && user?.Order?.length > 0) {
        const order = user?.Order[user.Order.length - 1];
        const createdAt = new Date(order?.createdAt ?? new Date());
        const presentDay = new Date();
        const thirtyOneDaysLater = new Date(createdAt.setDate(createdAt.getDate() + 31));

        const isThirtyOneDaysPassed = thirtyOneDaysLater > presentDay;
        if (isThirtyOneDaysPassed) {
            setIsSubscribe(true)
            setLimit(user?.Order[0]?.name === "Advanced" ? 1000 : 100 as number)
        }
    }
    const pathName = usePathname();
    return <>
        {open ?
            <SideBar />
            : <div className={`${pathName == "/" ? " top-[70px]" : "top-0"} relative `}>
                <div className=" z-[100] fixed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded" onClick={() => setOpen(true)}> {">"}</div>
            </div>
        }
        {children}
        {upgradeModal ? <div className='fixed top-0 left-0 overflow-y-auto w-full h-full bg-transparent bg-opacity-50 backdrop-blur-md z-20'>
            <Pricing className={`top-0 fixed z-40 w-full left-0 overflow-y-auto h-full `} />
            <div className="fixed z-[1000] top-2 right-4   bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded text-white" onClick={() => {
                setUpgradeModal(false)
            }}>X</div>
        </div>
            : null}
    </>
}
