"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Session } from "next-auth";
interface ProviderProps {
    children: ReactNode;
    session?: Session;
}
const Provider = ({ children }: ProviderProps) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default Provider