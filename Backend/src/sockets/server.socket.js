import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { parse } from "cookie"
import { processUserMessage } from "../services/chat.service.js"

let io

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: { origin: process.env.FRONTEND_URL, credentials: true },
    })

    // Authenticate every socket using the same JWT cookie as your REST routes
    io.use((socket, next) => {
        try {
            const { token } = parse(socket.handshake.headers.cookie || "")
            if (!token) return next(new Error("Unauthorized"))
            socket.user = jwt.verify(token, process.env.JWT_SECRET)
            next()
        } catch {
            next(new Error("Unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        // Room per user, so you can later push events to all of their tabs
        socket.join(`user:${socket.user.id}`)

        socket.on("chat:send", async ({ message, chatId } = {}, ack) => {
            if (typeof ack !== "function") return
            if (!message?.trim()) {
                return ack({ success: false, message: "Message is required" })
            }
            try {
                const data = await processUserMessage({
                    userId: socket.user.id,
                    message: message.trim(),
                    chatId,
                })
                ack({ success: true, ...data })
            } catch (error) {
                console.error("Socket send error:", error)
                ack({
                    success: false,
                    message: error.status === 404
                        ? error.message
                        : "The AI service is temporarily unavailable. Please try again.",
                })
            }
        })
    })
}

export function getIo() {
    if (!io) throw new Error("Socket.io is not initialized")
    return io
}