'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";


export default function ChatBox({
    documentId,
}:{
    documentId: Id<'documents'>
}) {

    const askQuestion = useAction(api.documents.askQuestion);
  
  return (
    <div className="w-[300px] flex flex-col bg-gray-900 gap-2 p-2 justify-between">
        <div className="h-[530px] overflow-y-auto">
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>            
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
            <div className="bg-gray-800 p-4">Hello</div>
        </div>
        <div className="flex gap-1">
            <form onSubmit={async(e)=>{
                e.preventDefault();
                const form = e.target as HTMLFormElement
                const formData = new FormData(form)
                const text =  formData.get("text") as string;
                await askQuestion({question: text, documentId}).then(console.log)
            }}>
              <Input required name="text" />
              <Button>Submit</Button>
            </form>         
        </div>
    </div>
  );
}