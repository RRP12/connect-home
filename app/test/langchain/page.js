"use client"

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts"
import { ChatMistralAI, MistralAIEmbeddings } from "@langchain/mistralai"
import { createClient } from "../../../utils/supabase/client"
import { z } from "zod"
import { HumanMessage, AIMessage } from "@langchain/core/messages"
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { MessagesPlaceholder } from "@langchain/core/prompts"

import { RunnableWithMessageHistory } from "@langchain/core/runnables"
import { ChatMessageHistory } from "langchain/stores/message/in_memory"
import { Suspense, useState, useRef, useEffect } from "react"

import { SendHorizontal } from "lucide-react"

export default function Page() {
  const [input, setinput] = useState("")

  const [ans, setans] = useState("")

  const [converstaionhostory, setconverstaionhostory] = useState([])

  console.log("converstaionhostory", converstaionhostory)

  async function getresponse(input) {
    const joke = z.object({
      property: z.string().describe("name of the property"),
    })
    const llm = new ChatMistralAI({
      model: "mistral-large-latest",
      temperature: 0.2,
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_TOKEN,
    })

    const embeddings = new MistralAIEmbeddings({
      model: "mistral-embed",
      apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_TOKEN,
    })

    const client = await createClient()
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    })

    const retriever = vectorStore.asRetriever({ k: 3 })

    const convertDocsToString = (documents) => {
      return documents
        .map((document) => {
          return `<doc>\n${document.pageContent}\n</doc>`
        })
        .join("\n")
    }

    const documentRetrievalChain = RunnableSequence.from([
      (input) => input.question,
      retriever,
      (prev) => {
        console.log("prev", prev)

        return prev
      },
      convertDocsToString,
    ])

    const TEMPLATE_STRING = `You are an experienced researcher,
    expert at interpreting and answering questions based on provided sources.
    Using the provided context, answer the user's question
    to the best of your ability using only the resources provided and history .
    Be verbose!

    <context>

    {context}

    </context>

    Now, answer this question using the above context:

    {question}`

    const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(
      TEMPLATE_STRING,
      new MessagesPlaceholder("history")
    )

    const retrievalChain = RunnableSequence.from([
      {
        context: documentRetrievalChain,
        question: (input) => input.question,
      },
      answerGenerationPrompt,
      llm,
      new StringOutputParser(),
    ])

    // Adding history

    const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `Given the following conversation and a follow up question,
  rephrase the follow up question to be a standalone question.`

    const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
      ["system", REPHRASE_QUESTION_SYSTEM_TEMPLATE],
      new MessagesPlaceholder("history"),
      [
        "human",
        "Rephrase the following question as a standalone question:\n{question}",
      ],
    ])

    const rephraseQuestionChain = RunnableSequence.from([
      rephraseQuestionChainPrompt,
      llm,
      new StringOutputParser(),
    ])

    const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher,
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history,

using only the resources provided. Be verbose! and always answer like you are taking to your friend
<context>
{context}

</context>`

    const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
      ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
      new MessagesPlaceholder("history"),
      [
        "human",
        "Now, answer this question using the previous context and chat history:\n{standalone_question}",
      ],
    ])

    await answerGenerationChainPrompt.formatMessages({
      context: "fake retrieved content",
      standalone_question: "Why is the sky blue?",
      history: [
        new HumanMessage("How are you?"),
        new AIMessage("Fine, thank you!"),
      ],
    })

    const conversationalRetrievalChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        standalone_question: rephraseQuestionChain,
      }),
      RunnablePassthrough.assign({
        context: documentRetrievalChain,
      }),
      answerGenerationChainPrompt,
      llm,
      new StringOutputParser(),
    ])

    const messageHistory = new ChatMessageHistory()

    const finalRetrievalChain = new RunnableWithMessageHistory({
      runnable: conversationalRetrievalChain,
      getMessageHistory: (_sessionId) => messageHistory,
      historyMessagesKey: "history",

      inputMessagesKey: "question",
    })

    console.log("messageHistory", messageHistory)

    console.log("finalRetrievalChain", finalRetrievalChain.runnable.lc_kwargs)

    // const originalQuestion = "show propertie s near andheri "

    // Your logic for invoking the finalRetrievalChain
    let quest1 = await finalRetrievalChain.invoke(
      {
        question: "i live in france ",
      },
      {
        configurable: { sessionId: "test" },
      }
    )

    let quest2 = await finalRetrievalChain.invoke(
      {
        question: "where do i live",
      },
      {
        configurable: { sessionId: "test" },
      }
    )
    setans(quest1)

    console.log("quest2", quest2)

    setconverstaionhostory((prev) => [...prev, { hunam: input, ai: quest1 }])
    console.log("quest1", quest1)
    // const { data, error } = await client.from("properties").select(`
    //   id,
    //   name,
    //   ST_X(location) AS longitude,
    //   ST_Y(location) AS latitude
    // `)
  }

  // console.log("quest2", quest2)

  return (
    <div className="border w-scren overflow-auto">
      <div className="overflow-scroll">
        {converstaionhostory &&
          converstaionhostory?.map((h) => {
            return (
              <>
                <p>{h.hunam}</p>

                <pre>{h.ai}</pre>
              </>
            )
          })}
      </div>

      <div className="border-gray-500">
        <input
          className="outline-none border-black"
          onChange={(e) => setinput(e.target.value)}
          type="text"
          value={input}
          placeholder="enter your propmt"
        />
      </div>

      <button
        onClick={() => {
          getresponse(input)
          setinput("")
        }}
      >
        submit{" "}
      </button>
    </div>
  )
}
