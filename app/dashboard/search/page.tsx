'use client';

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Link from "next/link";


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
                    <Link href={`/dashboard/notes/${result.record._id}`}>
                    <li className="hover:bg-slate-600 bg-slate-800 rounded p-4 whitespace-pre-line">
                    <span>type: note</span>
                    {result.score}
                    {result.record.text.substring(0,200) + "..."}
                    </li>
                    </Link>
                ) 
            } else {
                return (
                    <Link href={`/dashboard/documents/${result.record._id}`}>
                <li className="hover:bg-slate-600 bg-slate-800 rounded p-4 whitespace-pre-line">
                    <span>type: document</span>
                    {result.score}
                    {result.record.title}
                    {result.record.description?.substring(0,500) + "..."}
                </li>
                    </Link>
                )
            }
          })}
          </ul>
          
        </main>
    )
}