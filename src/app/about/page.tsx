"use client"
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { AiFillLinkedin } from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';
import { BsGithub } from 'react-icons/bs';
const About = () => {
    const visitGithub = () => {
        window.location.href = "https://github.com/shauryag2002";
    };
    return (
        <div className="aboutSection flex flex-col justify-center items-center w-full h-full min-h-screen bg-gradient-to-r from-purple-500 to-red-500">
            <div className="aboutSectionContainer flex flex-col justify-start pt-10 items-center max-w-[1000px] sm:mx-20 mx-5 my-5 bg-white *:text-black">
                <h1 className='text-5xl text-indigo-800'>About Us</h1>

                <div className='grid sm:grid-cols-2 grid-cols-1 h-full gap-4 flex-wrap'>
                    <div className=' pt-5 text-center flex flex-col gap-5 justify-start items-center'>
                        <Image
                            width={200}
                            height={200}
                            src={"/profile.jpg"}
                            alt="Founder"
                            className='rounded-full'
                        />
                        <p className='font-semibold text-5xl'>Shaurya Gupta</p>
                        <span className='text-red-500'>
                            This is a AI SAAS(Software As A Service) Product by
                            Shaurya Gupta(me). Only with the purpose to learn T3 Stack(Nextjs, Typescript, TRPC, Tailwind CSS, Prisma with PostgreSQL, Recoil (State Management), Next-Auth, Zod(Input Validation)).
                        </span>
                    </div>
                    <div className="aboutSectionContainer2 flex-1 flex justify-start items-center flex-col mt-20">
                        <h2 className='text-6xl text-slate-600'>Our Brands</h2>
                        <Link className='text-8xl mt-6' href="https://www.linkedin.com/in/shauryagupta6/" target="blank">
                            <AiFillLinkedin />
                        </Link>
                        <button onClick={visitGithub} className="primary text-8xl mt-6" color="primary">
                            <BsGithub />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About