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
  const [mapView, setMapView] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [recommenedByAi, setrecommenedByAi] = useState([])
  let supabase = createClient()
  const inputRef = useRef(null)

  console.log("mapView", mapView)

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

  const toggleMapView = () => {
    setMapView(!mapView)
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
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
    setrecommenedByAi([])
    // setmapView(true)
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

    //added tyhe fixed ui
    setTitles(propertyTitles)
  }
  const messagesEndRef = useRef(null)

  const cleanedResponse = (r) => r.replace(/\*\*/g, "")
  return (
    <motion.div
      className="modal"
      layout
      initial={{ width: "100%", height: "100%" }}
      animate={{
        width: isFullScreen ? "100%" : "100%",
        height: isFullScreen ? "100%" : "100%",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.8,
      }}
    >
      <div className="relative border rounded-lg p-4 w-full h-full flex flex-col">
        <div className="flex-grow overflow-hidden">
          <div className="flex overflow-y-auto h-full">
            <div className={`${mapView ? "w-1/2" : "w-full"} h-full`}>
              <ul className="space-y-2">
                {convHistory.map((msg, index) => (
                  <li key={index}>
                    <div
                      className={`py-2 px-4 ${
                        index % 2 === 0 ? "text-right" : "text-left"
                      }`}
                    >
                      {index % 2 === 0 ? (
                        <p className="text-wrap text-gray-800">
                          {cleanedResponse(msg?.message)}
                        </p>
                      ) : (
                        <pre className="w-full rounded-md text-wrap font-sans bg-gray-100 p-4 text-gray-700">
                          {cleanedResponse(msg?.message)}
                        </pre>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {mapView && (
              <div className="w-1/2 h-full">
                <MapInterface recommenedByAi={recommenedByAi} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center border-t border-gray-300 pt-2 mt-2">
          <input
            ref={inputRef}
            className="flex-grow p-3 border rounded-md outline-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <div className="flex items-center gap-4 ml-4">
            {input && (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Send"}
              </button>
            )}
            <button
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              onClick={toggleMapView}
            >
              {mapView ? "Exit Map View" : "Map View"}
            </button>
          </div>
          {convHistory.length > 0 && (
            <button
              onClick={() => {
                setconvHistory([])
                setrecommendedProperties([])
              }}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Clear
            </button>
          )}
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
