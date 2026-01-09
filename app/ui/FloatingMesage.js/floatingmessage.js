"use client"
import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiMessageCircle,
  FiX,
  FiHome,
  FiUser,
  FiChevronDown
} from "react-icons/fi";

export default function FloatingMessages() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    handleSubmit,
    status,
    append,
    sendMessage,
    handleInputChange
  } = useChat({
    api: '/api/chat',
    onError: (err) => console.error("Floating Chat Error:", err)
  });

  const [localInput, setLocalInput] = useState("");
  const messagesEndRef = useRef(null);

  // Debug: Log what useChat returns
  useEffect(() => {
    console.log("FloatingMessages useChat returns:", { messages, status, hasAppend: !!append, hasSubmit: !!handleSubmit });
  }, [status]);

  // Robust submit handler that tries all known methods
  const handleManualSubmit = (e) => {
    e?.preventDefault();
    if (!localInput?.trim()) return;

    if (typeof append === 'function') {
      append({ role: 'user', content: localInput });
    } else if (typeof sendMessage === 'function') {
      sendMessage({
        parts: [{ type: 'text', text: localInput }],
      });
    } else if (typeof handleSubmit === 'function') {
      const fakeEvent = { preventDefault: () => { }, target: { value: localInput } };
      if (typeof handleInputChange === 'function') {
        handleInputChange({ target: { value: localInput } });
        handleSubmit(fakeEvent);
      } else {
        console.error("No valid submit method found.");
      }
    } else {
      console.error("No chat functions available.");
    }
    setLocalInput("");
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <FiHome className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">SwiftStay Assistant</h3>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse"></span>
                    Ask anything about properties
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiChevronDown className="text-xl" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="text-3xl text-blue-500" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    Hi! I can help you find your dream home. Try asking for specific locations or budgets!
                  </p>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]
                      ${m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}>
                      {m.role === 'user' ? <FiUser /> : <FiHome />}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl text-xs leading-relaxed
                      ${m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleManualSubmit}
              className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center"
            >
              <input
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs outline-none focus:border-blue-400 transition-all"
                placeholder="What can I find for you?"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!localInput?.trim() || status === 'streaming'}
                className={`p-2.5 rounded-full transition-all flex items-center justify-center
                  ${!localInput?.trim() || status === 'streaming'
                    ? 'bg-slate-100 text-slate-300'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95'}`}
              >
                <FiSend className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMessageCircle className="text-2xl" />}
      </motion.button>
    </div>
  );
}
