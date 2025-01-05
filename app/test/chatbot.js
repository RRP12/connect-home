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
import MapInterface from "../../components/maps/mapsSuggestions"

import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"

import { motion } from "motion/react"
import { MistralAIEmbeddings } from "@langchain/mistralai"

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"

import { createClient } from "../../utils/supabase/client"
import {
  JsonOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowBigLeftIcon } from "lucide-react"

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
  const [recommendedProperties, setrecommendedProperties] = useState([])
  const [responseMessage, setResponseMessage] = useState(null)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [convHistory, setconvHistory] = useState([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [mapView, setmapView] = useState(false)
  const [recommenedByAi, setrecommenedByAi] = useState([])
  let supabase = createClient()
  const inputRef = useRef(null)

  console.log("mainrecommenedByAi", recommenedByAi)

  useEffect(() => {
    let data = recommendedProperties
      ?.filter((p) => p?.name !== "Not Available")
      .map(async (p) => {
        const { data: properties, error } = await supabase
          .from("properties")
          .select("*")
          .eq("property_title", p.name)
        if (error) {
          console.log("error", error)
        } else {
          setrecommenedByAi((prev) => [...prev, ...properties])
        }
      })

    console.log("found", data)
  }, [recommendedProperties, supabase])

  useEffect(() => {
    // getCoordinates()
    //upload data to supbase

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

        console.log("success")
      } catch (err) {
        console.log("err", err)
      }
      if (error) {
        console.log("error storing embiddings", error)
      }
    }
    uploaddata()
  }, [supabase])
  useEffect(() => {
    const extractPropertyNames = async () => {
      try {
        const prompt = PromptTemplate.fromTemplate(
          "Respond with a valid JSON object with no special character only json containing  arry of objects two fields: 'name'  ,'location'  and 'address'  {message}"
        )
        const parser = new JsonOutputParser()
        const chainA = prompt.pipe(llm).pipe(parser)

        console.log("responseMessage before ", responseMessage)

        // The result is an object with a `text` property.

        const chain = await chainA.invoke({ message: responseMessage })
        setrecommendedProperties(chain)
      } catch (e) {
        console.log("error", e)
      }
    }
    extractPropertyNames()
  }, [responseMessage])

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
    setmapView((prev) => !prev)
  }
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

        please remove the special characters like "**" and others  and format the stucture of the format properly ,
        If you really don't know the answer, say "I'm sorry, I don't know the answer to that.
        Don't try to make up an answer and always if the user want you to show properties in show the deatils in the
          form of  list of properties 
        
        and  Always speak as if you were
         chatting to a friend and try to make it sound like a human .
        context: {context}
        conversation history: {conv_history}
        question: {question}
        answer: `
      )
      // list but don't show the location but keep it in the response
      //  or contact info

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
          console.log("docs", docs)

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
    setIsFullScreen(true)
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
  }
  const messagesEndRef = useRef(null)

  const cleanedResponse = (r) => r.replace(/\*\*/g, "")
  return (
    <motion.div
      className="modal"
      layout
      initial={{ width: "50%", height: "100%" }}
      animate={{
        width: isFullScreen ? "100%" : "50%",
        height: isFullScreen ? "100%" : "100%",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.8,
      }}
    >
      <div className=" relative border rounded px-4 py-4 w-[100%]  justify-between h-[86%]  flex-col   hidden    lg:flex">
        {isFullScreen && (
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        )}

        <div
          className={`${convHistory.length !== 0 ? "hidden" : "block"} ${
            mapView ? "hidden" : "block"
          } `}
        >
          <div className="flex flex-col">
            <p>Results for</p>
            <div className="flex gap-2 items-center align-center justify-start">
              <div className="rounded-xl bg-blue-500 w-2 h-2"></div>
              <p className="text-gray-400 font-semibold">
                <span className="rounded-xl bg-blue-500 w-5 h-5"></span>
                Kadam Wadi, Marol, Andheri East, Mumbai
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h1 className=" my-4 font-extralight text-gray-600">
              AI Suggestions
            </h1>

            <div className="divide-y divide-dashed w-26 space-y-1">
              <div>
                <p className="text-gray-400">Pg in Andheri</p>
              </div>
              <p className="text-gray-400">Pg in marol</p>
              <p className="text-gray-400">Pg in bandra</p>
            </div>
          </div>
        </div>

        <div className=" rounded flex flex-col justify-end h-[100%]  overflow-hidden ">
          <div className="flex border overflow-scroll">
            <div
              className={`mb-12 ${
                mapView ? "w-[50%]" : "w-[100%]"
              }   h-full flex`}
            >
              <ul className="w-full">
                {convHistory.map((msg, index) => (
                  <li key={index}>
                    <div className={`py-2 w-auto px-5 `} sender={msg}>
                      <>
                        {index % 2 === 0 ? (
                          <div>
                            <p className="  text-wrap text-right ">
                              {cleanedResponse(msg?.message)}
                            </p>
                          </div>
                        ) : (
                          <>
                            <pre className=" w-full rounded-md text-wrap text-left font-sans capitalize from-neutral-900 bg-gray-100 p-4">
                              {cleanedResponse(msg?.message)}
                            </pre>
                          </>
                        )}
                      </>
                    </div>
                  </li>
                ))}
              </ul>

              <div ref={messagesEndRef} />
            </div>
            <div className={` ${mapView ? "block" : "hidden"} w-full`}>
              <MapInterface recommenedByAi={recommenedByAi} />
            </div>
          </div>

          <RecommendedProperties
            recommendedProperties={recommendedProperties}
          />
          <div className=" border border-1 justify-between  flex rounded mx-3 my-1 py-2 px-2 ">
            <input
              ref={inputRef}
              className=" w-[70%]  p-3 outline-none mx-3"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <div className="flex gap-4">
              {inputRef.current?.value && (
                <button
                  className={` h-full bg-grey-300 rounded-2xl bg-slate-400 text-white py-2 px-5`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Send"}
                </button>
              )}

              <button
                className={`${"bg-gray-600"} h-full rounded-2xl text-white py-2 px-5`}
                onClick={toggleFullScreen}
              >
                {!mapView ? "Mapview" : "Exit"}
              </button>
            </div>
            {convHistory.length > 0 && (
              <button
                onClick={() => {
                  setconvHistory([])

                  setrecommendedProperties([])
                }}
                className="absolute  left -0 top-5 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* <MapInterface /> */}
        </div>
      </div>
    </motion.div>
  )
}

export default Chatbot

const RecommendedProperties = ({ recommendedProperties }) => {
  return (
    <div>
      {recommendedProperties ? (
        <ul>
          {recommendedProperties?.map((property, index) => (
            <motion.li
              key={index}
              initial={{ x: -100, opacity: 0 }} // Slide in from the left with opacity 0
              animate={{ x: 0, opacity: 1 }} // Slide to the original position with full opacity
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.2, // Staggered delay for each property
              }}
            >
              <strong>{property.name}</strong>: {property.address}
              {property.area}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  )
}
