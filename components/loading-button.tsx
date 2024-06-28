import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { ReactNode } from "react";

export function LoadingButton(
    {
        isLoading, 
        children, 
        loadingText,
        onClick
    }:{
        isLoading: boolean, 
        children: ReactNode, 
        loadingText: string,
        onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>  void

    }){
    return(
        <Button
           className="flex gap-1 items-center" 
           type="submit" 
           onClick = {(e)=>{
            onClick?.(e);
           }}
           disabled={isLoading}
        >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLoading ?  loadingText : children}

        </Button>
    )
}