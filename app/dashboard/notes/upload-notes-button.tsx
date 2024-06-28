'use client';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast";
import CreateNote from "./upload-notes-form";
import { btnIconStyles } from "@/styles/styles";
import { PlusIcon } from "lucide-react";
import { title } from "process";

  export default function CreateNoteButton() {

    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();


    return(
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild>
          <Button className="flex items-center gap-1">
             <PlusIcon className={btnIconStyles} /> Create Note
          </Button>   
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a note</DialogTitle>
              <DialogDescription>
                Upload a note to your account
              </DialogDescription>
                <CreateNote 
                 onNoteCreated = {() => {
                  setIsOpen(false)
                  toast({
                    title: "Note created",
                    description: "Your note has been created successfully",
                  })
                 }} 
                />             
            </DialogHeader>
          </DialogContent>
        </Dialog>

    )
  }