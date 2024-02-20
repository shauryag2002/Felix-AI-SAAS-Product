import React from 'react'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'
const ToolLoading = () => {
    return (
        <div className='flex flex-col gap-2 justify-center items-center h-[max-content]'>
            <div className="animate-spin">

                <Image src={'/logo.svg'} alt="logo" width={100} height={100} />
            </div>
            <ReactTyped
                strings={[
                    'Felix is thinking....'
                ]}
                typeSpeed={40}
                backSpeed={50}
                loop
                className='text-black'
            />
        </div>
    )
}

export default ToolLoading