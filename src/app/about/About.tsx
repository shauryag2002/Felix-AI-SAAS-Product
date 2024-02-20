"use client"
import React from 'react'
import Image from 'next/image';
import { AiFillLinkedin } from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';
const About = () => {
    const visitGithub = () => {
        window.location.href = "https://github.com/shauryag2002";
    };
    return (
        <div className="aboutSection">
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <h1 >About Us</h1>

                <div>
                    <div>
                        <Image
                            width={200}
                            height={200}
                            src={"/profile.jpg"}
                            alt="Founder"
                        />
                        <p>Shaurya Gupta</p>
                        <button onClick={visitGithub} className="primary" color="primary">
                            Visit Github
                        </button>
                        <span>
                            This is a Real-time document sharing and editing web app made by
                            Shaurya Gupta. Only with the purpose to learn MERN Stack.
                        </span>
                    </div>
                    <div className="aboutSectionContainer2">
                        <h2 >Our Brands</h2>
                        <a href="https://www.linkedin.com/in/shauryagupta6/" target="blank">
                            <AiFillLinkedin />
                        </a>

                        <a href="https://instagram.com/shaurya_gupta6" target="blank">
                            <BsInstagram />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About