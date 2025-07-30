import express from "express";
import authRoute from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js"
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config();
let app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute)
const PORT = 5000
app.listen(PORT ,()=>{
    connectDB();
    console.log("server started at ", PORT);
    
})

