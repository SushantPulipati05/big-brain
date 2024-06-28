'use client';

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import CreateNoteButton from "./upload-notes-button"
import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";



export default function NotesLayout({children}:{children: ReactNode}){
    const notes = useQuery(api.notes.getNotes)
    const { noteId } = useParams<{noteId: Id<"notes">}>();

    return(
        <main className="space-y-8 w-full">
          <div className="flex items-center justify-between py-4">
             <h1 className="text-4xl font-bold">My Notes</h1>
             <CreateNoteButton />
          </div>

          <div className="flex gap-12">
          <ul className=" w-[300px]">
            {notes?.map(note =>(
              <Link href={`/dashboard/notes/${note._id}`}>
                <li 
                className={cn( "text-base p-1 hover:text-cyan-400", {
                  "text-cyan-600" : note._id === noteId
                })}
                key={note._id}>{note.text.substring(0,20) + "..."}</li>
                </Link>
              ))}
          </ul>

          <div className="bg-slate-800 rounded p-4 w-full">
           {children}
          </div>

          </div>

        </main>
    )
}