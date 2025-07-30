import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();



let connectDB=async ()=>{
    try{
        
        let conn =await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully Connected to DB" , conn.connection.host);
        

    }catch(error)
    {
        console.log("Error in connecting to db ",error);
        
    }

}
export default connectDB;