import io from 'socket.io-client'

export const initializeSocketConnection = () => {

    const socket = io('http://localhost:3000', {
        withcredentials: true,
    })

     socket.on('connect',()=>{
        // console.log('Connected to Socket.IO server')
     })
}