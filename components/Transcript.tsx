'use client'

import { Mic } from 'lucide-react'
import { useEffect, useRef } from 'react'

type TranscriptMessage = {
  role: string
  content: string
}

type TranscriptProps = {
  messages: TranscriptMessage[]
  currentMessage?: string
  currentUserMessage?: string
}

const Transcript = ({
  messages,
  currentMessage = '',
  currentUserMessage = '',
}: TranscriptProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const hasConversation =
    messages.length > 0 ||
    currentMessage.trim().length > 0 ||
    currentUserMessage.trim().length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentMessage, currentUserMessage])

  if (!hasConversation) {
    return (
      <section className="transcript-container">
        <div className="transcript-empty">
          <Mic className="mb-6 size-12 text-[#212a3b]" />
          <p className="transcript-empty-text">No conversation yet</p>
          <p className="transcript-empty-hint">
            Click the mic button above to start talking
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="transcript-container">
      <div className="transcript-messages">
        {messages.map((message, index) => {
          const isUser = message.role === 'user'

          return (
            <div
              key={`${message.role}-${index}`}
              className={`transcript-message ${
                isUser ? 'transcript-message-user' : 'transcript-message-assistant'
              }`}
            >
              <div
                className={`transcript-bubble ${
                  isUser ? 'transcript-bubble-user' : 'transcript-bubble-assistant'
                }`}
              >
                {message.content}
              </div>
            </div>
          )
        })}

        {currentUserMessage && (
          <div className="transcript-message transcript-message-user">
            <div className="transcript-bubble transcript-bubble-user">
              {currentUserMessage}
              <span className="transcript-cursor" aria-hidden="true" />
            </div>
          </div>
        )}

        {currentMessage && (
          <div className="transcript-message transcript-message-assistant">
            <div className="transcript-bubble transcript-bubble-assistant">
              {currentMessage}
              <span className="transcript-cursor" aria-hidden="true" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  )
}

export default Transcript
