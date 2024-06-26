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
import UploadDocument from "./upload-document-form"
import { useState } from "react"
import { Upload } from "lucide-react"

  export default function CreateDocumentButton() {

    const [isOpen, setIsOpen] = useState(false);


    return(
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild>
          <Button className="flex items-center gap-1">
            <Upload className="w-4 h-4" /> Upload
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