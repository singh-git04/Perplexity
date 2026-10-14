import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        pendingMessage: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        clearCurrentChat: (state) => {
            state.currentChatId = null
            state.pendingMessage = null
            state.isLoading = false
            state.error = null
        },
        setPendingMessage: (state, action) => {
            state.pendingMessage = action.payload
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "New Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                }
            }
            state.chats[chatId].messages.push({ content, role })
            state.chats[chatId].lastUpdated = new Date().toISOString()
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                }
            }
            state.chats[chatId].messages = messages
        },

        setChats: (state, action) => {
            const incoming = action.payload || {}
            Object.keys(incoming).forEach(id => {
                if (state.chats[id]?.messages?.length > 0) {
                    incoming[id].messages = state.chats[id].messages
                }
            })
            state.chats = incoming
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        removeChat: (state, action) => {
            const chatId = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, clearCurrentChat, removeChat, setPendingMessage } = chatSlice.actions
export default chatSlice.reducer
