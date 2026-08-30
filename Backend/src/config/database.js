import mongoose from "mongoose"

async function connectToDb() {
     const conn = await mongoose.connect(process.env.MONGODB_URI)

     console.log("MONGODB Connected",conn.connection.host)
    }

export default connectToDb