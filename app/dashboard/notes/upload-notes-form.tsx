'use client';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingButton } from "@/components/loading-button";
import { Textarea } from "@/components/ui/textarea";

 
const formSchema = z.object({
  text: z.string().min(2).max(5000),

})

export default function CreateNote({
    onNoteCreated,
} : {
    onNoteCreated: () => void
}){
    
    const createNote = useMutation(api.notes.createNotes)
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          text: "",
        },

      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        await createNote({
          text: values.text,
        })  
        onNoteCreated();        
      }

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Text</FormLabel>
                  <FormControl>
                    <Textarea rows={8} placeholder="Your Note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <LoadingButton 
              isLoading= {form.formState.isSubmitting}
              loadingText="Creating..."
            >
                Create
            </LoadingButton>
          </form>
        </Form>
      )
}

