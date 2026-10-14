import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../../auth/hook/useAuth'
import ThinkingIndicator from '../components/ThinkingIndicator'
import MarkdownRenderer from '../components/MarkdownRenderer'
import remarkGfm from "remark-gfm"

const Dashboard = () => {
  const { chatId: urlChatId } = useParams()
  const navigate = useNavigate()

  const chat = useChat()
  const { handleLogout } = useAuth()
  const [chatInput, setChatInput] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const pendingMessage = useSelector((state) => state.chat.pendingMessage)

  const activeChatId = urlChatId || currentChatId

  const userName = user?.name || user?.username || 'You'
  const userInitial = userName.charAt(0).toUpperCase()
  const messagesEndRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Auto-close mobile drawer on route/chat switch or Escape key
  useEffect(() => {
    setIsMobileDrawerOpen(false)
  }, [urlChatId])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileDrawerOpen(false)
      }
    }
    if (isMobileDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileDrawerOpen])

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChat()
  }, [])

  // Sync active chat whenever urlChatId changes or page is refreshed
  useEffect(() => {
    if (urlChatId) {
      chat.handleOpenChat(urlChatId)
    } else {
      chat.handleNewChat()
    }
  }, [urlChatId])

  const handleNewChat = () => {
    navigate('/')
    setChatInput('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage || isLoading) {
      return
    }

    setChatInput('')
    const targetChatId = activeChatId || null
    const result = await chat.handleSendMessage({ message: trimmedMessage, chatId: targetChatId })

    // If a brand new chat was created, push the new chatId to the URL
    if (result?.success && result?.chatId && (!targetChatId || result?.isNew)) {
      navigate(`/chat/${result.chatId}`, { replace: true })
    }
  }

  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`)
  }

  const handleDelete = async (chatId) => {
    await chat.handleDeleteChat(chatId)
    if (activeChatId === chatId) {
      navigate('/')
    }
  }

  const handleLogoutClick = async () => {
    setShowUserMenu(false)
    await handleLogout()
    navigate('/login')
  }

  const canShare = Boolean(activeChatId && chats[activeChatId]?.messages?.length > 0)

  const handleOpenShareModal = () => {
    if (!canShare) return
    setShowShareModal(true)
  }

  const getShareUrl = (chatId) => {
    const base = (import.meta.env.VITE_PRODUCTION_URL || window.location.origin).replace(/\/+$/, '')
    return `${base}/share/${chatId}`
  }

  const handleShareToWhatsApp = () => {
    const title = chats[activeChatId]?.title || 'Shared Thread'
    const shareUrl = getShareUrl(activeChatId)
    const text = `Check out this chat on Perplexity: "${title}"\n${shareUrl}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleCopyShareLink = () => {
    const shareUrl = getShareUrl(activeChatId)
    navigator.clipboard.writeText(shareUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [chats, activeChatId, isLoading, pendingMessage])

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#0b0d0f] text-zinc-200">
      {/* Mobile Drawer Backdrop */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-800 bg-[#111315] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>
            <span className="text-lg font-semibold text-white">Perplexity</span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
            aria-label="Close navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              handleNewChat()
              setIsMobileDrawerOpen(false)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            <span className="text-lg">＋</span>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recent searches
          </p>

          <div className="space-y-1">
            {Object.values(chats).map((chatItem) => (
              <div
                key={`mobile-${chatItem.id}`}
                onClick={() => {
                  openChat(chatItem.id)
                  setIsMobileDrawerOpen(false)
                }}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition cursor-pointer ${
                  activeChatId === chatItem.id
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{chatItem.title}</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(chatItem.id)
                  }}
                  title="Delete chat"
                  className="flex-shrink-0 p-1.5 rounded-md hover:bg-zinc-700/60 text-zinc-400 hover:text-rose-400 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-3">
          <div className="flex items-center justify-between rounded-xl p-2 bg-zinc-900/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">{userName}</p>
                <p className="truncate text-[10px] text-zinc-500">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileDrawerOpen(false)
                handleLogoutClick()
              }}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
              title="Log out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-zinc-800 bg-[#111315] md:flex">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
            P
          </div>
          <span className="text-lg font-semibold">Perplexity</span>
        </div>

        <div className="p-4">
          <button onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
            <span className="text-lg">＋</span>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recent searches
          </p>

          <div className="space-y-1">
            {Object.values(chats).map((chatItem) => (
              <div
                key={chatItem.id}
                onClick={() => openChat(chatItem.id)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition cursor-pointer ${
                  activeChatId === chatItem.id
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{chatItem.title}</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(chatItem.id)
                  }}
                  title="Delete chat"
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 rounded-md hover:bg-zinc-700/60 text-zinc-400 hover:text-rose-400 transition-opacity duration-150"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div ref={userMenuRef} className="relative border-t border-zinc-800 p-3">
          {showUserMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-zinc-800 bg-[#16181b] p-1.5 shadow-2xl shadow-black/80 z-50">
              <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </button>
            </div>
          )}

          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-zinc-800/80 cursor-pointer transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {userInitial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-zinc-500">Free account</p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowUserMenu(!showUserMenu)
              }}
              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-700/50 transition font-bold"
              title="Account options"
            >
              •••
            </button>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-4 md:px-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile drawer toggle */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white transition md:hidden"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="font-medium text-white truncate max-w-xs md:max-w-md text-sm md:text-base">
              {activeChatId && chats[activeChatId]?.title ? chats[activeChatId].title : 'New thread'}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleOpenShareModal}
            disabled={!canShare}
            title={canShare ? "Share conversation" : "Send a message to enable sharing"}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition ${
              canShare
                ? 'text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer'
                : 'text-zinc-600 opacity-40 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </header>

        <div className="flex flex-1 justify-center overflow-y-auto">
          <div className="w-full max-w-6xl px-3.5 sm:px-5 py-6 md:py-10 md:px-8">
            {(!chats[activeChatId]?.messages || chats[activeChatId]?.messages.length === 0) && !pendingMessage && (
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Where knowledge begins
                </h2>
                <p className="mt-3 text-zinc-500">
                  Ask anything and get clear, helpful answers.
                </p>
              </div>
            )}

            <div className="space-y-8">
              {chats[activeChatId]?.messages?.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === 'user'
                        ? 'max-w-[85%] bg-indigo-600 text-white break-words'
                        : 'w-fit max-w-full md:max-w-[90%] bg-[#171a1d] border border-zinc-800/80 text-zinc-300 break-words overflow-hidden'
                      }`}
                  >
                    {message.role === 'ai' ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {/* Optimistic user message for newly initiated chat thread */}
              {pendingMessage && (
                <div className="flex justify-end gap-4">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 bg-indigo-600 text-white">
                    {pendingMessage.content}
                  </div>
                </div>
              )}

              {/* Perplexity-style AI Thinking Indicator */}
              {isLoading && (
                <div className="flex justify-start gap-4">
                  <ThinkingIndicator />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Prompt input */}
        <div className="mt-5 px-5 pb-5 md:px-8 md:pb-8">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-zinc-700 bg-[#171a1d] p-3 shadow-2xl shadow-black/20 focus-within:border-zinc-500"
          >
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  if (!isLoading && chatInput.trim()) {
                    handleSubmit(event)
                  }
                }
              }}
              disabled={isLoading}
              rows="1"
              placeholder={isLoading ? "Generating answer..." : "Ask anything..."}
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!chatInput.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
              title={isLoading ? "Generating answer..." : "Send message"}
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
              ) : (
                '↑'
              )}
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-zinc-600">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </section>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#16181b] p-6 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-semibold text-white">Share link to Chat</h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Messages you send after sharing will remain private. Anyone with this link will be able to view this conversation.
              </p>

              <div className="mt-3.5 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="text-xs font-semibold text-zinc-200 truncate">
                  {chats[activeChatId]?.title || 'Shared Thread'}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500 truncate font-mono">
                  {getShareUrl(activeChatId)}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={handleShareToWhatsApp}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-[#20bd5a]"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Share on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700"
              >
                {shareCopied ? (
                  <>
                    <svg className="h-4 w-4 text-[#31b8c6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#31b8c6]">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Dashboard