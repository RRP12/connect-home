"use client"

import { HfInference } from "@huggingface/inference"

import { createClient } from "../../utils/supabase/client"
import { useEffect, useState } from "react"
import { formatedData } from "../../utils/aidata"
const client = new HfInference(process.env.HUGGINGFACE_API_TOKEN)

console.log("formatedData", formatedData)

let supabase = createClient()

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN)
export default function FloatingMessages() {
  const [isOpen, setIsOpen] = useState(false)
  let [input, setInput] = useState("")
  let [bestmatch, setBestMatch] = useState([])
  let [queryembiddings, setQueryEmbiddings] = useState(null)

  console.log("queryembiddings", queryembiddings)

  const toggleOpen = () => setIsOpen(!isOpen)
  const modelId = "intfloat/e5-base-v2" // Change to any other model if necessary
  const hfToken = process.env.HUGGINGFACE_API_TOKEN // Replace with your Hugging Face API token

  const apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`
  // useEffect(() => {
  //   async function generateText() {
  //     const textToGenerate = "The definition of machine learning inference is "

  //     const response = await hf.textGeneration({
  //       inputs: textToGenerate,
  //       model: "HuggingFaceH4/zephyr-7b-beta",
  //     })

  //     console.log("response", response)
  //   }

  //   generateText()
  // }, []) // Empty dependency array to run the effect once

  //create an embidding for an user input

  const createEmbedding = async (inputText) => {
    const modelId = "intfloat/e5-base-v2"
    const hfToken = process.env.HUGGINGFACE_API_TOKEN
    const apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [inputText],
      }),
    })

    const data = await response.json()

    return data[0]
  }

  function handelChange(e) {
    console.log("input chnaging ", input)

    setInput(e.target.value)
  }

  async function findNearestMatch(embedding) {
    if (embedding) {
      let { data, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 1, // Fetch more matche
      })

      if (error) console.error(error)
      else return data
      if (error) {
        console.error("Error fetching nearest neighbors:", error)
      }
    }
  }
  let chatMessages = [
    {
      role: "system",
      content: `You are an enthusiastic podcast expert hwo loves
       recommending podcasts to people. You will be given two pieces
        of information - some context about podcasts episodes and a question.
         Your main job is to formulate a short answer to the question using the
          provided context. If you are unsure and cannot find the answer in the
          context, "Sorry, I don't know the answer."  Please do not make up the answer yourself.`,
    },
  ]

  async function getChatCompletion(text, query) {
    const contextString = JSON.stringify(text)
    // Initialize the system message

    // Add the context about jazz under the stars and the user's question
    chatMessages.push({
      role: "user",
      content: `Content:${contextString} Question:${query}`,
    })

    console.log("chat mesage ", chatMessages)
    //working model
    // model: "microsoft/Phi-3-mini-4k-instruct",
    // Initiate the API call for chat completion
    // Qwen/QwQ-32B-Preview
    const stream = client.chatCompletionStream({
      model: "microsoft/Phi-3-mini-4k-instruct", // Adjust model if necessary
      messages: chatMessages,
      temperature: 0.8,
      max_tokens: 2048,
      top_p: 0.7,
    })

    let out = ""
    let isResponseEmpty = true

    // Streaming the response
    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content
        out += newContent

        // If the model generates something meaningful, flag it
        if (newContent.trim()) {
          isResponseEmpty = false
        }
      }
    }

    // Handle case when no meaningful response is generated
    if (isResponseEmpty) {
      console.log("The model couldn't generate a meaningful response.")
      return "Sorry, I don't know the answer." // Or handle as needed
    } else {
      console.log("Generated Response:", out) // Debugging the output
      return out // Return the generated response
    }
  }

  async function main(query) {
    const embedding = await createEmbedding(query) // Step 1: Generate query embedding
    const bestMatch = await findNearestMatch(embedding) // Step 2: Find the best matching document

    console.log("bestMatch", bestMatch)

    if (bestMatch) {
      try {
        const response = await getChatCompletion(bestMatch, query)
        console.log("Generated Response:", response)
      } catch (error) {
        console.log("loding model")

        console.error("Failed to generate response:", error.message)
      }
    } else {
      console.log("gettteing rsponse ")
    }
    setInput("")
  }

  async function handelSubmit() {
    await main(input)
  }
  // useEffect(() => {
  //   async function getchunkdata() {
  //     for await (const chunk of stream) {
  //       console.log("chunk", chunk)

  //       // if (chunk.choices && chunk.choices.length > 0) {
  //       //   const newContent = chunk.choices[0].delta.content
  //       //   out += newContent
  //       //   console.log("newContent", newContent)
  //       // }
  //     }
  //   }
  //   getchunkdata()
  // })
  // useEffect(() => {
  //   async function getEmbeddingsAndStoreInSupabase(texts) {
  //     const modelId = "intfloat/e5-base-v2" // Model for embedding
  //     const hfToken = "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" // Hugging Face API token
  //     const apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`

  //     try {
  //       const embeddingWithPair = await Promise.all(
  //         texts.map(async (text) => {
  //           const response = await fetch(apiUrl, {
  //             method: "POST",
  //             headers: {
  //               Authorization: `Bearer ${hfToken}`,
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ inputs: [text] }),
  //           })

  //           if (!response.ok) {
  //             throw new Error("Failed to fetch embeddings")
  //           }

  //           const data = await response.json()
  //           return { content: text, embedding: data[0] } // Return content and embedding
  //         })
  //       )

  //       // Store the embeddings in Supabase
  //       const { data, error } = await supabase
  //         .from("documents")
  //         .insert(embeddingWithPair)

  //       console.log("embeddingWithPair", embeddingWithPair)

  //       if (error) {
  //         console.error("Error storing embeddings in Supabase:", error)
  //       } else {
  //         console.log("Embeddings successfully stored in Supabase:", data)
  //       }

  //       return embeddingWithPair // Return embeddings with content for further use if needed
  //     } catch (error) {
  //       console.error("Error fetching embeddings:", error)
  //       return []
  //     }
  //   }

  //   // Example usage
  //   const content = [
  //     "Beyond Mars (1 hr 15 min): Join space enthusiasts as they speculate about extraterrestrial life and the mysteries of distant planets.",
  //     "Jazz under stars (55 min): Experience a captivating night in New Orleans, where jazz melodies echo under the moonlit sky.",
  //     "Mysteries of the deep (1 hr 30 min): Dive with marine explorers into the uncharted caves of our oceans and uncover their hidden wonders.",
  //     "Rediscovering lost melodies (48 min): Journey through time to explore the resurgence of vinyl culture and its timeless appeal.",
  //     "Tales from the tech frontier (1 hr 5 min): Navigate the complex terrain of AI ethics, understanding its implications and challenges.",
  //     "The soundscape of silence (30 min): Traverse the globe with sonic explorers to find the world's most serene and silent spots.",
  //     "Decoding dreams (1 hr 22 min): Step into the realm of the subconscious, deciphering the intricate narratives woven by our dreams.",
  //     "Time capsules (50 min): Revel in the bizarre, endearing, and profound discoveries that unveil the quirks of a century past.",
  //     "Frozen in time (1 hr 40 min): Embark on an icy expedition, unearthing secrets hidden within the majestic ancient glaciers.",
  //     "Songs of the Sea (1 hr): Dive deep with marine biologists to understand the intricate whale songs echoing in our vast oceans.",
  //   ]

  //   getEmbeddingsAndStoreInSupabase(content)
  //     .then((data) => console.log("Embeddings:", data))
  //     .catch((error) => console.error("Error:", error))
  // }, [])

  return (
    <div className="flex flex-col">
      <label htmlFor="">Serch embiiding</label>
      <input
        className="border border-gray-400"
        type="text"
        value={input}
        onChange={handelChange}
      />
      <button className="border border-gray-400" onClick={handelSubmit}>
        get embiidngs
      </button>
      h
      <button
        className="border border-gray-400"
        onClick={() => findNearestMatch()}
      >
        Compare embiidngs and get result
      </button>
    </div>
  )
}
// "use client"

// import { HfInference } from "@huggingface/inference"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { useEffect, useState } from "react"

// const client = new HfInference("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")
// const supabase = createClientComponentClient()

// export default function FloatingMessages() {
//   const [input, setInput] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [messages, setMessages] = useState([])

//   const createEmbedding = async (inputText) => {
//     try {
//       const modelId = "intfloat/e5-base-v2"
//       const hfToken = "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"
//       const apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${hfToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           inputs: [inputText],
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data[0]
//     } catch (error) {
//       console.error("Embedding error:", error)
//       return null
//     }
//   }

//   async function findNearestMatch(embedding) {
//     if (!embedding) return null

//     try {
//       let { data, error } = await supabase.rpc("match_documents", {
//         query_embedding: embedding,
//         match_threshold: 0.5,
//         match_count: 1,
//       })

//       if (error) throw error
//       return data
//     } catch (error) {
//       console.error("Database error:", error)
//       return null
//     }
//   }

//   async function getChatCompletion(text, query) {
//     try {
//       const contextString = JSON.stringify(text)

//       // Keep system prompt simple
//       const chatMessages = [
//         {
//           role: "system",
//           content: `You are a helpful podcast expert. Answer questions about podcasts using the provided context. Context: ${contextString} with previous contect ${messages}`,
//         },
//         {
//           role: "user",
//           content: query,
//         },
//       ]

//       const response = await client.textGeneration({
//         model: "HuggingFaceH4/zephyr-7b-beta",
//         inputs: chatMessages.map((msg) => msg.content).join("\n"),
//         parameters: {
//           max_new_tokens: 200,
//           temperature: 0.7,
//         },
//       })

//       return response.generated_text || "Sorry, I couldn't generate a response."
//     } catch (error) {
//       console.error("Chat error:", error)
//       return "I encountered an error. Please try again."
//     }
//   }

//   async function handleSubmit() {
//     if (!input.trim()) return

//     setIsLoading(true)
//     setMessages((prev) => [...prev, { role: "user", content: input }])

//     try {
//       const embedding = await createEmbedding(input)
//       if (!embedding) {
//         throw new Error("Failed to create embedding")
//       }

//       const bestMatch = await findNearestMatch(embedding)
//       if (!bestMatch) {
//         throw new Error("No matching content found")
//       }

//       const response = await getChatCompletion(bestMatch, input)
//       setMessages((prev) => [...prev, { role: "assistant", content: response }])
//     } catch (error) {
//       console.error("Error:", error)
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content:
//             "I'm having trouble right now. Please try again in a moment.",
//         },
//       ])
//     }

//     setIsLoading(false)
//     setInput("")
//   }

//   return (
//     <div className="flex flex-col space-y-4 p-4">
//       <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded ${
//               message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
//             }`}
//           >
//             <p>{message.content}</p>
//           </div>
//         ))}
//       </div>

//       <div className="flex space-x-2">
//         <input
//           className="flex-1 border border-gray-300 rounded p-2"
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask about podcasts..."
//           disabled={isLoading}
//         />
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//           onClick={handleSubmit}
//           disabled={isLoading || !input.trim()}
//         >
//           {isLoading ? "..." : "Send"}
//         </button>
//       </div>
//     </div>
//   )
// }
