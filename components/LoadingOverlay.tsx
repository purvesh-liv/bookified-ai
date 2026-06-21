"use client"

import { LoaderCircle } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null

  return (
    <div
      className="loading-wrapper"
      role="status"
      aria-live="polite"
      aria-label="Preparing your book"
    >
      <div className="loading-shadow-wrapper bg-[#fff6e5] shadow-2xl">
        <div className="loading-shadow">
          <LoaderCircle
            className="loading-animation size-12 text-[#663820]"
            aria-hidden="true"
          />
          <div className="space-y-2 text-center">
            <p className="loading-title">Preparing your book</p>
            <p className="text-[var(--text-secondary)]">
              We’re beginning the synthesis. This may take a moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
