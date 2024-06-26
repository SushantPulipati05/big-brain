import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import UploadDocument from "./upload-document-button"
import { useState } from "react"

  export default function CreateDocumentButton() {

    const [isOpen, setIsOpen] = useState(false);


    return(
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild>
          <Button>
             Click Me
          </Button>   
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a document</DialogTitle>
              <DialogDescription>
                Upload a document to share with others
              </DialogDescription>
                <UploadDocument onUpload = {() => setIsOpen(false)} />             
            </DialogHeader>
          </DialogContent>
        </Dialog>

    )
  }