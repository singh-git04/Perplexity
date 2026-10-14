import io from 'socket.io-client'

export const initializeSocketConnection = () => {

    const socket = io(import.meta.env.VITE_PRODUCTION_URL, {
        withcredentials: true,
    })

     socket.on('connect',()=>{
        // console.log('Connected to Socket.IO server')
     })
}