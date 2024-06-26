import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode } from "react";

export function LoadingButton(
    {
        isLoading, 
        children, 
        loadingText
    }:{
        isLoading: boolean, 
        children: ReactNode, 
        loadingText: string
    }){
    return(
        <Button
           className="flex gap-1 items-center" 
           type="submit" 
           disabled={isLoading}
        >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ?  loadingText : children}

        </Button>
    )
}