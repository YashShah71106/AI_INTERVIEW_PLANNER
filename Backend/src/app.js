import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "https://ai-interview-planner-frontend-1m3x.onrender.com",
        credentials: true
    })
);

import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;