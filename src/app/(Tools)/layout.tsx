"use client"
import SideBar from "~/app/_components/SideBar";
import { openAtom } from "~/state/atoms/atom";
import { useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface layoutProps {
    children: React.ReactNode;
}
const Layout = ({ children }: layoutProps) => {
    const open = useRecoilValue<boolean>(openAtom);
    const { data: session, status } = useSession()
    const router = useRouter()
    if (status === "unauthenticated") {
        router.push("/login")
    }
    return (

        <div className="w-full h-screen">

            {open ?
                <SideBar />
                : null
            }
            {children}
        </div>

    )
}

export default Layout