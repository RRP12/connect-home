"use client"

import { createContext, useContext, useState } from "react"

const ChatContext = createContext([])

export default function ChatProvider({ children }) {
  const [titles, setTitles] = useState([])
  let context = {
    setTitles,
    titles,
  }
  return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
}
export const useChatContext = () => useContext(ChatContext)

// const theme = useGetTheme();
