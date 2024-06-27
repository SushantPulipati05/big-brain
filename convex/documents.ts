import { ConvexError, v } from 'convex/values'
import {MutationCtx, QueryCtx, action, internalQuery, mutation, query} from './_generated/server'
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
            return [];
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

    
      await ctx.db.insert('documents', {
            title: args.title,
            tokenIdentifier: userId,
            fileId: args.fileId,
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
        console.log(text)
        
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