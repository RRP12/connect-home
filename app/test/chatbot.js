"use client"
import { syncProperties } from "../actions"
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiRefreshCw,
  FiHome,
  FiUser,
  FiInfo,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";

import React, {
  useState,
  useEffect,
  useRef,
} from "react"

function Chatbot() {
  const {
    messages,
    input: hookInput,
    handleInputChange,
    handleSubmit,
    status,
    error,
    reload,
    stop,
    append,
    sendMessage // Potential fallback based on user feedback
  } = useChat({
    api: '/api/chat',
    onFinish: () => {
      console.log("Finished streaming message");
    },
    onError: (err) => {
      console.error("Chat Error:", err);
    }
  });

  const [localInput, setLocalInput] = useState("")
  const [syncing, setSyncing] = useState(false)
  const messagesEndRef = useRef(null)

  // Robust submit handler that tries all known methods
  const handleManualSubmit = (e) => {
    e?.preventDefault(); // e is optional (for suggestion clicks)
    const textToSend = typeof e === 'string' ? e : localInput;
    if (!textToSend?.trim()) return;

    console.log("Attempting to send:", textToSend);
    console.log("Available methods:", {
      hasAppend: typeof append === 'function',
      hasSendMessage: typeof sendMessage === 'function',
      hasHandleSubmit: typeof handleSubmit === 'function'
    });

    if (typeof append === 'function') {
      append({ role: 'user', content: textToSend });
    } else if (typeof sendMessage === 'function') {
      // User suggested format: { parts: [{ type: 'text', text: input }] }
      // Or simple text depending on implementation. Trying object first based on user snippet.
      sendMessage({
        parts: [{ type: 'text', text: textToSend }],
      });
    } else if (typeof handleSubmit === 'function') {
      // Requires hookInput to be set. If handleInputChange works, we can try matching it.
      // This is a last resort and might fail if handleInputChange is also missing.
      const fakeEvent = { preventDefault: () => { }, target: { value: textToSend } };
      // We can't easily sync localInput to hookInput instantly and call handleSubmit.
      // But if handleInputChange is available:
      if (typeof handleInputChange === 'function') {
        handleInputChange({ target: { value: textToSend } });
        // Small timeout to allow state update? No, that's risky.
        // Let's assume handleSubmit might handle the event directly?
        // Usually handleSubmit(e) takes the event.
        handleSubmit(fakeEvent);
      } else {
        console.error("No valid submit method found.");
        alert("Error: Cannot send message. Please reload.");
      }
    } else {
      console.error("No chat functions available.");
    }

    setLocalInput("");
  };

  const handleSync = async () => {
    setSyncing(true)
    try {
      const result = await syncProperties()
      if (result.success) {
        alert(`Successfully synced ${result.count} properties!`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const suggestions = [
    "Properties in Andheri under 25k",
    "3BHK flats with balcony",
    "Luxury penthouses in South Mumbai"
  ];

  const handleSuggestionClick = (s) => {
    if (typeof append === 'function') {
      append({ role: 'user', content: s });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <FiHome className="text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">SwiftStay AI</h2>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status === 'streaming' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                {status === 'streaming' ? 'Active' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm
            ${syncing
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white text-blue-600 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 active:scale-95'}`}
        >
          {syncing ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
          {syncing ? 'Syncing...' : 'Refresh Listings'}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="p-6 bg-blue-50 rounded-3xl">
              <FiInfo className="text-4xl text-blue-500" />
            </div>
            <div className="max-w-xs">
              <h3 className="text-slate-800 font-bold text-lg mb-2">How can I help you today?</h3>
              <p className="text-slate-500 text-sm">Ask me about any property, location, or budget requirements.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all hover:shadow-md"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm
                  ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}>
                  {m.role === 'user' ? <FiUser className="text-sm" /> : <FiHome className="text-sm" />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                    {/* Support structured parts (modern Vercel AI SDK) or fallback to simple content */}
                    {m.parts ? (
                      m.parts.map((part, index) => {
                        if (part.type === 'text') {
                          return <span key={index} className="whitespace-pre-wrap">{part.text}</span>;
                        }
                        return null; // Handle tool invocations here in future if needed
                      })
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  <span className={`text-[10px] text-slate-400 font-medium px-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {status === 'streaming' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start items-center gap-2 text-blue-500"
          >
            <div className="flex gap-1 ml-12">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-sm p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600"
          >
            <FiAlertCircle className="flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-tight">Something went wrong</p>
              <button
                onClick={() => reload()}
                className="text-[10px] font-bold underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form
          onSubmit={handleManualSubmit}
          className="relative group transition-all"
        >
          <input
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none
              focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all text-slate-700"
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder="Type your property requirements..."
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {status === 'streaming' ? (
              <button
                type="button"
                onClick={stop}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                title="Stop generation"
              >
                <div className="w-3 h-3 bg-current rounded-sm"></div>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!localInput?.trim() || status === 'streaming'}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center
                  ${(!localInput?.trim() || status === 'streaming')
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed ring-0'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200'}`}
              >
                <FiSend className="text-lg" />
              </button>
            )}
          </div>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest italic">
          Powered by ConnectHome RAG Architecture
        </p>
      </div>
    </div>
  )
}

export default Chatbot
