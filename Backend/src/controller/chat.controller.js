import { genrateResponse, generateChatTitle} from "../services/ai.service.js"
import chatModel from "../model/chat.model.js"
import messageModel from "../model/message.model.js"


export async function sendMessage(req,res) {
    
    try {
        const { message } = req.body;
        const incomingChatId = req.body.chatId || req.body.chat;

        let title = null;
        let chat = null;
        let activeChatId = incomingChatId;

        // If no chat ID provided, create a brand new chat on first message
        if (!activeChatId) {
            title = await generateChatTitle(message);
            
            chat = await chatModel.create({
                user: req.user.id,
                title: title
            });
            activeChatId = chat._id;
        } else {
            // Otherwise, continue existing chat
            const existingChat = await chatModel.findOne({
                _id: activeChatId,
                user: req.user.id
            });

            if (!existingChat) {
                return res.status(404).json({
                    message: "Chat not found"
                });
            }
        }

        const userMessage = await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        });
        
        const messages = await messageModel.find({ chat: activeChatId }).sort({ createdAt: 1 });
        const result = await genrateResponse(messages);

        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: result,
            role: "ai"
        });

        return res.status(201).json({
            chatId: activeChatId,
            title, 
            chat,
            aiMessage,
        });
    } catch (error) {
        console.error("Send message error:", error);

        return res.status(503).json({
            success: false,
            message: "The AI service is temporarily unavailable. Please try again."
        });
    }
}



export async function getChats(req,res) {
    const user = req.user

    const chats = await chatModel.find({user:user.id})

    res.status(200).json({
        message:"Chats retrived successfully",
        chats
    })
}

export async function getMessages(req,res) {
    try {
        const {chatId} = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if(!chat){
            return res.status(404).json({
                message:"Chat not found"
            })
        }

        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 })

        return res.status(200).json({
            message: "Messages retrived successfully",
            messages
        })
    } catch (error) {
        console.error("Get messages error:", error)
        return res.status(500).json({
            message: "Failed to retrieve messages"
        })
    }
}

export async function deleteChat(req,res) {
    try {
        const {chatId} = req.params

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        })

        if(!chat){
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            })
        }
        
        await messageModel.deleteMany({
            chat: chatId
        })
        
        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        })
    } catch (error) {
        console.error("Delete chat error:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to delete chat"
        })
    }
}

export async function getSharedChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Shared chat not found or has been deleted"
            });
        }

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            chat: {
                id: chat._id,
                title: chat.title,
                createdAt: chat.createdAt
            },
            messages
        });
    } catch (error) {
        console.error("Get shared chat error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load shared chat"
        });
    }
}
