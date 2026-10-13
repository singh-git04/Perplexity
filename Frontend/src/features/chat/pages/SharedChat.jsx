import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getSharedChat } from '../services/chat.api'

const SharedChat = () => {
  const { chatId } = useParams()
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchShared() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getSharedChat({ chatId })
        if (data?.success) {
          setChat(data.chat)
          setMessages(data.messages || [])
        } else {
          setError(data?.message || 'Shared chat not found')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shared conversation')
      } finally {
        setIsLoading(false)
      }
    }

    if (chatId) {
      fetchShared()
    }
  }, [chatId])

  const getShareUrl = () => {
    const base = (import.meta.env.VITE_PRODUCTION_URL || window.location.origin).replace(/\/+$/, '')
    return `${base}/share/${chatId}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    const text = `Check out this chat on Perplexity: "${chat?.title || 'Shared Thread'}"\n${getShareUrl()}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-[#0b0d0f] text-zinc-200">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#0b0d0f]/90 px-5 backdrop-blur md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black animate-pulse">
              P
            </div>
            <span className="text-lg font-semibold text-white">Perplexity</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-24 rounded-lg bg-zinc-800/80 animate-pulse" />
            <div className="h-8 w-24 rounded-lg bg-zinc-800/80 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-zinc-700/60 animate-pulse" />
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-10 md:px-8">
          <div className="mb-8 border-b border-zinc-800 pb-6">
            <div className="h-5 w-36 rounded-full bg-zinc-800/80 animate-pulse" />
            <div className="mt-3.5 h-8 w-3/4 rounded-lg bg-zinc-800 animate-pulse" />
            <div className="mt-2.5 h-3.5 w-44 rounded bg-zinc-900 animate-pulse" />
          </div>

          <div className="space-y-8 flex-1 pb-20">
            {/* User message skeleton */}
            <div className="flex justify-end">
              <div className="h-12 w-64 rounded-2xl bg-indigo-600/30 animate-pulse" />
            </div>

            {/* AI message skeleton */}
            <div className="flex justify-start">
              <div className="w-full max-w-[85%] rounded-2xl border border-zinc-800/80 bg-[#171a1d] p-5 space-y-3 animate-pulse">
                <div className="h-4 w-5/6 rounded bg-zinc-800" />
                <div className="h-4 w-full rounded bg-zinc-800/80" />
                <div className="h-4 w-4/6 rounded bg-zinc-800/70" />
                <div className="h-4 w-3/4 rounded bg-zinc-800/60" />
              </div>
            </div>

            {/* User follow up skeleton */}
            <div className="flex justify-end">
              <div className="h-10 w-48 rounded-2xl bg-indigo-600/20 animate-pulse" />
            </div>

            {/* AI follow up skeleton */}
            <div className="flex justify-start">
              <div className="w-full max-w-[75%] rounded-2xl border border-zinc-800/80 bg-[#171a1d] p-5 space-y-3 animate-pulse">
                <div className="h-4 w-11/12 rounded bg-zinc-800" />
                <div className="h-4 w-4/5 rounded bg-zinc-800/80" />
                <div className="h-4 w-2/5 rounded bg-zinc-800/60" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !chat) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0b0d0f] px-4 text-center text-zinc-300">
        <div className="max-w-md rounded-2xl border border-zinc-800 bg-[#111315] p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-rose-400">
            ✕
          </div>
          <h1 className="text-xl font-semibold text-white">Conversation Not Found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {error || 'This shared link is invalid or may have been deleted by the owner.'}
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Start New Chat
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0b0d0f] text-zinc-200">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#0b0d0f]/90 px-5 backdrop-blur md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
            P
          </div>
          <span className="text-lg font-semibold text-white">Perplexity</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-medium text-[#25D366] transition hover:bg-[#25D366]/20"
            title="Share to WhatsApp"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            {copied ? 'Copied Link!' : 'Copy Link'}
          </button>

          <Link
            to="/"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
          >
            New Chat
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-10 md:px-8">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <span className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400">
            Shared Conversation
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            {chat.title}
          </h1>
          <p className="mt-2 text-xs text-zinc-500">
            Shared from Perplexity
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-8 flex-1 pb-20">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-7 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#171a1d] border border-zinc-800 text-zinc-300'
                }`}
              >
                {message.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 border-t border-zinc-800 bg-[#111315]/95 p-4 backdrop-blur text-center">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 text-left">
            Have questions of your own? Start a new conversation.
          </p>
          <Link
            to="/"
            className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition"
          >
            Try Perplexity
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default SharedChat
