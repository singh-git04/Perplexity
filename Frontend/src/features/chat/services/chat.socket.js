import { io } from "socket.io-client"

let socket = null

export const initializeSocketConnection = () => {
    if (socket) return socket
    socket = io(import.meta.env.VITE_PRODUCTION_URL, { withCredentials: true })
    socket.on("connect_error", (err) => console.error("Socket error:", err.message))
    return socket
}

export const disconnectSocket = () => {
    socket?.disconnect()
    socket = null
}

export const sendMessageSocket = ({ message, chatId }) =>
    new Promise((resolve, reject) => {
        initializeSocketConnection()
            .timeout(120000) // AI replies can be slow
            .emit("chat:send", { message, chatId }, (err, res) => {
                if (err) return reject({ response: { data: { message: "Request timed out. Please try again." } } })
                if (!res?.success) return reject({ response: { data: { message: res?.message } } })
                resolve(res)
            })
    })