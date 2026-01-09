import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { MistralAIEmbeddings } from "@langchain/mistralai"
import { createClient } from "./supabase/server"

const MISTRAL_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_TOKEN || process.env.MISTRAL_API_KEY;

export async function syncPropertiesToVectorStore() {
    const supabase = await createClient()

    // 1. Fetch properties
    const { data: properties, error } = await supabase
        .from("properties")
        .select("*")

    if (error) {
        console.error("Error fetching properties:", error)
        return { success: false, error: error.message || "Failed to fetch properties" }
    }

    // 2. Format into rich documents
    const documents = properties.map((p) => {
        const content = `
Property Title: ${p.property_title || "N/A"}
Type: ${p.property_type || "N/A"}
Price: ${p.price || "N/A"}
Area: ${p.area || "N/A"}
Location: ${p.location_text || p.address || "N/A"}, ${p.city || ""}, ${p.state || ""}
Amenities: ${p.amenities || "N/A"}
Description: ${p.description || "N/A"}
`.trim()

        return {
            pageContent: content,
            metadata: {
                id: p.id,
                price: p.price,
                city: p.city,
                type: p.property_type,
            },
        }
    })

    // 3. Clear existing documents (optional, or rely on upsert if stable IDs used)
    // For now, let's just add them. In a real app, you might want to delete old ones first
    // or use a more sophisticated sync logic.

    const embeddings = new MistralAIEmbeddings({
        model: "mistral-embed",
        apiKey: MISTRAL_API_KEY,
    })

    try {
        const vectorStore = await SupabaseVectorStore.fromDocuments(
            documents,
            embeddings,
            {
                client: supabase,
                tableName: "documents",
            }
        )
        return { success: true, count: documents.length }
    } catch (err) {
        console.error("Error uploading to vector store:", err)
        return { success: false, error: err.message || "Failed to upload to vector store" }
    }
}
