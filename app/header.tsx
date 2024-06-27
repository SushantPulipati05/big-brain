import { ModeToggle } from "@/components/ui/mode-toggle"
import { HeaderActions } from "./header-actions";

import Image from "next/image";
import Link from "next/link";


export const Header = () =>{
    return(
        <div className="bg-slate-900 py-4">
            <div className=" container flex mx-auto justify-between items-center">
                <Link href="/" className="flex gap-4 items-center text-2xl">
                    
                    <Image className="rounded-md" src='/logo.png' width={40} height={40} alt="big_brain logo" />
                    BigBrain
                    
                </Link>
                <div className="flex gap-4 items-center">
                     <ModeToggle />   
                     <HeaderActions />  
                  
                </div>
            </div>
        </div>
    )
}