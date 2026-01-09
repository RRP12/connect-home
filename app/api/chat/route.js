import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { createUIMessageStreamResponse } from 'ai';
import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "../../../utils/supabase/server";
import { SystemMessage } from "@langchain/core/messages";

export const maxDuration = 30;

export async function POST(req) {
    try {
        console.log("Chat API: Received request");
        const { messages } = await req.json();
        console.log("Chat API: Messages count", messages?.length);

        // Environment checks
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const MISTRAL_KEY = process.env.MISTRAL_API_KEY || process.env.NEXT_PUBLIC_MISTRAL_API_TOKEN || 'KeN2EVC22mnRvrw0JJbo8h5bvyBoZCFs';

        if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Missing Supabase Env Vars");
        if (!MISTRAL_KEY) throw new Error("Missing Mistral API Key");

        // 1. Init Supabase & RAG
        console.log("Chat API: Init Supabase & RAG");
        const supabase = await createClient();
        const embeddings = new MistralAIEmbeddings({ model: "mistral-embed", apiKey: MISTRAL_KEY });
        const vectorStore = new SupabaseVectorStore(embeddings, { client: supabase, tableName: "documents", queryName: "match_documents" });

        // 2. Prepare Prompt & Convert messages (Converted FIRST to handle content safe extraction)
        console.log("Chat API: Converting messages");
        const langchainMessages = await toBaseMessages(messages);

        // Extract query from the last normalized message safely
        const lastLangChainMessage = langchainMessages[langchainMessages.length - 1];
        let queryText = typeof lastLangChainMessage.content === 'string'
            ? lastLangChainMessage.content
            : Array.isArray(lastLangChainMessage.content)
                ? lastLangChainMessage.content.map(c => c.text || '').join(' ')
                : '';

        if (!queryText) {
            console.warn("Chat API: Empty query text derived from last message");
            queryText = "property";
        }

        // 3. Retrieve context
        console.log("Chat API: Similarity Search for query:", queryText.substring(0, 20));
        const docs = await vectorStore.similaritySearch(queryText, 5);
        const context = docs.map(d => d.pageContent).join('\n\n');
        console.log("Chat API: Context length:", context.length);

        // 4. Setup Model
        console.log("Chat API: Init Mistral Model");
        const model = new ChatMistralAI({ model: 'mistral-large-latest', temperature: 0, apiKey: MISTRAL_KEY });

        const systemPrompt = `You are a helpful and professional real estate agent assistant.
Your goal is to help users find properties based on their requirements using the provided context.

Context: 
${context}

Instructions:
- If the answer is in the context, provide details about the relevant properties.
- If you cannot find a matching property in the context, kindly inform the user and ask for more details or suggest broadening their search.
- Be friendly and professional.
- Format property details clearly using bullet points.`;

        const finalMessages = [new SystemMessage(systemPrompt), ...langchainMessages];

        // 5. Stream using Standard AI SDK Helpers (Strict adherence to user request)
        console.log("Chat API: Starting stream (model.stream -> toUIMessageStream)");
        const stream = await model.stream(finalMessages);

        // 6. Return Response using createUIMessageStreamResponse
        return createUIMessageStreamResponse({
            stream: toUIMessageStream(stream),
        });

    } catch (error) {
        console.error("Chat API Critical Error:", error);
        return new Response(JSON.stringify({
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
