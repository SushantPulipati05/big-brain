'use client';

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import CreateNoteButton from "./upload-notes-button"
import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";



export default function NotesLayout({children}:{children: ReactNode}){
    const notes = useQuery(api.notes.getNotes)
    const { noteId } = useParams<{noteId: Id<"notes">}>();

    const hasNotes = notes && notes.length > 0

    return(
        <main className="space-y-8 w-full">
          <div className="flex items-center justify-between py-4">
             <h1 className="text-4xl font-bold">My Notes</h1>
             <CreateNoteButton />
          </div>

          {!notes && (
            <div className="flex gap-12">
            <div className="w-[200px] space-y-4">
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-[300px] w-full " />
            </div>
            </div>

          )}

          {notes?.length === 0 && (
            <div className="flex flex-col justify-center items-center gap-8 py-12" >
            <Image
              src='/noNotes.svg'
              width={200}
              height={200}
              alt="you haven't created any notes yet"          
            />
            <h2>No notes created yet</h2>  
            <CreateNoteButton />      
          </div>
          )}

          {notes && notes.length > 0 && (
          <div className="flex gap-12">
          <ul className=" w-[300px]">
            {notes?.map(note =>(
              <Link key={note._id} href={`/dashboard/notes/${note._id}`}>
                <li 
                className={cn( "text-base p-1 hover:text-cyan-400", {
                  "text-cyan-600" : note._id === noteId
                })}
                key={note._id}>{note.text.substring(0,20) + "..."}</li>
                </Link>
              ))}
          </ul>

          <div className=" bg-slate-800 rounded p-4 w-full">
           {children}
          </div>

          </div>
          )}

        </main>
    )
}