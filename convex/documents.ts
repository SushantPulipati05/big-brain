import { ConvexError, v } from 'convex/values'
import {MutationCtx, QueryCtx, action, internalAction, internalMutation, internalQuery, mutation, query} from './_generated/server'
import { api, internal } from './_generated/api'
import OpenAI from 'openai';
import { Id } from './_generated/dataModel';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});


export async function hasAccessToDocuments(
    ctx: MutationCtx | QueryCtx,
    documentId: Id<"documents">
) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier
        if(!userId){
            throw new ConvexError('user not authenticated')
        }    

    const document = await ctx.db.get(documentId)
    if(!document){
        throw new ConvexError('document not found')
    }
    if(document.tokenIdentifier !== userId){
        throw new ConvexError('user not authenticated')        
    }
    return {document, userId}
}


export const hasAccessToDocumentQuery = internalQuery({
    args:{
        documentId: v.id("documents")
    },
    handler: async (ctx, args) => {
        return await hasAccessToDocuments(ctx, args.documentId)
    }
})


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});


export const getDocuments = query({
    handler: async(ctx) =>{
        
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier
        console.log(userId)
        if (!userId) {
            return undefined;
        }

        return await ctx.db.query('documents')
        .withIndex('by_tokenIdentifier', (q)=>q.eq('tokenIdentifier', userId))
        .collect()

    }
})


export const getDocument = query({
    args: {
        documentId : v.id('documents')
    },
    handler: async(ctx, args) =>{
        const accessObj = await hasAccessToDocuments(ctx, args.documentId)
        if(!accessObj){
            throw new ConvexError('document not found')
        }      

        return {...accessObj.document,
             documentUrl:  await ctx.storage.getUrl(accessObj.document.fileId)
        };

    }
})


export const createDocument = mutation({
    args:{
        title: v.string(),
        fileId: v.id('_storage'),
    },

    handler: async(ctx, args) => {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier
        console.log(userId)
        if (!userId) {
            throw new ConvexError('user not authenticated')
        }

    
       const documentId =await ctx.db.insert('documents', {
            title: args.title,
            tokenIdentifier: userId,
            fileId: args.fileId,
            description: ""
        })

      await ctx.scheduler.runAfter(0, internal.documents.generateDocumentDescription, {
        fileId: args.fileId,
        documentId
      })
    }
})


export const updateDocumentDescription = internalMutation({
    args: {
        documentId: v.id('documents'),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch( args.documentId, {
            description: args.description
        })
    }
})


export const generateDocumentDescription = internalAction({
    args: {
        documentId: v.id('documents'),
        fileId: v.id("_storage")
    }, 
    handler: async(ctx, args) => {
        const file = await ctx.storage.get(args.fileId)
        if(!file){
            throw new ConvexError('file not found')
        }

        const text = await file.text()

        const chatCompletion: OpenAI.Chat.Completions.ChatCompletion = 
        await openai.chat.completions.create({
          messages: [
            { 
                role: 'system', 
                content: `Here is a text file ${text}`
            },
            {
                role: 'user',
                content: `please generate 1 sentence description for this document.`
            }
        ],
          model: 'gpt-3.5-turbo',
        });
        if(chatCompletion === null){
            throw new ConvexError('chat completion not found')
        }

        const description = chatCompletion.choices[0].message.content ?? "could not give a description for this document"
        console.log(description)

        await ctx.runMutation(internal.documents.updateDocumentDescription, {
            documentId: args.documentId,
            description: description
        })


    }
})


export const askQuestion = action({
    args:{
        question: v.string(),
        documentId: v.id("documents")
    },
    handler: async(ctx, args) => {
        const accessObj = await ctx.runQuery(internal.documents.hasAccessToDocumentQuery, {
            documentId: args.documentId
        })
        if(!accessObj){
            throw new ConvexError('not found or you do not have access lmao')
        }

        const file = await ctx.storage.get(accessObj.document.fileId)
        if(!file){
            throw new ConvexError('file not found')
        }

        const text = await file.text();
        
        const chatCompletion: OpenAI.Chat.Completions.ChatCompletion = 
        await openai.chat.completions.create({
          messages: [
            { 
                role: 'system', 
                content: `Here is a text file ${text}`
            },
            {
                role: 'user',
                content: `please answer this question ${args.question}`
            }
        ],
          model: 'gpt-3.5-turbo',
        });
        if(chatCompletion === null){
            throw new ConvexError('chat completion not found')
        }
        
        //to store the prompt from the user
        await ctx.runMutation(internal.chats.createChatRecord, {
            documentId: args.documentId,
            text: args.question,
            isHuman: true,
            tokenIdentifier: accessObj.userId
        })

        //to store the text generated from the AI
        const response = chatCompletion.choices[0].message.content ?? "could not generate a response"
        
        await ctx.runMutation(internal.chats.createChatRecord, {
            documentId: args.documentId,
            text: response,
            isHuman: false,
            tokenIdentifier: accessObj.userId
        })

        return chatCompletion.choices[0].message.content      
    
    }

})

export const deleteDocument = mutation({
    args: {
        documentId: v.id("documents"),
    },
    handler: async(ctx, args) =>{
       
        const accessObj = await hasAccessToDocuments(ctx, args.documentId);
       if(!accessObj){
        throw new ConvexError('not authorized to delete')
       }

       await ctx.storage.delete(accessObj.document.fileId)
       await ctx.db.delete(args.documentId)
    }
})