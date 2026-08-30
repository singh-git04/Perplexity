import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages } from "../chat.slice"
import { useDispatch } from 'react-redux'

export const useChat = () => {

    const dispatch = useDispatch()

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))


        const data = await sendMessage({ message, chatId })


        const { chat, aiMessage } = data
        const id = chat?._id || chatId

        if (chat) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))
        }

        dispatch(addNewMessage({
            chatId: id,
            content: message,
            role: 'user'
        }))
        dispatch(addNewMessage({
            chatId: id,
            content: aiMessage.content,
            role: aiMessage.role
        }))
        dispatch(setCurrentChatId(id))

        dispatch(setLoading(false))
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

    async function handleOpenChat(chats,chatId) {
  
       if (chats[chatId]?.messages.length === 0) {

        const data = await getMessages({ chatId })
        const { messages } = data

        const formattedMessages = messages.map(msg => ({
            content: msg.content,
            role: msg.role,
        }))

        dispatch(addMessages({
            chatId,
            messages: formattedMessages
        }))

    }
     dispatch(setCurrentChatId(chatId))
    }
    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChat,
        handleOpenChat,
    }
}