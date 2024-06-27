import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getChatForDocument = query({
    args:{
        documentId: v.id("documents")
    },
    handler: async(ctx, args) =>{
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier
        if(!userId){
            return [];
        }

        return await ctx.db
        .query("chats")
        .withIndex("by_documentId_tokenIdentifier", (q)=> 
        q
          .eq("documentId", args.documentId)
          .eq("tokenIdentifier", userId)
        ).collect();
    }
})


export const createChatRecord = internalMutation({
    args:{
        documentId: v.id("documents"),
        text: v.string(),
        tokenIdentifier: v.string(),
        isHuman: v.boolean(),     
    },
    handler: async(ctx, args) =>{
        await ctx.db.insert('chats',{
            documentId: args.documentId,
            text: args.text,
            tokenIdentifier: args.tokenIdentifier,
            isHuman: args.isHuman,
        })
    }
})