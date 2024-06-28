'use client';

import { useQuery } from "convex/react";
import CreateNoteButton from "./upload-notes-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function NotesPage(){
    const notes = useQuery(api.notes.getNotes)
    return(
        <div className="space-y-8 w-full">
            Pwease select a note uwu ;3
        </div>
    )
}