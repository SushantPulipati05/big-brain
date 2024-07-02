'use client';

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Files, Notebook } from "lucide-react";

function SearchResults({
    url,
    score,
    text,
    type
}:{
    url: string,
    score: number,
    text: string,
    type: string
}){
    return(
        <Link href={url}>
           <li className="hover:bg-slate-600 bg-slate-800 rounded p-4 whitespace-pre-line space-y-4">            
            <div className="flex justify-between gap-2 text-xl items-center">
                <div className="flex gap-2 items-center">
                  {type === "notes"? <Notebook />:<Files />}
                  {type === 'notes'? "Note": "Document"}
                </div>
                <div className="text-sm">
                    Relevancy of {score.toFixed(2)}
                </div>
            </div>
            <div>
                {text.substring(0,500) + "..."}
            </div>            
           </li>
        </Link>
    )

}


export default function SearchPage(){   
    const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);

    useEffect(() => {
        const storedResults = localStorage.getItem("searchResults")
        if(!storedResults) {
            return;
        }
        setResults(JSON.parse(storedResults))
    }, [])

    return(
        <main className="w-full">
          <div className="flex items-center justify-between py-4">
             <h1 className="text-4xl font-bold">Search</h1>
          </div>
          
          <div className="mb-4">
            <SearchForm setResults={(searchResults)=>{
                localStorage.setItem("searchResults", JSON.stringify(searchResults))
                setResults(searchResults)
            }} />
          </div>
          

          <ul className="flex flex-col gap-2">
          {results?.map((result) => {
            if(result.type === 'notes'){
                return(
                    <SearchResults 
                       url= {`/dashboard/notes/${result.record._id}`}
                       score={result.score}
                       text= {result.record.text}
                       type= {result.type}
                    />                 
                ) 
            } else {
                return (
                    <SearchResults 
                       url= {`/dashboard/documents/${result.record._id}`}
                       score={result.score}
                       text= {result.record.title + ":" + result.record.description}
                       type= {result.type}
                    />
                )
            }
          })}
          </ul>
          
        </main>
    )
}