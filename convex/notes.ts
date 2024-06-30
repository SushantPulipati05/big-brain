import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNote = query({
    args: {
        noteId: v.id('notes')
    },
    handler: async(ctx, args) =>{
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        if(!userId){
            return null;
        }

        const note = await ctx.db.get(args.noteId)
        if(!note){
            return null;
        }
        if(note.tokenIdentifier !== userId){
            return null;
        }

        return note;

    }
})

export const getNotes = query({
    handler: async(ctx) => {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        if(!userId){
            return null;
        }

        return await ctx.db.query("notes")
        .withIndex("by_tokenIdentifier", (q)=> q.eq("tokenIdentifier", userId))
        .order('desc')
        .collect();        
    }
})

export const createNotes = mutation({
    args: {
        text: v.string(),
    },
    handler: async(ctx, args) =>{
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        if(!userId){
            throw new ConvexError("You must be logged in to create a note!!")
            return null;
        }

        const note = await ctx.db.insert("notes",{
            text: args.text,
            tokenIdentifier: userId,
        })

        return note;
    }
})

export const deleteNote = mutation({
    args: {
        noteId: v.id("notes"),
    },
    handler: async(ctx, args) => {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
        if(!userId){
            return null;
        }

        const note = await ctx.db.get(args.noteId)
        if(!note){
            return null;
        }
        if(note.tokenIdentifier !== userId){
            return null;
        }

        await ctx.db.delete(args.noteId)

    }
})