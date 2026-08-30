import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
// require all routes Here
import authRouter from './routes/auth.routes.js'
import interviewRouter from './routes/interview.routes.js'

// using all The routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



export default app