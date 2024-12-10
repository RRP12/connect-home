"use client"

import { HfInference } from "@huggingface/inference"

import { createClient } from "../../../utils/supabase/client"
import { useState } from "react"
import { formatedData } from "../../../utils/aidata"
const client = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN)

console.log("formatedData", formatedData)

let supabase = createClient()

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN)
export default function FloatingMessages() {
  let [isOpen, setIsOpen] = useState(false)
  let [input, setInput] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  let [queryembiddings, setQueryEmbiddings] = useState(null)
  let [resposne, setResponse] = useState("")
  let [loadingResponse, setLoadingResponse] = useState(false)
  console.log("loading", loading)
  console.log("error", error)

  const toggleOpen = () => setIsOpen(!isOpen)
  const modelId = "intfloat/e5-base-v2" // Change to any other model if necessary
  const hfToken = process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN // Replace with your Hugging Face API token

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
    const hfToken = process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN // Replace with your Hugging Face API token
    const apiUrl = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`

    try {
      setLoading(true)
      setError(null) // Clear any previous error
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

      if (!response.ok) throw new Error("Failed to fetch data")

      const data = await response.json()

      console.log("data", data)

      return data[0]
    } catch (err) {
      console.log("err", err)

      setError(err?.message) // Handle errors
    } finally {
      setLoading(false) // Stop loading
    }
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
    const embedding = await createEmbedding(query) // Step 1: Generate query embedding
    const bestMatch = await findNearestMatch(embedding) // Step 2: Find the best matching document

    console.log("bestMatch", bestMatch)

    if (bestMatch) {
      try {
        const response = await getChatCompletion(bestMatch, query)
        if (response) {
          setLoadingResponse(false)
          setResponse(response)
        }
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
    setLoadingResponse(true)
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

  return isOpen ? (
    <div className=" fixed bottom-4 right-4 bg-white text-gray-900 rounded-lg shadow-xl flex flex-col p-4 space-y-4 h-[80%] w-[90%]  md:w-[30%] lg:w-[25%] xl:w-[20%] sm:w-10 ">
      <button className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
        <div
          onClick={() => {
            setIsOpen(false)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 4.293a1 1 0 011.414 0L10 6.586l2.293-2.293a1 1 0 111.414 1.414L11.414 8l2.293 2.293a1 1 0 01-1.414 1.414L10 9.414l-2.293 2.293a1 1 0 11-1.414-1.414L8.586 8 6.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <p>close</p>
        </div>
      </button>

      {!loadingResponse ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Search with AI
          </h2>
          {loading ? "...loading" : "Ai is ready to answer your questions"}
          <p className="text-gray-600 py-5 pz-5 ">{resposne}</p>
        </div>
      ) : (
        "...geting response please wait"
      )}

      <div className="flex flex-col  align-bottom flex-1  gap-4 justify-end ">
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={handelChange}
            placeholder="Ask me anything..."
            className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M13.295 11.705a7 7 0 1 1 1.414-1.414 8.95 8.95 0 0 1 1.334 2.126l4.557 4.557-1.5 1.5-4.557-4.557a8.95 8.95 0 0 1-2.126 1.334zM15 7a6 6 0 1 0-12 0 6 6 0 0 0 12 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <button
          className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none transition duration-300"
          onClick={handelSubmit}
        >
          Send
        </button>
      </div>
    </div>
  ) : (
    <div
      onClick={() => {
        setIsOpen(true)
      }}
      className="fixed bottom-4 right-4 sm:w-40 bg-white text-gray-900 rounded-lg shadow-2xl flex gap-2 justify-center align-middle items-center p-4 w-20"
    >
      <h1 className=" chatbot-container-text">open chat</h1>
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 5V20.7929C3 21.2383 3.53857 21.4614 3.85355 21.1464L7.70711 17.2929C7.89464 17.1054 8.149 17 8.41421 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 12C14.2005 12.6224 13.1502 13 12 13C10.8498 13 9.79952 12.6224 9 12"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 8.01953V8"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 8.01953V8"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
