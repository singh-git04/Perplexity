import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state,action)=>{
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId, 
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state,action)=>{
            const { chatId, content, role} = action.payload
            state.chats[chatId].messages.push({content, role})
        },
        addMessages: (state,action)=>{
            const { chatId, messages } = action.payload
            state.chats[chatId].messages.push(...messages)
        },

        setChats: (state,action)=>{
            state.chats = action.payload
        },
        setCurrentChatId: (state,action)=>{
            state.currentChatId = action.payload
        },
        setLoading: (state,action)=>{
            state.isLoading = action.payload
        },
        setError: (state,action)=>{
            state.error = action.payload
        }
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage,addMessages } = chatSlice.actions
export default chatSlice.reducer

// chat = {
//     "docker and Aws" : {
//         messages: [
//             {
//                 role: 'user',
//                 content: 'What is docker and Aws?'
//             },
//             {
//                 role: 'ai',
//                 content: 'Docker is a platform that allows developers to easily create, deploy, and run applications in containers. AWS (Amazon Web Services) is a cloud computing platform that provides a wide range of services, including computing power, storage, and databases. Together, Docker and AWS can be used to build and deploy scalable applications in the cloud.'
//             }
//         ],id: "docker and Aws",
//         lastUpdated: "2023-06-28T12:00:00Z"
//     }
// }