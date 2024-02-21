"use client";
import Link from "next/link";
import Image from "next/image";
import TypeWriter from "~/app/_components/TypeWriterEffect";
import Navbar from "./_components/Navbar";
import Pricing from "./_components/Pricing";
import Footer from "./_components/Footer";
export default async function Home() {
  return (
    <main >
      <Navbar />

      <div className="home mt-[70px]" >
        <div className="homeHeading border-b-2 border-b-sky-50">
          <div className="headImg relative">
            <Image src={"/HomeImg.png"} alt="Home Page" width={500} height={1000} className="hidden sm:block absolute -z-10 right-0" />
          </div>
          <div className="headRight sm:w-1/2 sm:h-[520px] w-screen h-[300px]  flex flex-col justify-center items-center">
            <div className="rightContent text-5xl text-blue-700 text-center flex justify-center">

              Felix can Generate{" "}
            </div>
            <TypeWriter display={["Prompt Conversation", "Image to Image", "Text to Image", "Text to Code", "Link to QR Code"]} className={"font-extrabold  text-3xl"} speed={100} key={100} />
          </div>
        </div>
        <div className="features mt-[40px]" id="features">
          <div className="text-5xl text-center text-secondary">Check out our premium features</div>
          <div className="flex gap-4 justify-center sm:flex-row flex-col items-center mt-4">

            <div className="card flex flex-col justify-center items-center p-3 border rounded bg-blue-500">
              <Image src={"/Group.png"} alt="Easy Design icon" height={50} width={50} />
              <div className="text-3xl text-center">Easy Features</div>
            </div>
            <div className="card flex flex-col justify-center items-center p-3 border rounded bg-blue-500">
              <Image src={"/loading.png"} alt="Easy Design icon" height={50} width={50} />
              <div className="text-3xl text-center">Good user Experience</div>
            </div>
            <div className="card flex flex-col justify-center items-center p-3 border rounded bg-blue-500">
              <Image src={"/design_icon.png"} alt="Easy Design icon" height={50} width={50} />
              <div className="text-3xl text-center">Clean Design</div>
            </div>
          </div>
          < div className='flex flex-col pt-12 max-w-[600px] m-auto border-b-2 border-b-sky-50' >

            <Link href="/chat" className='text-center bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded '>Chat Conversation</Link>
            <Link href="/image-to-image" className=' text-center bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded ' >Image to Image Generation</Link>
            <Link href="/text-to-image" className=' text-center bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded '>Text to Image Generation</Link>
            <Link href="/text-to-code" className=' text-center bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded '>Text to Code Generation</Link>
            <Link href="/link-to-qr-image" className=' text-center bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded '>Link to QR Generation</Link>
          </div >
        </div>
        <div className="py-4 border-b-2 border-b-sky-50">
          <h1 className="text-5xl my-2 text-center text-secondary">How to use Felix:- </h1>
          <video src="/Felix_Demo_video.mp4" controls className="w-[80%] m-auto " />
        </div>
        <div className="pricing py-4 border-b-2 border-b-sky-50" id="pricing">
          <h1 className="text-5xl text-center text-secondary my-2 ">Our Pricings</h1>
          <Pricing />
        </div>
        <div className="feedbacks"></div>
      </div >
      <Footer />
    </main >
  );
}