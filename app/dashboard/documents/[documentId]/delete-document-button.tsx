'use client';

import { LoadingButton } from "@/components/loading-button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { btnIconStyles, btnStyles } from "@/styles/styles"
import { useMutation } from "convex/react"
import { TrashIcon } from "lucide-react"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useState } from "react"

  
  export function DeleteDocumentButton({
    documentId,
  }: {
    documentId: Id<"documents">;
  }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deleteDocument = useMutation(api.documents.deleteDocument)
    const router = useRouter();

    return(
        <AlertDialog>
        <AlertDialogTrigger>
          <Button variant='destructive' className={btnStyles}>
            <TrashIcon className={btnIconStyles}/>
            Delete
          </Button>
        </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this document?</AlertDialogTitle>
              <AlertDialogDescription>
                  Your document can not be recovered after it's been deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Link href='/dashboard/documents'>
                <LoadingButton
                  onClick={()=>{
                      setIsLoading(true);
                      deleteDocument({
                          documentId,
                        })
                        .finally(() => {
                            setIsLoading(false);
                        });
                    }}                 
                    
                    isLoading={isLoading}
                    loadingText="Deleting..."
                    >
                    Delete
                </LoadingButton>
                </Link>              
              
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

    )
  }