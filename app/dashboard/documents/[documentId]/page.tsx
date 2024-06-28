'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import ChatBox from "./chat-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDocumentButton } from "./delete-document-button";


export default function DocumentPage({
    params,
}:{
    params:{
        documentId: Id<"documents">,
    }
}) {
    
    const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,   
    });  

  
  return (
    <main className="p-24">
      {!document && (
        <div className="space-y-8">
           <div>
             <Skeleton className="h-[40px] w-[500px]"/>
           </div>
           <div className="flex gap-2">
             <Skeleton className="h-[40px] w-[80px]"/>
             <Skeleton className="h-[40px] w-[80px]"/>
           </div>
           <Skeleton className="h-[500px]"/>
        </div>
      )}

      {document && (
        <>

        <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">{document.title}</h1> 
        <DeleteDocumentButton documentId={document._id}/>  
      </div>
        <div className = 'flex gap-12 '>
        <Tabs defaultValue="account" className="w-full">
             <TabsList>
                 <TabsTrigger value="document">Document</TabsTrigger>
                 <TabsTrigger value="chat">Chat</TabsTrigger>
             </TabsList>
             <TabsContent value="document" className="w-full">
                <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[600px]">
                  {document.documentUrl && (<iframe className="w-full h-full" src={document.documentUrl} /> )}            
                </div>
             </TabsContent>
             <TabsContent value="chat">
                <ChatBox documentId={document._id} />
             </TabsContent>
        </Tabs>                  
        </div>
        </>
       )}
    </main>
  );
}