'use client';

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useAction, useQuery } from "convex/react";
import { QuestionForm } from "./question-form";


export default function ChatBox({
    documentId,
}:{
    documentId: Id<'documents'>
}) {

    const askQuestion = useAction(api.documents.askQuestion);
    const chats = useQuery(api.chats.getChatForDocument, {documentId})
  
  return (
    <div className="flex flex-col bg-gray-900 gap-2 p-2">
        <div className="h-[530px] overflow-y-auto space-y-2">
            <div className="bg-slate-950 rounded p-3">
                this is the place where the text from AI will be displayed!!\
            </div> 
            {chats?.map((chat)=>(
                <div className={cn(
                    {
                        "bg-slate-800 text-right": chat.isHuman,
                        "dark:bg-slate-950 bg-slate-300": !chat.isHuman,
                    },
                    "rounded p-3 whitespace-pre-line"
                )}>
                    {chat.isHuman ? "YOU":"AI"} : {chat.text}
                </div>
            ))}     
        </div>
        <div className="flex gap-1">
            <QuestionForm documentId={documentId} />                     
        </div>
    </div>
  );
}