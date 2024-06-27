import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Input } from "@/components/ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button";

export function QuestionForm({
    documentId,
}:{
    documentId: Id<'documents'>
}) {
    const askQuestion = useAction(api.documents.askQuestion)

    const formSchema = z.object({
        text: z.string().min(1).max(250),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          text: "",
        },

      })

      async function onSubmit(values: z.infer<typeof formSchema>) {        
        await askQuestion({question: values.text, documentId})  
        form.reset()  ;      
      }

    return(
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-1 gap-2"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Ask any question regarding the doc to AI" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton 
              isLoading= {form.formState.isSubmitting}
              loadingText="Submitting..."
            >
                Submit
            </LoadingButton>
        </form>
      </Form>
          
    )
}