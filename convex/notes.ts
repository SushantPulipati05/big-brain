import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});


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

export async function embed(text: string) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    })

    return embedding.data[0].embedding;
}

export const setNoteEmbedding = internalMutation({
    args: {
        noteId: v.id('notes'),
        embedding: v.array(v.number()),
    },
    handler: async(ctx, args) =>{
        await ctx.db.patch(args.noteId, {
            embedding: args.embedding,            
        })
    }
})

export const createNotesEmbedding = internalAction({
    args: {
        noteId: v.id('notes'),
        text: v.string(),
    },
    handler: async(ctx, args) =>{        

        const embedding = await embed(args.text)

        await ctx.runMutation(internal.notes.setNoteEmbedding, {
            noteId: args.noteId,
            embedding,
        })
} })

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

        const noteId = await ctx.db.insert("notes",{
            text: args.text,
            tokenIdentifier: userId,
        })

        await ctx.scheduler.runAfter(0, internal.notes.createNotesEmbedding, {
            noteId,
            text: args.text,
        })

        
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