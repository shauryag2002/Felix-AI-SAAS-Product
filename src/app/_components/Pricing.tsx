"use client"
import React from 'react'
import { api } from '~/trpc/react';
import { useSession } from 'next-auth/react';
import { upgradeModalAtom } from '~/state/atoms/atom';
import { useSetRecoilState } from 'recoil';
import Loading from './Loading';
interface PricingProps {
    className?: string;
}
interface RazorpayOptions {
    key?: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    image?: string;
    order_id?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    handler?: (response: { razorpay_payment_id: string }) => void;
    modal?: {
        ondismiss?: () => void;
    };
}
interface Razorpay {
    open: () => void;
    on: (event: string, handler: () => void) => void;
    close: () => void;
    paymentSuccess: (payment_id: string) => void;
    paymentError: () => void;
    paymentCancel: () => void;
}
type RazorpayConstructor = (options: RazorpayOptions) => Razorpay;
declare global {
    interface Window {
        Razorpay: RazorpayConstructor;
    }
}
const Pricing = ({ className }: PricingProps) => {
    const { data: session, status } = useSession()
    const setUpgradeModal = useSetRecoilState<boolean>(upgradeModalAtom)
    const { mutate } = api.payment.createOrder.useMutation({
        onError: (err) => {
            console.log(err)
        }
    })
    const loadRazorpay = async (name: string, amount: number) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
                amount: amount * 100,
                currency: 'INR',
                name: 'Felix',
                description: name,
                image: '/logo.svg',
                handler: function (response: { razorpay_payment_id: string }) {
                    if (session) {

                        mutate({ name, amount, currency: "INR", receipt: response.razorpay_payment_id, userId: session.user.id })
                        setUpgradeModal(false)
                    }
                },
                theme: {
                    color: '#F37254'
                }
            };

            const razorpayConstructor: RazorpayConstructor = window.Razorpay;
            //@ts-expect-error This is necessary to suppress the TypeScript error.

            const razorpay: Razorpay = new razorpayConstructor(options) as Razorpay;
            if (razorpay) {

                razorpay?.open();
            }

        };
        document.body.appendChild(script);
    };
    if (status === "loading") return <div className='h-screen w-screen'><Loading /></div>
    return (
        <div className={`${className} bg-gradient-to-r from-purple-500 to-red-500`}>
            <div className={`h-full  flex items-center justify-center gap-10 flex-wrap`}>
                <div className="first border p-4 m-3 rounded flex flex-col items-center justify-center my-5">
                    <div className="price">
                        <h1 className='sm:text-9xl text-[18vw]'>Basic</h1>
                    </div>
                    <div className="features my-4">
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>100 AI Conversations</p>
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>50 Remove Backgrounds</p>
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>Fast Response</p>
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>Better Image quality</p>
                    </div>
                    <p className='text-3xl text-center'>₹999 per month</p>
                    <div className="button">
                        <button className='bg-[#83d1dc] hover:bg-[#447c83] text-black font-bold py-2 px-4 rounded ' onClick={async () => {
                            await loadRazorpay("Basic", 999)
                        }}>Buy Now</button>
                    </div>
                </div>
                <div className="second border p-4 m-3 rounded flex flex-col items-center justify-center my-5">
                    <div className="price">
                        <h1 className='sm:text-9xl text-[18vw]'>Advanced</h1>
                    </div>
                    <div className="features my-4">
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>1000 AI Conversations</p>
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>500 Remove Backgrounds</p>
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>Faster Response than Basic</p>
                        <p className='text-[#adff2f]'> <span className='font-semibold' >✔</span>Better Image quality(HD) </p>
                    </div>
                    <p className='text-3xl text-center'>₹1999 per month</p>
                    <div className="button">
                        <button className='bg-[#83d1dc] hover:bg-[#447c83] text-black font-bold py-2 px-4 rounded ' onClick={async () => {
                            await loadRazorpay("Advanced", 1999)
                        }}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricing