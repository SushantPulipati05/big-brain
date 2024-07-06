'use client';

import { api } from "@/convex/_generated/api";
import { DocumentCard } from "./document-card";
import { useMutation, useQuery } from "convex/react";
import CreateDocumentButton from "./upload-document-button";
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card";
import Image from "next/image";


export default function Home() {

  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);
  

  return (
    <main className="space-y-8 w-full">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">My documents</h1>
         <CreateDocumentButton />     
      </div>

      {!documents && (
        <div className="grid grid-cols-3 gap-8">
        {new Array(9).fill("").map((_,i)=>(
          <Card key={i} className="h-[200px] p-6 flex flex-col justify-between">
          <Skeleton className="h-[30px] rounded-sm" />
          <Skeleton className="h-[30px] rounded-sm" />
          <Skeleton className="w-[80px] h-[40px] rounded-sm" />
          </Card>
        ))}
        </div>
      )}

      {documents && documents.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-8 py-12" >
          <Image
            src='/upload_doc.svg'
            width={200}
            height={200}
            alt="you haven't uploaded any documents yet"          
          />
          <h2>No documents uploaded yet</h2>  
          <CreateDocumentButton />      
        </div>
      )} 

      {documents && documents.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
        {documents?.map((docs) => {
            return(
              <DocumentCard key={docs._id} document = {docs}/>
            )
          })}
        </div>
      )}      

           
    </main>
  );
}
