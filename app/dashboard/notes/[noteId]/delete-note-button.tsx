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

  
  export function DeleteNoteButton({
    noteId,
  }: {
    noteId: Id<"notes">;
  }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deleteNote = useMutation(api.notes.deleteNote)
    

    return(
        <AlertDialog>
        <AlertDialogTrigger>
          <Button 
          className="absolute -top-3 -right-3"
          variant={"destructive"}
          size="icon">
            <TrashIcon />
          </Button>
        </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
              <AlertDialogDescription>
                  Your note can not be recovered after its been deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <Link href='/dashboard/notes'>
                <LoadingButton
                  onClick={()=>{
                      setIsLoading(true);
                      deleteNote({
                          noteId,
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