'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQueries, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { DeleteNoteButton } from "./delete-note-button";


export default function NotePage(){
    const { noteId } = useParams<{noteId: Id<"notes">}>();
    const note = useQuery(api.notes.getNote, {
        noteId: noteId,
    })
    if(!note){
        return null;
    }

    return(     
        <div className="relative bg-slate-800 rounded p-4 w-full">
          <DeleteNoteButton noteId={note._id} />
        <div className="pr-3 whitespace-pre-line">{note?.text}</div>
    </div>  
    )
}