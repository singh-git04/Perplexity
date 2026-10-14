import { Server } from "socket.io"

let io

export function initSocket(httpServer){
    io = new Server(httpServer,{
        cors:{
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })

    console.log("Socket.io server is running")

    io.on("connection", (socket)=>{
        console.log("A user Connected: ", socket.id)
    })
}

export function getIo(){
    if(!io){
        throw new Error("Socket.io is not initialized")
    }

    return io
}