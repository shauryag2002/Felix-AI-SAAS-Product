"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { LuLayoutDashboard } from "react-icons/lu";
import { VscSignOut } from "react-icons/vsc";
const Navbar = () => {
    const { data: session } = useSession()
    return (
        <div className='sticky top-0'>
            <div className="flex  justify-between bg-[#1a73e8] p-4 w-full">
                <div className="text-white font-bold text-xl">
                    <Image src={"/logo.svg"} height={40} width={40} alt='Felix Logo' />
                </div>
                <div className="flex items-center space-x-4">
                    <Link className="text-white" href="/about">About</Link>
                    <Link className="text-white" href={"#features"}>Features</Link>
                    <Link className="pricing" href="#pricing">Pricing</Link>
                    {session?.user.id ? <>
                        <Link className="text-white" href="/dashboard" title='DashBoard'><LuLayoutDashboard /></Link>
                        <button className="text-white" title='Log Out' onClick={async () => await signOut()}><VscSignOut /></button>
                    </>
                        : <Link className="text-white" href="/login">Login</Link>}
                </div>
            </div>
        </div>
    )
}

export default Navbar