import express from "express"
import path from 'node:path'
import { fileURLToPath } from "node:url"

import authRoutes from "../src/routes/auth.route.js"
import chatRouter from "./routes/chat.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"


const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

/* Middleware */
app.use(express.json())
app.use(express.static(publicPath))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors(
    {
        origin : process.env.FRONTEND_URL,
        credentials: true,
        methods: ["Get", "Post", "Delete", "Patch"]
    }
))

/* Routes */
app.use('/api/auth',authRoutes)
app.use('/api/chats',chatRouter)



export default app 