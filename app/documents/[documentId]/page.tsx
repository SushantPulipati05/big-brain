'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import ChatBox from "./chat-form";

export default function DocumentPage({
    params,
}:{
    params:{
        documentId: Id<"documents">,
    }
}) {
    console.log(params.documentId)
    const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });
    
  if(!document){
    return <div>Document not found</div>
  }

  
  return (
    <main className="p-24">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">{document.title}</h1>   
      </div>      
        
        <div className = 'flex gap-12 '>
            <div className="bg-gray-900 p-4 rounded flex-1 h-[600px]">
               {document.documentUrl && (<iframe className="w-full h-full" src={document.documentUrl} /> )}            
            </div>
            <ChatBox documentId={document._id} />      
        </div>
    </main>
  );
}