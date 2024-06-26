import * as React from "react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export const DocumentCard = ({document}:{document:Doc<'documents'>})=>{
    return(
        <Card>
           <CardHeader>
             <CardTitle>{document.title}</CardTitle>
             
           </CardHeader>
           <CardContent>
             <div>
               {!document.description ? (
                 <div className="flex justify-center">
                    <Loader2 className="animate-spin" />
                 </div>
                ) : (
                  document.description
                )}
             </div>
           </CardContent>
           <CardFooter>             
             <Button variant='secondary'>
              <Link href={`/dashboard/documents/${document._id}`}>
                View              
              </Link>
             </Button>
           </CardFooter>
        </Card>
    )
}