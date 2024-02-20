"use client";
import Link from 'next/link'
import React from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { countAtom, openAtom, upgradeModalAtom, isSubscribeAtom, limitAtom } from '~/state/atoms/atom';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const SideBar = () => {
    const pathName = usePathname();
    const [open, setOpen] = useRecoilState<boolean>(openAtom);
    const count = useRecoilValue<number>(countAtom);
    const setUpgradeModal = useSetRecoilState<boolean>(upgradeModalAtom);
    const isSubscribe = useRecoilValue<boolean>(isSubscribeAtom);
    const { data: session, status } = useSession()
    const limit = useRecoilValue<number>(limitAtom);
    return open ?
        <>
            <div className=" Sidebar w-full h-full bg-transparent bg-opacity-50 backdrop-blur-md fixed z-10">


                <div className="sidebar bg-[#6495ed] h-full w-[300px] z-20 relative top-0 left-0 ">
                    <div className="absolute top-2 right-4   bg-red-500 hover:bg-red-700  font-bold py-2 px-4 rounded text-white" onClick={() => {
                        setOpen(false)
                    }}>X</div>
                    <Link href={"/"} onClick={() => setOpen(false)}>

                        <Image src="/logo.svg" alt="Logo of Felix" width={40} height={40} className='text-white pl-2 pt-4' />
                    </Link>
                    < div className='flex flex-col pt-12' >

                        <Link href="/chat" className=' bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded ' onClick={() => setOpen(false)}>Chat Conversation</Link>
                        <Link href="/image-to-image" className=' bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded ' onClick={() => setOpen(false)}>Image to Image Generation</Link>
                        <Link href="/text-to-image" className=' bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded ' onClick={() => setOpen(false)}>Text to Image Generation</Link>
                        <Link href="/text-to-code" className=' bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded ' onClick={() => setOpen(false)}>Text to Code Generation</Link>
                        <Link href="/link-to-qr-image" className=' bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded ' onClick={() => setOpen(false)}>Link to QR Generation</Link>
                    </div >
                    <div className={`bottom-5 mx-4 flex flex-col fixed w-[250px]`}>
                        <div className="text-black">
                            {count}/{limit}
                        </div>
                        <div className="w-full">
                            <input type="range" readOnly={true} value={count} max={limit} color='red' className='bg-gradient-to-r from-purple-500 to-red-500 w-[250px]' />
                        </div>
                        {isSubscribe ? <button className='w-full px-2 py-3 bg-gradient-to-r from-purple-500 to-red-500 hover:from-indigo-500 hover:to-red-500 rounded'>Enjoy</button> : <button className='w-full px-2 py-3 bg-gradient-to-r from-purple-500 to-red-500 hover:from-indigo-500 hover:to-red-500 rounded' onClick={() => {
                            setUpgradeModal(true)
                        }}>Upgrade</button>}
                    </div>
                </div>
            </div >
        </> : null
}

export default SideBar