'use client';

import { api } from "@/convex/_generated/api";
import { DocumentCard } from "./document-card";
import { useMutation, useQuery } from "convex/react";
import CreateDocumentButton from "./create-document-button";

export default function Home() {

  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="p-24">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-4xl font-bold">My documents</h1>
         <CreateDocumentButton />     
      </div>

      <div className="grid grid-cols-4 gap-8">
      {documents?.map((docs) => {
          return(
            <DocumentCard document = {docs}/>
          )
        })}
      </div>
      

        

        
     
    </main>
  );
}
