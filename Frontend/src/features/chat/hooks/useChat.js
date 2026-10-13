import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, clearCurrentChat, removeChat } from "../chat.slice"
import { useDispatch } from 'react-redux'

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId, chat }) {
        const idToSend = chatId || chat || null
        dispatch(setLoading(true))

        try {
            const data = await sendMessage({ message, chatId: idToSend })

            const { chat: newChat, aiMessage } = data
            const resolvedChatId = newChat?._id || data.chatId || idToSend

            if (newChat) {
                dispatch(createNewChat({
                    chatId: newChat._id,
                    title: newChat.title
                }))
            }

            dispatch(addNewMessage({
                chatId: resolvedChatId,
                content: message,
                role: 'user'
            }))

            if (aiMessage) {
                dispatch(addNewMessage({
                    chatId: resolvedChatId,
                    content: aiMessage.content,
                    role: aiMessage.role
                }))
            }

            dispatch(setCurrentChatId(resolvedChatId))
            return { success: true, chatId: resolvedChatId, isNew: Boolean(newChat) }
        } catch (error) {
            console.error("Failed to send message:", error)
            return { success: false, error }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChat() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[chat._id] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId) {
        if (!chatId) return
        dispatch(setCurrentChatId(chatId))

        try {
            const data = await getMessages({ chatId })
            const { messages } = data

            const formattedMessages = (messages || []).map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }))
            return { success: true }
        } catch (error) {
            console.error("Failed to load messages:", error)
            return { success: false, error }
        }
    }

    async function handleNewChat() {
        dispatch(clearCurrentChat())
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat({ chatId })
            dispatch(removeChat(chatId))
            return { success: true }
        } catch (error) {
            console.error("Failed to delete chat:", error)
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"))
            return { success: false, error }
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChat,
        handleOpenChat,
        handleNewChat,
        handleDeleteChat
    }
}

