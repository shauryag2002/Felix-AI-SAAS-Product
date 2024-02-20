"use client"

import "~/styles/globals.css";
import { RecoilRoot } from "recoil";
import Provider from "~/context/Provider";
import { TRPCReactProvider } from "~/trpc/react";
import { Inter } from "next/font/google";
import Support from "~/app/_components/Support"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      <TRPCReactProvider>
        <Provider>

          <html lang="en" className="bg-slate-400">
            <body className={`font-sans ${inter.variable} `}>
              <Support>{children}</Support>
            </body>
          </html>
        </Provider>
      </TRPCReactProvider>
    </RecoilRoot>
  );
}
