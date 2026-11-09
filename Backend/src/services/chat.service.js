import { genrateResponse, generateChatTitle } from "./ai.service.js"
import chatModel from "../model/chat.model.js"
import messageModel from "../model/message.model.js"

export async function processUserMessage({ userId, message, chatId }) {
    let title = null
    let chat = null
    let activeChatId = chatId

    if (!activeChatId) {
        title = await generateChatTitle(message)
        chat = await chatModel.create({ user: userId, title })
        activeChatId = chat._id
    } else {
        const existing = await chatModel.findOne({ _id: activeChatId, user: userId })
        if (!existing) {
            const err = new Error("Chat not found")
            err.status = 404
            throw err
        }
    }

    await messageModel.create({ chat: activeChatId, content: message, role: "user" })

    const messages = await messageModel.find({ chat: activeChatId }).sort({ createdAt: 1 })
    const result = await genrateResponse(messages)

    const aiMessage = await messageModel.create({ chat: activeChatId, content: result, role: "ai" })

    return { chatId: activeChatId, title, chat, aiMessage }
}