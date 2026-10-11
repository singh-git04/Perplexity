import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectToDb() {

  const conn = await mongoose.connect(process.env.MONGODB_URI);

  console.log("MONGODB Connected", conn.connection.host);
}

export default connectToDb;