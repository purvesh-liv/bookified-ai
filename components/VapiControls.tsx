'use client'
import usevapi from '@/hooks/useVapi'
import Transcript from '@/components/Transcript'
import { IBook } from '@/types'
import { Mic, MicOff } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const VapiControls = ({book}:{book:IBook}) => {
    const {
      status,
      isActive,
      messages,
      currentMessage,
      currentUserMessage,
      duration,
      start,
      stop,
      limitError,
      clearError,
    } = usevapi(book);
   const coverSrc = book.coverURL || "/assets/book-cover.svg";
  return (
    <>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="vapi-header-card w-full">
          <div className="vapi-cover-wrapper">
            <Image
              src={coverSrc}
              alt={book.title}
              width={120}
              height={180}
              className="h-[180px] w-[120px] rounded-lg object-cover shadow-lg"
              priority
            />

            <div className="vapi-mic-wrapper">
              {isActive && status === "thinking" && (
                <span className="vapi-pulse-ring" aria-hidden="true" />
              )}
              <button
                onClick={isActive ? stop : start}
                disabled={status === "connecting"}
                className={`vapi-mic-btn ${
                  isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"
                }`}
                type="button"
                aria-label={isActive ? "Voice is on" : "Voice is off"}
              >
                {isActive ? (
                  <Mic className="size-8 text-[#212a3b]" />
                ) : (
                  <MicOff className="size-8 text-[#212a3b]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold leading-tight text-[#212a3b] md:text-3xl">
                {book.title}
              </h1>
              <p className="mt-2 text-lg font-medium text-[#3d485e]">
                by {book.author}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">Voice: {book.persona}</span>
              </div>

              <div className="vapi-status-indicator">
                <span className="vapi-status-text">0:00/15:00</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="vapi-transcript-wrapper mt-7 mx-auto w-full max-w-4xl">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
     
    </>
  );
}

export default VapiControls
