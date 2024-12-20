// "use client"

// import React, { useState, useEffect, Suspense } from "react"

// import { useChatContext } from "../../components/mainContext"
// // A dummy async function simulating API call to fetch the chatbot response

// //server actin changes

// import { ChatMistralAI } from "@langchain/mistralai"
// import { HumanMessage, SystemMessage } from "@langchain/core/messages"
// import { PromptTemplate } from "@langchain/core/prompts"

// import {
//   RunnablePassthrough,
//   RunnableSequence,
// } from "@langchain/core/runnables"
// import { MistralAIEmbeddings } from "@langchain/mistralai"
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
// import { ChatPromptTemplate } from "@langchain/core/prompts"
// import { Document } from "@langchain/core/documents"
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

// import { createClient } from "../../utils/supabase/client"
// import { StringOutputParser } from "@langchain/core/output_parsers"

// const llm = new ChatMistralAI({
//   model: "mistral-large-latest",
//   temperature: 0,
//   maxRetries: 2,
//   apiKey: "1PsW8N6PpMIXcavicB0PjwOm8JIkk51v",
//   // other params...
// })

// function formatConvHistory(messages) {
//   return messages
//     .map((message, i) => {
//       if (i % 2 === 0) {
//         return `Human: ${message}`
//       } else {
//         return `AI: ${message}`
//       }
//     })
//     .join("\n")
// }

// function Chatbot() {
//   const [responseMessage, setResponseMessage] = useState(null)
//   const [input, setinput] = useState("")
//   const { convHistory, setconvHistory } = useChatContext()

//   console.log("convHistory", convHistory)

//   async function getResponse(input) {
//     console.log("input", input)

//     try {
//       let client = createClient()
//       // const res = await fetch(`http://localhost:3000/api/readTextFile`)
//       // const text = await res.text()

//       // const splitter = new RecursiveCharacterTextSplitter({
//       //   chunkSize: 500,
//       //   separators: ["\n\n", "\n", " ", ""],
//       //   chunkOverlap: 50,
//       // })

//       //retriver

//       const embeddings = new MistralAIEmbeddings({
//         model: "mistral-embed", // Default value
//         apiKey: "1PsW8N6PpMIXcavicB0PjwOm8JIkk51v",
//       })
//       const vectorStore = new SupabaseVectorStore(embeddings, {
//         client,
//         tableName: "documents",
//         queryName: "match_documents",
//       })

//       const retriever = vectorStore.asRetriever()

//       // A string holding the phrasing of the prompt
//       const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question.
//       conversation history: {conv_history}
//       question: {question}
//       standalone question:`

//       // A prompt created using PromptTemplate and the fromTemplate method
//       const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
//         standaloneQuestionTemplate
//       )
//       const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
//       context: {context}
//       conversation history: {conv_history}
//       question: {question}
//       answer: `

//       let answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
//       // Take the standaloneQuestionPrompt and PIPE the model
//       const standaloneQuestionChain = standaloneQuestionPrompt
//         .pipe(llm)
//         .pipe(new StringOutputParser())
//       function combineDocuments(docs) {
//         return docs.map((doc) => doc.pageContent).join("\n\n")
//       }
//       const retrieverChain = RunnableSequence.from([
//         (prevResult) => prevResult.standalone_question,
//         retriever,
//         combineDocuments,
//       ])

//       const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())
//       const chain = RunnableSequence.from([
//         {
//           standalone_question: standaloneQuestionChain,
//           original_input: new RunnablePassthrough(),
//         },
//         {
//           context: retrieverChain,
//           question: ({ original_input }) => {
//             return original_input.question
//           },
//           conv_history: ({ original_input }) => original_input.conv_history,
//         },
//         answerChain,
//       ])

//       const response = await chain.invoke({
//         question: input,
//         conv_history: formatConvHistory(convHistory),
//       })

//       return response
//     } catch (e) {
//       console.log("error ", e)
//     }
//   }
//   console.log("convHistory", convHistory)

//   async function handelsubmit() {
//     const fetchData = async () => {
//       const response = await getResponse(input)
//       setResponseMessage(response)

//       console.log("response", response)

//       if (responseMessage) {
//         setconvHistory((prev) => [...prev, input, responseMessage])
//       }
//     }

//     fetchData()
//   }
//   function formatConvHistory(messages) {
//     return messages
//       .map((message, i) => {
//         if (i % 2 === 0) {
//           return `Human: ${message}`
//         } else {
//           return `AI: ${message}`
//         }
//       })
//       .join("\n")
//   }

//   return (
//     <div>
//       <Suspense fallback={<h1>Loading...</h1>}>
//         <h1>{responseMessage || "...loading"}</h1>
//       </Suspense>

//       <input
//         style={{ outline: "blue", border: "1px solid red" }}
//         onChange={(e) => setinput(e.target.value)}
//         type="text"
//       />
//       <button
//         onClick={() => {
//           handelsubmit()
//         }}
//       >
//         Get Data
//       </button>
//     </div>
//   )
// }

// export default Chatbot

"use client"
import styled from "styled-components"
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { PromptTemplate } from "@langchain/core/prompts"
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { MistralAIEmbeddings } from "@langchain/mistralai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { Document } from "@langchain/core/documents"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"

import { createClient } from "../../utils/supabase/client"
import { StringOutputParser } from "@langchain/core/output_parsers"

import React, {
  useState,
  Suspense,
  useEffect,
  use,
  useRef,
  useLayoutEffect,
} from "react"
import { useChatContext } from "../../components/mainContext"
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect"

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  maxRetries: 2,
  apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_TOKEN,
})

function formatConvHistory(messages) {
  let formattedmessages = messages
    .map((message, i) => (i % 2 === 0 ? `Human: ${message}` : `AI: ${message}`))
    .join("\n")

  return formattedmessages
}

function formatPropertyList(properties) {
  if (!properties || properties.length === 0) {
    return "No properties found matching your criteria."
  }

  let formattedList = ""
  properties.forEach((property) => {
    formattedList += `
<div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
  <strong style="font-size: 1.2em;">${
    property.title || "No Title Available"
  }</strong><br>
  ${property.description || "No Description Available"}<br>
  Location: ${property.location || "Not explicitly available"}
</div>
`
  })
  return formattedList
}

function Chatbot() {
  const [titles, setTitles] = useState([])
  const [location, setLocation] = useState({ latitude: null, longitude: null })
  const [error, setError] = useState(null)

  let supabase = createClient()

  function extractPropertyTitles(data) {
    console.log("data", data)

    const propertyTitles = []
    const regex = /Property Title: (.+)/g

    data?.forEach((item) => {
      const matches = item.pageContent.matchAll(regex)
      for (const match of matches) {
        const title = match[1].trim()

        console.log("title", title)

        if (title.toLowerCase() !== "null") {
          propertyTitles?.push(title)
        }
      }
    })

    setTitles(propertyTitles)
    console.log("propertyTitles", propertyTitles)
    console.log("titles", titles)
  }

  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setError(null)
        },
        (err) => {
          setError(err.message)
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }
  useEffect(() => {
    getCoordinates()
    //upload data to supbase
    let supabase = createClient()

    async function uploaddata() {
      let { data: properties, error } = await supabase
        .from("properties")
        .select("location")

      console.log("properties", properties)

      try {
        let client = createClient()
        // const res = await fetch(`http://localhost:3000/api/readTextFile`)
        // const text = await res.text()

        const res = await fetch(`http://localhost:3000/api/chat`)
        const text = await res.text()

        console.log("text", text)

        // Check if the response is successful and contains JSON

        // Step 2: Chunk the data

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
          separators: ["\n\n", "\n", " ", ""],
          chunkOverlap: 50,
        })
        const output = await splitter.createDocuments([text])

        console.log("output", output)

        // await SupabaseVectorStore.fromDocuments(
        //   output,
        //   new MistralAIEmbeddings({
        //     model: "mistral-embed",
        //     apiKey: "1PsW8N6PpMIXcavicB0PjwOm8JIkk51v",
        //   }),
        //   {
        //     client,
        //     tableName: "documents",
        //   }
        // )
        console.log("success")
      } catch (err) {
        console.log("err", err)
      }
      if (error) {
        console.log("error storing embiddings", error)
      }
    }
    uploaddata()
  }, [])
  const [responseMessage, setResponseMessage] = useState(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [convHistory, setconvHistory] = useState([])

  async function getResponse(input) {
    console.log("input", input)

    try {
      const client = createClient()

      const embeddings = new MistralAIEmbeddings({
        model: "mistral-embed",
        apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_TOKEN,
      })

      const vectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: "documents",
        queryName: "match_documents",
      })

      const retriever = vectorStore.asRetriever()

      const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
        `Given some conversation history (if any) and a question, convert the question to a standalone question .
        conversation history: {conv_history}
        question: {question}
        standalone question:`
      )

      const answerPrompt = PromptTemplate.fromTemplate(
        `You are a helpful and enthusiastic Property agent support bot who can answer a given question about properties based on the context provided and Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history ,
        If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer and always if the user want you to show properties in show the deatils in ters of the  list and  Always speak as if you were chatting to a friend .
        context: {context}
        conversation history: {conv_history}
        question: {question}
        answer: `
      )

      const standaloneQuestionChain = standaloneQuestionPrompt
        .pipe(llm)
        .pipe(new StringOutputParser())

      const retrieverChain = RunnableSequence.from([
        (prevResult) => {
          console.log("prevResult", prevResult)

          return prevResult.standalone_question
        },
        retriever,
        (docs) => {
          extractPropertyTitles(docs)

          return docs.map((doc) => doc.pageContent).join("\n\n")
        },
      ])

      const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())

      const chain = RunnableSequence.from([
        {
          standalone_question: standaloneQuestionChain,
          original_input: new RunnablePassthrough(),
        },

        {
          context: retrieverChain,
          question: ({ original_input }) => original_input.question,
          conv_history: ({ original_input }) => original_input.conv_history,
        },

        answerChain,
      ])

      return await chain.invoke({
        question: input,
        conv_history: formatConvHistory(convHistory),
      })
    } catch (e) {
      console.error("Error:", e)
      throw new Error("Failed to fetch response")
    }
  }

  const handleSubmit = async () => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const response = await getResponse(input) // Get the response
      console.log("Response: ", response) // Check the response here
      setResponseMessage(response) // Set the response to state
      setconvHistory((prev) => [
        ...prev,
        { message: input, sender: "user" },
        { message: response, sender: "bot" },
      ])
    } catch (error) {
      console.error("Error:", error)
      setResponseMessage("An error occurred while fetching the response.")
    } finally {
      setLoading(false)
      setInput("") // Clear the input field
    }
  }

  const messagesEndRef = useRef(null)
  return (
    <div className="border border-1 rounded flex flex-col justify-end h-[100%]  overflow-hidden ">
      <div className=" mb-12 overflow-y-scroll">
        <div className="p-7  overflow-y-scroll">
          <ul>
            {convHistory.map((msg, index) => (
              <li key={index}>
                <div
                  className={`py-1 ${
                    index % 2 === 0 ? "  text-right" : "bg-zinc-200 "
                  }`}
                  sender={msg.sender}
                >
                  <p
                    className={`py-2 px-4 ${
                      index % 2 === 0 ? "" : "text-left"
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full border border-1  flex gap-5 rounded justify-between ">
        <input
          className=" w-[70%]  p-3 outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="  h-full bg-blue-500  text-white py-3 px-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  )
}

export default Chatbot
