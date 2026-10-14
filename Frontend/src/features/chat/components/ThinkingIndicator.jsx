import React from 'react'

export const ThinkingIndicator = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2.5 py-1 text-zinc-400 animate-fade-in"
    >
      <span className="sr-only">AI is thinking...</span>

      {/* Subtle Perplexity asterism icon */}
      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center text-[#31b8c6]">
        <svg
          className="h-4 w-4 animate-spin"
          style={{ animationDuration: '4s' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
        </svg>
      </div>

      {/* Minimal Thinking label with wave dots */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-zinc-300">Thinking</span>
        <div className="flex items-center gap-1" aria-hidden="true">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#31b8c6] animate-wave-dot"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#31b8c6] animate-wave-dot"
            style={{ animationDelay: '180ms' }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#31b8c6] animate-wave-dot"
            style={{ animationDelay: '360ms' }}
          />
        </div>
      </div>
    </div>
  )
}

export default ThinkingIndicator

