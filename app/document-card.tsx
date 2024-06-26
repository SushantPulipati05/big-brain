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

export const DocumentCard = ({document}:{document:Doc<'documents'>})=>{
    return(
        <Card>
           <CardHeader>
             <CardTitle>{document.title}</CardTitle>
             
           </CardHeader>
           <CardContent>
             <p>Card Content</p>
           </CardContent>
           <CardFooter>             
             <Button variant='secondary'>View</Button>
           </CardFooter>
        </Card>
    )
}