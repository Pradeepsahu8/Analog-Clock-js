import express  from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./lib/db.js";
import {io, app , server} from "./lib/socket.js"



dotenv.config();
const PORT=process.env.PORT









app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);




server.listen(PORT,()=>{
    console.log("server started at "+ server.address().port);
   connectDB();

    
})