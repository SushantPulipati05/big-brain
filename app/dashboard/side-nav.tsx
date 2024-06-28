'use client';

import { cn } from "@/lib/utils";
import { Files, Notebook, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav(){
    const pathName = usePathname();
    return(
        
        <nav>
            <ul className="space-y-6">
                <li>
                    <Link 
                    className={cn(
                        "font-light flex gap-2 items-center text-xl hover:text-cyan-400 dark:hover:text-cyan-100",
                        {
                          "text-cyan-300": pathName.endsWith("/documents"),
                        }
                      )}
                    href="/dashboard/documents">
                      <Files />
                      Documents
                    </Link>
                </li>
                <li>
                    <Link 
                    className={cn(
                        "font-light flex gap-2 items-center text-xl hover:text-cyan-400 dark:hover:text-cyan-100",
                        {
                          "text-cyan-300": pathName.endsWith("/notes"),
                        }
                      )}
                    href="/dashboard/notes">
                      <Notebook />
                      Notes
                    </Link>
                </li>
                <li>
                    <Link 
                    className={cn(
                        "font-light flex gap-2 items-center text-xl hover:text-cyan-400 dark:hover:text-cyan-100",
                        {
                          "text-cyan-300": pathName.endsWith("/settings"),
                        }
                      )}
                    href="/dashboard/settings">
                      <Settings />
                      Settings
                    </Link>
                </li>
            </ul>

        </nav>
    )
}