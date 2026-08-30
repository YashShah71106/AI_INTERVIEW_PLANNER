import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cookieparser())

// CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-interview-planner-frontend-1m3x.onrender.com"
    ],
    credentials: true
}))

// Require all routes here
import authRouter from './routes/auth.routes.js'
import interviewRouter from './routes/interview.routes.js'

// Using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

export default app