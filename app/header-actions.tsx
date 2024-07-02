'use client';

import { SignInButton, UserButton } from "@clerk/nextjs"
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react"

export const HeaderActions = () =>{
    return(
        <>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
          <Authenticated>           
             <UserButton />            
          </Authenticated>
          <AuthLoading >Loading...</AuthLoading>
        </>
    )
}