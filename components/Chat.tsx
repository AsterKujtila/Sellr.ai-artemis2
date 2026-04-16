"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, UIMessage } from "ai"

const CHIPS = [
  "Why isn't my store converting?",
  "Write my offer headline",
  "How to price my community?",
  "Roast my sales page",
  "Create a 7-day launch plan",
  "What upsells should I add?",
  "Improve my product description",
  "How to grow on Whop?",
]

function TypingDots() {
  return (
    <div className="self-start px-4 py-2.5 bg-foreground rounded-2xl inline-flex gap-1.5 items-center animate-msg-in">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary animate-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

// Helper to extract text from UIMessage parts
function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export default function Chat({ name }: { name: string }) {
  const firstName = name.split(" ")[0]
  const [input, setInput] = useState("")
  const [showChips, setShowChips] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const welcomeMessage: UIMessage = {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `Hey ${firstName}! I'm SELLR — your AI sales coach built for Whop.\n\nAsk me anything about your store, pricing, offers, or copy. Specific, real advice — no fluff.\n\nWhat's the biggest problem with your Whop store right now?`,
      },
    ],
  }

  const { messages: chatMessages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  // Combine welcome message with chat messages
  const messages = [welcomeMessage, ...chatMessages]

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleChipClick = (chip: string) => {
    setShowChips(false)
    sendMessage({ text: chip })
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setShowChips(false)
    sendMessage({ text: input })
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-primary font-bold text-lg">S</span>
        </div>
        <div>
          <div className="font-serif font-bold text-lg text-foreground">
            SELLR AI Coach
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => {
          const text = getMessageText(msg)
          return (
            <div
              key={msg.id}
              className={`max-w-[85%] px-4 py-3 rounded-2xl animate-msg-in ${
                msg.role === "user"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-foreground text-card"
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {text}
              </div>
              {msg.role === "assistant" && msg.id !== "welcome" && text && (
                <button
                  onClick={() => copyToClipboard(text)}
                  className="mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-card/80"
                >
                  Copy
                </button>
              )}
            </div>
          )
        })}

        {isLoading && <TypingDots />}

        {error && (
          <div className="self-start max-w-[85%] px-4 py-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error.message || "Something went wrong. Please try again."}
          </div>
        )}

        {/* Chips */}
        {showChips && chatMessages.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {CHIPS.slice(0, 4).map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        id="chat-form"
        onSubmit={onSubmit}
        className="p-4 border-t border-border"
      >
        <div className="flex items-end gap-2 bg-secondary rounded-2xl p-2 border border-border focus-within:border-primary transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about sales..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-base text-foreground px-2 py-1 max-h-[120px] placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center cursor-pointer transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
