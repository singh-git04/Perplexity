import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import remarkGfm from "remark-gfm"

 

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput ] = useState('')
  const { user } = useSelector((state) => state.auth)

  const chats = useSelector((state)=>state.chat.chats)
  const currentChatId = useSelector((state)=> state.chat.currentChatId)

  const userName = user?.name || user?.username || 'You'
  const userInitial = userName.charAt(0).toUpperCase()
  const messagesEndRef = useRef(null)

  useEffect(()=>{
    chat.initializeSocketConnection()
    chat.handleGetChat()
  },[])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return 
    }
 
    chat.handleSendMessage({message: trimmedMessage, chatId: currentChatId})
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat( chats,chatId)
  }
  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  },[chats, currentChatId])

  return (  
    <main className="flex h-screen w-full overflow-hidden bg-[#0b0d0f] text-zinc-200">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-zinc-800 bg-[#111315] md:flex">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
            P
          </div>
          <span className="text-lg font-semibold">Perplexity</span>
        </div>

        <div className="p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
            <span className="text-lg">＋</span>
            New thread
          </button> 
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recent searches
          </p>

          <div className="space-y-2">
            { Object.values(chats).map((chat,index)=>(
              <button
              onClick={()=> { openChat(chat.id)}}
                key={chat.id}
                className="w-full truncate rounded-lg px-3 py-3 text-left text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                {chat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {userInitial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-zinc-500">Free account</p>
            </div>

            <span className="ml-auto text-zinc-500">•••</span>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-5 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-black md:hidden">
              P
            </div>
            <h1 className="font-medium text-white">New thread</h1>
          </div>

          <button className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white">
            Share
          </button>
        </header>

        <div className="flex flex-1 justify-center overflow-y-auto">
          <div className="w-full max-w-6xl px-5 py-10 md:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Where knowledge begins
              </h2>
              <p className="mt-3 text-zinc-500">
                Ask anything and get clear, helpful answers.
              </p>
            </div>

            <div className="space-y-8">
              {chats[currentChatId]?.messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#171a1d] text-zinc-300'
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
              <div ref={messagesEndRef}/>
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
                  handleSubmit(event)
                }
              }}
              rows="1"
              placeholder="Ask anything..."
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↑
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-zinc-600">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Dashboard