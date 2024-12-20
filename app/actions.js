"use server"

import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { PromptTemplate } from "@langchain/core/prompts"
import { useChatContext } from "../components/mainContext"
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { MistralAIEmbeddings } from "@langchain/mistralai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { Document } from "@langchain/core/documents"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"

import { createClient } from "../utils/supabase/server"
import { StringOutputParser } from "@langchain/core/output_parsers"

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  maxRetries: 2,
  apiKey: "xnOlm4dSejslRCunWIrAg0q0OOAWNgIX",
  // other params...
})

async function getResponse(input) {
  "use server"
  try {
    let client = await createClient()
    // const res = await fetch(`http://localhost:3000/api/readTextFile`)
    // const text = await res.text()

    // const splitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 500,
    //   separators: ["\n\n", "\n", " ", ""],
    //   chunkOverlap: 50,
    // })

    //retriver

    const embeddings = new MistralAIEmbeddings({
      model: "mistral-embed", // Default value
      apiKey: "xnOlm4dSejslRCunWIrAg0q0OOAWNgIX",
    })
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    })

    const retriever = vectorStore.asRetriever()

    // A string holding the phrasing of the prompt
    const standaloneQuestionTemplate =
      "Given a question, convert it to a standalone question. question: {question} standalone question:"

    // A prompt created using PromptTemplate and the fromTemplate method
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
      standaloneQuestionTemplate
    )

    const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
  context: {context}
  question: {question}
  answer: `

    let answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
    // Take the standaloneQuestionPrompt and PIPE the model
    const standaloneQuestionChain = standaloneQuestionPrompt
      .pipe(llm)
      .pipe(new StringOutputParser())
    function combineDocuments(docs) {
      return docs.map((doc) => doc.pageContent).join("\n\n")
    }
    const retrieverChain = RunnableSequence.from([
      (prevResult) => prevResult.standalone_question,
      retriever,
      combineDocuments,
    ])

    const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())
    const chain = RunnableSequence.from([
      {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({ original_input }) => {
          return original_input.question
        },
      },
      answerChain,
    ])

    const response = await chain.invoke({
      question: input,
    })
    setconvHistory(response)
    setconvHistory(input)
    return response
  } catch (e) {
    console.log("error ", e)
  }
}

// const composedChainWithLambda = RunnableSequence.from([])

//runnable sequence demo

// const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}")

// let chain = prompt.pipe(llm).pipe(new StringOutputParser())

// const analysisPrompt = ChatPromptTemplate.fromTemplate(
//   "is this a funny joke? {joke}"
// )

// let analizechain = analysisPrompt.pipe(llm)

// const composedChainWithLambda = RunnableSequence.from([
//   chain,

//   (input) => ({ joke: input }),
//   analizechain,
//   new StringOutputParser(),
// ])

// let joke = await composedChainWithLambda.invoke({ topic: "beets" })
// console.log("joke:", joke)

// console.log("anlizedjonke", anlizedjonke)

// try {
//   let data = await SupabaseVectorStore.fromDocuments(
//     output,
//     new MistralAIEmbeddings({
//       apiKey: "1PsW8N6PpMIXcavicB0PjwOm8JIkk51v",
//     }),
//     {
//       client,
//       tableName: "documents",
//     }
//   )

//   console.log("data", data)
// } catch (error) {
//   console.log("error", error)
// }

// Generating Text Embeddings
// const embeddings = new MistralAIEmbeddings({
//   model: "mistral-embed", // Default value
//   apiKey: "1PsW8N6PpMIXcavicB0PjwOm8JIkk51v",
// })

// async function getdata(params) {
//   for (const chunk of chunks) {
//     let data = await embeddings.embedQuery(chunk)
//     console.log("data", data)
//   }
// }
// await getdata()

// const splittedDocs = await splitter.splitDocuments(text1)

export { getResponse }
