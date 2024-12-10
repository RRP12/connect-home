"use client"

import { HfInference } from "@huggingface/inference"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { formatedData } from "../../../utils/aidata"
const client = new HfInference("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")

console.log("formatedData", formatedData)

let supabase = createClientComponentClient()

const hf = new HfInference("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")
export default function FloatingMessages() {
  const [isOpen, setIsOpen] = useState(false)
  let [input, setInput] = useState("")
  let [bestmatch, setBestMatch] = useState([])
  let [queryembiddings, setQueryEmbiddings] = useState(null)

  console.log("queryembiddings", queryembiddings)

  const toggleOpen = () => setIsOpen(!isOpen)
  const modelId = "intfloat/e5-base-v2" // Change to any other model if necessary
  const hfToken = "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" // Replace with your Hugging Face API token

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
    const hfToken = "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" // Replace with your Hugging Face API token
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
    // console.log("data emididngs", data)
    // console.log("data emididngs", data.length)

    return data[0]
  }

  function handelChange(e) {
    console.log("input chnaging ", input)

    setInput(e.target.value)
  }

  async function findNearestMatch(embedding) {
    if (embedding) {
      let { data, error } = await supabase.rpc("match_properties", {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 2, // Fetch more matche
      })

      if (error) console.error(error)
      else return data
      if (error) {
        console.error("Error fetching nearest match_properties:", error)
      }
    }
  }
  let chatMessages = [
    {
      role: "system",
      content: `You are an enthusiastic property search  expert hwo loves
       recommending properties to people. You will be given two pieces
        of information - some context about properties  and a question.
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
      temperature: 0.5,
      max_tokens: 100,
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
    try {
      const embedding = await createEmbedding(query)
      const bestMatch = await findNearestMatch(embedding) // Step 2: Find the best matching document

      // console.log("bestMatch", bestMatch)

      if (bestMatch) {
        try {
          const response = await getChatCompletion(bestMatch, query)
          // console.log("Generated Response:", response)
        } catch (error) {
          // console.log("loding model")
          // console.error("Failed to generate response:", error.message)
        }
      } else {
        // console.log("gettteing rsponse ")
      }
      setInput("")
    } catch (e) {
      console.error("error", e)
    }

    // Step 1: Generate query embedding
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
  //         .from("properties_ai")
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
  //   const content = formatedData

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
