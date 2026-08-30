import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    chat:{
        type:String,
        ref:"Chat",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['ai','user'],
        required:true
    }
})

const messageModel = mongoose.model("message", messageSchema)

export default messageModel