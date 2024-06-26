'use client';

import { ModeToggle } from "@/components/ui/mode-toggle"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated } from "convex/react"
import Image from "next/image";

export const Header = () =>{
    return(
        <div className="bg-slate-900 py-4">
            <div className=" container flex mx-auto justify-between items-center">
                <div className="flex gap-4 items-center">
                    <Image className="rounded-md" src='/logo.png' width={40} height={40} alt="big_brain logo" />
                    BigBrain
                </div>
                <div>
                  <Unauthenticated>
                     <SignInButton />
                  </Unauthenticated>
                  <Authenticated>
                    <div className="flex gap-4">
                     <ModeToggle />          
                     <UserButton />  
                    </div>
                  </Authenticated>
                </div>
            </div>
        </div>
    )
}